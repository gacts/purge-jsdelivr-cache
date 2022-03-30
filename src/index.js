const core = require('@actions/core');

// read action inputs
const input = {
  urls: core.getInput('url', {required: true}).split('\n').map(url => url.trim()),
  attempts: parseInt(core.getInput('attempts'), 10),
}

// main action entrypoint
async function run() {
  if (input.urls.length <= 0) {
    throw new Error('Empty URLs list')
  }

  console.info(input.urls)
  console.info(input.attempts)
}

// run the action
try {
  run()
} catch (error) {
  core.setFailed(error.message)
}
