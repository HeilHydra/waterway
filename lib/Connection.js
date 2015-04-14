var NRP = require("node-redis-pubsub");
var JSONB = require("json-buffer");
var _ = require("lodash-node");
var argsToArray = require("./utils/argsToArray");

function Connection(config) {
  this._nrp = new NRP(config);
}

Connection.prototype.on = function () {
  var args = argsToArray(arguments);
  var callback = args.pop();
  this._nrp.on(keyToString(args), function (payload, channel) {
    callback(fromWire(payload), stringToKey(channel));
  });
};

Connection.prototype.off = function () {
  var args = argsToArray(arguments);
  var callback;
  if (typeof args[args.length - 1] === "function") {
    callback = args.pop();
  }
  this._nrp.off(keyToString(args), callback);
};

Connection.prototype.emit = function () {
  var args = argsToArray(arguments);
  var data = args.pop();
  this._nrp.emit(keyToString(args), toWire(data));
};

Connection.prototype.quit = function () {
  this._nrp.quit();
};

module.exports = Connection;


function toWire(data) {
  return JSONB.stringify({
    data: data
  });
}

function fromWire(payload) {
  return JSONB.parse(payload).data;
}

function keyToString() {
  var args = _.flatten(argsToArray(arguments));
  return args.join(":");
}

function stringToKey(string) {
  return string.split(":");
}