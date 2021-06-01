"use strict";

const controller = require("./controller");

module.exports = function(app) {
   app.route("/getDeviceListForDevice")
       .get(controller.generateClientIdForDevice);
app.route("/getDeviceListForUser")
       .get(controller.generateClientIdForUser);
  
       
};