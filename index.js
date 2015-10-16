var inherits = require('inherits')
var EventEmitter = require('events').EventEmitter
var Node = require('./lib/node.js')

module.exports = Sim
inherits(Sim, EventEmitter)

function Sim () {
  if (!(this instanceof Sim)) return new Sim
  this.nodes = {}
  this.links = {}
}

Sim.prototype.createNode = function (index, ifaces) {
  var self = this
  var node = new Node(ifaces)
  self.nodes[index] = node
  return node
}

Sim.prototype.link = function (a, b) {
  var asp = a.split(':')
  var bsp = b.split(':')
  var anode = this.nodes[asp[0]]
  var bnode = this.nodes[bsp[0]]
  anode.link(asp[1], bnode, bsp[1])
}
