const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const favSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    dishes:[{
        type:Schema.Types.ObjectId,
        ref:'Dish'
    }]
},{
    timestamps:true,
    usePushEach:true
})

module.exports = mongoose.model('Favourite',favSchema)
