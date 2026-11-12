const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");

const { sendOTP, signUp, Login, changePassword } = require("../controllers/Auth");
const { createCourse, showAllCourses, getCourseDetails } = require("../controllers/Course");
const { createSection, updateSection, deleteSection } = require("../controllers/Section");
const { createSubSection, updateSubSection, deleteSubSection } = require("../controllers/SubSection");
const { updateDisplayPicture, updateProfile, deleteProfile, getAllUserProfile } = require("../controllers/Profile");
const { resetPasswordToken, resetPassword } = require("../controllers/ResetPassword");
const { creteRating, getAverageRating, getAllRatingAndReview } = require("../controllers/RatingAndReview");
const { capturePayments, verifySignature } = require("../controllers/Payments");
const { createCategory, showAllCategory, categoryPageDetails } = require("../controllers/Category");

// ==================== AUTH ROUTES ====================
router.post("/auth/sendotp", sendOTP);
router.post("/auth/signup", signUp);
router.post("/auth/login", Login);
router.post("/auth/changepassword", auth, changePassword);
router.post("/auth/reset-password-token", resetPasswordToken);
router.post("/auth/reset-password", resetPassword);

// ==================== PROFILE ROUTES ====================
router.put("/profile/updateDisplayPicture", auth, updateDisplayPicture);
router.put("/profile/updateProfile", auth, updateProfile);
router.delete("/profile/deleteProfile", auth, deleteProfile);
router.get("/profile/getUserDetails", auth, getAllUserProfile);

// ==================== COURSE & CATEGORY ROUTES ====================
router.post("/course/createCourse", auth, createCourse);
router.get("/course/getAllCourses", showAllCourses);
router.get("/course/getCourseDetails", getCourseDetails);
router.post("/course/addSection", auth, createSection);
router.put("/course/updateSection", auth, updateSection);
router.delete("/course/deleteSection", auth, deleteSection);
router.post("/course/addSubSection", auth, createSubSection);
router.put("/course/updateSubSection", auth, updateSubSection);
router.delete("/course/deleteSubSection", auth, deleteSubSection);
router.post("/course/createCategory", auth, createCategory);
router.get("/course/showAllCategories", showAllCategory);
router.get("/course/getCategoryPageDetails", categoryPageDetails);

// ==================== RATING & REVIEW ROUTES ====================
router.post("/course/createRating", auth, creteRating);
router.get("/course/getAverageRating", getAverageRating);
router.get("/course/getReviews", getAllRatingAndReview);

// ==================== PAYMENT ROUTES ====================
router.post("/payment/capturePayment", auth, capturePayments);
router.post("/payment/verifyPayment", auth, verifySignature);

module.exports = router;
