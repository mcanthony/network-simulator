var sim = require('../')()

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
