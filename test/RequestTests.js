var expect = require("chai").expect;
var sinon = require("sinon");
var when = require("when");
var _ = require("lodash-node");
var guid = require("guid");
var Request = require("../lib/Request");

describe("Request", function () {
  var request, sandbox, connection;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    connection = {
      emit: sandbox.spy(),
      on: sandbox.spy(),
      off: sandbox.spy()
    };
    request = new Request(connection, ["foo", "bar"]);
  });
  afterEach(function () {
    sandbox.reset();
  });

  describe("#send()", function () {
    it("should return a promise", function () {
      expect(when.isPromiseLike(request.send())).to.be.true;
    });

    it("should throw an error if key has wildcards", function () {
      var fn = function () {
        var request = new Request(null, ["test", "*"]);
        request.send();
      };
      expect(fn).to.throw(/Wildcards found in/);
    });

    it("should emit request with correct key", function () {
      request.send();
      expect(connection.emit).to.have.been.calledWith("request",
        sinon.match.string, "send", ["foo", "bar"]);
    });

    it("should emit request with guid", function () {
      request.send();
      expect(guid.isGuid(connection.emit.args[0][1])).to.be.true;
    });

    it("should register callback listener with correct key", function () {
      request.send();
      expect(connection.on).to.have.been.calledWithExactly("request",
        connection.emit.args[0][1], "respond", sinon.match.func);
    });

    it("should resolve with data", function (done) {
      request.send()
        .catch(done)
        .then(function (data) {
          expect(data).to.equal("foo");
          done();
        });
      connection.on.args[0][3]("foo");
    });

    it("should unregister callback listener", function () {
      request.send();
      connection.on.args[0][3]();
      expect(connection.off).to.have.been.calledWithExactly("request", connection.emit.args[0][1], "respond");
    });
  });

  describe("#respond()", function () {
    it("should register callback listener with correct key", function () {
      request.respond();
      expect(connection.on).to.have.been.calledWithExactly("request", "*", "send", ["foo", "bar"], sinon.match.func);
    });

    it("should invoke callback with data and request key", function (done) {
      request.respond(function (data, key) {
        expect(data).to.equal("test");
        expect(key).to.deep.equal(["baz", "boop"]);
        done();
      });
      connection.on.args[0][4]("test", ["request", "123", "send", "baz", "boop"]);
    });

    it("should emit response with response data and correct key", function (done) {
      request.respond(function () {
        return "baz";
      });
      connection.on.args[0][4](null, ["request", "123"]);
      _.defer(function () {
        expect(connection.emit).to.have.been.calledWithExactly("request", "123", "respond", "baz");
        done();
      });
    });
  });

});