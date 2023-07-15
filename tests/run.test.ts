import { DeploymentState } from '../src/generated/graphql-types'
import { findOutdated } from '../src/run'

test('run successfully', () => {
  expect(
    findOutdated({
      repository: {
        deployments: {
          nodes: [
            {
              id: 'DE_kwDOEx5AOc4nK0tU',
              environment: 'pr-727/app1',
              state: DeploymentState.Destroyed,
              ref: null,
            },
            {
              id: 'DE_kwDOEx5AOc4nK0tZ',
              environment: 'pr-727/app2',
              state: DeploymentState.Destroyed,
              ref: null,
            },
            {
              id: 'DE_kwDOEx5AOc4nK0td',
              environment: 'pr-727/app3',
              state: DeploymentState.Active,
              ref: null,
            },
            {
              id: 'DE_kwDOEx5AOc4nK3o9',
              environment: 'pr-737/app1',
              state: DeploymentState.Destroyed,
              ref: null,
            },
            {
              id: 'DE_kwDOEx5AOc4nK3pE',
              environment: 'pr-737/app2',
              state: DeploymentState.Destroyed,
              ref: null,
            },
            {
              id: 'DE_kwDOEx5AOc4nK3pO',
              environment: 'pr-737/app3',
              state: DeploymentState.Active,
              ref: null,
            },
            {
              id: 'DE_kwDOEx5AOc4nK5XB',
              environment: 'tags/v1.12.0/app1',
              state: DeploymentState.Inactive,
              ref: {
                __typename: 'Ref',
              },
            },
            {
              id: 'DE_kwDOEx5AOc4nK5XJ',
              environment: 'tags/v1.12.0/app2',
              state: DeploymentState.Inactive,
              ref: {
                __typename: 'Ref',
              },
            },
            {
              id: 'DE_kwDOEx5AOc4nK5XO',
              environment: 'tags/v1.12.0/app3',
              state: DeploymentState.Active,
              ref: {
                __typename: 'Ref',
              },
            },
            {
              id: 'DE_kwDOEx5AOc4nO3ph',
              environment: 'pr-631/app1',
              state: DeploymentState.Destroyed,
              ref: {
                __typename: 'Ref',
              },
            },
            {
              id: 'DE_kwDOEx5AOc4nO3pk',
              environment: 'pr-631/app2',
              state: DeploymentState.Destroyed,
              ref: {
                __typename: 'Ref',
              },
            },
            {
              id: 'DE_kwDOEx5AOc4nO3pt',
              environment: 'pr-631/app3',
              state: DeploymentState.Active,
              ref: {
                __typename: 'Ref',
              },
            },
            {
              id: 'DE_kwDOEx5AOc4nR1aZ',
              environment: 'pr-739/app1',
              state: DeploymentState.Destroyed,
              ref: null,
            },
            {
              id: 'DE_kwDOEx5AOc4nR1ab',
              environment: 'pr-739/app2',
              state: DeploymentState.Destroyed,
              ref: null,
            },
            {
              id: 'DE_kwDOEx5AOc4nR1ag',
              environment: 'pr-739/app3',
              state: DeploymentState.Active,
              ref: null,
            },
            {
              id: 'DE_kwDOEx5AOc4nTdI3',
              environment: 'pr-741/app1',
              state: DeploymentState.Destroyed,
              ref: null,
            },
            {
              id: 'DE_kwDOEx5AOc4nTdJB',
              environment: 'pr-741/app2',
              state: DeploymentState.Destroyed,
              ref: null,
            },
            {
              id: 'DE_kwDOEx5AOc4nTdJK',
              environment: 'pr-741/app3',
              state: DeploymentState.Active,
              ref: null,
            },
            {
              id: 'DE_kwDOEx5AOc4nToK0',
              environment: 'master/app1',
              state: DeploymentState.Inactive,
              ref: {
                __typename: 'Ref',
              },
            },
            {
              id: 'DE_kwDOEx5AOc4nToK8',
              environment: 'master/app2',
              state: DeploymentState.Inactive,
              ref: {
                __typename: 'Ref',
              },
            },
            {
              id: 'DE_kwDOEx5AOc4nToLC',
              environment: 'master/app3',
              state: DeploymentState.Active,
              ref: {
                __typename: 'Ref',
              },
            },
            {
              id: 'DE_kwDOEx5AOc4nToV0',
              environment: 'pr-742/app1',
              state: DeploymentState.Destroyed,
              ref: {
                __typename: 'Ref',
              },
            },
            {
              id: 'DE_kwDOEx5AOc4nToV3',
              environment: 'pr-742/app2',
              state: DeploymentState.Destroyed,
              ref: {
                __typename: 'Ref',
              },
            },
            {
              id: 'DE_kwDOEx5AOc4nToV6',
              environment: 'pr-742/app3',
              state: DeploymentState.Active,
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
    'DE_kwDOEx5AOc4nK0tU',
    'DE_kwDOEx5AOc4nK0tZ',
    'DE_kwDOEx5AOc4nK0td',
    'DE_kwDOEx5AOc4nK3o9',
    'DE_kwDOEx5AOc4nK3pE',
    'DE_kwDOEx5AOc4nK3pO',
    'DE_kwDOEx5AOc4nR1aZ',
    'DE_kwDOEx5AOc4nR1ab',
    'DE_kwDOEx5AOc4nR1ag',
    'DE_kwDOEx5AOc4nTdI3',
    'DE_kwDOEx5AOc4nTdJB',
    'DE_kwDOEx5AOc4nTdJK',
  ])
})
