const User = require("../models/User");
const Category = require("../models/Category");
const Course = require("../models/Course");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//Create Course Handler Function
exports.createCourse = async(req,res) =>{
    try{
        //fetch data from user
        const {courseName, courseDetails,whatYouWillYouLearn,price,Category: categoryId,} = req.body;

        //fetch thumbnail
        const thumbnail = req.files?.thumbnailImage;
        if (!thumbnail) {
        return res.status(400).json({
        success: false,
        message: "Thumbnail file is missing",
    });
}

        //validation
        if (!courseName || !courseDetails || !whatYouWillYouLearn || price === undefined || price === "" || !categoryId || !thumbnail) {
        return res.status(400).json({
        success: false,
        message: "All fields are required",
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
        const CategoryDetails = await Category.findById(categoryId);
        if(!CategoryDetails){
            return res.status(404).json({
                success : false,
                message : "Category Details Not Found",
            });
        }

        //uploadImage TO Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        //create User Entry In DB
        const newCourse = await Course.create({
    courseName,
    courseDetails,
    whatYouWillYouLearn,
    price,
    courseInstructor: [instructorDetails._id],
    category: CategoryDetails._id,
    tag: [CategoryDetails.name],
    thumbnail: thumbnailImage.secure_url,
});

        //add course Schema in user Schema
        await User.findByIdAndUpdate(
    instructorDetails._id,
    {
        $push: {
            courses: newCourse._id,
        }},
    { returnDocument: "after" }
    );

        //add course entry in Tag
    await Category.findByIdAndUpdate(
    CategoryDetails._id,
    { $push: { courses: newCourse._id } },
    { returnDocument: "after" }
);

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

//ShowAllCourse Handler
exports.showAllCourses = async(req,res) =>{
    try{
        const allCourse = await Course.find({},{
            courseName : true,
            price : true,
            thumbnail : true,
            courseInstructor : true,
            ratingAndReview : true,
            studentEnrolled : true,
        }).populate("courseInstructor")
        .exec();

        return res.status(200).json({
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


//getCourseDetails
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;

        const courseDetails = await Course.findById(courseId)
            .populate({
                path: "courseInstructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            //.populate("ratingAndReview")
            .populate("category")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Could not find course with ID: ${courseId}`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: courseDetails,
        });
    } catch (error) {
        console.error("Get Course Details Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};