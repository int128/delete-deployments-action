import { GitHub } from '@actions/github/lib/utils'
import {
  DeleteDeploymentMutation,
  DeleteDeploymentMutationVariables,
  DeploymentsQuery,
  DeploymentsQueryVariables,
} from '../generated/graphql'

type Octokit = InstanceType<typeof GitHub>

const query = /* GraphQL */ `
  query deployments($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      deployments(first: 100) {
        nodes {
          id
          environment
          state
          ref {
            __typename
          }
        }
      }
    }
    rateLimit {
      cost
    }
  }
`

export const getDeployments = async (o: Octokit, v: DeploymentsQueryVariables): Promise<DeploymentsQuery> =>
  await o.graphql(query, v)

const deleteMutation = /* GraphQL */ `
  mutation deleteDeployment($id: ID!) {
    deleteDeployment(input: { id: $id }) {
      clientMutationId
    }
  }
`

export const deleteDeployment = async (
  o: Octokit,
  v: DeleteDeploymentMutationVariables
): Promise<DeleteDeploymentMutation> => await o.graphql(deleteMutation, v)
