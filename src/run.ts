import assert from 'assert'
import * as core from '@actions/core'
import { deleteDeployment } from './queries/deleteDeployment.js'
import { findOutdated, OutdatedDeployment } from './deployment.js'
import { getOctokit, Octokit } from './github.js'
import { getDeployments } from './queries/getDeployments.js'
import { DeploymentState } from './generated/graphql-types.js'
import { GetDeploymentsQueryVariables } from './generated/graphql.js'

type Inputs = {
  batchDeletionRateLimit: number
  owner: string
  repo: string
  token: string
}

export const run = async (inputs: Inputs): Promise<void> => {
  const octokit = getOctokit(inputs.token)
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
    // Ignore 422 error: "This deployment has reached the maximum number of statuses."
    await catchStatusError(
      422,
      octokit.rest.repos.createDeploymentStatus({
        owner: v.owner,
        repo: v.name,
        deployment_id: outdated.databaseId,
        state: 'inactive',
      }),
    )
  }
  core.info(`Deleting the deployment ${outdated.id}`)
  await deleteDeployment(octokit, { id: outdated.id })
}

const catchStatusError = async <T>(status: number, promise: Promise<T>): Promise<T | undefined> => {
  try {
    return await promise
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'status' in e && typeof e.status === 'number' && e.status === status) {
      return
    } else {
      throw e
    }
  }
}
