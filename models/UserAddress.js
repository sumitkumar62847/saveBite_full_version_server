import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UsersAddress = new Schema({
    userid: {type: "string"},
    Locality:{type:"string"},
    Landmark:{type:"string"},
    Map_Address:{type:"string"},
    Delivery_mobile:{type:"string"},
    isUseNow:{type:Boolean},
    location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        }
      },
    date: { type: Date, default: Date.now },
});

const UsersAdd = mongoose.model('UsersAddress', UsersAddress);

export default UsersAdd;
