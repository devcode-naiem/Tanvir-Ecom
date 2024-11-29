const express = require("express");
const cors = require("cors");
const authRoutes = require("./models/routes/authRoutes");
const errorHandler = require("./middlewares/errorHandler");
const checkoutRoutes = require("./models/routes/checkoutRoutes");

const { createTables } = require("./models/createTables");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", checkoutRoutes);

// Global Error Handler
app.use(errorHandler);

// Create table
createTables();

module.exports = app;
