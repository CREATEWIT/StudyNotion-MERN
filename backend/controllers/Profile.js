
const Profile = require("../models/Profile");
const User = require("../models/User");
const { cloudinary } = require("../config/cloudinary");

// ========================================
// Update Profile Details
// ========================================
exports.updateProfile = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Request body is missing",
            });
        }

        const {
            gender,
            dateOfBirth,
            about = "",
            contactNumber = "",
        } = req.body;

        const id = req.user?.id;

        if (!id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        if (!gender || !contactNumber) {
            return res.status(400).json({
                success: false,
                message: "Gender and contact number are required",
            });
        }

        const userDetails = await User.findById(id);

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const profileDetails = await Profile.findById(
            userDetails.additionalDetails
        );

        if (!profileDetails) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        profileDetails.gender = gender;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;

        // Allow the date of birth to be updated or cleared.
        if (dateOfBirth === "" || dateOfBirth === null) {
            profileDetails.dateOfBirth = undefined;
        } else if (dateOfBirth !== undefined) {
            const parsedDate = new Date(dateOfBirth);

            if (Number.isNaN(parsedDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid date of birth",
                });
            }

            profileDetails.dateOfBirth = parsedDate;
        }

        await profileDetails.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profileDetails,
        });
    } catch (error) {
        console.error("Profile Update Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update profile",
        });
    }
};

// ========================================
// Update Profile Picture
// ========================================
exports.updateDisplayPicture = async (req, res) => {
    try {
        const id = req.user?.id;

        if (!id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        if (!req.files?.displayPicture) {
            return res.status(400).json({
                success: false,
                message: "Please upload a profile picture",
            });
        }

        const displayPicture = req.files.displayPicture;

        // Basic file validation
        if (!displayPicture.mimetype?.startsWith("image/")) {
            return res.status(400).json({
                success: false,
                message: "Only image files are allowed",
            });
        }

        const userDetails = await User.findById(id);

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const uploadedImage = await cloudinary.uploader.upload(
            displayPicture.tempFilePath,
            {
                folder: "LearnMeet/ProfilePictures",
                resource_type: "image",
            }
        );

        userDetails.image = uploadedImage.secure_url;
        await userDetails.save();

        const updatedUser = await User.findById(id)
    .populate("additionalDetails")
    .select("-password -token");

return res.status(200).json({
    success: true,
    message: "Image Updated successfully",
    data: updatedUser,
});
    } catch (error) {
        console.error("Update Display Picture Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update profile picture",
        });
    }
};

// ========================================
// Delete Profile and User
// ========================================
exports.deleteProfile = async (req, res) => {
    try {
        const id = req.user?.id;

        if (!id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const userDetails = await User.findById(id);

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (userDetails.additionalDetails) {
            await Profile.findByIdAndDelete(
                userDetails.additionalDetails
            );
        }

        await User.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "User and profile deleted successfully",
        });
    } catch (error) {
        console.error("Delete Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete profile",
        });
    }
};

// ========================================
// Get All User Profile Data
// ========================================
exports.getAllUserProfile = async (req, res) => {
    try {
        const id = req.user?.id;

        if (!id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const userDetails = await User.findById(id)
            .populate("additionalDetails")
            .select("-password -token")
            .exec();

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            userDetails,
        });
    } catch (error) {
        console.error("Get User Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch user profile",
        });
    }
};
