const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
    sectionName : {
        type : String,
    },
    subSection : [{
        type :  mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "subSection"
    }],
});

module.export = mongoose.model("Section",sectionSchema)