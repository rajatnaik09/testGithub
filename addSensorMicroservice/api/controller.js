"use strict";

var properties = require("../package.json")
var distance = require("../service/distance");
const WifiReg_DeviceList = require("../models/DeviceList.model");
var Request = require("request"); //Request is a simplified HTTP client, used to call Rest API's
const axios = require("axios");
const redis = require("redis");
const config = require("./config");
const mailObj = require("./mail");
const {
    promisify
} = require("util");
const publisher = redis.createClient();
const subscriber = redis.createClient();
subscriber.subscribe("add_device3")
const client = redis.createClient({
    host: "127.0.0.1",
    port: 6379,
});
const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.set).bind(client);

var controllers = {



    /*******************************************************************************************************************
     * @function    {*} addSensor()
     * @param       {*} inComingMessage  
     * @description {*} Function called to add sensor to database
     ***********************************************************************************************************/

    addSensor: function(inComingMessage) {
        try {

            Request.post({ // This API called to Update Device ON Status
                "headers": {
                    "content-type": "application/json"
                },
                "url": "http://iotserver.ortusolis.in:3500/sensor",
                "body": JSON.stringify({
                    "deviceId": inComingMessage.deviceId,
                    "sensorId": inComingMessage.sensorId
                })
            }, (error, response, body) => {
                try {
                    if (error) {
                        mailObj.sendMail("Device Id" + " " + inComingMessage.deviceId + " " + "Actuator Id" + " " + inComingMessage.actuatorId + " " + "Error Occured While Updating Actuator Status" + error);
                        return;
                    }
                    if ((response.statusCode === config.successCode)) { //if Actuator Status Updated Successfuly
                        var jsonMessage = {
                            "action": "ADD_SENSOR",
                            "deviceId": inComingMessage.deviceId,
                            "sensorId": inComingMessage.sensorId,
                            "connectionId": inComingMessage.connectionId
                        };

                        publisher.publish("device_wsServer", JSON.stringify(jsonMessage));
                        // callBack(null,inConnId,response.statusCode); 
                        return;
                    } else if ((response.statusCode === config.successCode) && (JSON.parse(body).nModified === 0)) {
                        // callBack(null,inConnId,config.notFoundErrorCode); 
                        return;
                    } else {
                        //callBack(null,inConnId,response.statusCode); 
                        return;
                    }
                } catch (err) {
                    console.log("Reference/Syntax Error" + " " + err);
                    mailObj.sendMail("Device Id" + " " + inComingMessage.deviceId + " " + "Actuator Id" + " " + inComingMessage.actuatorId + " " + "Critical Error Occured While Updating Actuator Status" + err);
                    return;
                }
            });

        } catch (err) {
            console.log("Reference/Syntax Error" + " " + err);
            mailObj.sendMail("Device Id" + " " + inComingMessage.deviceId + " " + "Actuator Id" + " " + inComingMessage.actuatorId + " " + "Critical Error Occured while Updating Actuator status" + err.name);
            return;
        }
    },

    /*******************************************************************************************************************
     * @function    {*} deleteSensor()
     * @param       {*} inComingMessage 
     * @description {*} Function called to delete sensor node from database
     ***********************************************************************************************************/

    deleteSensor: function(inComingMessage) {
        try {

            Request.post({ // This API called to Update Device ON Status
                "headers": {
                    "content-type": "application/json"
                },
                "url": "http://iotserver.ortusolis.in:3500/sensor/delete",
                "body": JSON.stringify({
                    "deviceId": inComingMessage.deviceId,
                    "sensorId": inComingMessage.sensorId
                })
            }, (error, response, body) => {
                try {
                    if (error) {
                        mailObj.sendMail("Device Id" + " " + inComingMessage.deviceId + " " + "Actuator Id" + " " + inComingMessage.actuatorId + " " + "Error Occured While Updating Actuator Status" + error);
                        return;
                    }
                    if ((response.statusCode === config.successCode)) { //if Actuator Status Updated Successfuly
                        var jsonMessage = {
                            "action": "ADD_SENSOR",
                            "deviceId": inComingMessage.deviceId,
                            "sensorId": inComingMessage.sensorId
                        };

                        publisher.publish("device_wsServer", JSON.stringify(jsonMessage));
                        // callBack(null,inConnId,response.statusCode); 
                        return;
                    } else if ((response.statusCode === config.successCode) && (JSON.parse(body).nModified === 0)) {

                        console.log(config.notFoundErrorCode);
                        return;
                    } else {
                        //callBack(null,inConnId,response.statusCode); 
                        console.log(response.statusCode);
                        return;
                    }
                } catch (err) {
                    console.log("Reference/Syntax Error" + " " + err);
                    mailObj.sendMail("Device Id" + " " + inComingMessage.deviceId + " " + "Actuator Id" + " " + inComingMessage.actuatorId + " " + "Critical Error Occured While Updating Actuator Status" + err);
                    return;
                }
            });

        } catch (err) {
            console.log("Reference/Syntax Error" + " " + err);
            mailObj.sendMail("Device Id" + " " + inComingMessage.deviceId + " " + "Actuator Id" + " " + inComingMessage.actuatorId + " " + "Critical Error Occured while Updating Actuator status" + err.name);
            return;
        }
    }
};

module.exports = controllers;