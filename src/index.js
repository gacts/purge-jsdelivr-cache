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

  for (let i = 0; i < input.urls.length; i++) {
    core.startGroup(`Purging cache for "${input.urls[i]}"`)

    const purgingUrl = input.urls[i].replace('//cdn.jsdelivr.net', '//purge.jsdelivr.net')

    for (let attemptNumber = 1; ; attemptNumber++) {
      if (attemptNumber > input.attempts) {
        throw new Error(`✖ Too many (${attemptNumber - 1}) attempts`)
      }

      const res = await http.get(purgingUrl), statusCode = res.message.statusCode

      if (statusCode !== 200) {
        core.info(`✖ Wrong response status code = ${statusCode}`)

        continue
      }

      const bodyRaw = await res.readBody(), body = JSON.parse(bodyRaw)

      if (Object.prototype.hasOwnProperty.call(body, 'status') && body['status'].toLowerCase() !== 'finished') {
        core.info(`✖ Wrong status state (${body['status']})`)

        continue
      }

      if (Object.prototype.hasOwnProperty.call(body, 'paths')) {
        for (const path in body['paths']) {
          const pathData = body['paths'][path]

          if (Object.prototype.hasOwnProperty.call(pathData, 'throttled') && pathData['throttled'] !== false) {
            core.info(JSON.stringify(pathData))

            throw new Error(`✖ Purging request for the file "${path}" was throttled`)
          }
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
  core.setFailed(error.message)
}
