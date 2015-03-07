class WaterwayChannel {

  constructor(connection, pattern) {
    this.connection = connection;
    this.pattern = pattern;
  }

  getConnection() {
    return this.connection;
  }

}

module.exports = WaterwayChannel;