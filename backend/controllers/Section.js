
const Section = require("../models/Section");
const Course = require("../models/Course");

// Create Section
exports.createSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body;

        if (
            typeof sectionName !== "string" ||
            !sectionName.trim() ||
            !courseId
        ) {
            return res.status(400).json({
                success: false,
                message: "Section name and course ID are required",
            });
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        const newSection = await Section.create({
            sectionName: sectionName.trim(),
        });

        course.courseContent.push(newSection._id);
        await course.save();

        const updatedCourseDetails = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                    model: "SubSection",
                },
            });

        return res.status(201).json({
            success: true,
            message: "Section created successfully",
            updatedCourseDetails,
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Issue while creating section",
            error: error.message,
        });
    }
};

// Update Section
exports.updateSection = async (req, res) => {
    try {
        const { sectionName, sectionId } = req.body;

        if (
            typeof sectionName !== "string" ||
            !sectionName.trim() ||
            !sectionId
        ) {
            return res.status(400).json({
                success: false,
                message: "Section name and section ID are required",
            });
        }

        const section = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName: sectionName.trim() },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            section,
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid section ID",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating section",
            error: error.message,
        });
    }
};

// Delete Section
exports.deleteSection = async (req, res) => {
    try {
        const { sectionId, courseId } = req.body;

        if (!sectionId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Section ID and course ID are required",
            });
        }

        // Verify the course contains this section
        const course = await Course.findOne({
            _id: courseId,
            courseContent: sectionId,
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course or section association not found",
            });
        }

        // Remove section reference from course
        course.courseContent.pull(sectionId);
        await course.save();

        // Delete section
        const deletedSection =
            await Section.findByIdAndDelete(sectionId);

        if (!deletedSection) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting section",
            error: error.message,
        });
    }
};