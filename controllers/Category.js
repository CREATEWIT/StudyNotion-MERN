const Category = require("../models/Category");

//Create Tag Handler Function
exports.createCategory = async(req,res) =>{
    try{
        //fetch Data From user
        const {name,description} = req.body;

        //validate the All Field
        if(!name || !description){
            return res.status(400).json({
                success : false,
                message : " All Fields Are Required",
            });
        }

        //Create Entry In DB
        const  categoryDetails = Category.create({
            name : name,
            description : description,
        });
        console.log(tagDetails);

        //return response
        return res.status(200).json({
            success:true,
            message : "Category Is Created Successfully",
        });



    } catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : error.message,
        });
    }
}


// Create getAllCategory handler Function
exports.showAllCategory = async(req,res) =>{
    try{
        //getAll Tags from DB
        const allCategory = await Tag.find({},{name : true, description : true});
        console.log(allCategory);

        //return res
        return res.status(200).json({
            success:true,
            message : "All Tags Fetch Successfully",
            allTags,
        });

    } catch(error){
        return res.status(500).json({
            success : false,
            message : error.message,
        });
    }
}

// CategoryPageDetails Handler
exports.categoryPageDetails = async (req, res) => {
try {
    // Get Category ID
    const { categoryId } = req.body;

    // Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId).populate("courses").exec();

    // Validate category
    if (!selectedCategory) {
        return res.status(404).json({
        success: false,
        message: "Data Not Found",
        });
    }

    // Get courses from different categories
    const differentCategory = await Category.find({
        _id: { $ne: categoryId },
        }).populate("courses").exec();

    // TODO: Calculate top-selling category
    const topEnrolledCategory = await Course.aggregate([
    {
        $project: {
            category: 1,
            enrollmentCount: {
                $size: {
                    $ifNull: ["$studentEnrolled", []]
                }
            }
        }
    },
    {
        $group: {
            _id: "$category",
            totalEnrollments: {
                $sum: "$enrollmentCount"
            }
        }
    },
    {
        $match: {
            totalEnrollments: { $gt: 0 }
        }
    },
    {
        $sort: {
            totalEnrollments: -1
        }
    },
    {
        $limit: 1
    },
    {
        $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "categoryDetails"
        }
    },
    {
        $unwind: "$categoryDetails"
    },
    {
        $project: {
            _id: 0,
            categoryDetails: 1,
            totalEnrollments: 1
        }
    }
]);


    return res.status(200).json({
    success: true,
    data: {
        selectedCategory,
        differentCategory,
        topEnrolledCategory: topEnrolledCategory[0] || null
    }
});} catch (error) {
    console.error("Error in categoryPageDetails:", error);

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        });
    }
};