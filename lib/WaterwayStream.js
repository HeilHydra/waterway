var Duplex = require("stream").Duplex;
var inherits = require("util").inherits;
var keyUtils = require("./utils/key");

var CHANNEL_TYPE = "stream";

function WaterwayStream(connection, key) {
  keyUtils.ensureNoWildcards(key);
  Duplex.call(this, {
    objectMode: true
  });
  this._connection = connection;
  this._key = key
  this._reading = false;
  this._readBuffer = [];
  this._connection.on(CHANNEL_TYPE, this._key, this._handleIncomingData.bind(this));
}

inherits(WaterwayStream, Duplex);

WaterwayStream.prototype._read = function () {
  this._reading = true;
  if (this._readBuffer.length > 0) {
    var toFlush = this._readBuffer;
    this._readBuffer = [];
    _.each(toFlush, this._handleIncomingData.bind(this));
  }
};

WaterwayStream.prototype._write = function (data) {
  this._connection.emit(CHANNEL_TYPE, this._key, data);
};

WaterwayStream.prototype._handleIncomingData = function (data) {
  if (!this._reading) {
    this._readBuffer.push(data);
  } else {
    if (!this.push(data)) {
      this._reading = false;
    }
  }
};

module.exports = WaterwayStream;