/* global describe it */

import chai from 'chai'

import rpc from '../index.js'

const expect = chai.expect

describe('RPC', function () {
  describe('POST', function () {
    it('default options', async function () {
      const res = await rpc({
        action: 'version'
      })

      expect(res.rpc_version).to.be.a('string')
      expect(res.protocol_version).to.be.a('string')
      expect(res.network).to.be.a('string')
    })

    it('single url', async function () {
      const res = await rpc(
        {
          action: 'version'
        },
        {
          url: 'https://proxy.nanos.cc/proxy'
        }
      )

      expect(res.rpc_version).to.be.a('string')
      expect(res.protocol_version).to.be.a('string')
      expect(res.network).to.be.a('string')
    })

    it('multiple urls with one bad url', async function () {
      const res = await rpc(
        {
          action: 'version'
        },
        {
          randomize: false,
          urls: ['https://example.com/proxy', 'https://proxy.nanos.cc/proxy']
        }
      )

      expect(res.rpc_version).to.be.a('string')
      expect(res.protocol_version).to.be.a('string')
      expect(res.network).to.be.a('string')
    })
  })

  describe('errors', function () {
    it('bad url', async function () {
      const res = await rpc(
        {
          action: 'version'
        },
        {
          url: 'https://example.com/proxy'
        }
      )

      expect(res.error).to.be.an.instanceof(Error)
      expect(res.error.message).to.equal('Not Found')
    })

    it('bad action', async function () {
      const res = await rpc(
        {
          action: 'example'
        },
        {
          url: 'https://proxy.nanos.cc/proxy'
        }
      )

      expect(res.error).to.be.an.instanceof(Error)
      expect(res.error.message).to.equal('Action example not allowed')
    })
  })
})
