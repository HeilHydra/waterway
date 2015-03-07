var WaterwayClient = require("./client/WaterwayClient");
var WaterwayServer = require("./server/WaterwayServer");

module.exports = {
  client: function (config) {
    return new WaterwayClient(config);
  },
  server: function (config) {
    return new WaterwayServer(config);
  }
};