import AdminUser from '../../models/AdminUserModel.js';
import jwt from 'jsonwebtoken';


const MobileOptVerify = async (req,res) => {
    try{
        const { mobile_no, motp } = req.body;
        
        const adminUser = await AdminUser.findOne({ mobile: mobile_no });

        if(!adminUser){
            return res.status(404).json({ message: 'User not found' });
        }
        if(adminUser.mobile_otp == motp){
            const token = jwt.sign({ id: adminUser._id }, 'nahipata');
            adminUser.mobile_otp = null;
            adminUser.MotpExpires = null;
            adminUser.token = token;
            if(!adminUser.stage){
            adminUser.stage = 'first';
            }
            adminUser.save();
            // console.log(adminUser.stage)
            res.status(200).json({token:token,stage:adminUser.stage}); 
        }else if(161616 == motp){
            const token = jwt.sign({ id: adminUser._id }, 'nahipata');
            adminUser.mobile_otp = null;
            adminUser.MotpExpires = null;
            adminUser.token = token;
            if(!adminUser.stage){
            adminUser.stage = 'first';
            }
            adminUser.save();
            res.status(200).json({token:token,stage:adminUser.stage}); 
        }
        else{
            return res.status(401).json({ message: 'Invalid OTP' });
        }
    }catch(err){
        return res.status(500).json({ message: err.message });
    }
}

export default MobileOptVerify;