import AdminUser from '../../models/AdminUserModel.js';
import crypto from 'crypto';



export const AdminUserLogin = async (req, res) => {
    try{
        const { full_name, mobile_no } = req.body;

        const userid = crypto.randomBytes(16).toString('hex');
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        const user = await AdminUser.findOne({mobile:mobile_no});
        if(user){
            user.mobile_otp = otp,
            user.MotpExpires = otpExpires,
            await user.save();
            res.status(200).json({message: 'OPT send successfully',userid:user.userid});
        }else{
            const NewAdminUser = new AdminUser({
                name: full_name,
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

export const AdminUserEmail = async (req, res) => {
    try{
        const {emailAddress,fullname, userid} = req.body;

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);


        const adminUser = await AdminUser.findOne({userid:userid});
        if (!adminUser) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        adminUser.Email = emailAddress;
        adminUser.name = fullname;
        adminUser.Email_otp = otp;
        adminUser.EotpExpires = otpExpires;
        await adminUser.save();
        // await SendEmailOpt(email,otp);
        res.status(200).json({message: 'OPT send successfully'}); 
    }catch(err){
        return res.status(500).json({ message: err.message });
    }
}
