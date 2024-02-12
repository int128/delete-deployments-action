# delete-deployments-action [![ts](https://github.com/int128/delete-deployments-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/delete-deployments-action/actions/workflows/ts.yaml)

This is an action to delete outdated GitHub Deployments.

## Getting Started

To clean up the outdated deployments every night,

```yaml
name: delete-outdated-deployments

on:
  schedule:
    - cron: '0 0 * * *'

jobs:
  delete:
    runs-on: ubuntu-latest
    steps:
      - uses: int128/delete-deployments-action@v1
```

### Deletion criteria

If a deployment refers to a ref which does not exist, this action will delete it.
For example, if a deployment meets the following conditions:

- The deployment refers to `topic` branch
- `topic` branch does not exist

If a deployment refers to an outdated commit, this action will delete it.
For example, if a deployment meets the following conditions:

- `main` branch refers to commit A
- The deployment refers to `main` branch
- The deployment refers to commit B, which is different from the commit of `main` branch

## Batch deletion

If a repository has a lot of deployments, try the batch deletion.

```yaml
jobs:
  delete:
    runs-on: ubuntu-latest
    steps:
      - uses: int128/delete-deployments-action@v1
        with:
          # Perform the batch deletion while the rate limit remaining > 100
          batch-deletion-rate-limit: 100
```

## Specification

### Inputs

| Name                        | Default        | Description                                                                 |
| --------------------------- | -------------- | --------------------------------------------------------------------------- |
| `batch-deletion-rate-limit` | -              | If set, perform the batch deletion until the rate limit remaining is enough |
| `token`                     | `github.token` | GitHub token                                                                |
