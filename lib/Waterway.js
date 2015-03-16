var _ = require("lodash-node");
var NRP = require("node-redis-pubsub");
var WaterwayStream = require("./WaterwayStream");
var WaterwayEvent = require("./WaterwayEvent");
var WaterwayRequest = require("./WaterwayRequest");
var argsToArray = require("./utils/argsToArray");

function Waterway(config) {
  this.config = _.extend(Waterway.DEFAULTS, config);
  this.connection = new NRP(this.config.redis);
}

Waterway.prototype.stream = function () {
  return new WaterwayStream(this.connection, argsToArray(arguments));
};

Waterway.prototype.event = function () {
  return new WaterwayEvent(this.connection, argsToArray(arguments));
};

Waterway.prototype.request = function () {
  return new WaterwayRequest(this.connection, argsToArray(arguments));
};

Waterway.DEFAULTS = {
  redis: {
    port: 6379,
    host: "127.0.0.1"
  }
};

module.exports = Waterway;