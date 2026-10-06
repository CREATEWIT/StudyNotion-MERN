const mongoose = require("mongoose");

const Sub_SectionSchema = new mongoose.Schema({
    title : {
        type : String,
    },
    timeDuration :{
        type : String,
    },
    description : {
        type : String,
    },
    videoUrl : {
        type : String,
    },

}) 

module.exports = mongoose.model("Sub_Section",Sub_SectionSchema)