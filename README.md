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
      - uses: int128/delete-deployments-action@v1
```

### Inputs

| Name | Default | Description
|------|----------|------------
| `token` | `github.token` | GitHub token
