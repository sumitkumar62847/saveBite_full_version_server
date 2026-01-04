import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderid: { type: String},
    userid: { type: String},
    Deliveryitems:{type:Array},
    DiningInitems:{type:Array},
    orderAddress:{type:Object},
    orderRests:{type:Array},
    weatherType:{type:String},
    temperature:{type:String},
    orderHour:{type:String},
    orderMonth:{type:String},
    orderDate:{type:String},
    orderDay:{type:String},
    mealType:{type:String},
    orderStatus:{type:String, enum: ["Preparing your order", "On the way", "Delivered"], default:"Preparing your order"},
    date: { type: Date, default: Date.now },
})

const OrderItem = mongoose.model('orderItems', orderSchema);

export default OrderItem;