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

Node.prototype.send = function (iface, buf, cb) {
  if (!cb) cb = noop
  if (!has(this.ifaces, iface)) return cb(new Error('no such interface'))
  this.emit(iface + ':message', buf)
  this.emit(iface + ':send', buf)
}

function noop () {}
