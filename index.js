var stream = require('stream')
  , util = require('util')

module.exports = Bracket

util.inherits(Bracket, stream.Transform)

function Bracket(bra, ket, options, match) {
  if(typeof options === 'function') {
    match = options
    options = undefined
  }

  // elements between a bra and a ket need to be they're own dataelement
  // If the bra and ket are nested
  this.bra = bra
  this.ket = ket
  this.options = options
  this.match = match || equals
  this.bag = []
  this.open = null

  stream.Transform.call(this, options)

  if(this.options.array) {
    this.concat = arr_concat
  } else if(!this.options.string) {
    this.concat = string_concat
  } else {
    this.concat = Buffer.concat
  }
}

function string_concat(arr) {
  return arr.join('')
}

function arr_concat(arr) {
  return [].concat(arr)
}

Bracket.prototype._transform = function(chunk, encoding, done) {
  if(this.match(this.bra, chunk)) {
    // open a new bag.

    this.open = true
    this.bag.push(chunk)

    return done()
  }

  if(this.match(this.ket, chunk)) {
    this.bag.push(chunk)
    this.push(this.concat(this.bag))

    // empty and close the bag
    this.bag = []
    this.open = null

    return done()
  }

  if(this.open) {
    // push the chunk onto the bag
    this.bag.push(chunk)

    return done()
  }

  this.push(chunk)

  return done()
}

function equals(lhs, rhs) {
  return lhs === rhs
}
