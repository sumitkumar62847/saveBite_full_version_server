import RestAddress from "../../models/RestAddressModel.js";

const getRestAddressInfo = async (req, res) => {
    const {userid} = req.query;
    try{
        const restAddressInfo = await RestAddress.find({userid});
        res.status(200).json(restAddressInfo[0]);
    }catch(err){
        res.status(500).json({message: err.message});

    }

}

export default getRestAddressInfo;