const User = require("../models/User");
const sendMail = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//resetPasswordToken
exports.resetPasswordToken = async(req,res) =>{
    try{
        //get email from user
        const email = req.body.email;
        
        //check user for this email,email validation
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"email is not Valid",
            });
        }

        //generate token
        const token = crypto.randomUUID();

        //update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },{
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000
                },
                { new: true }
                );
        //create url
        const url = `https://localhost:3000/update-password/${token}`

        //send th email containing the url
        await mailSender(email,
            "Password Reset Link",
            `Password Reset Link Url : ${url}`
        );

        //return response
        return res.status(200).json({
            success:false,
            message:"Email Send Successfully,Please check email and change Password",
        });

    }catch(error){
        return res.status(500).json({
            success : false,
            message : "Server Error, Please Try Again Later",
        });
    }
}

//ResetPassword
exports.resetPassword = async(req,res) =>{
    try{
        //get email from user
        const {password,newPassword,token} = req.body

        if(password !== newPassword){
            return res.json({
                success : false,
                message : "password Not Match",
            });
        }

        //get userDetails from db
        const userDetails = await User.findOne({email:email});
        if(!userDetails){
            return res.json({
                success : false,
                message : "Token is Invalid",
            });
        }

        //update user by adding token and expiration time
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success : false,
                message : "Token Expired , Please Regenerate your token",
            });
        }

        //hash Password
        const hashedPassword = await bcrypt.hash(password,10);

        //password update
        await User.findOneAndUpdate({token:token},
            {password:hashedPassword},  
            {new:true}
        );

        //return response
        return res.status(200).json({
            success : true,
            message : "Password reset Successful",
        });

    } catch(error){
        return res.status(500).json({
            success : false,
            message : "something error in reset Password, please try Again later",
        });
    }
}

