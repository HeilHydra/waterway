var Writable = require("stream").Writable;
var inherits = require("util").inherits;

var CHANNEL_TYPE = "stream";

function WritableStream(connection, id) {
  Writable.call(this, {
    objectMode: true
  });
  this._connection = connection;
  this._id = id;

  this.on("end", function () {
  this._connection.emit(CHANNEL_TYPE, this._id, "end", null);
  });
}

inherits(WritableStream, Writable);

WritableStream.prototype._write = function (data, encoding, callback) {
  this._connection.emit(CHANNEL_TYPE, this._id, "data", data);
  callback();
};

module.exports = WritableStream;