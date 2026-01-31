const { name } = require('ejs');
var admin=require('../model/admin_model');
var result=require('../model/result_model');
var student=require('../model/student_model');
const storage=require('node-persist');
storage.init();

exports.register=async (req,res)=>{
    var data= await admin.create(req.body);
    res.status(200).json({
        success:'true',
        message:'Regiser Successfully',
        data
    })
}

exports.login = async (req,res)=>{
    try {
                var data = await admin.find({email:req.body.email});
                let userid = await storage.getItem('userid');
                console.log('userid == ', userid);
                if (userid == undefined) {
                    if (data.length != 0) {
                        if (req.body.password == data[0].password) {
                            await storage.setItem('userid', data[0]._id)
                            res.status(200).json({
                                success: true,
                                message: "User Login Successfully"
                            })
                        }
                        else {
                            res.status(404).json({
                                success:false,
                                message:'Invalid email and password'
                            })
                        }
                    }
                    else {
                        res.status(404).json({
                            success:false,
                            message:'Invalid email and password'
                        })
                    }
                }
                else {
                    res.status(200).json({
                            success:false,
                            message:'Please first logout'
                        })
                }
        
        
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message,
                })
        }
}

exports.add_student = async(req,res)=>{
    let data=await student.create(req.body);
    res.status(200).json({
        success:true,
        message:"Student Added Succesfully",
        data
    })
}
exports.view_student= async(req,res)=>{
    let data=await student.find();
    res.status(200).json({
        success:true,
        message:"Students List",
        data
    })
}

exports.update_student = async(req,res)=>{
    let data=await student.findByIdAndUpdate(req.params.id,req.body);
    res.status(200).json({
        success:true,
        message:`Data Updated Sucessfully `,
        data
    })
}

exports.delete_student = async(req,res)=>{
    let data= await student.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success:true,
        message:`Data Deleted Sucessfully `,
        data
    })
}

exports.add_result = async (req, res) => {

        const { name, mark1, mark2, mark3 } = req.body;

        if (!name || mark1 == null || mark2 == null || mark3 == null) {
            return res.status(400).json({
                success: false,
                message: "Name and marks for all subjects are required"
            });
        }

        const total = Number(mark1) + Number(mark2) + Number(mark3);
        const percentage = (total / 300) * 100;

        let grade;
        if (percentage >= 90) grade = "A+";
        else if (percentage >= 80) grade = "A";
        else if (percentage >= 70) grade = "B";
        else if (percentage >= 60) grade = "C";
        else if (percentage >= 50) grade = "D";
        else grade = "F";

        let resultStatus = (mark1 >= 33 && mark2 >= 33 && mark3 >= 33) ? "Pass" : "Fail";

        // Save to DB
        const data = await result.create({
            name,
            mark1,
            mark2,
            mark3,
            total,
            percentage: percentage.toFixed(2), // limit decimal points
            grade,
            result: resultStatus
        });

        res.status(200).json({
            success: true,
            message: "Result Data Added Successfully",
            data
        });    
};

exports.view_result= async(req,res)=>{
    let data=await result.find();
    res.status(200).json({
        success:true,
        message:"Student Result",
        data
    })
}

exports.update_result = async (req, res) => {
    try {
        const { mark1, mark2, mark3 } = req.body;

        // Ensure marks are provided
        if (mark1 == null || mark2 == null || mark3 == null) {
            return res.status(400).json({
                success: false,
                message: "Marks for all subjects are required"
            });
        }

        // Recalculate values
        const total = Number(mark1) + Number(mark2) + Number(mark3);
        const percentage = (total / 300) * 100;

        let grade;
        if (percentage >= 90) grade = "A+";
        else if (percentage >= 80) grade = "A";
        else if (percentage >= 70) grade = "B";
        else if (percentage >= 60) grade = "C";
        else if (percentage >= 50) grade = "D";
        else grade = "F";

        let resultStatus = (mark1 >= 33 && mark2 >= 33 && mark3 >= 33) ? "Pass" : "Fail";

        // Update only marks and recalculated fields
        const updatedData = await result.findByIdAndUpdate(
            req.params.id,
            {
                mark1,
                mark2,
                mark3,
                total,
                percentage: percentage.toFixed(2),
                grade,
                result: resultStatus
            },
            { new: true } // return updated document
        );

        if (!updatedData) {
            return res.status(404).json({
                success: false,
                message: "Result not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Result updated successfully",
            data: updatedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating result",
            error: error.message
        });
    }
};

exports.delete_result = async (req, res) => {
    let data = await result.findByIdAndDelete(req.params.id);

    if (!data) {
        return res.status(404).json({
            success: false,
            message: "Result not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Result deleted successfully",
        data
    });
};
exports.top3 = async (req, res) => {
    let data = await result.find().sort({ percentage: -1 }).limit(3);

    if (!data.length) {
        return res.status(404).json({
            success: false,
            message: "No results found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Top 3 Students",
        data
    });
};

exports.logout= async (req,res)=>{
    try{
            await storage.clear();
            res.status(200).json({
                success:true,
                message:'Logout Successfully'
            })
    
        }catch(error){
            res.status(500).json({
                success:false,
                message:error.message
            })
    }
};