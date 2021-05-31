const mongoose = require('mongoose');

const DeviceIdSchema = mongoose.Schema({
    deviceId : {type: String, required: true, trim: true ,index: { unique: true }},
    status      :   { type: String, required: true, trim: true }
},{
    timestamps: true
});

const ActuatorIdSchema = mongoose.Schema({
    actuatorId : {type: String, required: true, trim: true ,index: { unique: true }},
    status      :   { type: String, required: true, trim: true }
},{
    timestamps: true
});

const SensorIdSchema = mongoose.Schema({
    sensorId : {type: String, required: true, trim: true ,index: { unique: true }},
    status      :   { type: String, required: true, trim: true }
},{
    timestamps: true
});



const DeviceListSchema = mongoose.Schema({
    deviceIdList    :  { type: [DeviceIdSchema]},
    actuatorIdList  :   { type: [ActuatorIdSchema]},
    sensorIdList      :   { type: [SensorIdSchema]}
}, {
    timestamps: true
});


module.exports = mongoose.model('WifiReg_DeviceList', DeviceListSchema,'WifiReg_DeviceList');