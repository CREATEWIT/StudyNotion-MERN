const ratingAndReview = require("../models/ratingAndReview");
const Course = require("../models/Course")

//Create RatingAndReview Handler
exports.creteRating = async(req,res) =>{
    try{
        //get Data
        const userId = req.user.id;

        //fetched data from req body
        const {rating,review,courseId} = req.body

        //check the user is enrolled or not
        const ratingDetails = await Course.findOne({_id : courseId,
            studentEnrolled:{$elemMatch: {$eq: userId}},
        });

        if(!ratingDetails){
            return res.status(404).json({
                success : false,
                message : "Student is not enrolled in this course",
            });
        }

        //check if user already reviewed the course :
        const alreadyReview = await RatingAndReview.findOne(
            {user:userId,
            course : courseId,
        });

        if(alreadyReview){
            return res.status(403).json({
                success  : false,
                message : "This Course Is already Review By User",
            });
        }

        //create rating and review
        const ratingReview = await ratingAndReview.create({rating,
            review,
            user : userId,
            course:courseId,
        });

        //update course with this rating and review
        const updatedReviewDetails = await Course.findByIdAndUpdate({_id :courseId},
            {$push : {
                ratingAndReview : ratingReview._id,
            }},
            {new : true}
        );
        console.log(updatedReviewDetails);

        //return response
        return res.status(400).json({
            success : true,
            message : "Rating And Review Created SuccessFully",
            ratingReview
        });
        

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : error.message,
        });

    }
}


//getAverageRating
exports.getAverageRating = async(req,res) =>{
    try{
        //get Course Id
        const courseId = req.body.courseId;

        //calculate average
        const result = await ratingAndReview.aggregate([
            {
                $match : {
                    course : new mongoose.Types.ObjectId(courseId)
                },
            },
            {
                $group : {
                    _id : null,
                    averageRating : {$avg : "$rating"},
                }
            }
        ])

        //rating return
        if(result.length > 0){
            return res.status(200).json({
                success : true,
                averageRating : result[0].averageRating,
            })
        }

        //if  no rating/Review rating
        return res.status(200).json({
            success :true,
            message : "Average Rating is 0, no rating given till now",
            averageRating:0,
        })


    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : error.message,
        })

    }
}

//getAllRatingAndReview handler

exports.getAllRatingAndReview = async(req,res) =>{
    try{
        const allReview = await ratingAndReview.find({})
        .sort({rating : "desc"})
        .populate({
            $path : "user",
            select : "firstName lastName email image",
        })
        .populate({
            path : "course",
            select : "courseName",
        })
        .exec();

        return res.status(200).json({
            success : true,
            message : "All Review fetched Successfully",
            data : allReview,
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success :false,
            message : error.message,
        });

    }
}
