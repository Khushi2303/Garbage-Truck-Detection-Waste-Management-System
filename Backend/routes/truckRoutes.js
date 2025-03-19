const express = require("express");
const router = express.Router();
const GarbageTruck = require("../models/GarbageTruck");

// WebSocket instance (import from server.js)
const { io } = require("../server");

// ✅ Add a new garbage truck
router.post("/add", async (req, res) => {
    try {
        const truck = new GarbageTruck(req.body);
        await truck.save();
        res.status(201).json({ message: "Garbage Truck Added 🚛", truck });

        // Broadcast new truck to all clients
        io.emit("newTruck", truck);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ✅ Get all garbage trucks
router.get("/all-trucks", async (req, res) => {
    try {
        const trucks = await GarbageTruck.find();
        res.json(trucks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get a specific garbage truck by ID
router.get("/:id", async (req, res) => {
    try {
        const truck = await GarbageTruck.findById(req.params.id);
        if (!truck) return res.status(404).json({ error: "Truck Not Found" });
        res.json(truck);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Update truck details & location
router.put("/:id", async (req, res) => {
    try {
        const truck = await GarbageTruck.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!truck) return res.status(404).json({ error: "Truck Not Found" });
        res.json({ message: "Truck Updated ✅", truck });

        // Notify clients of updated location
        io.emit("locationUpdate", truck);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Delete a garbage truck
router.delete("/delete/:id", async (req, res) => {
    try {
        const truck = await GarbageTruck.findByIdAndDelete(req.params.id);
        if (!truck) return res.status(404).json({ error: "Truck Not Found" });
        res.json({ message: "Truck Deleted 🗑️" });

        // Notify clients that a truck was removed
        io.emit("truckDeleted", req.params.id);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Find nearest truck (for users)
router.get("/nearest", async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) return res.status(400).json({ error: "Latitude and Longitude required" });

        const trucks = await GarbageTruck.find();
        if (!trucks.length) return res.status(404).json({ error: "No trucks available" });

        let nearestTruck = null;
        let minDistance = Infinity;

        trucks.forEach(truck => {
            const distance = Math.sqrt(Math.pow(truck.location.lat - lat, 2) + Math.pow(truck.location.lng - lng, 2));
            if (distance < minDistance) {
                minDistance = distance;
                nearestTruck = truck;
            }
        });

        res.json(nearestTruck);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;