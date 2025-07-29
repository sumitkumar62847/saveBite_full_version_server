import mongoose from "mongoose";

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    foodtype:{type:String},
    suitableFor:[String],
    item_name:{type:String},
    price:{type:String},
    discount:{type:String},
    discription:{type:String},
    imageUrl:[String],
    quantity:{type:Number},
    amount:{type:Number},
    masalaType:{type:String},
    allergens:[String],
    ingredients:[Object],
    rating:{type:Number},
    userid:{type:String},
    order:{type:Number ,default:0},
    sold:{type:Number , default:0},
    isLiveed:{type:Boolean, default:false},
    LiveUntil:{type:Date},
})

const ItemModel = mongoose.model('Items', itemSchema);

export default ItemModel;