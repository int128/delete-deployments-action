# delete-deployments-action [![ts](https://github.com/int128/delete-deployments-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/delete-deployments-action/actions/workflows/ts.yaml)

This is an action to delete outdated GitHub Deployments.

## Getting Started

To run this action, create a workflow as follows:

```yaml
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
