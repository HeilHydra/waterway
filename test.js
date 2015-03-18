var Waterway = require("./lib/Waterway");

var waterway1 = new Waterway();
waterway1.request("bar")
  .respond(function (data) {
    console.log("RECEIVED", data);
    return "YOLO" + JSON.stringify(data);
  });

var waterway2 = new Waterway();
waterway2.request("bar")
  .send({ yolo: "swaghetti" })
  .then(function (response) {
    console.log("RESPONSE", response);
  })