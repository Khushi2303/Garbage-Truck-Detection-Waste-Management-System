const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Register new user
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const user = new User({ name, email, password, role });
        await user.save();
        res.json({ message: "User registered" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;