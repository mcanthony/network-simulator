var inherits = require('inherits')
var EventEmitter = require('events').EventEmitter
var Duplex = require('readable-stream/duplex')

inherits(Node, Duplex)
module.exports = Node

function Node (ifaces) {
  if (!(this instanceof Node)) return new Node(ifaces)
  var self = this
  self.ports = {}
  self.ifaces = ifaces
}

Node.prototype.send = function (iface, buf) {
  this.emit(iface + ':send', buf)
}

Node.prototype.createSocket = function (type, cb) {
  var self = this
  var sock = new Socket(function (port) {
    return !self.ports[port]
  }, self.address)
  sock.once('listening', function () {
    // ...
  })
  if (cb) sock.on('message', cb)
  return sock
}

Node.prototype._write = function (buf, enc, next) {
}

inherits(Socket, EventEmitter)

function Socket (check, addr) {
  EventEmitter.call(this)
  this._check = check
  this._addr = addr
}

Socket.prototype.send = function (buf, offset, length, port, address, cb) {
}

Socket.prototype.bind = function (port, addr, cb) {
  if (this.listening && cb) {
    cb(new Error('socket already bound'))
  } else if (this.listening) {
    return this.emit('error', new Error('socket already bound'))
  }
  if (typeof port === 'object') {
    addr = port.address
    port = port.port
  }
  if (!self._check(port)) {
  }
}

Socket.prototype.address = function () {
}
