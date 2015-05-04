var Writable = require("stream").Writable;
var inherits = require("util").inherits;
var Heartbeat = require("./Heartbeat");

var CHANNEL_TYPE = "stream";

function WritableStream(connection, id) {
  Writable.call(this, {
    objectMode: true
  });
  this._connection = connection;
  this._id = id;

  this._heartbeat = new Heartbeat();
  this._heartbeat.on("beat", this._connection.emit.bind(this._connection, CHANNEL_TYPE, id, "heartbeat"));
  this._heartbeat.on("timeout", this._handleTimeout.bind(this));
  this._connection.on(CHANNEL_TYPE, id, "heartbeat", this._heartbeat.received.bind(this._heartbeat));
  this._heartbeat.start();

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

WritableStream.prototype._handleTimeout = function () {
  this.emit("timeout");
  this.end();
};


module.exports = WritableStream;