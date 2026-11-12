const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token.replace(/^Bearer /, ""), process.env.JWT_SECRET || "dev-only-change-me");
        req.user = verified;
        next();
    } catch {
        res.status(400).json({ message: "Invalid Token" });
    }
};