import ItemModel from "../../models/Items.js";

const LiveItem = async (req,res)=>{
    try{
        const {id,ltime} = req.body;
        const item = await ItemModel.findById(id);
        const timeToLive = new Date(Date.now() + ltime*60 * 1000);
        item.LiveUntil = timeToLive;
        item.isLiveed = true;
        await item.save();
        res.status(200).json({message:"item lived"})
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}


export default LiveItem;