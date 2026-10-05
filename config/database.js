const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () =>{
    new mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("DB Kai Connection Successful"))
    .catch((error) =>{
        console.log("Issue In DB Ka Connection");
        console.error(error);
        process.exit(1);

    })
};