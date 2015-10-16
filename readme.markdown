# network-simulator

simulate a low-level computer network

# one-way example

This network forwards connections along a one-way linear path:

``` js
var sim = require('network-simulator')()

for (var i = 0; i < 20; i++) (function (i) {
  var node = sim.createNode(i, [ 'eth0', 'eth1' ])
  node.on('eth0:message', function (buf) {
    node.send('eth1', buf)
  })
})(i)

for (var i = 1; i < 20; i++) {
  sim.link((i-1) + ':eth1', i + ':eth0')
}

sim.nodes[19].on('eth1:message', function (buf) {
  console.log('MESSAGE: ' + buf)
})
sim.nodes[4].send('eth0', Buffer('hello!'))
```

# ip example

This network sends IP messages for simple routing across a linear chain:

``` js
var sim = require('network-simulator')()
var ip = require('ip-packet')

for (var i = 1; i <= 20; i++) (function (i) {
  var node = sim.createNode(i, [ 'eth0', 'eth1' ])
  node.on('eth0:message', onmessage(false, 'eth1'))
  node.on('eth1:message', onmessage('eth0', false))
  function onmessage (lt, gt) {
    return function (buf) {
      var packet = ip.decode(buf)
      var octets = packet.destinationIp.split('.')
      if (packet.destinationIp === '192.168.1.' + i) {
        node.emit('packet', packet)
      } else if (lt && i > octets[3]) {
        node.send(lt, buf)
      } else if (gt && i < octets[3]) {
        node.send(gt, buf)
      }
    }
  }
})(i)

for (var i = 1; i < 20; i++) {
  sim.link(i + ':eth1', (i+1) + ':eth0')
}

sim.nodes[3].on('packet', function (packet) {
  console.log(packet)
})
sim.nodes[16].send('eth0', ip.encode({
  version: 4,
  protocol: 0,
  sourceIp: '192.168.1.16',
  destinationIp: '192.168.1.3',
  data: Buffer('hello')
}))
```

# api

``` js
var Simulator = require('network-simulator')
```

## var sim = Simulator()

Create a new simulator instance `sim`.

## var node = sim.createNode(key, ifaces)

Create a network node identified by a string `key` and an array of string
interface names `ifaces`.

## sim.nodes

Look up a previously created node by its key.

## sim.link(a, b)

Wire the network interfaces for `a` and `b` together.

`a` and `b` should be strings with a colon separator: `key:iface`.

## node.send(iface, buf)

Send `buf` out `iface`. A `'message'` event is generated on the node iface and
on any linked interfaces.

## node.link(iface, target, targetIface)

Wire `targetIface` on `target` (a node instance) to the local `iface`.

## node.on('IFACE:message', function (buf) {})

When data is sent to IFACE, this event fires.

# install

```
npm install network-simulator
```

# license

MIT
