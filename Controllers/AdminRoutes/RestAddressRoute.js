import RestAddress from "../../models/RestAddressModel.js";
import AdminUser from '../../models/AdminUserModel.js';

const RestAddressRoute = async (req, res) => {
    try {
        const { fullname, mobileNo, pinCode, locality, fullAddress, city, state, landmark, alternate_phone, userid} = req.body;
        const newRestAddress = new RestAddress({
            Full_name: fullname,
            userid,
            Mobile_no: mobileNo,
            Pincode: pinCode,
            Locality: locality,
            Full_Address: fullAddress,
            City: city,
            State: state,
            Landmark: landmark,
            Alternate_mobile:alternate_phone,
        });
        await newRestAddress.save();
        const adminUser = await AdminUser.findOne({userid:userid});
        adminUser.stage = 'fourth';
        await adminUser.save();
        res.status(200).json({message:'Success'});
    }catch(err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}
 
export default RestAddressRoute;