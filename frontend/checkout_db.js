const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "User_Info"
});

// Connect to Database
db.connect((err) => {
    if (err) {
        console.error("❌ DATABASE CONNECTION ERROR:", err.message);
        process.exit(1);
    }
    console.log("✅ Connected to MySQL database");

    // Create table if not exists
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS checkout_info (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            address VARCHAR(255) NOT NULL,
            city VARCHAR(255) NOT NULL,
            state VARCHAR(255),
            zip_code VARCHAR(10),
            bkash_number VARCHAR(15) NOT NULL,
            transaction_id VARCHAR(50) NOT NULL,
            total_cost DECIMAL(10, 2) DEFAULT 30.00,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    db.query(createTableQuery, (err) => {
        if (err) {
            console.error("❌ Error creating table:", err.message);
        } else {
            console.log("✅ Table `checkout_info` ensured to exist");
        }
    });
});

// Checkout Endpoint
app.post("/checkout", (req, res) => {
    const {
        fullName,
        address,
        city,
        state,
        zipCode,
        bkashNumber,
        transactionId
    } = req.body;

    // Input Validation
    const validationErrors = [];
    if (!fullName) validationErrors.push("Full Name is required");
    if (!address) validationErrors.push("Address is required");
    if (!city) validationErrors.push("City is required");
    if (!bkashNumber) validationErrors.push("bKash Number is required");
    if (!transactionId) validationErrors.push("Transaction ID is required");

    if (validationErrors.length > 0) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validationErrors
        });
    }

    // Prepare Insert Query
    const insertQuery = `
        INSERT INTO checkout_info 
        (full_name, address, city, state, zip_code, bkash_number, transaction_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        fullName,
        address,
        city,
        state || null,
        zipCode || null,
        bkashNumber,
        transactionId
    ];

    // Execute Query
    db.query(insertQuery, values, (err, result) => {
        if (err) {
            console.error("❌ Database Insertion Error:", err);
            return res.status(500).json({
                message: "Checkout processing failed",
                error: err.message
            });
        }

        res.status(201).json({
            message: "Checkout successful",
            insertedId: result.insertId
        });
    });
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful Shutdown
process.on("SIGINT", () => {
    db.end((err) => {
        if (err) console.error("Error closing MySQL connection", err.message);
        console.log("MySQL connection closed");
        process.exit(0);
    });
});