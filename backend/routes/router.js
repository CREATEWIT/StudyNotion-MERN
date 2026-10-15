const express = require("express");
const router = express.Router();
const { auth ,} = require("../middlewares/auth");

const {sendOTP, signUp, Login, changePassword } = require("../controllers/Auth");
const {createCourse, showAllCourses, getCourseDetails} = require("../controllers/Course");
const {createSection, updateSection, deleteSection} = require("../controllers/Section");
const {createSubSection, updateSubSection, deleteSubSection} = require("../controllers/SubSection");
const {updateDisplayPicture, updateProfile, deleteProfile, getAllUserProfile } = require("../controllers/Profile");
const {resetPasswordToken, resetPassword }  = require("../controllers/ResetPassword");
const {creteRating, getAverageRating, getAllRatingAndReview} = require("../controllers/RatingAndReview");
const {capturePayments, verifySignature } = require("../controllers/Payments");
const {createCategory,  showAllCategory, categoryPageDetails} = require("../controllers/Category");


router.post("/SendOTP", sendOTP);
router.post("/Home/SignUp", signUp);
router.post("/Home/Login", Login);
router.post("/Courses/CreateCourse",auth, createCourse);
router.get("/Courses/ShowAllCourses", showAllCourses);
router.get("/Courses/GetCourseDetails", getCourseDetails);
router.post("/Section/CreateSection", createSection);
router.put("/Section/UpdateSection", updateSection);
router.delete("/Section/DeleteSection", deleteSection);
router.post("/SubSection/CreateSubSection", createSubSection);
router.put("/SubSection/UpdateSubSection", updateSubSection);
router.delete("/SubSection/DeleteSubSection", deleteSubSection);
router.put("/Profile/UpdateDisplayPicture",auth, updateDisplayPicture);
router.put("/Profile/UpdateProfile", auth, updateProfile);
router.delete("/Profile/DeleteProfile",auth, deleteProfile);
router.get("/Profile/GetAllUserProfile",auth, getAllUserProfile);
router.post("/Password/ResetPasswordToken", resetPasswordToken);
router.post("/Password/ResetPassword", resetPassword );
router.post("/Password/ChangePassword", changePassword);
router.post("/Rating/CreateRating", creteRating);
router.get("/Rating/GetAverageRating", getAverageRating);
router.get("/Rating/GetAllRatingAndReview", getAllRatingAndReview);
router.post("/Payments/CapturePayments", capturePayments);
router.post("/Payments/VerifySignature", verifySignature);
router.post("/Category/CreateCategory", createCategory);
router.get("/Category/ShowAllCategory", showAllCategory);
router.get("/Category/CategoryPageDetails", categoryPageDetails);







module.exports = router;