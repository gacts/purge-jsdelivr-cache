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
      throw new Error(`The url "${url}" does not contains jsDelivr domain "cdn.jsdelivr.net"`)
    }
  })

  if (input.attempts <= 0) {
    throw new Error('Wrong attempts count')
  }

  const http = new httpClient.HttpClient()

  for (const result of (await Promise.allSettled(input.urls.map(async (url) => {
    const purgingUrl = url.replace('//cdn.jsdelivr.net', '//purge.jsdelivr.net')

    for (let attemptNumber = 1; ; attemptNumber++) {
      if (attemptNumber > input.attempts) {
        throw new Error(`✖ Too many (${attemptNumber - 1}) attempts for the url "${url}"`)
      }

      const res = await http.get(purgingUrl)

      if (res.message.statusCode !== 200) {
        core.info(`✖ Wrong response status code (${res.message.statusCode}) for the url "${url}"`)

        continue
      }

      /**
       * @see https://purge.jsdelivr.net/npm/jquery@3.2.0/dist/jquery.js
       *              ^^^^^^ instead of `cdn.`
       *
       * @example
       * {
       *   "id": "94Ntf00wDmtaEHm9",
       *   "status": "finished",
       *   "timestamp": "2024-06-20T08:17:35.569Z",
       *   "paths": {
       *     "/npm/jquery@3.2.0/dist/jquery.js": {
       *       "throttled": false,
       *       "providers": {
       *         "CF": true,
       *         "FY": true
       *       }
       *     }
       *   }
       * }
       *
       * @type {{
       *   id: string | undefined,
       *   status: string | undefined,
       *   timestamp: string | undefined,
       *   paths: Object.<string, {
       *     throttled: boolean | undefined,
       *     providers: Object.<string, boolean> | undefined,
       *   }> | undefined,
       * }}
       */
      const body = JSON.parse(await res.readBody())

      if (body.status && body.status.toLowerCase() !== 'finished') {
        core.info(`✖ Wrong status state (${body.status}) for the url "${url}"`)

        continue
      }

      if (body.paths && typeof body.paths === 'object') {
        for (const path in body.paths) {
          const pathData = body.paths[path]

          if (pathData.throttled && pathData.throttled !== false) {
            core.info(JSON.stringify(pathData))

            throw new Error(`✖ Purging request for the file "${path}" was throttled`)
          }
        }
      }

      core.info(`✔ Successes (${url})`)

      break
    }
  })))) {
    if (result.status === 'rejected') {
      throw result.reason
    }
  }
}

// run the action
(async () => {
  await run()
})().catch(error => {
  core.setFailed(error.message)
})
