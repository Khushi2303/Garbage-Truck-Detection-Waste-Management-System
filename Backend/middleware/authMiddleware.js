const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user data to request
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;