# delete-deployments-action [![ts](https://github.com/int128/delete-deployments-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/delete-deployments-action/actions/workflows/ts.yaml)

This is an action to delete outdated GitHub Deployments.
If a GitHub Deployment points to a ref which does not exist, this action deletes it.

## Getting Started

To clean up the outdated GitHub Deployments every night, create a workflow as follows:

```yaml
name: delete-outdated-deployments

on:
  schedule:
    - cron: '0 0 * * *'

jobs:
  delete:
    runs-on: ubuntu-latest
    steps:
      - uses: int128/delete-deployments-action@v0
```

## Batch deletion

If a repository has a lot of deployments, try the batch deletion.

```yaml
jobs:
  delete:
    runs-on: ubuntu-latest
    steps:
      - uses: int128/delete-deployments-action@v0
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
