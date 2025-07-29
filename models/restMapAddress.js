import mongoose from "mongoose";
const Schema = mongoose.Schema;

const MapRestAddress = new Schema({
    userid: {type: "string"},
    Map_Address:{type:"string"},
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

const MapRestAdd = mongoose.model('RestMapAddress', MapRestAddress);

export default MapRestAdd;