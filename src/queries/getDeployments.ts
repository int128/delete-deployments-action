import { GitHub } from '@actions/github/lib/utils'
import { GetDeploymentsQuery, GetDeploymentsQueryVariables } from '../generated/graphql'

type Octokit = InstanceType<typeof GitHub>

const query = /* GraphQL */ `
  query getDeployments($owner: String!, $name: String!, $after: String) {
    rateLimit {
      cost
    }
    repository(owner: $owner, name: $name) {
      deployments(first: 100, after: $after) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          databaseId
          environment
          state
          ref {
            __typename
          }
        }
      }
    }
  }
`

export const getDeployments = async (o: Octokit, v: GetDeploymentsQueryVariables): Promise<GetDeploymentsQuery> =>
  await o.graphql(query, v)