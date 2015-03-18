var expect = require("chai").expect;
var sinon = require("sinon");
var WaterwayEvent = require("../lib/WaterwayEvent");

describe("WaterwayEvent", function () {

  var event, sandbox, connection;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    connection = {
      emit: sandbox.spy(),
      on: sandbox.spy(),
      off: sandbox.spy()
    };
    event = new WaterwayEvent(connection, ["foo", "bar"]);
  });
  afterEach(function () {
    sandbox.reset();
  });

  describe("#emit()", function () {
    it("should throw an error if key has wildcards", function () {
      var fn = function () {
        var event = new WaterwayEvent(null, ["test", "*"]);
        event.emit();
      };
      expect(fn).to.throw(/Wildcards found in/);
    });

    it("should prepend channel type to key", function () {
      event.emit("test");
      expect(connection.emit).to.have.been.calledWith("event");
    });

    it("should pass through data", function () {
      event.emit("test");
      expect(connection.emit).to.have.been.calledWithExactly("event", ["foo", "bar"], "test");
    });
  });

  describe("#on()", function () {
    it("should prepend channel type to key", function () {
      event.emit("test");
      expect(connection.emit).to.have.been.calledWith("event");
    });

    it("should pass through callback", function () {
      var fn = function () { };
      event.on(fn);
      expect(connection.on).to.have.been.calledWithExactly("event", ["foo", "bar"], fn);
    });
  });

  describe("#off()", function () {
    it("should prepend channel type to key", function () {
      event.off("test");
      expect(connection.off).to.have.been.calledWith("event");
    });

    it("should pass through callback", function () {
      var fn = function () { };
      event.off(fn);
      expect(connection.off).to.have.been.calledWithExactly("event", ["foo", "bar"], fn);
    });
  });


});