import type * as github from '@actions/github'
import type { DeleteDeploymentMutation, DeleteDeploymentMutationVariables } from '../generated/graphql.js'

type Octokit = ReturnType<typeof github.getOctokit>

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
