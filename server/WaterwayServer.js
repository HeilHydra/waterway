var IOServer = require("socket.io");
var _ = require("lodash-node");

class WaterwayServer {

  constructor(config) {
    this.config = _.extend(WaterwayServer.DEFAULTS, config);
    this.io = new IOServer(this.config);
  }

}

WaterwayServer.DEFAULTS = {

};

module.exports = WaterwayServer;