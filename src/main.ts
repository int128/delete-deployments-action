import * as core from '@actions/core'
import * as github from '@actions/github'
import { run } from './run.js'

const main = async (): Promise<void> => {
  await run({
    batchDeletionRateLimit: parseInt(core.getInput('batch-deletion-rate-limit', { required: true }), 10),
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    token: core.getInput('token', { required: true }),
  })
}

main().catch((e: Error) => {
  core.setFailed(e)
  console.error(e)
})
