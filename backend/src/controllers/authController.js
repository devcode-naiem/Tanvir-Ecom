const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwtUtils");
const db = require("../config/database");

exports.signup = (req, res) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
    if (hashErr) {
      return res.status(500).json({ error: "Error hashing password" });
    }

    const query =
      "INSERT INTO signUp_Info (email, password, name) VALUES (?, ?, ?)";
    db.query(query, [email, hashedPassword, name], (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  });
};

exports.login = (req, res) => {
  console.log("Logging");
  const { email, password } = req.body;

  const query = "SELECT * FROM signUp_Info WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.generateToken({ userId: user.id, email: user.email });

      // Set cookie with token
      res.cookie("auth_token", token, {
        httpOnly: true, // Prevents JavaScript access to cookies
        secure: process.env.NODE_ENV === "production", // Enables Secure flag for HTTPS in production
        sameSite: "strict", // Protects against CSRF attacks
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      // Send user details and token in response
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name || "User", // Adjust based on database schema
        },
      });
    });
  });
};
