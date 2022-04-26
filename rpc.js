import fetch from 'cross-fetch'

const request = async (options) => {
  const response = await fetch(options.url, options)
  if (response.status >= 200 && response.status < 300) {
    return response.json()
  } else {
    let res
    try {
      res = await response.json()
    } catch (error) {
      // ignore
    }

    const error = new Error((res && res.error) || response.statusText)
    error.response = response
    throw error
  }
}

const POST = (data) => ({
  method: 'POST',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json'
  }
})

const defaultConfig = {
  randomize: true,
  urls: [
    'https://rpc.p2pow.online',
    'https://rpc.nanoprofile.online',
    'https://mynano.ninja/api/node',
    'https://nault.nanos.cc/proxy',
    'https://proxy.powernode.cc/proxy',
    'https://api.nanex.cc',
    'https://vault.nanocrawler.cc/api/node-api',
    'https://node.somenano.com/proxy',
    'https://proxy.nanos.cc/proxy',
    'https://www.bitrequest.app:8020/',
    'https://rainstorm.city/api'
  ]
}

export default async function rpc(params, config = {}) {
  const { url } = config
  if (url) {
    try {
      const options = { url, ...POST(params) }
      const res = await request(options)
      return res
    } catch (error) {
      return {
        error
      }
    }
  }

  const cnf = Object.assign(defaultConfig, config)

  const urls = cnf.randomize
    ? cnf.urls
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    : cnf.urls

  let error
  let res
  for (let i = 0; i < urls.length; i++) {
    try {
      const url = urls[i]
      const options = { url, ...POST(params) }
      res = await request(options)
    } catch (err) {
      error = err
    }

    if (res && !res.error) {
      return res
    }
  }

  return { error: (res && res.error) || error }
}
