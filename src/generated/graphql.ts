import * as Types from './graphql-types';

export type DeleteDeploymentMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DeleteDeploymentMutation = { __typename?: 'Mutation', deleteDeployment?: { __typename?: 'DeleteDeploymentPayload', clientMutationId?: string | null } | null };

export type GetDeploymentsQueryVariables = Types.Exact<{
  owner: Types.Scalars['String'];
  name: Types.Scalars['String'];
}>;


export type GetDeploymentsQuery = { __typename?: 'Query', rateLimit?: { __typename?: 'RateLimit', cost: number } | null, repository?: { __typename?: 'Repository', deployments: { __typename?: 'DeploymentConnection', totalCount: number, nodes?: Array<{ __typename?: 'Deployment', id: string, environment?: string | null, state?: Types.DeploymentState | null, ref?: { __typename: 'Ref' } | null } | null> | null } } | null };
