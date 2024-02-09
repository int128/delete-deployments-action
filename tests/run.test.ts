import { DeploymentState } from '../src/generated/graphql-types'
import { findOutdated } from '../src/run'

test('run successfully', () => {
  expect(
    findOutdated({
      repository: {
        deployments: {
          totalCount: 20,
          pageInfo: {
            hasNextPage: false,
          },
          nodes: [
            {
              id: 'DE_kwDOEx5AOc4nK0tU',
              databaseId: 1,
              environment: 'app1',
              state: DeploymentState.Destroyed,
              ref: null,
            },
            {
              id: 'DE_kwDOEx5AOc4nK0td',
              databaseId: 2,
              environment: 'app2',
              state: DeploymentState.Active,
              ref: null,
            },
            {
              id: 'DE_kwDOEx5AOc4nK5XB',
              databaseId: 3,
              environment: 'app3',
              state: DeploymentState.Inactive,
              ref: {
                __typename: 'Ref',
              },
            },
          ],
        },
      },
      rateLimit: {
        cost: 1,
      },
    }),
  ).toStrictEqual([
    {
      id: 'DE_kwDOEx5AOc4nK0tU',
      databaseId: 1,
      state: DeploymentState.Destroyed,
    },
    {
      id: 'DE_kwDOEx5AOc4nK0td',
      databaseId: 2,
      state: DeploymentState.Active,
    },
  ])
})
