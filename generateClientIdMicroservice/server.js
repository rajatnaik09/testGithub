const express= require("express");
const redis = require("redis");
const axios= require("axios");
const {promisify}= require("util");
const app = express();
const port = 3001;
const mongoose=require("mongoose");
const subscriber1 = redis.createClient();
const subscriber2 = redis.createClient();
const bodyParser = require("body-parser");
const controller = require("./api/controller");
subscriber1.subscribe("add_device2");
subscriber1.on("message", (channel, message) => {
    console.log("Received data :" + message);
    controller.generateClientIdForDevice(message);
  })
subscriber2.subscribe("add_user2");
subscriber2.on("message", (channel, message) => {
    console.log("Received data :" + message);
    controller.generateClientIdForUser(message);
  })
app.use(bodyParser.json());
require("dotenv/config");
const routes = require("./api/routes");
routes(app);
app.listen(port, function() {
   console.log("Server started on port: " + port);
});
