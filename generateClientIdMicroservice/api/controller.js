"use strict";

var properties = require("../package.json")
const axios = require("axios");
const redis = require("redis");
const {
    promisify
} = require("util");
const publisher = redis.createClient();
const config = require("./config");
const mailObj = require("./mail");
const uuidv1 = require("uuid"); //Universally Unique Identifier , used to generate unique id's
var Request = require("request"); //Request is a simplified HTTP client, used to call Rest API's
const client = redis.createClient({
    host: "127.0.0.1",
    port: 6379,
});
const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.set).bind(client);

var controllers = {

/***************************************************************************************************************
* @function    {*} generateClientIdForDevice()
* @param       {*} Message  
* @description {*} Function called to generate clientId for device
******************************************************************************************************************/
    generateClientIdForDevice: function(Message) {
        try {
            var clientId = null;
            var inComingMessage = JSON.parse(Message);
            //clientId=uuidv1(); //Inbuilt Function called to generate unique client Id's
            clientId = uuidv1.v4(); //Inbuilt Function called to generate unique client Id's
            if ((clientId === null) || (clientId === "")) { // checking clientId value is null or empty, if it is null or empty , calling agin main function
                module.exports.generateClientId(inConnId, inComingMessage, function(err, outConnectionId, outGoingMessage) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    return;
                })
            }

            Request.get({ // This API called For checking newly generated clientId is already exists or not in a collection.[clientId is unique in colection]
                "headers": {
                    "content-type": "application/json"
                },
                "url": "http://iotserver.ortusolis.in:3500/clientId",
                "body": JSON.stringify({
                    "clientId": clientId
                })
            }, (error, response, body) => {
                try {
                    if (error) {
                        mailObj.sendMail("Device Id" + " " + inComingMessage.deviceId + "Error Occured While Generating Client Id For Device" + " " + error);
                        return;
                    }
                    if ((response.statusCode === config.successCode) && (JSON.parse(body).length === 0)) { // If clientId is not Exists in collection
                        Request.post({ // This API is called to insert newly generated client Id in a Collection
                            "headers": {
                                "content-type": "application/json"
                            },
                            "url": "http://iotserver.ortusolis.in:3500/clientId",
                            "body": JSON.stringify({
                                "clientId": clientId
                            })
                        }, (error, response, body) => {
                            try {
                                if (error) {
                                    mailObj.sendMail("Device Id" + " " + inComingMessage.deviceId + "Error Occured While Inserting newly generated Client Id in Collection" + " " + " " + error);
                                    return;
                                }
                                if (response.statusCode === config.successCode) {
                                    //  callBack(null,inConnId,clientId) // If client Id inserted successfully , then callBack clientId with connection Id
                                    var jsonMessage = {
                                        "deviceId": inComingMessage.deviceId,
                                        "clientId": clientId
                                    };
                                    publisher.publish("add_device3", JSON.stringify(jsonMessage));
                                    return;
                                } else {
                                    mailObj.sendMail("DB Error Ocured while inserting client Id in collection");
                                    return;
                                }
                            } catch (err) {
                                console.log("Reference/Syntax Error" + " " + err);
                                mailObj.sendMail("Device Id" + " " + inComingMessage.deviceId + "Error Occured While Inserting newly generated Client Id in Collection" + " " + err.name);
                                return;
                            }
                        });

                    } else { // If client Id already exists in collection, then call again main function to generate new client id and same process will repeat

                        module.exports.generateClientIdForDevice(inConnId, inComingMessage, function(err, outConnectionId, outGoingMessage) {
                            if (err) {
                                mailObj.sendMail("Critical ErrError Occured While calling a function for generating new client id" + err);
                                return;
                            }

                            return;
                        })
                    }

                } catch (err) {
                    console.log("Reference/Syntax Error" + " " + err);
                    mailObj.sendMail("Device Id" + " " + inComingMessage.deviceId + " Critical Error Occured While checking new generated client id is exists or not in a Collection" + " " + err.name);
                    return;
                }
            });
        } catch (err) {
            console.log("Reference/Syntax Error" + " " + err);
            mailObj.sendMail("Device Id" + " " + inComingMessage.deviceId + "Critical Error Occured While Generating Client Id For Device" + err.name);
            return;
        }
    },


