/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from './graphql-types.js';

/** The possible states in which a deployment can be. */
export type DeploymentState =
  /** The pending deployment was not updated after 30 minutes. */
  | 'ABANDONED'
  /** The deployment is currently active. */
  | 'ACTIVE'
  /** An inactive transient deployment. */
  | 'DESTROYED'
  /** The deployment experienced an error. */
  | 'ERROR'
  /** The deployment has failed. */
  | 'FAILURE'
  /** The deployment is inactive. */
  | 'INACTIVE'
  /** The deployment is in progress. */
  | 'IN_PROGRESS'
  /** The deployment is pending. */
  | 'PENDING'
  /** The deployment has queued */
  | 'QUEUED'
  /** The deployment was successful. */
  | 'SUCCESS'
  /** The deployment is waiting. */
  | 'WAITING';

export type DeleteDeploymentMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteDeploymentMutation = { deleteDeployment: { clientMutationId: string | null } | null };

export type GetDeploymentsQueryVariables = Exact<{
  owner: string;
  name: string;
  after?: string | null | undefined;
}>;


export type GetDeploymentsQuery = { rateLimit: { cost: number } | null, repository: { deployments: { totalCount: number, pageInfo: { hasNextPage: boolean, endCursor: string | null }, nodes: Array<{ id: string, databaseId: number | null, environment: string | null, state: Types.DeploymentState | null, commitOid: string, ref: { name: string, target:
            | { oid: string }
            | { oid: string }
            | { oid: string }
            | { oid: string }
           | null } | null } | null> | null } } | null };
