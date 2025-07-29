import ItemModel from "../../models/Items.js";
import mainUser from "../../models/mainUserModel.js";
import RestAddress from "../../models/RestAddressModel.js";
import RestDetail from "../../models/RestDetailModel.js";
const getitem = async (req,res)=>{
    try{
        const {userid,itemId} = req.query;
        const item = await ItemModel.findById(itemId);
        const user = await mainUser.findOne({
          userid:userid
        })
        const restDetail = await RestDetail.findOne({
            userid:item.userid
        })
        const restaddress = await RestAddress.findOne({
            userid:item.userid
        })
        const incart = user?.cart?.some(I => I._id == item._id);
        if(incart){
            return res.status(200).json({item:{...item.toObject(),inCart: true,rest:restDetail,address:restaddress}});
        }else{
            return res.status(200).json({item:{...item.toObject(),rest:restDetail,address:restaddress}})
        }
    }catch(err){
        console.error("Error: ",err);
        return res.status(500).json({ message: err.message }); 
    }

}
export default getitem;