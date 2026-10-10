
const express = require("express");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 4000;

// Import configuration
const dbConnect = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

// Import middleware
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

// Import routes
const router = require("./routes/router");

// Database and Cloudinary connections

dbConnect.connect();
cloudinaryConnect();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
    })
);

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "./temp",
    })
);

// Routes
app.use("/api/v1", router);

// Default route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Your server is up and running",
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
