import ItemModel from "../../models/Items.js";

const deleteItem = async (req,res)=>{
    try{
        const {id} = req.query;
        const deleteditem = await ItemModel.deleteOne({_id:id});
        res.status(200).json({deleteditem});
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

export default deleteItem;