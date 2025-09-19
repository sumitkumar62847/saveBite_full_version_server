import mongoose from "mongoose";
import { type } from "os";

const Schema = mongoose.Schema;

const orderData = new Schema({
    weatherType:{type:String},
    temperature:{type:String},
    orderHour:{type:String},
    orderMonth:{type:String},
    orderDate:{type:String},
    orderDay:{type:String},
    mealType:{type:String},
    itemId:{type:String},
    orderQty:{type:Number},
    userid: { type: String},
})
const ordersDetail = mongoose.model('ordersDetails',orderData);

export default ordersDetail;

