import UsersAdd from "../../models/UserAddress.js";
import mainUser from '../../models/mainUserModel.js';
import jwt from "jsonwebtoken";


const UserAddressRoute = async (req,res)=>{
    try{    
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });
        const decoded = jwt.verify(token, 'nahipata');
        const userId = decoded.id;
        const user = await mainUser.findOne({userid:userId});
        if (!user) return res.status(404).json({ message: "User not found" });
        const {data,position,currentLocation,userid} = req.body;
        const lat = parseFloat(position[0]);
        const lon = parseFloat(position[1]);
        await UsersAdd?.updateMany(
            { userid },
            { $set: { isUseNow: false } }
        );
        const userAdd = new UsersAdd({
            userid,
            Locality:data.houseNo,
            Landmark:data.landmark,
            Delivery_mobile:data.mobileNo,
            Map_Address:currentLocation,
            isUseNow:true,
            location:{
                type:'Point',
                coordinates:[lon,lat]
            }
        })
        await userAdd.save();
        res.status(200).json({ message: 'Address updated successfully'});
    }catch(err){
        return res.status(500).json({ message: err.message });
    }
}
export const setCurrentAdd = async (req,res)=>{
    try{
        const {id,userid} = req.body;
        await UsersAdd?.updateMany(
            { userid },
            { $set: { isUseNow: false } }
        );
        await UsersAdd.findByIdAndUpdate(id,{$set:{isUseNow:true}});
        res.status(200).json({message:'ok'})
    }catch(err){
        return res.status(500).json({ message: err.message });
    }
}


export default UserAddressRoute;