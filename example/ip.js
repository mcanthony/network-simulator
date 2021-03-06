var sim = require('../')()
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
