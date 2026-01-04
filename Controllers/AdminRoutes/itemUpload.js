import express from 'express';
import ItemModel from "../../models/Items.js";
import upload from '../../Middleware/Uploaditem.js';


const router = express.Router();


router.post('/' , upload.array("images", 10) , async (req, res) => {
    try{
        const { item_name, item_id,foodtype,amount,masalaType, price,suitableFor,allergens,ingredients, discount, discription,quantity,userid } = req.body;
        const imageUrl = req.files.map(file => file.path);
        const newItem = new ItemModel({
            item_name,
            item_id,
            foodtype,
            amount,
            masalaType,
            price,
            discount,
            discription,
            quantity:Number(quantity),
            imageUrl,
            userid,
            suitableFor,
            allergens ,
            ingredients
        });
        await newItem.save();
        res.status(200).json({ message: 'Item added successfully' });
    }catch(err){
        console.error(err.message);
        return res.status(500).json({ message: err.message });
    }
});

export default router;