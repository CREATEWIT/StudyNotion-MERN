
const User = require("../models/User")
const cookieParser = require("cookie-parser");
const JWT = require("jsonwebtoken");
require("dotenv").config();

// Authentication middleware
exports.auth = async (req, res, next) => {
    try {
        // Extract token safely
        const authHeader = req.headers.authorization;

        let token = req.cookies?.token || req.body?.token;

        if (!token && authHeader?.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token missing",
            });
        }

        // Verify token
        const decoded = JWT.verify(
            token,
            process.env.JWT_SECRETE
        );

        // Attach decoded payload to request
        req.user = decoded;

        if (!req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Token does not contain a user ID",
            });
        }

        return next();
    } catch (error) {
        console.error("Authentication error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};


//isStudent
exports.isStudent = async(req,res,next) =>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success : false,
                message : "This is protected Route, Only For Students"
            })
        }
        next()

    }catch(error){
        return res.status(500).json({
            success : false,
            message : "User Role Cant not verified,please try again later",
        });
    }
}

//isAdmin Route
exports.isAdmin = (req,res,next) =>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success : false,
                message : "This Route is Protected for only Admin",
            });
        }
        next()

    }catch(error){
        return res.status(500).json({
            success : false,
            message : "User Role Can Not Be verified,Please Try Again Later",
        });

    }
}
//Instructor Route
exports.Instructor = (req,res,next) =>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success : false,
                message : "The Route Is Only For Instructor"
            })
        }
        next()

    }catch(error){
        return res.status(500).json({
            success : false,
            message : "User Role Can Not be Verified,please try Again Later",
        });
    }
}