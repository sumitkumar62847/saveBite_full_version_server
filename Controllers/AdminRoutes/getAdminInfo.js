import AdminUser from "../../models/AdminUserModel.js";

const getAdminInfo = async (req, res) => {
    const {userid} = req.query;
    try{
        const userInfodb = await AdminUser.find({userid});
        res.status(200).json(userInfodb[0]);
    }catch(err){
        res.status(500).json({message: err.message});

    }

}

export default getAdminInfo;