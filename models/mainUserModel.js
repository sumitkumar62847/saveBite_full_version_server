import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String},
    userid: { type: String},
    mobile: { type: String, required: true , unique: true },
    mobile_otp:{type: String},
    MotpExpires: { type: Date },
    stage: { type: String},
    email: { type: String},
    token: { type: String,},
    date: { type: Date, default: Date.now },
    profileStatus:{type:Boolean,default:false},
    gender:{type:String},
    cart:{type:Array, default:[]},
})

const mainUser = mongoose.model('MainSBUserrr', userSchema);

export default mainUser;