const core = require('@actions/core') // https://github.com/actions/toolkit/tree/main/packages/core
const httpClient = require('@actions/http-client') // https://github.com/actions/http-client

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

  const http = new httpClient.HttpClient()

  retryLoop:
    for (let i = 0; i < input.urls.length; i++) {
      core.startGroup(`Purging cache for "${input.urls[i]}"`)

      const purgingUrl = input.urls[i].replace('//cdn.jsdelivr.net', '//purge.jsdelivr.net')

      for (let j = 1; ; j++) {
        if (j > input.attempts) {
          throw new Error(`✖ Too many (${j}) attempts`)
        }

        const res = await http.get(purgingUrl)

        if (res.message.statusCode !== 200) {
          core.info(`✖ Response status code = ${res.message.statusCode}`)

          continue
        }

        const bodyRaw = await res.readBody(), bodyObj = JSON.parse(bodyRaw)

        if (bodyObj['status'].toLowerCase() !== 'finished') {
          core.info(`✖ Wrong status state (${bodyObj['status']})`)

          continue
        }

        for (const key in bodyObj['paths']) {
          if (bodyObj['paths'][key]['throttled'] !== false) {
            core.info(`✖ Request for the file "${key}" was throttled`)

            continue retryLoop
          }
        }

        core.info(`✔ Successes`)

        break
      }

      core.endGroup()
    }
}

// run the action
try {
  run()
} catch (error) {
  core.error(error.message)

  core.setFailed(error.message)
}
