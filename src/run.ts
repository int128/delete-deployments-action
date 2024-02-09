import * as core from '@actions/core'
import * as github from '@actions/github'
import { GetDeploymentsQuery } from './generated/graphql'
import { getDeployments } from './queries/getDeployments'
import { deleteDeployment } from './queries/deleteDeployment'
import { DeploymentState } from './generated/graphql-types'
import assert from 'assert'

type Inputs = {
  token: string
}

export const run = async (inputs: Inputs): Promise<void> => {
  const octokit = github.getOctokit(inputs.token)

  core.info(`Get deployments`)
  const deployments = await getDeployments(octokit, {
    owner: github.context.repo.owner,
    name: github.context.repo.repo,
  })
  core.startGroup('getDeployments')
  core.info(JSON.stringify(deployments, undefined, 2))
  core.endGroup()

  const outdatedDeployments = findOutdated(deployments)
  core.info(`Deleting outdated ${outdatedDeployments.length} deployment(s)`)
  for (const outdated of outdatedDeployments) {
    if (outdated.state === DeploymentState.Active) {
      // An active deployment cannot be deleted directly.
      // https://docs.github.com/en/rest/deployments/deployments?apiVersion=2022-11-28#delete-a-deployment
      core.info(`Creating an inactive status before deleting the active deployment ${outdated.databaseId}`)
      await octokit.rest.repos.createDeploymentStatus({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        deployment_id: outdated.databaseId,
        state: 'inactive',
      })
    }

    core.info(`Deleting the deployment ${outdated.id}`)
    await deleteDeployment(octokit, { id: outdated.id })
  }
}

type OutdatedDeployment = {
  id: string
  databaseId: number
  state: DeploymentState
}

export const findOutdated = (q: GetDeploymentsQuery): OutdatedDeployment[] => {
  assert(q.repository != null)

  const outdated: OutdatedDeployment[] = []
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
    if (node.ref == null) {
      outdated.push({ id: node.id, databaseId: node.databaseId, state: node.state })
    }
  }
  return outdated
}
