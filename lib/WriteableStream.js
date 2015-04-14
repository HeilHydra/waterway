var Writeable = require("stream").Writeable;
var inherits = require("util").inherits;

var CHANNEL_TYPE = "stream";

function WriteableStream(connection, id) {
  Writeable.call(this, {
    objectMode: true
  });
  this._connection = connection;
  this._id = id;

  this.on("end", function () {
  this._connection.emit(CHANNEL_TYPE, this._id, "end");
  });
}

inherits(WriteableStream, Writeable);

WriteableStream.prototype._write = function (data, encoding, callback) {
  this._connection.emit(CHANNEL_TYPE, this._id, "data", data);
  callback();
};

module.exports = WriteableStream;