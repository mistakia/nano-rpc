# Nano RPC

A simple & small library to make RPC calls to an RPC endpoint.

```js
import rpc from 'nano-rpc'

const res = await rpc({ action: 'version' })
console.log(res)
```

```js
{
  rpc_version: '1',
  store_version: '21',
  protocol_version: '18',
  node_vendor: 'Nano V23.0',
  store_vendor: 'LMDB 0.9.25',
  network: 'live',
  network_identifier: '991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948',
  build_info: 'a7a44f9 "GNU C++ version " "7.5.0" "BOOST 107000" BUILT "Jan 17 2022"'
}
```

## Usage

### `rpc(request, [options])`

### Parameters

| Name    | Type     | Description                                                                                 |
| ------- | -------- | ------------------------------------------------------------------------------------------- |
| request | `Object` | See the [official RPC docs](https://docs.nano.org/commands/rpc-protocol/) for documentation |

### Options

An optional object which may have the following keys:

| Name      | Type      | Default     | Description                                                     |
| --------- | --------- | ----------- | --------------------------------------------------------------- |
| url       | `String`  | `undefined` | If supplied, it will only use this endpoint                     |
| randomize | `Boolean` | `true`      | Randomize the order the urls are reached for a success response |
| urls      | `Array`   | `Array`     | View default urls here                                          |

### Returns

| Type            | Description                                                                                        |
| --------------- | -------------------------------------------------------------------------------------------------- |
| `Promise<void>` | A promise that resolves to an `Object`, if request is not successful an error property will be set |

## Examples

```js
import rpc from 'nano-rpc'

// uses default urls, randomized, and returns first successful response
const randomRes = await rpc({ action: 'version' })

// use supplied url only
const res = await rpc(
  { action: 'version' },
  { url: 'https://proxy.nanos.cc/proxy' }
)

// use supplied urls, will return first successful response (checked in order)
const urls = ['https://proxy.nanos.cc/proxy', 'https://node.somenano.com/proxy']
const res = await rpc({ action: 'version' }, { urls, randomize: false })
```
