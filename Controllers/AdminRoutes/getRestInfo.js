import RestDetail from "../../models/RestDetailModel.js";

const getRestInfo = async (req, res) => {
    const {userid} = req.query;
    try{
        const restInfo = await RestDetail.findOne({userid});
        res.status(200).json(restInfo);
    }catch(err){
        res.status(500).json({message: err.message});

    }

}

export default getRestInfo;