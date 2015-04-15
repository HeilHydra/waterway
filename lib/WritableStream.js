var Writable = require("stream").Writable;
var inherits = require("util").inherits;

var CHANNEL_TYPE = "stream";

function WritableStream(connection, id) {
  Writable.call(this, {
    objectMode: true
  });
  this._connection = connection;
  this._id = id;

  this.on("finish", this._handleStreamEnd.bind(this));
}

inherits(WritableStream, Writable);

WritableStream.prototype._handleStreamEnd = function () {
  this._connection.emit(CHANNEL_TYPE, this._id, "finish", null);
};

WritableStream.prototype._write = function (data, encoding, callback) {
  this._connection.emit(CHANNEL_TYPE, this._id, "data", data);
  callback();
};

module.exports = WritableStream;