const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    console.log("Received Token:", token);  // Debugging

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);  // Debugging
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;