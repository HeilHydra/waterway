var expect = require("chai").expect;
var sinon = require("sinon");
var Waterway = require("../lib/Waterway");
var WaterwayStream = require("../lib/WaterwayStream");
var WaterwayEvent = require("../lib/WaterwayEvent");
var WaterwayRequest = require("../lib/WaterwayRequest");

describe("Waterway", function () {

  var waterway;
  beforeEach(function () {
    waterway = new Waterway();
  });
  afterEach(function () {
    waterway.quit();
  });

  describe("#stream()", function () {
    var stream;
    beforeEach(function () {
      stream = waterway.stream("test", "yolo");
    });

    it("should return an instance of WaterwayStream", function () {
      expect(stream).to.be.an.instanceof(WaterwayStream);
    });

    it("should pass through the connection", function () {
      expect(stream._connection).to.equal(waterway._connection);
    });

    it("should pass through the key", function () {
      expect(stream._key).to.deep.equal(["test", "yolo"]);
    });
  });

  describe("#event()", function () {
    var event;
    beforeEach(function () {
      event = waterway.event("test", "yolo");
    });

    it("should return an instance of WaterwayStream", function () {
      expect(event).to.be.an.instanceof(WaterwayEvent);
    });

    it("should pass through the connection", function () {
      expect(event._connection).to.equal(waterway._connection);
    });

    it("should pass through the key", function () {
      expect(event._key).to.deep.equal(["test", "yolo"]);
    });
  });

  describe("#request()", function () {
    var request;
    beforeEach(function () {
      request = waterway.request("test", "yolo");
    });

    it("should return an instance of WaterwayStream", function () {
      expect(request).to.be.an.instanceof(WaterwayRequest);
    });

    it("should pass through the connection", function () {
      expect(request._connection).to.equal(waterway._connection);
    });

    it("should pass through the key", function () {
      expect(request._key).to.deep.equal(["test", "yolo"]);
    });
  });

  describe("#quit()", function () {
    beforeEach(function () {
      sinon.stub(waterway._connection, "quit");
    });
    afterEach(function () {
      waterway._connection.quit.restore();
    });

    it("should invoke quit on the WaterwayConnection", function () {
      waterway.quit();
      expect(waterway._connection.quit).to.have.been.calledOnce;
    });
  });


});