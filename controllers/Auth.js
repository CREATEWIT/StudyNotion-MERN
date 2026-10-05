const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Profile = require("../models/Profile");

//OTP function

exports.sendOTP = async(req,res) =>{
    try{
        //fetch email from request body
        const {email} = req.body;

        //check User Exist in DataBase 
        const UserExist = await User.findOne({email});

        //Send Response if user Exist 
        if(UserExist){
            return res.status(400).json({
                success:false,
                message : "User Already Exist",
            })
        }

        //generate OTP

        let otp = otpGenerator.generate(6,{
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false
        });

        console.log("OTP Generated",otp);

        //Check otp is Unique or Not
        let result = await OTP.findOne({ otp });

while (result) {
    otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });

    result = await OTP.findOne({ otp });
}
        const otpPayload = {email,otp};

        //create entry in mongodb
        const otpBody = await OTP.create(otpPayload)
        console.log(otpBody);

        //return response successful
        return res.status(200).json({
            success : true,
            message : "OTP Sent Successfully",
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message:error.message,
        })

    }
}

//SignUP function
exports.signUp = async(req,res) =>{
    try{
        //fetch user details from request body
        const {firstName,lastName,email,password,accountType,confirmPassword,contactNumber,otp} = req.body;

        //validate user input field
        if(!email || !firstName || !lastName || !password || !confirmPassword || !contactNumber || !otp){
            return res.status(400).json({
                success : false,
                message : "All Fields Are Required ",
            });
        }

        // Match 2Password.., password vs confirmPassword field
        if(password != confirmPassword){
            return res.status(400).json({
                success : false,
                message : "Password and Confirm Password Does not Match "
            });
        }

        // Check User is Already Exist OR Not

        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({
                success : false,
                message : "User Is Already Registered",
            });
        } 

        //find the most Recent OTP
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);

        //validate recent OTP
        if(recentOtp.length == 0){
            return res.status(400).json({
                success :false,
                message : "NO OTP Found",
            })
        }
        else if (otp != recentOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
            }
        //Hash Password
        const hashedPassword = await bcrypt.hash(password,10);

        //Create entry in DB
        const profileDetails = await Profile.create({
            gender : null,
            dateOfBirth : null,
            about : null,
            contactNumber : null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password : hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image:`https://api.dicebear.com/10.x/lorelei/svg?seed=${firstName} ${lastName}`,
        });

        //response send

        return res.status(201).json({
            success : true,
            message : "User Registered Successfully",
            user,
        })

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "User Cannot Registered Please try again later",
        });
    }
}

//Login function

exports.Login = async(req,res) =>{
    try{
        //fetch the data from user request
        const {email,password} = req.body;

        // Validate data
        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "All Fields are Required, Please Try Again Later",
            });
        }

        //Check User Exist OR Not
        const user = await User.findOne({ email }).populate("additionalDetails");
        if(!user){
            return res.status(400).json({
                success : false,
                message :"User is not Registered, please signUp first",
            });
        }

        //generate JWT, after password matching

        if(await bcrypt.compare(password,user.password)){
            const payload = {
                email : user.email,
                id : user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload,process.env.JWT_SECRETE,{
                expiresIn : "2h",
            });
            user.token = token;
            user.password = undefined;
         //check cookie and send response
        const options = {
            expires : new Date(Date.now() + 3*24*60*60*1000),
            httpOnly : true,
        }
        res.cookie("token",token,options).status(200).json({
            success :true,
            token,
            user,
            message : "Logged in Successfully"
        })
        }else {
            return res.status(401).json({
                success:false,
                message :"Password is inCorrect",
            });
        }
        

    }catch(error){
        return res.status(500).json({
            success : false,
            message : "Login Failed, Please Try Again Later",
        });
    }
}

//change Password
exports.changePassword = async(req,res) =>{
    try{
        //fetch data from User Input
        const {oldPassword,newPassword,confirmNewPassword} = req.body;

        //Check All input Field is Fill 
        if(!oldPassword || !newPassword || !confirmNewPassword){
            return res.status(400).json({
                success : false,
                message : "Please Fill All Details",
            });
        }

        //Checking Old & New Password Matching
        if(!oldPassword || !newPassword){
            return res.status(400).json({
                success : false,
                message : "Both Password Not Match",
            });
        }

        //Check User Email
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(403).json({
                success : false,
                message : "User not found",
            });
        }

        //Compare OldPassword vs NewPassword
        const isPasswordCorrect = await User.bcrypt.compare(
        oldPassword, user.password
        );

        //Check Old Password is Correct or Not
        if(!isPasswordCorrect){
            return res.status(400).json({
                success:false,
                message:"oldPassword is Not Correct"
            })
        }

        //Hashed The Password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        //UpdatePassword
        user.password = hashedPassword

        //savePassword
        await user.save();

        return res.status(200).json({
            success : false,
            message : "Password Change Successfully",
        });

    } catch(error){
        return res.status(500).json({
            success : false,
            message : "Something Went Wrong, Please Try Again Later"
        })
    }
}

