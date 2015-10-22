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
    self.ifaces[iface] = []
  })
}

Node.prototype.send = function (iface, buf) {
  if (!has(this.ifaces, iface)) throw new Error('no such interface')
  ;(this.ifaces[iface] || []).forEach(function (dst) {
    dst.node.emit(dst.iface + ':message', buf)
  })
}

Node.prototype.link = function (iface, target, targetIface) {
  var self = this
  if (!has(self.ifaces, iface)) throw new Error('no such interface')
  if (!has(target.ifaces, targetIface)) throw new Error('no such interface')
  self.ifaces[iface].push({ node: target, iface: targetIface })
  target.ifaces[targetIface].push({ node: self, iface: iface })
}
