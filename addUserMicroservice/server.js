const express= require("express");
const redis = require("redis");
const axios= require("axios");
const {promisify}= require("util")
const app = express();
const port = 3014;
const subscriber1 = redis.createClient();
const subscriber2 = redis.createClient();
const bodyParser = require("body-parser");
const controller = require("./api/controller");
subscriber1.subscribe("add_user");

subscriber1.on("message", (channel, message) => {
console.log("Received data :" + message)
let incomingMessage=JSON.parse(message);
                
let inAction=incomingMessage.action;

switch(inAction)
 {


case "APP_INIT" :

/*********************************************ASSIGNING  NODE NUMBER***********************************************/
try
{
controller.addUser(incomingMessage);
} catch(e)
{
	console.log(e);
}
break;
case "APP_RESTART" :

/*********************************************ASSIGNING  NODE NUMBER***********************************************/
try
{
controller.appRestart(incomingMessage);
} catch(e)
{
	console.log(e);
}
break;
default :
 break;
}
  })


app.use(bodyParser.json());
require("dotenv/config");
const routes = require("./api/routes");
routes(app);
app.listen(port, function() {
   console.log("Server started on port: " + port);
});