/***************************************************************************************************************
* @function    {*}  generateClientIdForUser()
* @param       {*} Message  
* @description {*} Function called to generate clientId for user
******************************************************************************************************************/
    generateClientIdForUser: function(Message) {
        try {
            var clientId = null;
            var inComingMessage = JSON.parse(Message);
            //clientId=uuidv1(); //Inbuilt Function called to generate unique client Id's
            clientId = uuidv1.v4(); //Inbuilt Function called to generate unique client Id's
            if ((clientId === null) || (clientId === "")) { // checking clientId value is null or empty, if it is null or empty , calling agin main function
                module.exports.generateClientId(inConnId, inComingMessage, function(err, outConnectionId, outGoingMessage) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    return;
                })
            }

            Request.get({ // This API called For checking newly generated clientId is already exists or not in a collection.[clientId is unique in colection]
                "headers": {
                    "content-type": "application/json"
                },
                "url": "http://iotserver.ortusolis.in:3500/clientId",
                "body": JSON.stringify({
                    "clientId": clientId
                })
            }, (error, response, body) => {
                try {
                    if (error) {
                        mailObj.sendMail("Device Id" + " " + inComingMessage.deviceId + "Error Occured While Generating Client Id For Device" + " " + error);
                        return;
                    }
                    if ((response.statusCode === config.successCode) && (JSON.parse(body).length === 0)) { // If clientId is not Exists in collection
                        Request.post({ // This API is called to insert newly generated client Id in a Collection
                            "headers": {
                                "content-type": "application/json"
                            },
                            "url": "http://iotserver.ortusolis.in:3500/clientId",
                            "body": JSON.stringify({
                                "clientId": clientId
                            })
                        }, (error, response, body) => {
                            try {
                                if (error) {
                                    mailObj.sendMail("Device Id" + " " + inComingMessage.deviceId + "Error Occured While Inserting newly generated Client Id in Collection" + " " + " " + error);
                                    return;
                                }
                                if (response.statusCode === config.successCode) {
                                    //  callBack(null,inConnId,clientId) // If client Id inserted successfully , then callBack clientId with connection Id
                                    var jsonMessage = {
                                        "userId": inComingMessage.userId,
                                        "clientId": clientId
                                    };
                                    publisher.publish("add_user3", JSON.stringify(jsonMessage));
                                    return;
                                } else {
                                    mailObj.sendMail("DB Error Ocured while inserting client Id in collection");
                                    return;
                                }
                            } catch (err) {
                                console.log("Reference/Syntax Error" + " " + err);
                                mailObj.sendMail("Device Id" + " " + inComingMessage.deviceId + "Error Occured While Inserting newly generated Client Id in Collection" + " " + err.name);
                                return;
                            }
                        });

                    } else { // If client Id already exists in collection, then call again main function to generate new client id and same process will repeat

                        module.exports.generateClientIdForDevice(inConnId, inComingMessage, function(err, outConnectionId, outGoingMessage) {
                            if (err) {
                                mailObj.sendMail("Critical ErrError Occured While calling a function for generating new client id" + err);
                                return;
                            }

                            return;
                        });
                    }

                } catch (err) {
                    console.log("Reference/Syntax Error" + " " + err);
                    mailObj.sendMail("Device Id" + " " + inComingMessage.deviceId + " Critical Error Occured While checking new generated client id is exists or not in a Collection" + " " + err.name);
                    return;
                }
            });
        } catch (err) {
            console.log("Reference/Syntax Error" + " " + err);
            mailObj.sendMail("Device Id" + " " + inComingMessage.deviceId + "Critical Error Occured While Generating Client Id For Device" + err.name);
            return;
        }
    }
};

module.exports = controllers;