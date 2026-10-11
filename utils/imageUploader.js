
const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (
    file,
    folder,
    resourceType = "image"
) => {
    if (!file || !file.tempFilePath) {
        throw new Error("Uploaded file or temporary file path is missing");
    }

    // Validate based on the requested resource type
    if (resourceType === "video" &&
        !file.mimetype?.startsWith("video/")) {
        throw new Error("Invalid video file");
    }

    if (resourceType === "image" &&
        !file.mimetype?.startsWith("image/")) {
        throw new Error("Invalid image file");
    }

    return await cloudinary.uploader.upload(file.tempFilePath, {
        folder,
        resource_type: resourceType,
    });
};
