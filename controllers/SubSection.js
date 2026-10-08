const Section = require("./models/Section");
const SubSection = require("./models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubSection = async(req,res) =>{
    try{
        //fetch Data
        const {sectionId, title,description,timeDuration} = req.body
        if(!sectionId || !title || !description || !timeDuration){
            return res.status(403).json({
                success : false,
                message : "All Field necessary",
            });
        }
        //extract file & Video
        const video = req.files.fileVideo;

        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);

        //create a sub_section
        const SubSectionDetails = await SubSection.create({
            title:title,
            description : description,
            timeDuration : timeDuration,
            videoUrl : uploadDetails.secure_url,
        });

        //update section with this SubSection objectId
        const updateSectionDetails = await Section.findByIdAndUpdate({_id:sectionId},
            {
                $push : {
                    subSection : SubSectionDetails._id,
                }
            },{new : true}
        );

        if(!updateSectionDetails){
            return res.status(400).json({
                success : false,
                message : "issue in update Section",
            });
        }

        //log  update section after adding populate query
        const updatedSectionDetails = await Section.findById(sectionId)
            .populate("subSection")
            .exec();
        console.log(updatedSectionDetails);

        //return response
        return res.status(200).json({
            success : true,
            message : "SubSection Created Successfully",
            updatedSectionDetails,
        });
    }catch(error){
        return res.status(500).json({
            success : false,
            message : "something wen wrong for creating subSection, please try again later",
            error: error.message,
        });

    }
}

exports.updateSubSection = async (req, res) => {
    try {

        const {subSectionId,title,description,timeDuration} = req.body;
        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: "SubSection ID is required",
            });
        }
        const updatedSubSection = await SubSection.findByIdAndUpdate(
            subSectionId,
            {
                title,
                description,
                timeDuration
            },
            { new: true }
        );

        if (!updatedSubSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "SubSection updated successfully",
            updatedSubSection,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Server error while updating SubSection",
            error: error.message,
        });
    }
};


exports.deleteSubSection = async (req, res) => {
    try {

        const { subSectionId, sectionId } = req.body;

        if (!subSectionId || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "SubSection ID and Section ID are required",
            });
        }

        // 1. Delete SubSection document
        const deletedSubSection =
            await SubSection.findByIdAndDelete(subSectionId);

        if (!deletedSubSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        // 2. Remove SubSection ID from Section
        await Section.findByIdAndUpdate(
            sectionId,
            {
                $pull: {
                    subSection: subSectionId,
                }
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "SubSection deleted successfully",
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Server error while deleting SubSection",
            error: error.message,
        });
    }
};