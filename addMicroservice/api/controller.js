'use strict';

var properties = require("../package.json");
var distance = require("../service/distance"); 
var Request = require("request"); //Request is a simplified HTTP client, used to call Rest API's
const axios= require("axios");
const redis= require("redis");
const config = require("./config");
const mailObj = require("./mail");
const {promisify}= require("util");
const publisher = redis.createClient();
const subscriber = redis.createClient();
subscriber.subscribe("add_device3");
const client= redis.createClient({
    host:"127.0.0.1",
    port: 6379,
})
const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.set).bind(client);

var controllers = {
   

    updateDeviceStatus: function (inComingMessage) {
        try{

var subscriberMessage;
            Request.post({  // This API called to Update Device ON Status
                "headers": { "content-type": "application/json" },
                "url":  "http://iotserver.ortusolis.in:3500/deviceIdList/updateDevicestatus",
                "body": JSON.stringify({
                    "deviceId":inComingMessage.deviceId,
                    "status" :"ACTIVE"
                    
                })
                },async (error, response, body) => {
                    try{
                        if(error) {
                           // mailObj.sendMail("Device Id"+" "+inComingMessage.deviceId+" "+"Error Occured While Adding sensor states to collection"+error);
                            return;
                        }
                        if((response.statusCode === config.successCode) && (JSON.parse(body).nModified === 1)){ //if Actuator Node Added Successfuly
                         //   callBack(null,inConnId,response.statusCode); 
                            publisher.publish("add_device2", Message);
                            let p1 = new Promise((resolve, reject) => {
                                subscriber.on("message", (channel, message) => {
                                  console.log("Received data :" + message)
				subscriberMessage = JSON.parse(message);
				
                                resolve(1);
                                  
                                })
                                  });
                                
                                var sagaComplete = await Promise.all([p1]);
console.log(subscriberMessage.clientId);
				var jsonMessage={
				"deviceId":subscriberMessage.deviceId,
				"clientId":subscriberMessage.clientId,
				"connectionId":inComingMessage.connectionId,
				"userClientId": inComingMessage.userClientId
				
				}
console.log(jsonMessage);
                                controllers.insertDeviceDetailsInCollection(jsonMessage);
                                 //res.send('we are on home');
                                //  res.send("subscriber two");
                            return;
                        }else if((response.statusCode === config.successCode) && (JSON.parse(body).nModified === 0)){
                         //   callBack(null,inConnId,config.notFoundErrorCode); 
                            return;
                        }else{
                           // callBack(null,inConnId,response.statusCode); 
                            return;
                        }
                    }catch(err){
                        console.log("Reference/Syntax Error"+" "+err);
                        //mailObj.sendMail("Device Id"+" "+inComingMessage.deviceId+" "+"Critical Error Occured While Adding Sensor States to collection"+err);
                        return;
                    }
                });
        }catch(err){
       //     return res.status(500).send("There is a problem in Creating DeviceId Collection"+" "+err);
	console.log(err);
        }
    },

    insertDeviceDetailsInCollection: function (inComingMessage) {
        try{
console.log(inComingMessage);
            Request.post({  // This API called to Update Device ON Status
                "headers": { "content-type": "application/json" },
                "url":  "http://iotserver.ortusolis.in:3500"+"/activeDevice",
                "body": JSON.stringify({
                    "deviceId":inComingMessage.deviceId,
                    "clientId" :inComingMessage.clientId,
		    "connId": inComingMessage.connectionId
                    })
                }, (error, response, body) => {
                    try{
                        if(error) {
                       //     mailObj.sendMail("Device Id"+" "+inComingMessage.deviceId+" "+"Error Occured While Adding sensor states to collection"+error);

                            return;
                        }
			console.log(response.statusCode);
			console.log(config.successCode);
                        if((response.statusCode === config.successCode)){ //if Actuator Node Added Successfuly
                         //   callBack(null,inConnId,response.statusCode); 
			console.log("adddddddddd");
                            let jsonMessage={
                                "action":"ADD_DEVICE",
                                "deviceId":inComingMessage.deviceId,
                                "connectionId":inComingMessage.connectionId,
				"clientId":inComingMessage.clientId,
				"userClientId": inComingMessage.userClientId
                            }
                            publisher.publish("device_wsServer", JSON.stringify(jsonMessage));
                            return;
                        }else{
                           // callBack(null,inConnId,response.statusCode); 

                            return;
                        }
                    }catch(err){
                        console.log("Reference/Syntax Error"+" "+err);
                     //   mailObj.sendMail("Device Id"+" "+inComingMessage.deviceId+" "+"Critical Error Occured While Adding Sensor States to collection"+err);
                       // return;
                    }
                });
        }catch(err){
          //  return res.status(500).send("There is a problem in Creating DeviceId Collection"+" "+err);
         console.log(err);
        }
    },


/************************************************************************************************************
 * @function    {*} restartDevice()
 * @param       {*} inConnId 
 * @param       {*} inComingMessage 
 * @param       {*} callBack 
 * @description {*} Function called to restart device
 ***************************************************************************************************************/
    restartDevice:function(inComingMessage){
        try{
            
            Request.post({  // This API called to Update Device conn Id
                "headers": { "content-type": "application/json" },
                "url":  "http://iotserver.ortusolis.in:3500/activeDevice/updateConnId",
                "body": JSON.stringify({
                    "deviceId":inComingMessage.deviceId,
                    "clientId":inComingMessage.clientId,
                    "connId":inComingMessage.connectionId
                })
            }, async (error, response, body) => {
                try{
                    if(error) {
                        mailObj.sendMail("Error Occured While updating Device's Conection Id based on Device Id"+error);
                        return;
                    }
                    if((response.statusCode === config.successCode) && (JSON.parse(body).nModified === 1)){   //if device connection id updated successfully
                         let jsonMessage={
                                "action":"DEVICE_RESTART",
                                "deviceId":inComingMessage.deviceId,
                                "connectionId":inComingMessage.connectionId
				 }
				 publisher.publish("device_wsServer", JSON.stringify(jsonMessage));
                    }else if((response.statusCode === config.successCode) && (JSON.parse(body).nModified === 0)){  //  get device's client id and send back to device as response
			const searchTerm = inComingMessage.deviceId;
    console.log(searchTerm);
    const reply = await GET_ASYNC(searchTerm);
    if(reply) {
        console.log('using cached data');
		var jsonMessage={
                 "action":"DEVICE_RESTART",
                 "deviceId":inComingMessage.deviceId,
                 "connectionId":inComingMessage.connectionId,
			   	"clientId":JSON.parse(reply)
                            }
		  publisher.publish("device_wsServer", JSON.stringify(jsonMessage));
       // res.send(JSON.parse(reply));
        return;
    }
                        Request.get({  // This API called to Get Device's Client Id
                            "headers": { "content-type": "application/json" },
                            "url":  "http://iotserver.ortusolis.in:3500/activeDevices/getClientId",
                            "body": JSON.stringify({
                                "deviceId":inComingMessage.deviceId
                            })
                        },async (error, response, body) => {
                            try{
                                if(error) {
                                    mailObj.sendMail("Device Id"+" "+inComingMessage.deviceId+" "+"Error Occured While Geting Client Id for Device"+error);
                                    return;
                                }
                                if((response.statusCode === config.successCode) && (body.length === 0)){
                                    mailObj.sendMail("Invalid Device Id For getting Client Id"+" "+inComingMessage.deviceId);
                                    return;
                                }else if(response.statusCode === config.successCode){
                                    
									let jsonMessage={
                 "action":"DEVICE_RESTART",
                 "deviceId":inComingMessage.deviceId,
                 "connectionId":inComingMessage.connectionId,
	         "clientId":JSON.parse(body).clientId
                            }
		  publisher.publish("device_wsServer", JSON.stringify(jsonMessage));
									 const saveResult= await SET_ASYNC(searchTerm,JSON.stringify(JSON.parse(body).clientId),'EX',5);
						console.log('new data cached',saveResult)
                                    //callBack(null,inConnId,jsonMessage) 
                                    return;
                                }else{
                                    mailObj.sendMail("DB Eror ocured while getting device's Client Id"+" "+inComingMessage.deviceId);
                                    return;
                                }
                            }catch(err){
                                console.log("Reference/Syntax Error"+" "+err);
                                mailObj.sendMail("Device Id"+" "+inComingMessage.deviceId+" "+"Critical Error Occured While Geting Client Id for Device"+err.name);
                                return;
                            }
                        });
                    }else{
                        mailObj.sendMail("DB Error Occured While updating Device's Conection Id based on Device Id");
                        return;
                    }
                }catch(err){
                    console.log("Reference/Syntax Error"+" "+err);
                    mailObj.sendMail("Critical Error Occured While updating Device's Conection Id based on Device Id"+err);
                    return;
                }
            });
        }catch(err){
            console.log("Reference/Syntax Error"+" "+err);
            mailObj.sendMail("Device Id"+" "+inComingMessage.deviceId+"Critical Error Occured while Device Restart"+err.name);
            return;
        }
    }


    
    

};

module.exports = controllers;