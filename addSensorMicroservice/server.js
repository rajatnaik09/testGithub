const express= require("express");
const redis = require("redis");
const axios= require("axios");
const {promisify}= require("util")
const app = express();
const port = 3021;
const mongoose=require("mongoose");
const subscriber1 = redis.createClient();
const subscriber2 = redis.createClient();
const bodyParser = require('body-parser');
const controller = require("./api/controller");
subscriber1.subscribe("add_sensor");

subscriber1.on("message", (channel, message) => {
    console.log("Received data :" + message)
let incoming_message=JSON.parse(message);
controller.addSensor(incoming_message);
    })


app.use(bodyParser.json());
require("dotenv/config");
const routes = require("./api/routes");
routes(app);
app.listen(port, function() {
   console.log("Server started on port: " + port);
});
