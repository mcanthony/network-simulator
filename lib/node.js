var inherits = require('inherits')
var EventEmitter = require('events').EventEmitter
var has = require('has')

module.exports = Node
inherits(Node, EventEmitter)

function Node (ifaces) {
  if (!(this instanceof Node)) return new Node(ifaces)
  var self = this
  self.ports = {}
  self.ifaces = {}
  ;[].concat(ifaces).filter(Boolean).forEach(function (iface) {
    self.ifaces[iface] = true
  })
}

Node.prototype.send = function (iface, buf) {
  if (!has(this.ifaces, iface)) throw new Error('no such interface')
  this.emit(iface + ':message', buf)
  this.emit(iface + ':send', buf)
}

Node.prototype.link = function (iface, target, targetIface) {
  var self = this
  if (!has(self.ifaces, iface)) throw new Error('no such interface')
  if (!has(target.ifaces, targetIface)) throw new Error('no such interface')
  self.on(iface + ':send', function (buf) {
    target.emit(targetIface + ':message', buf)
  })
  target.on(targetIface + ':send', function (buf) {
    self.emit(iface + ':message', buf)
  })
}

function noop () {}
