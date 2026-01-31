let mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
})
module.exports = mongoose.model('student',studentSchema);