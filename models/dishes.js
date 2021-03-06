const mongoose = require('mongoose')
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose)
const Currency = mongoose.Types.Currency;

const dishSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    featured:{
        type:Boolean,
        default:false
    },
    label:{
        type:String,
        default:''
    },
    price:{
        type:Currency,
        required:true,
        min:0
    }},{
        usePushEach:true,
        timestamps:true
    }
)

module.exports = mongoose.model('Dish',dishSchema)