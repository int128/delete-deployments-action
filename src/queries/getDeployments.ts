import type * as github from '@actions/github'
import type { GetDeploymentsQuery, GetDeploymentsQueryVariables } from '../generated/graphql.js'

type Octokit = ReturnType<typeof github.getOctokit>

const query = /* GraphQL */ `
  query getDeployments($owner: String!, $name: String!, $after: String) {
    rateLimit {
      cost
    }
    repository(owner: $owner, name: $name) {
      deployments(first: 100, after: $after, orderBy: { field: CREATED_AT, direction: ASC }) {
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
          commitOid
          ref {
            name
            target {
              oid
            }
          }
        }
      }
    }
  }
`

export const getDeployments = async (o: Octokit, v: GetDeploymentsQueryVariables): Promise<GetDeploymentsQuery> =>
  await o.graphql(query, v)
