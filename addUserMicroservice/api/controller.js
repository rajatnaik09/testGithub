'use strict';

var properties = require("../package.json")
var distance = require("../service/distance");
var Request = require("request"); //Request is a simplified HTTP client, used to call Rest API's
const axios = require("axios");
const redis = require("redis");
const config = require("./config");
const {
    promisify
} = require("util");
const publisher = redis.createClient();
const subscriber = redis.createClient();
subscriber.subscribe("add_user3");
const client = redis.createClient({
    host: "127.0.0.1",
    port: 6379,
})
const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.set).bind(client);

var controllers = {
/***************************************************************************************************************
* @function    {*} addUser()
* @param       {*} inComingMessage 
* @description {*} Function called to add user to database
******************************************************************************************************************/

    addUser: async (inComingMessage) => {
        try {
            var subscriberMessage;
	    publisher.publish("add_user2", Message);
            let p1 = new Promise((resolve, reject) => {
                subscriber.on("message", (channel, message) => {
                    console.log("Received data :" + message)
                    subscriberMessage = JSON.parse(message);
		    resolve(1);
		});
            });

            var sagaComplete = await Promise.all([p1]);
            console.log(subscriberMessage.clientId);
            var jsonMessage = {
                "userId": inComingMessage.userId,
                "clientId": subscriberMessage.clientId,
                "connectionId": inComingMessage.connectionId

            }
            console.log(jsonMessage);
            controllers.insertUserDetailsInCollection(jsonMessage);
            //res.send('we are on home');
            //  res.send("subscriber two");

        } catch (err) {
            console.log("Reference/Syntax Error" + " " + err);
            //mailObj.sendMail("Device Id"+" "+inComingMessage.deviceId+" "+"Critical Error Occured While Adding Sensor States to collection"+err);
            return;
        }

    },
/***************************************************************************************************************
* @function    {*} insertUserDetailsInCollection()
* @param       {*} inComingMessage 
* @description {*} Function called to insert User Details with newly generated client Id
******************************************************************************************************************/
    insertUserDetailsInCollection: function(inComingMessage) {
        try {
            Request.get({ // This API called ti Check given User Id is already exists or not in collection , UserId is unique in collection
                "headers": {
                    "content-type": "application/json"
                },
                "url": "http://iotserver.ortusolis.in:3500/user",
                "body": JSON.stringify({
                    "userId": inComingMessage.userId
                })
            }, (error, response, body) => {
                try {
                    if (error) {
                        console.log("DB Error" + " " + error);
                        //callBack(null,inConnId,config.dbErrorCode);
                        return;
                    }
                    if ((response.statusCode === config.successCode) && (JSON.parse(body).length === 0)) { // If given User Id is not exists in collection

                        Request.post({ // This API called to insert user details in collection
                            "headers": {
                                "content-type": "application/json"
                            },
                            "url": "http://iotserver.ortusolis.in:3500/user",
                            "body": JSON.stringify({
                                "userId": inComingMessage.userId,
                                "clientId": inComingMessage.clientId,
                                "connId": inComingMessage.connectionId,
                                "status": "InActive"
                            })
                        }, (error, response, body) => {
                            try {
                                if (error) {
                                    console.log("DB Error" + " " + error);
                                    //    callBack(null,inConnId,config.dbErrorCode);
                                    return;
                                }
                                let jsonMessage = {
                                    "action": "ADD_USER",
                                    "userId": inComingMessage.userId,
                                    "connectionId": inComingMessage.connectionId,
                                    "clientId": inComingMessage.clientId
                                }
                                publisher.publish("user_wsServer", JSON.stringify(jsonMessage));
                                //  callBack(null,inConnId,response.statusCode );  // If inserted Successfully , callBack with true and conection id
                                return;

                            } catch (err) {
                                console.log("Syntax/reference Error" + " " + err);
                                //callBack(null,inConnId,config.generalErrorCode);
                                return;
                            }
                        });
                    } else if (response.statusCode === config.successCode) { // If given User Id already exists in collection

                        Request.post({ // This API called to insert client Id for a already Exists UserId in collection
                            "headers": {
                                "content-type": "application/json"
                            },
                            "url": "http://iotserver.ortusolis.in:3500/user/clientId",
                            "body": JSON.stringify({
                                "userId": inComingMessage.userId,
                                "clientId": inComingMessage.clientId,
                                "connId": inComingMessage.connectionId,
                            })
                        }, (error, response, body) => {
                            try {
                                if (error) {
                                    console.log("DB Error" + " " + error);
                                    //  callBack(null,inConnId,config.dbErrorCode);
                                    return;
                                }
                                let jsonMessage = {
                                    "action": "ADD_USER",
                                    "userId": inComingMessage.deviceId,
                                    "connectionId": inComingMessage.connectionId,
                                    "clientId": inComingMessage.clientId
                                };
                                publisher.publish("user_wsServer", JSON.stringify(jsonMessage));
                                //callBack(null,inConnId,response.statusCode ); // If inserted Successfully , callBack with true and conection id
                                return;
                            } catch (err) {
                                console.log("Syntax/reference Error" + " " + err);
                                //callBack(null,inConnId,config.generalErrorCode);
                                return;
                            }
                        });
                    } else {
                        // callBack(null,inConnId,response.statusCode);
                        return;
                    }

                } catch (err) {
                    console.log("Syntax/reference Error" + " " + err);
                    //callBack(null,inConnId,config.generalErrorCode);
                    return;
                }
            });
        } catch (err) {
            console.log("Syntax/reference Error" + " " + err);
            //callBack(null,inConnId,config.generalErrorCode);
            return;
        }
    },



/***************************************************************************************************************
* @function    {*} appRestart()
* @param       {*} inComingMessage  
* @description {*} Function called to update user Connection Id based on Client Id when app restarts
******************************************************************************************************************/
    appRestart: function(inComingMessage) {
        try {
            Request.post({ // This API called to insert client Id for a already Exists UserId in collection
                "headers": {
                    "content-type": "application/json"
                },
                "url": "http://iotserver.ortusolis.in:3500/user/updateConnIdByUserId",
                "body": JSON.stringify({
                    "clientId": inComingMessage.clientId,
                    "userId": inComingMessage.userId,
                    "connId": inComingMessage.connectionId
                })
            }, (error, response, body) => {
                try {
                    if (error) {
                        console.log("DB Error" + " " + error);
                        //callBack(null,inConnId,config.dbErrorCode);
                        return;
                    }
                    console.log("update" + response.statusCode);
                    console.log(JSON.parse(body).nModified);
                    if ((response.statusCode === config.successCode) && (JSON.parse(body).nModified === 0)) {
                        console.log('not updated');
                        //callBack(null,inConnId,config.notFoundErrorCode); // If failed , callBack with true and conection id
                        return;
                    } else if ((response.statusCode === config.successCode) && (JSON.parse(body).nModified === 1)) {
                        var jsonMessage = {
                            "action": "APP_RESTART",
                            "connectionId": inComingMessage.connectionId
                        };
                        publisher.publish("user_wsServer", JSON.stringify(jsonMessage));
                        //callBack(null,inConnId,response.statusCode); // If updated Successfully , callBack with true and conection id
                        return;
                    } else {
                        //callBack(null,inConnId,response.statusCode); 
                        return;
                    }
                } catch (err) {
                    console.log("Reference/Syntax Eror" + " " + err);
                    //callBack(null,inConnId,config.generalErrorCode);
                    return;
                }
            });
        } catch (err) {
            console.log("Reference/Syntax Eror" + " " + err);
            //callBack(null,inConnId,config.generalErrorCode);
            return;
        }
    }


};

module.exports = controllers;