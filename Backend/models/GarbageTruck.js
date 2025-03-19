const mongoose = require("mongoose");

const GarbageTruckSchema = new mongoose.Schema({
    driverName: { type: String, required: true },
    licensePlate: { type: String, required: true },
    currentLocation: { 
        lat: { type: Number, required: true }, 
        lng: { type: Number, required: true } 
    },
    route: [{ lat: Number, lng: Number }], // List of waypoints
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GarbageTruck", GarbageTruckSchema);