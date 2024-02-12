import * as core from '@actions/core'
import * as github from '@actions/github'
import * as octokitPluginRetry from '@octokit/plugin-retry'
import { GetDeploymentsQuery, GetDeploymentsQueryVariables } from './generated/graphql'
import { getDeployments } from './queries/getDeployments'
import { deleteDeployment } from './queries/deleteDeployment'
import { DeploymentState } from './generated/graphql-types'
import assert from 'assert'

type Octokit = ReturnType<typeof github.getOctokit>

type Inputs = {
  batchDeletionRateLimit: number
  owner: string
  repo: string
  token: string
}

export const run = async (inputs: Inputs): Promise<void> => {
  const octokit = github.getOctokit(inputs.token, undefined, octokitPluginRetry.retry)
  if (inputs.batchDeletionRateLimit) {
    await deleteInBatch(octokit, inputs)
    return
  }
  await deletePerPage(octokit, { owner: inputs.owner, name: inputs.repo })
}

const deleteInBatch = async (octokit: Octokit, inputs: Inputs): Promise<void> => {
  core.info(`Starting the batch deletion`)
  for (let after: string | null | undefined; ; ) {
    const { data: rateLimit } = await octokit.rest.rateLimit.get()
    core.info(`Rate limit remaining (core): ${rateLimit.resources.core.remaining}`)
    assert(rateLimit.resources.graphql !== undefined)
    core.info(`Rate limit remaining (graphql): ${rateLimit.resources.graphql.remaining}`)
    if (rateLimit.resources.core.remaining < inputs.batchDeletionRateLimit) {
      core.warning(`Exiting to avoid hitting the rate limit of the REST API`)
      return
    }
    if (rateLimit.resources.graphql.remaining < inputs.batchDeletionRateLimit) {
      core.warning(`Exiting to avoid hitting the rate limit of the GraphQL API`)
      return
    }

    const pageInfo = await deletePerPage(octokit, { owner: inputs.owner, name: inputs.repo, after })
    if (!pageInfo.hasNextPage) {
      return
    }
    after = pageInfo.endCursor
  }
}

const deletePerPage = async (octokit: Octokit, v: GetDeploymentsQueryVariables) => {
  core.startGroup('getDeployments')
  const deployments = await getDeployments(octokit, v)
  core.info(JSON.stringify(deployments, undefined, 2))
  core.endGroup()
  assert(deployments.repository != null)

  const outdatedDeployments = findOutdated(deployments)
  core.info(`Deleting outdated ${outdatedDeployments.length} deployment(s)`)
  for (const outdated of outdatedDeployments) {
    await deleteOne(octokit, v, outdated)
  }
  return deployments.repository.deployments.pageInfo
}

const deleteOne = async (octokit: Octokit, v: GetDeploymentsQueryVariables, outdated: OutdatedDeployment) => {
  if (outdated.state === DeploymentState.Active) {
    // An active deployment cannot be deleted directly.
    // https://docs.github.com/en/rest/deployments/deployments?apiVersion=2022-11-28#delete-a-deployment
    core.info(`Creating an inactive status before deleting the active deployment ${outdated.databaseId}`)
    await octokit.rest.repos.createDeploymentStatus({
      owner: v.owner,
      repo: v.name,
      deployment_id: outdated.databaseId,
      state: 'inactive',
    })
  }
  core.info(`Deleting the deployment ${outdated.id}`)
  await deleteDeployment(octokit, { id: outdated.id })
}

type OutdatedDeployment = {
  id: string
  databaseId: number
  state: DeploymentState
}

export const findOutdated = (q: GetDeploymentsQuery): OutdatedDeployment[] => {
  assert(q.repository != null)

  const deployments: OutdatedDeployment[] = []
  for (const node of q.repository.deployments.nodes ?? []) {
    if (node == null) {
      continue
    }
    if (node.databaseId == null) {
      continue
    }
    if (node.state == null) {
      continue
    }
    const deployment = { id: node.id, databaseId: node.databaseId, state: node.state }
    // If the deployment refers to a ref which does not exist
    if (node.ref == null || node.ref.target == null) {
      deployments.push(deployment)
      continue
    }
    // If the deployment refers to the outdated commit
    if (node.commitOid !== node.ref.target.oid) {
      deployments.push(deployment)
      continue
    }
  }
  return deployments
}
