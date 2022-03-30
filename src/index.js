const core = require('@actions/core');

// read action inputs
const input = {
  url: core.getInput('url', {required: true}),
  attempts: core.getInput('attempts'),
}

// main action entrypoint
async function run() {
  core.info(input.url)
  core.info(input.attempts)
}

// run the action
try {
  run()
} catch (error) {
  core.setFailed(error.message)
}
