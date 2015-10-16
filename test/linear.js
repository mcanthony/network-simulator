var test = require('tape')
var Simulator = require('../')

test('linear routing', function (t) {
  t.plan(1)
  var sim = new Simulator()
  for (var i = 0; i < 20; i++) (function (i) {
    var node = sim.createNode(i, {
      eth0: '192.168.' + i + '.1',
      eth1: '192.168.' + i + '.2'
    })
    node.on('eth0:message', function (buf) {
      node.send('eth1', buf)
    })
  })(i)

  for (var i = 1; i < 20; i++) {
    sim.link((i-1) + ':eth1', i + ':eth0')
  }
  sim.nodes[19].on('eth1:message', function (buf) {
    t.deepEqual(buf, Buffer('hello!'))
  })
  sim.nodes[4].on('eth0:message', t.fail.bind(t, 'one-way'))
  sim.nodes[4].on('eth1:message', t.fail.bind(t, 'one-way'))
  sim.nodes[5].send('eth1', Buffer('hello!'))
})
