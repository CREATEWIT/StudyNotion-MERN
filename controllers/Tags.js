const Tag = require("../models/tags");

//Create Tag Handler Function
exports.createTags = async(req,res) =>{
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
        const  tagDetails = Tag.create({
            name : name,
            description : description,
        });
        console.log(tagDetails);

        //return response
        return res.status(200).json({
            success:true,
            message : "Tag Is Created Successfully",
        });



    } catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : error.message,
        });
    }
}


// Create getAllTags handler Function
exports.showAllTags = async(req,res) =>{
    try{
        //getAll Tags from DB
        const allTags = await Tag.find({},{name : true, description : true});
        console.log(getAllTags);

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