var _ = require("lodash-node");
var WaterwayConnection = require("./WaterwayConnection");
var WaterwayStream = require("./WaterwayStream");
var WaterwayEvent = require("./WaterwayEvent");
var WaterwayRequest = require("./WaterwayRequest");
var argsToArray = require("./utils/argsToArray");

function Waterway(config) {
  this._config = _.extend(Waterway.DEFAULTS, config);
  this._connection = new WaterwayConnection(this._config.redis);
}

Waterway.prototype.stream = function () {
  return new WaterwayStream(this._connection, argsToArray(arguments));
};

Waterway.prototype.event = function () {
  return new WaterwayEvent(this._connection, argsToArray(arguments));
};

Waterway.prototype.request = function () {
  return new WaterwayRequest(this._connection, argsToArray(arguments));
};

Waterway.DEFAULTS = {
  redis: {
    port: 6379,
    host: "127.0.0.1"
  }
};

module.exports = Waterway;