var Readable = require("stream").Readable;
var _ = require("lodash-node");
var inherits = require("util").inherits;

var CHANNEL_TYPE = "stream";

function ReadableStream(connection, id) {
  Readable.call(this, {
    objectMode: true
  });

  this._connection = connection;
  this._reading = false;
  this._buffer = [];

  this._connection.on(CHANNEL_TYPE, id, "data", this._handleIncomingData.bind(this));
  this._connection.on(CHANNEL_TYPE, id, "finish", this._handleStreamFinish.bind(this));
}

inherits(ReadableStream, Readable);

ReadableStream.prototype._read = function () {
  this._reading = true;
  if (this._buffer.length > 0) {
    var toFlush = this._buffer;
    this._buffer = [];
    _.each(toFlush, this._handleIncomingData.bind(this));
  }
};

ReadableStream.prototype._handleIncomingData = function (res) {
  if (!this._reading) {
    this._buffer.push(res);
  } else {
    if (!this.push(res.data)) {
      this._reading = false;
    }
  }
};

ReadableStream.prototype._handleStreamFinish = function () {
  this.push(null);
};

module.exports = ReadableStream;