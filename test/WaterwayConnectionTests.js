var expect = require("chai").expect;
var sinon = require("sinon");
var NRP = require("node-redis-pubsub");
var WaterwayConnection = require("../lib/WaterwayConnection");

describe("WaterwayConnection", function () {

  var connection;
  beforeEach(function () {
    connection = new WaterwayConnection();
  });
  afterEach(function () {
    connection.quit();
  });

  it("should instantiate a new NRP", function () {
    expect(connection._nrp).to.be.instanceof(NRP);
  });

  describe("#on()", function () {
    var listeningChannel, matchedKey, data;
    beforeEach(function (done) {
      sinon.stub(connection._nrp, "on", function (_listeningChannel, handler) {
        listeningChannel = _listeningChannel;
        handler("{\"data\": 123}", "test:123");
        done();
      });
      connection.on("test", "123", function (_data, _matchedKey) {
        matchedKey = _matchedKey;
        data = _data;
      });
    });
    afterEach(function () {
      connection._nrp.on.restore();
    });

    it("should convert key args to channel string", function () {
      expect(listeningChannel).to.equal("test:123");
    });

    it("should invoke callback with unpacked data", function () {
      expect(data).to.equal(123);
    });

    it("should invoke callback key", function () {
      expect(matchedKey).to.deep.equal(["test", "123"]);
    });
  });

  describe("#off()", function () {
    var channel, callback;
    beforeEach(function () {
      sinon.stub(connection._nrp, "off", function (_channel, _callback) {
        channel = _channel;
        callback = _callback;
      });
    });
    afterEach(function () {
      connection._nrp.off.restore();
    });

    it("should convert key args to channel string", function () {
      connection.off("test", "123");
      expect(channel).to.equal("test:123");
    });

    it("should pass through callback if it is a function", function () {
      var fn = function () { };
      connection.off("test", fn);
      expect(callback).to.equal(fn);
    });

    it("should not pass through callback if it is not a function", function () {
      connection.off("test", "123");
      expect(callback).to.not.exist;
    });
  });

  describe("#emit()", function () {
    var payload = {
      data: { yolo: "swaghetti" }
    };
    var channel, receivedPayload;
    beforeEach(function (done) {
      sinon.stub(connection._nrp, "emit", function (_channel, _payload) {
        channel = _channel;
        receivedPayload = _payload;
        done();
      });
      connection.emit("test", 123, payload.data);
    });
    afterEach(function () {
      connection._nrp.emit.restore();
    });

    it("should convert key args to channel string", function () {
      expect(channel).to.equal("test:123");
    });

    it("should pack data into payload", function () {
      expect(JSON.parse(receivedPayload)).to.deep.equal(payload);
    });
  });

  describe("#quit()", function () {
    beforeEach(function () {
      sinon.stub(connection._nrp, "quit");
    });
    afterEach(function () {
      connection._nrp.quit.restore();
    });

    it("should invoke quit on redis connection", function () {
      connection.quit();
      expect(connection._nrp.quit).to.have.been.calledOnce;
    });
  });

});