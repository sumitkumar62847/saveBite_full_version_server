import mainUser from '../../models/mainUserModel.js';
import crypto from 'crypto';



export const mainUserLogin = async (req, res) => {
    try{
        const { mobile_no } = req.body;

        const userid = crypto.randomBytes(16).toString('hex');
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        const user = await mainUser.findOne({mobile:mobile_no});
        if(user){
            user.mobile_otp = otp,
            user.MotpExpires = otpExpires,
            await user.save();
            res.status(200).json({message: 'OPT send successfully',userid:user.userid});
        }else{
            const NewAdminUser = new mainUser({
                mobile: mobile_no,
                mobile_otp: otp,
                userid: userid,
                MotpExpires: otpExpires
            });
            await NewAdminUser.save();
            res.status(200).json({message: 'OPT send successfully',userid:userid});
        }
        // await SendMobileOtp(mobile_no, otp);
        
    }catch(err){
        console.log(err.message);
        return res.status(500).json({ message: err.message });
    }
}
