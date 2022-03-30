const core = require('@actions/core')
const httpClient = require('@actions/http-client')

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

  input.urls.forEach(url => {
    if (!url.includes('//cdn.jsdelivr.net')) {
      throw new Error(`Url "${url}" does not contains jsDelivr domain "cdn.jsdelivr.net"`)
    }
  })

  if (input.attempts <= 0) {
    throw new Error('Wrong attempts count')
  }

  // create http client instance (docs: <https://github.com/actions/http-client>)
  const http = new httpClient.HttpClient();

  input.urls.forEach(url => {
    core.startGroup(`Purging cache for "${url}"`)

    for (let i = 0; i < input.attempts; i++) {
      core.info(`Attempt ${i}`)
    }

    core.endGroup()
  })
}

// run the action
try {
  run()
} catch (error) {
  core.setFailed(error.message)
}
