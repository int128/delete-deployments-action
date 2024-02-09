import * as core from '@actions/core'
import * as github from '@actions/github'
import { GetDeploymentsQuery } from './generated/graphql'
import { getDeployments } from './queries/getDeployments'
import { deleteDeployment } from './queries/deleteDeployment'

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

  const outdatedIDs = findOutdated(deployments)
  core.info(`Deleting outdated ${outdatedIDs.length} deployment(s)`)

  for (const id of outdatedIDs) {
    core.info(`Deleting ${id}`)
    await deleteDeployment(octokit, { id })
  }
}

export const findOutdated = (q: GetDeploymentsQuery) => {
  if (q.repository == null) {
    throw new Error(`q.repository === ${String(q.repository)}`)
  }

  const outdatedIDs: string[] = []
  for (const node of q.repository.deployments.nodes ?? []) {
    if (node == null) {
      continue
    }
    if (node.ref == null) {
      outdatedIDs.push(node.id)
    }
  }
  return outdatedIDs
}
