import type { Octokit } from '@octokit/action'
import type { DeleteDeploymentMutation, DeleteDeploymentMutationVariables } from '../generated/graphql.js'

const query = /* GraphQL */ `
  mutation deleteDeployment($id: ID!) {
    deleteDeployment(input: { id: $id }) {
      clientMutationId
    }
  }
`

export const deleteDeployment = async (
  o: Octokit,
  v: DeleteDeploymentMutationVariables,
): Promise<DeleteDeploymentMutation> => await o.graphql(query, v)
