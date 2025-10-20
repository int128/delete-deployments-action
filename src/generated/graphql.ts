import * as Types from './graphql-types.js';

export type DeleteDeploymentMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeleteDeploymentMutation = { __typename?: 'Mutation', deleteDeployment?: { __typename?: 'DeleteDeploymentPayload', clientMutationId?: string | null } | null };

export type GetDeploymentsQueryVariables = Types.Exact<{
  owner: Types.Scalars['String']['input'];
  name: Types.Scalars['String']['input'];
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetDeploymentsQuery = { __typename?: 'Query', rateLimit?: { __typename?: 'RateLimit', cost: number } | null, repository?: { __typename?: 'Repository', deployments: { __typename?: 'DeploymentConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null }, nodes?: Array<{ __typename?: 'Deployment', id: string, databaseId?: number | null, environment?: string | null, state?: Types.DeploymentState | null, commitOid: string, ref?: { __typename?: 'Ref', name: string, target?:
            | { __typename?: 'Blob', oid: string }
            | { __typename?: 'Commit', oid: string }
            | { __typename?: 'Tag', oid: string }
            | { __typename?: 'Tree', oid: string }
           | null } | null } | null> | null } } | null };
