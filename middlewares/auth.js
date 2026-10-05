const JWT = require("jsonwebtoken") ;
const User = require("../models/User")
require("dotenv").config();
const cookieParser = require("cookie-parser");


//auth
exports.auth = async(req,res,next)=>{
    try{
        //extract token from user 
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");

        //if token missing,then return response
        if(!token){
            return res.status(401).json({
                success : false,
                message : "invalid or expired token",
            });
        }

        //Verify Token
        try{
            const decode = JWT.verify(token,process.env.JWT_SECRETE);
            console.log(token);
            req.user = decode

        } catch(error){
            return res.status(401).json({
                success : false,
                message :  "token is valid"
            })
        }
        next();
        
    } catch(error){
        return res.status(401).json({
            success : false,
            message : "Something Went Wrong for validating the token",
        });
    }
}

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