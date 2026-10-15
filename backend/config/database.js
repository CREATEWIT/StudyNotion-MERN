
const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("DB Connection Successful");
    } catch (error) {
        console.error("Issue in DB Connection:", error.message);
        process.exit(1);
    }
};
