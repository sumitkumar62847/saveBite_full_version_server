import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RestAddressSchema = new Schema({
    userid: {type: "string"},
    Full_name:{type:"string"},
    Mobile_no:{type:"string"},
    Pincode:{type:"string"},
    Locality:{type:"string"},
    Full_Address:{type:"string"},
    City:{type:"string"},
    State:{type:"string"},
    Country:{type:"string", default:"india"},
    Landmark:{type:"string"},
    Alternate_mobile:{type:"string"},
    date: { type: Date, default: Date.now },
});

const RestAddress = mongoose.model('RestAddress', RestAddressSchema);

export default RestAddress;