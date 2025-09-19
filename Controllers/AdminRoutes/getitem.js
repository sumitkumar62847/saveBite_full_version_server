import ItemModel from "../../models/Items.js";


const Admingetitem = async (req, res) =>{
    try{
        const {userid} = req.query;
        const items = await ItemModel.find({userid}); 
        return res.status(200).json({items});
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

export const getEditItem = async (req, res) =>{
     try{
        const {itemid} = req.query;
        const items = await ItemModel.findOne({_id:itemid}); 
        return res.status(200).json({items});
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

export const UpdataItem = async (req,res) =>{
    const { data } = req.body;
    const itemId = data._id;
    const newItem = {
        foodtype:data.foodtype,
        suitableFor:data.suitableFor,
        item_name: data.item_name,
        price:data.price,
        discount:data.discount,
        quantity:data.quantity,
        amount:data.amount,
        masalaType: data.masalaType,
        ingredients: data.ingredients,
        description: data.description
    }
    const updateditem = await ItemModel.findByIdAndUpdate(
      itemId,
      { $set: newItem },
      { new: true }
    );
    if (!updateditem) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updateditem);
}


export default Admingetitem;