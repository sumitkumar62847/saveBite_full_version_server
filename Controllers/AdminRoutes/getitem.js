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

export default Admingetitem;