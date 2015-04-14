var Duplex = require("stream").Duplex;
var when = require("when");
var guid = require("guid");
var ReadableStream = require("./ReadableStream");
var WriteableStream = require("./WriteableStream");
var inherits = require("util").inherits;
var keyUtils = require("./utils/key");

var CHANNEL_TYPE = "stream";

function Stream(connection, key) {
  keyUtils.ensureNoWildcards(key);
  Duplex.call(this, {
    objectMode: true
  });
  this._connection = connection;
  this._key = key;
  this._reading = false;
  this._readBuffer = [];
  this._connection.on(CHANNEL_TYPE, this._key, this._handleIncomingData.bind(this));
}

inherits(Stream, Duplex);

Stream.prototype.readable = function (data) {
  var id = guid.raw();
  var dfrd = when.defer();

  this._connection.on(CHANNEL_TYPE, id, "init", function () {
    var readable = new ReadableStream(this._connection, id, data);
    dfrd.resolve(readable);
  }.bind(this));

  this._connection.on(CHANNEL_TYPE, id, "initerror", function (err) {
    dfrd.reject(err);
  });

  this._connection.emit(CHANNEL_TYPE, id, this._key, "send", this._key, data);

  return dfrd.promise;
};

Stream.prototype.writeable = function (callback) {
  this._connection.on(CHANNEL_TYPE, "*", "send", this._key, function (data, requestKey) {
    var id = requestKey[1];
    var writeable = new WriteableStream(this._connection, id);

    try {
      callback(writeable, data, requestKey.slice(3));
      this._connection.emit(CHANNEL_TYPE, id, "init");
    } catch (err) {
      this._connection.emit(CHANNEL_TYPE, id, "initerror", err);
    }
  }.bind(this));
};

module.exports = Stream;