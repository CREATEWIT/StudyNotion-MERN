const Section = require("../models/Section");
const Course = require("../models/Course");

//Create Section 
exports.createSection  = async(req,res) =>{
    try{
        //fetch Data
        const {sectionName, courseId} = req.body;

        //data validation
        if(!sectionName || !courseId){
            return res.status(403).json({
                success : false,
                message : "Check Properly, Please Fill All Fields..",
            });
        }

        //create section
        const newSection = await Section.create({sectionName});

        //update course with section objectId
        const updateCourseDetails = await Course.findByIdAndUpdate(courseId,
            {
                $push : {
                    courseContent : newSection._id,
                }
            },
            {new : true},
        );
        if(!updateCourseDetails){
            return res.status(403).json({
                success : false,
                message : "Course not found",

            });
        }
        // Populate Section + SubSection
        const updatedCourseDetails = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                    model: "SubSection",
                },
            })
            .exec();

        console.log(updatedCourseDetails);

        //return response
        return res.status(200).json({
            success : true,
            message : "Section Created Successfully",
        });

    }catch(error){
        return res.status(500).json({
            success : false,
            message : "Issue In Section Creation Please Try Again later",
            error:error.message,
        });

    }
}



exports.updateSection = async(req,res) => {
    try {

        const {sectionName, sectionId} = req.body;

        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: "Fill All Details",
            });
        }

        const section = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName },
            { new: true }
        );

        if(!section){
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully",
            section,
        });

    } catch(error) {

        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating section",
            error: error.message,
        });
    }
};



exports.sectionDelete = async(req,res) => {
    try {

        const {sectionId, courseId} = req.body;

        if(!sectionId || !courseId){
            return res.status(400).json({
                success: false,
                message: "Section ID and Course ID are required",
            });
        }

        // Delete Section
        const sectionDelete =
            await Section.findByIdAndDelete(sectionId);

        if(!sectionDelete){
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        // Remove Section ID from Course
        await Course.findByIdAndUpdate(
            courseId,
            {
                $pull: {
                    courseContent: sectionId,
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Section Deleted Successfully",
        });

    } catch(error) {

        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting section",
            error: error.message,
        });
    }
};