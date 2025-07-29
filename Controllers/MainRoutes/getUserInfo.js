import mainUser from "../../models/mainUserModel.js";
import jwt from "jsonwebtoken";

const getUserInfo = async (req,res)=>{
    try{
        const token = req.headers.authorization?.split('Bearer ')[1];
        if(!token) return res.status(401).json({message:'Unaothorized'})
        const decoded = jwt.verify(token,'nahipata');
        const userId = decoded.id;
        const userInfo = await mainUser.findOne(
            { userid: userId },
            {
                name: 1,
                userid: 1,
                mobile: 1,
                date: 1,
                profileStatus: 1,
                gender: 1,
                email:1
            }
        );        
        res.status(200).json({userInfo});
    }catch(err){
        return res.status(500).json({ message: err.message });
    }
}
 
export default getUserInfo;

export const createProfile = async (req,res)=>{
    try{
        const {fullname,email,gender,userid} = req.body;
        const user = await mainUser.findOne({userid});
        user.name = fullname;
        user.email = email;
        user.gender = gender;
        user.profileStatus = true;
        await user.save();
        res.status(200).json({message:'Successful'});
    }catch(err){
        return res.status(500).json({ message: err.message });
    }
}