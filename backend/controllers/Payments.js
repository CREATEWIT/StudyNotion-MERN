const { instance } = require("../config/razorpay")
const User = require("../models/User");
const Course = require("../models/Course")
const mailSender = require("../utils/mailSender")
const mongoose = require("mongoose");
const crypto = require("crypto");

//capture Payment and initiate the Razorpay
exports.capturePayments  = async(req,res) =>{
    try{
        //get CourseId and UserId
        const {course_Id} = req.body;
        const userId = req.user.id;

        //validation  course_Id
        if(!course_Id){
            return res.status(400).json({
                success : false,
                message : "please provide valid courseId",
            });
        }

        let course;
        try{
            course = await Course.findById(course_Id);
            if(!course){
                return res.status(400).json({
                    success : false,
                    message : "could not find the course",
                });
            }

            //user already pay for the same course
            const uId = new mongoose.Types.Schema.ObjectId(userId);
            if(course.studentEnrolled.includes(uId)){
                return res.status(200).json({
                    success : false,
                    message : "Student is Already enrolled the course",
                });
            }
        }catch(error){
            console.error(error);
            return res.status(500).json(
                {
                    success : false,
                    message : error.message,
            }
            );
        }

        //order create
        const amount = course.price;
        const currency = "INR"
        
        const options = {
            amount:  amount * 100,
            currency,
            receipt : Math.random(Date.now()).toString(),
            notes : {
                courseId : course_Id,
                userId,
            }
        };
        try{
            //initiate the payment using razorpay
            const PaymentsRazorpay = await instance.orders.create(options);
            console.log(PaymentsRazorpay);

            //return response
            return res.status(200).json({
                success : true,
                courseName : course.courseName,
                courseDetails : course.courseDetails,
                thumbnail : course.thumbnail,
                orderId : paymentResponse._id,
                payment : paymentResponse.Amount,
                Currency : paymentResponse.Currency,
            });


        }catch(error){
            return res.json({
                success :false,
                message : "order could not initiate",
            });
        }

    }catch(error){
        return res.status(500).json({
            success : false,
            message : error.message,
        });

    }
}


//VerifySignature of RazorPay and Server
exports.verifySignature = async(req,res) =>{
    const webhookSecrete = "123456678"
    const signature = req.header["x-razorpay-signature"];

    const shasum  = crypto.createHmac("sha256",webhookSecrete);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature == digest){
        console.log("Payment is Authorized");

        const {courseId , userId} = req.body.payload.payment.entity.notes;

        try{
            //find the course and enroll the student in it
            const enrolledCourse = await Course.findByIdAndUpdate({_id:courseId},
                {$push : {
                    studentEnrolled : userId
                }},
                {new : true},
            );

            if(!enrolledCourse){
                return res.status(400).json({
                    success : false,
                    message : "Course not Found",
                });
            }

            console.log(enrolledCourse);

            //find the student and add the course to their list enrolled course
            const enrolledStudent = await User.findByIdAndUpdate({_id : userId},
                {$push : {
                    courses : courseId
                }},
                {new : true}
            );

            console.log(enrolledStudent)

            //mail send kardo confirmation wala
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Congratulation, you are onboarded into new learnMeet Course ",
            );

            console.log(emailResponse);
            return res.status(200).json({
                success : true,
                message : "Signature Verify successFull Course Added to Student",
            });

        }catch(error){
            console.log(error);
            return res.status(500).json({
                success : false,
                message : error.message,
            });

        }

    }
    else {
        return res.status(400).json({
            success : false,
            message : "Invalid Request",
        });

    }

};