import RestDetail from "../../models/RestDetailModel.js";
import AdminUser from '../../models/AdminUserModel.js';

const RestDetailRoute = async (req, res) => {
    try {
        const {rest_name, owner_name, rest_mobile_no, fssai_no,userid} = req.body;

        const newRestDetail = new RestDetail({
            Restaurant_name:rest_name,
            Owner_name:owner_name,
            userid,
            Mobile_no:rest_mobile_no,
            Fssai_no:fssai_no,
        });
        await newRestDetail.save();
        const adminUser = await AdminUser.findOne({userid:userid});
        adminUser.stage = 'thrid';
        await adminUser.save();
        res.status(200).json({message:'OK'});
    }catch(err) {
        return res.status(500).json({ message: err.message });
    }
};

export default RestDetailRoute;