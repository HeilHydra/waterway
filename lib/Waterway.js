var _ = require("lodash-node");
var Connection = require("./Connection");
var Stream = require("./Stream");
var Event = require("./Event");
var Request = require("./Request");
var argsToArray = require("./utils/argsToArray");

function Waterway(config) {
  this._config = _.extend(Waterway.DEFAULTS, config);
  this._connection = new Connection(this._config.redis);
}

Waterway.prototype.stream = function () {
  return new Stream(this._connection, argsToArray(arguments));
};

Waterway.prototype.event = function () {
  return new Event(this._connection, argsToArray(arguments));
};

Waterway.prototype.request = function () {
  return new Request(this._connection, argsToArray(arguments));
};

Waterway.prototype.quit = function () {
  this._connection.quit();
};

Waterway.DEFAULTS = {
  redis: {
    port: 6379,
    host: "127.0.0.1"
  }
};

module.exports = Waterway;