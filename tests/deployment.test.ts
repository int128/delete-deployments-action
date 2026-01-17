import { expect, it } from 'vitest'
import { findOutdated } from '../src/deployment.js'
import { DeploymentState } from '../src/generated/graphql-types.js'

it('findOutdated', () => {
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
              commitOid: '0123456789012345678901234567890123456789',
              ref: null,
            },
            {
              id: 'DE_kwDOEx5AOc4nK0td',
              databaseId: 2,
              environment: 'app2',
              state: DeploymentState.Active,
              commitOid: '0123456789012345678901234567890123456789',
              ref: null,
            },
            {
              id: 'DE_kwDOEx5AOc4nK5XB',
              databaseId: 3,
              environment: 'app3',
              state: DeploymentState.Inactive,
              commitOid: '0123456789012345678901234567890123456789',
              ref: {
                name: 'main',
                target: {
                  oid: '0123456789012345678901234567890123456789',
                },
              },
            },
            {
              id: 'DE_kwDOEx5AOc4n0004',
              databaseId: 4,
              environment: 'app4',
              state: DeploymentState.Inactive,
              commitOid: '0000000000000000000000000000000000000000',
              ref: {
                name: 'main',
                target: {
                  oid: '0123456789012345678901234567890123456789',
                },
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
      environment: 'app1',
      state: DeploymentState.Destroyed,
    },
    {
      id: 'DE_kwDOEx5AOc4nK0td',
      databaseId: 2,
      environment: 'app2',
      state: DeploymentState.Active,
    },
    {
      id: 'DE_kwDOEx5AOc4n0004',
      databaseId: 4,
      environment: 'app4',
      state: DeploymentState.Inactive,
    },
  ])
})
