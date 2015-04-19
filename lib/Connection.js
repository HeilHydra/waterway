var NRP = require("node-redis-pubsub");
var JSONB = require("json-buffer");
var _ = require("lodash-node");
var argsToArray = require("./utils/argsToArray");

function Connection(config) {
  this._nrp = new NRP(config);
}

Connection.prototype.on = function () {
  var listenKey = argsToArray(arguments);
  var callback = listenKey.pop();
  this._nrp.on(keyToString(listenKey), function (payload, channel) {
    var responseKey = stringToKey(channel);
    var response = {
      data: fromWire(payload),
      params: getKeyParams(listenKey, responseKey),
      key: responseKey
    };
    callback(response);
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
  return _.chain(argsToArray(arguments))
    .flattenDeep()
    .map(function (part) {
      part = String(part);
      if (part.substr(0, 1) === ":") {
        return "*";
      }
      return new Buffer(part).toString("base64");
    })
    .value()
    .join(":");
}

function stringToKey(string) {
  return _.map(string.split(":"), function (part) {
    if (part !== "*") {
      return new Buffer(part, "base64").toString("utf8");
    }
    return part;
  });
}

function getKeyParams(pattern, match) {
  var params = {};
  _.each(_.flattenDeep(pattern), function (part, i) {
    part = String(part);
    if (part.substr(0, 1) === ":") {
      params[part.substr(1)] = match[i];
    }
  });
  return params;
}