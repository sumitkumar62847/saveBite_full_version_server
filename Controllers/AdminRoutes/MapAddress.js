import RestAddress from "../../models/restMapAddress.js";
import AdminUser from '../../models/AdminUserModel.js';


const MapAddressRoute = async (req, res) => {
    try {
        const {position,currentLocation,userid} = req.body;
        const lat = parseFloat(position[0]);
        const lon = parseFloat(position[1]);

        const restAddress = new RestAddress({
            userid,
            Map_Address : currentLocation,
            location:{
                type: 'Point',
                coordinates: [lon, lat]
            }
        })
        await restAddress.save();

        const adminUser = await AdminUser.findOne({userid:userid});
        adminUser.stage = 'fifth';
        await adminUser.save();
        res.status(200).json({ message: 'Map Address updated successfully' });
    }catch(err) {
        return res.status(500).json({ message: err.message });
    }
}

export default MapAddressRoute;