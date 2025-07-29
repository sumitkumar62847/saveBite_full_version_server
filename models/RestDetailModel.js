import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RestDetailSchema = new Schema({
    Restaurant_name:{type:"string"},
    Owner_name:{type:"string"},
    Mobile_no:{type:"string"},
    Fssai_no:{type: "string" , unique: true},
    isVerified:{type:"boolean", default: false},
    userid:{type:"string"},
    date: { type: Date, default: Date.now },
});

const RestDetail = mongoose.model('RestDetail', RestDetailSchema);

export default RestDetail;