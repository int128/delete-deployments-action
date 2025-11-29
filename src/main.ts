import * as core from '@actions/core'
import { getContext, getOctokit } from './github.js'
import { run } from './run.js'

const main = async (): Promise<void> => {
  await run(
    {
      batchDeletionRateLimit: parseInt(core.getInput('batch-deletion-rate-limit', { required: true }), 10),
    },
    getOctokit(),
    getContext(),
  )
}

main().catch((e: Error) => {
  core.setFailed(e)
  console.error(e)
})
