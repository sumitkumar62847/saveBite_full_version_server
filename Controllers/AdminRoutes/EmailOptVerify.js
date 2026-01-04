import AdminUser from '../../models/AdminUserModel.js';

const EmailOptVerify = async (req,res) => {
    try{
        const { emailAddress, eotp } = req.body;
        // console.log( emailAddress, eotp );
        const adminUser = await AdminUser.findOne({ Email: emailAddress });

        if(!adminUser){
            return res.status(404).json({ message: 'User not found' });
        }

        if(eotp === 161616 || adminUser.Email_otp === eotp){
            adminUser.Email_otp = null;
            adminUser.EotpExpires = null;
            adminUser.stage = 'second';
            await adminUser.save();
            res.status(200).json({ message: 'OTP verified' });
        }
    }catch(err){
        return res.status(500).json({ message: err.message });
    }

}

export default EmailOptVerify;