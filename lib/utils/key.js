var _ = require("lodash-node");
var argsToArray = require("./argsToArray");

function getString() {
  var args = _.flatten(argsToArray(arguments));
  return args.join(":");
}

function ensureNoWildcards(key) {
  var hasWildcards = _.any(key, function (part) {
    return part.indexOf("*") !== -1;
  });
}

module.exports = {
  getString: getString,
  ensureNoWildcards: ensureNoWildcards
};