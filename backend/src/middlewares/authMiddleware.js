const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

exports.authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log(decoded)
        req.user = decoded; // Attach decoded user information (e.g., { id, email }) to the request
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
