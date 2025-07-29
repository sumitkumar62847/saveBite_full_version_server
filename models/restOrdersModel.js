import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderData = new Schema({
    weatherType:{type:String},
    temperature:{type:String},
    orderTime:{type:Date},
    orderDay:{type:String},
    mealType:{type:String},
    itemId:{type:String},
    orderQty:{type:Number},
    userid: { type: String},
})
const ordersDetail = mongoose.model('ordersDetail',orderData);

export default ordersDetail;