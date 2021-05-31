const express = require('express');
const router = express.Router();
const WifiReg_DeviceList=require('../models/DeviceList.model');  


/*********************************create A DeviceId List Collection**************************** */
router.post('/', function (req, res) {
    try{
        console.log("++++++++Create+++++++++++")
        WifiReg_DeviceList.create({
            deviceIdList: [],
            actuatorIdList:[],
            sensorList:[]
        }, 
            function (err, resp) {
                if (err) return res.status(500).send("There is a problem in Creating DeviceId Collection"+" "+err);
                res.status(200).send(resp);
            });
    }catch(err){
        return res.status(500).send("There is a problem in Creating DeviceId Collection"+" "+err);
    }
});

/****************************************Insert Generated Device Id in Collection *******************************/
router.post('/deviceId', function (req, res) {
    try{
        console.log("++++++++Insert Generated Device Id+++++++++++")
        WifiReg_DeviceList.updateOne({},
            {   $push: {
                    deviceIdList: [ { deviceId: req.body.deviceId, status: req.body.status }]
                }
            }, function (err, resp) {
            if (err) return res.status(500).send("There was a problem in inserting Device Id in List."+" "+err);
            res.status(200).send(resp);
        });
    }catch(err){
        return res.status(500).send("There was a problem in inserting Device Id in List."+" "+err);
    }
});

/****************************************Insert Generated Actuator Id in Collection *******************************/
router.post('/actuatorId', function (req, res) {
    try{
        console.log("++++++++Insert Generated Actuator Id+++++++++");
        WifiReg_DeviceList.updateOne({},
            {   $push: {
                actuatorIdList: [ { actuatorId: req.body.actuatorId, status: req.body.status }]
                }
            }, function (err, resp) {
            if (err) return res.status(500).send("There was a problem in inserting Actuator Id in List."+" "+err);
            res.status(200).send(resp);
        });
    }catch(err){
        return res.status(500).send("There was a problem in inserting Actuator Id in List."+" "+err);
    }
});


/****************************************Insert Generated Sensor Id in Collection *******************************/
router.post('/sensorId', function (req, res) {
    try{
        console.log("++++++++Insert Generated Sensor Id+++++++++");
        WifiReg_DeviceList.updateOne({},
            {   $push: {
                sensorIdList: [ { sensorId: req.body.sensorId, status: req.body.status }]
                }
            }, function (err, resp) {
            if (err) return res.status(500).send("There was a problem in inserting Sensor Id in List."+" "+err);
            res.status(200).send(resp);
        });
    }catch(err){
        return res.status(500).send("There was a problem in inserting Sensor Id in List."+" "+err);
    }
});

/*****************************************Update Device Status **************************/
router.post('/updateDevicestatus', function (req, res) {
    try{
        WifiReg_DeviceList.updateOne({},
            { $set: { "deviceIdList.$[elem].status" : req.body.status } },{
                arrayFilters: [ { "elem.deviceId":req.body.deviceId , "elem.status": "InActive"} ]
            }, function (err, resp) {
            if (err) return res.status(500).send("There was a problem in updating Device Id Status ."+err);
            res.status(200).send(resp);
        });
    }catch(err){
        return res.status(500).send("There was a problem in updating Device Id Status ."+err);
    }
});


/*****************************************Update Actuator Status **************************/
router.post('/updateActuatorstatus', function (req, res) {
    try{
        WifiReg_DeviceList.updateOne({},
            { $set: { "actuatorIdList.$[elem].status" : req.body.status } },{
                arrayFilters: [ { "elem.actuatorId":req.body.deviceId , "elem.status": "InActive"} ]
            }, function (err, resp) {
            if (err) return res.status(500).send("There was a problem in updating Actuator Id Status ."+err);
            res.status(200).send(resp);
        });
    }catch(err){
        return res.status(500).send("There was a problem in updating Actuator Id Status ."+err);
    }
});


/*****************************************Update Sensor Status **************************/
router.post('/updateSensorstatus', function (req, res) {
    try{
        WifiReg_DeviceList.updateOne({},
            { $set: { "sensorIdList.$[elem].status" : req.body.status } },{
                arrayFilters: [ { "elem.sensorId":req.body.sensorId , "elem.status": "InActive"} ]
            }, function (err, resp) {
            if (err) return res.status(500).send("There was a problem in updating Sensor Id Status ."+err);
            res.status(200).send(resp);
        });
    }catch(err){
        return res.status(500).send("There was a problem in updating Sensor Id Status ."+err);
    }
})


module.exports = router;