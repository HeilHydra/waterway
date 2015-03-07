var ioClient = require("socket.io-client");
var _ = require("lodash-node");

var SUBSCRIBE = "subscribe";

class ServerConnection {

  constructor(config) {
    this.config = _.extend(ServerConnection.DEFAULTS, config);
    this._subscriptions = [];
    this.socket = ioClient(this.config);
    this.socket.on("reconnect", this._resendSubscriptions.bind(this));
    this.socket.on("event", this._handleEvent.bind(this));
  }

  send() {
    this.socket.send.apply(this.socket, arguments);
  }

  subscribe(type, pattern) {
    this._subscriptions.push(arguments);
    this.socket.send(SUBSCRIBE, type, pattern);
  }

  _resendSubscriptions() {
    _.each(this._subscriptions, (subscription) => {
      var [type, pattern] = subscription;
      this.socket.send(SUBSCRIBE, type, pattern);
    });
  }

  _handleEvent(type, pattern, ...args) {
    // do pattern matching on subscriptions
  }

}

ServerConnection.DEFAULTS = {

};

module.exports = ServerConnection;