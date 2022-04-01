
# socket.io-msgpack-javascript

An alternative to the default [socket.io-parser](https://github.com/socketio/socket.io-parser), encoding and decoding packets with [msgpack](http://msgpack.org/) official latest javascript version [msgpack-javascript](https://github.com/msgpack/msgpack-javascript)

Please note that you MUST use the parser on both sides (server & client).

Compatibility table:

| Parser version | Socket.IO server version |
|----------------| ------------------------ |
| 1.x.x          | 3.x.x / 4.x.x            |

## Installation

```
npm i -S skgdev/socket.io-msgpack-javascript
```

## Options

### `EncodeOptions`

Name|Type|Default
----|----|----
maxDepth | number | `100`
initialBufferSize | number | `2048`
sortKeys | boolean | false
forceFloat32 | boolean | false
forceIntegerToFloat | boolean | false
ignoreUndefined | boolean | false

See:
- [msgpack EncodeOptions](https://github.com/msgpack/msgpack-javascript#encodeoptions)
- [ExtensionCodec context](https://github.com/msgpack/msgpack-javascript#extensioncodec-context)
### `DecodeOptions`

Name|Type|Default
----|----|----
maxStrLength | number | `4_294_967_295` (UINT32_MAX)
maxBinLength | number | `4_294_967_295` (UINT32_MAX)
maxArrayLength | number | `4_294_967_295` (UINT32_MAX)
maxMapLength | number | `4_294_967_295` (UINT32_MAX)
maxExtLength | number | `4_294_967_295` (UINT32_MAX)

You can use `max${Type}Length` to limit the length of each type decoded.

See:
- [msgpack DecodeOptions](https://github.com/msgpack/msgpack-javascript#decodeoptions)
- [ExtensionCodec context](https://github.com/msgpack/msgpack-javascript#extensioncodec-context)

## Usage
### Example
```js
const io = require('socket.io');
const ioc = require('socket.io-client');
const customParser = require('@skgdev/socket.io-msgpack-javascript');
const server = io(PORT, {
  parser: customParser.build({
      encoder: ?EncodeOptions,
      decoder: ?DecodeOptions
  })
});

const socket = ioc('ws://localhost:' + PORT, {
  parser: customParser
});

socket.on('connect', () => {
  socket.emit('hello');
});
```

### Format

`socket.emit('hello', 'you')` will create the following packet:

```json
{
  "type": 2,
  "nsp": "/",
  "data": ["hello", "you"]
}
```

which will be encoded by the parser as:

`<Buffer 83 a4 74 79 70 65 02 a3 6e 73 70 a1 2f a4 64 61 74 61 92 a5 68 65 6c 6c 6f a3 79 6f 75>`
