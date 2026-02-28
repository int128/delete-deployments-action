import assert from 'node:assert'
import type { GetDeploymentsQuery } from './generated/graphql.js'
import type { DeploymentState } from './generated/graphql-types.js'

export type OutdatedDeployment = {
  id: string
  databaseId: number
  environment: string | null | undefined
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
    const deployment = {
      id: node.id,
      databaseId: node.databaseId,
      environment: node.environment,
      state: node.state,
    }
    // If the deployment refers to a ref which does not exist
    if (node.ref == null || node.ref.target == null) {
      deployments.push(deployment)
      continue
    }
    // If the deployment refers to the outdated commit
    if (node.commitOid !== node.ref.target.oid) {
      deployments.push(deployment)
    }
  }
  return deployments
}
