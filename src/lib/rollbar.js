const Rollbar = require("rollbar");

module.exports = new Rollbar({
  accessToken: '8bc78e38489c483a84347df43e9d0683',
  captureUncaught: true,
  captureUnhandledRejections: true,
})