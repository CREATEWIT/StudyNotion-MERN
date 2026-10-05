const User = require("../models/User");
const Tag = require("../models/tags");
const Course = require("../models/Course");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//Create Course Handler Function
exports.createCourse = async(req,res) =>{
    try{
        //fetch data from user
        const {courseName, courseDetails,whatYouWillYouLearn,price,tags} = req.body;

        //fetch thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDetails || !whatYouWillYouLearn || !price ||!tags || !thumbnail){
            return res.status(400).json({
                success : false,
                message : "All Fields Are Required To Fill",
            });
        }

        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("instructor Details : ", instructorDetails);
        if(!instructorDetails){
            return res.status(404).json({
                success : false,
                message : "instructor Details not found",
            });
        }

        //check given tag is valid or not
        const tagDetails = await Tag.findById(tags);
        if(!tagDetails){
            return res.status(404).json({
                success : false,
                message : "Tag Details Not Found",
            });
        }

        //uploadImage TO Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        //create User Entry In DB
        const newCourse = await Course.create({
        courseName: courseName,
        courseDetails: courseDetails,
        whatYouWillYouLearn: whatYouWillYouLearn,
        price: price,
        courseInstructor: instructorDetails._id,
        tags: tagDetails._id,
        thumbnail: thumbnailImage.secure_url,
        });

        //add course Schema in user Schema
        await User.findByIdAndUpdate(
    instructorDetails._id,
    {
        $push: {
            courses: newCourse._id,
        }},
    { new: true }
    );

        //add course entry in Tag
    await Tag.findByIdAndUpdate(
    tagDetails._id,
    {
        $push: {
            courses: newCourse._id,
        }},
    { new: true });

    //return successfully
    return res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: newCourse,
});

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Failed To Create Course",
            error : error.message,
        });

    }
}




//GetAllCourse Handler
exports.showAllCourses = async(req,res) =>{
    try{
        const AllCourse = await Course.find({},{
            courseName : true,
            price : true,
            thumbnail : true,
            courseInstructor : true,
            ratingAndReview : true,
            studentEnrolled : true,
        }).populate("instructor")
        .exec();

        return res.status(500).json({
            success : true,
            message : "Data for All Courses Successfully",
            data : allCourse,
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Cannot fetch course data",
            error : error.message,
        });
    }
}