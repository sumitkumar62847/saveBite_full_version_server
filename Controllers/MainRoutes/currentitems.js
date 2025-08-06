import mainUser from "../../models/mainUserModel.js";
import ItemModel from "../../models/Items.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto'
import UsersAdd from "../../models/UserAddress.js";
import deliveryTime from "../Sockets/delivery.js";
import { restItemWithDetail } from "../AdminRoutes/restOrdersDetails.js";

export const currentOrderitems = async (req, res) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token, 'nahipata');
    const userId = decoded.id;
    const user = await mainUser.findOne({userid:userId});
    if (!user) return res.status(404).json({ message: "User not found" }); 
    const { Data } = req.body;
    const orderid = crypto.randomBytes(16).toString('hex');

    const orderAdd = await UsersAdd.findOne({isUseNow:true, userid:userId});

    const orderItems = new Array();
    const restAddresses = new Set();

    if(Data.HomeItemAmt.length > 0){
        Data.HomeItemAmt.forEach( async (ele) => {
            restAddresses.add(ele.userid);
            orderItems.push({itemId:ele._id,userid:ele.userid,orderOty:ele.userQty});
            await ItemModel.findByIdAndUpdate(ele._id,{$inc:{quantity: -ele.userQty}},{new:true})
        })
        user.currentDeliveryitems.push({orderid,items:Data.HomeItemAmt,orderAdd,restAdds:Array.from(restAddresses)});
        deliveryTime(orderid,userId);
        await user.save();
    }

    const restAddress = new Set();

    if(Data.RestItemAmt.length > 0){
        Data.RestItemAmt.forEach( async (item) => {
            restAddress.add(item.userid);
            orderItems.push({itemId:item._id,userid:item.userid,orderOty:item.userQty});
            await ItemModel.findByIdAndUpdate(
                item._id,
                {$inc:{quantity: -item.userQty}},
                {new:true}
            )
        })
        
        user.currentDiningInitems.push({orderid,items:Data.RestItemAmt,restAdds:Array.from(restAddress)});
        await user.save();
    }

    restItemWithDetail(orderItems);
    return res.status(200).json({ message: "Item added"});
  } catch (err) {
    console.error("error:", err.message);
    return res.status(500).json({ message: "Server error: " + err.message});
  }
};

export const getCurrentOrderitems = async (req,res)=>{
    try{
        const {userid} = req.query;
        const user = await mainUser.findOne({userid});
        const currentDeliveryitems = user?.currentDeliveryitems;
        const currentDiningInitems = user?.currentDiningInitems;
        if(currentDeliveryitems.length > 0 && currentDiningInitems.length > 0){
            res.status(200).json({deliveryitems:currentDeliveryitems,diningitems:currentDiningInitems});
        }else if(currentDeliveryitems.length > 0 && currentDiningInitems.length == 0){
            res.status(200).json({deliveryitems:currentDeliveryitems,diningitems:null});
        }else if(currentDeliveryitems.length == 0 && currentDiningInitems.length > 0){
            res.status(200).json({deliveryitems:null,diningitems:currentDiningInitems});
        }else{
            res.status(200).json({deliveryitems:null,diningitems:null});
        }
    }catch(err){
        console.error("error:", err.message);
        return res.status(500).json({ message: "Server error: " + err.message });
    }
}


export const orderDelivered = async (orderid, userid) => {

    const user = await mainUser.findOne({ userid });
    if (!user) throw new Error("not found");

    const deliveredOrder = await user.currentDeliveryitems.findOne(item => item.orderid === orderid);

    user.currentDeliveryitems = user.currentDeliveryitems.filter(item => item.orderid !== orderid);

    user.orders.push(deliveredOrder);
    await user.save();

};


