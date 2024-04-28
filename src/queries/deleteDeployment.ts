import { GitHub } from '@actions/github/lib/utils'
import { DeleteDeploymentMutation, DeleteDeploymentMutationVariables } from '../generated/graphql.js'

type Octokit = InstanceType<typeof GitHub>

const query = /* GraphQL */ `
  mutation deleteDeployment($id: ID!) {
    deleteDeployment(input: { id: $id }) {
      clientMutationId
    }
  }
`

export const deleteDeployment = async (
  o: Octokit,
  v: DeleteDeploymentMutationVariables
): Promise<DeleteDeploymentMutation> => await o.graphql(query, v)
