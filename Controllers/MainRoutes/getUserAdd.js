import UsersAdd from "../../models/UserAddress.js";

const getUserAddress = async (req,res)=>{
    try{
        const {userid} = req.query;
        const Addressess = await UsersAdd.find({userid});
        res.status(200).json({AddData:Addressess});
    }catch(err){
        return res.status(500).json({ message: err.message });
    }
}

export default getUserAddress;

export const removeUserAddress = async (req,res)=>{
    try{
        const {id} = req.query;
        const Address = await UsersAdd.findByIdAndDelete(id);
        res.status(200).json({id});
    }catch(err){
        return res.status(500).json({ message: err.message });
    }
}
