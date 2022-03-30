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

  let hasErrors = false // has error flag

  for (let i = 0; i < input.urls.length; i++) {
    core.startGroup(`Purging cache for "${input.urls[i]}"`)

    const purgingUrl = input.urls[i].replace('//cdn.jsdelivr.net', '//purge.jsdelivr.net')

    for (let j = 0; j < input.attempts; j++) {
      const res = await http.get(purgingUrl)

      if (res.message.statusCode !== 200) {
        core.info(`Attempt ${j+1} failed: response status code ${res.message.statusCode}`)

        if (j >= input.attempts - 1) {
          core.error('Attempts count exceeded')
          hasErrors = true
        }
      } else {
        core.info(`Attempt ${j+1} successes`)

        break
      }
    }

    core.endGroup()
  }

  if (hasErrors) {
    throw new Error('Completed with errors, please try again')
  }
}

// run the action
try {
  run()
} catch (error) {
  core.setFailed(error.message)
}
