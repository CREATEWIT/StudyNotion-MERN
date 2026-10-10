const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    courseName : {
        type : String,
        required : true,
    },
    courseDetails : {
        type : String,
        required : true,
    },
    courseInstructor : [{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User",
    }],
    whatYouWillYouLearn : {
        type : String,
        required : true,
    },
    courseContent : [{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref :"Section",
    }],
    ratingAndReview : [{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "RatingAndReview",
    }],
    price : {
        type : Number,
        required : true,
    },
    thumbnail : {
        type : String,
        required : true,
    },
    tag :{
        type : [String],
        required :true,
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Category",
    },
    studentEnrolled : [{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User" 
    }],

});

module.exports = mongoose.model("Course",CourseSchema)