"use strict";

const controller = require("./controller");

module.exports = function(app) {
   app.route("/getDeviceList")
       .get(controller.updateDeviceStatus);
};