const Profile = require("../models/Profile");
const User = require("../models/User");

//Profile Update Handler
exports.updateProfile = async(req,res)=>{
    try{
        //get data
    const {gender, dateOfBirth,about ="",contactNumber=""} = req.body;

    //get userId
    const id = req.user.id;

    //user validation
    if(!gender || !contactNumber || !id){
        return res.status(500).json({
            success : false,
            message : "All field Required to fill",
        });
    }

    //find Profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    //update Profile
    profileDetails.gender = gender;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.dateOfBirth = dateOfBirth;
    await profileDetails.save();

    //return response
    return res.status(200).json({
        success : true,
        message : "Profile Updated SuccessFull",
        profileDetails,
    });

    }catch(error){
        return res.status(500).json({
            success : false,
            message : "Issue in Profile Update, something Issue",
        });
    }}

    //Delete Profile

    exports.deleteProfile = async(req,res) =>{
        try{
            //get id
            const id = req.user.id;

            //validation
            const userDetails  = await User.findById(id);
            if(!userDetails){
                return res.status(404).json({
                    success : false,
                    message : "User Not Found",
                }
            );}

            //delete profile
            await Profile.findByIdAndDelete({_id : userDetails.additionalDetails});
            //How en unroll the students by all enrolled Courses

            //delete user
            await User.findByIdAndDelete({_id:id});

            //return response
            return res.status(200).json({
                success : true,
                message : "User Deleted Successfully",
            });

        }catch(error){
            return res.status(500).json({
                success : false,
                message : "something issue in Delete Profile",
            });

        }
    }


//getAllUserData
exports.getAllUserProfile = async(req,res) =>{
    try{
        //get id
        const id = req.user.id;

        //validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        console.log(userDetails);

        //return response
        return res.status(200).json({
            success : false,
            message : "User data fetched successfully",
        });

    }catch(error){
        return res.status(500).json({
            success : false,
            message : "issue in fetch all user details",
        });
    }
}