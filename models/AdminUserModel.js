import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String},
    userid: { type: String},
    mobile: { type: String, required: true , unique: true },
    mobile_otp:{type: String},
    MotpExpires: { type: Date },
    stage: { type: String},
    Email: { type: String},
    token: { type: String,},
    Email_otp: { type: String},
    EotpExpires: { type: Date},
    date: { type: Date, default: Date.now },
})

const AdminUser = mongoose.model('AdminUser', userSchema);

export default AdminUser;