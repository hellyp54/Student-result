var mongoose= require('mongoose');
const resultschema = new mongoose.Schema({
    name:{
        type:String
    },
    mark1:{
        type:String
    },
    mark2:{
        type:String
    },
    mark3:{
        type:String
    },
    total:{
        type:String
    },
    percentage:{
        type:String
    },
    grade:{
        type:String
    },
    result:{
        type:String
    },
})
module.exports = mongoose.model('result',resultschema);