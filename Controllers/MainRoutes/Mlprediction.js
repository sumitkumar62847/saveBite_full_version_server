import axios from "axios";
import ItemModel from "../../models/Items.js";

export const mlPrediction = async (req, res)=>{
    const {Restaurant_name,restaurant_ID, weather, season, meal, day} = req.body;
    try{
        console.log(Restaurant_name,restaurant_ID, weather, season, meal, day);

        const data = {
                "restaurant_id": restaurant_ID,
                "weather": weather,
                "season": season,
                "meal": meal,
                "day": day
        };
        const respone = await axios.post('https://savebite-ml-model.onrender.com/recommend',data);
        const responeData = respone.data;
        console.log(responeData);
        console.log('respone' +  respone); 

        const items_ml = await ItemModel.find({
            item_id:{$in: responeData.recommended_items}
        })
        console.log(items_ml);
        return res.status(200).json({items_ml});
        
    }catch(err){
        res.status(500).json({message: err.message});
    }
}