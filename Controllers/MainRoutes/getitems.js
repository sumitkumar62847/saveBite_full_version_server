import mongoose from 'mongoose';
import ItemModel from "../../models/Items.js";
import RestAddress from "../../models/restMapAddress.js";
import restDetail from "../../models/RestDetailModel.js";
import mainUser from '../../models/mainUserModel.js';

mongoose.connection.on('open', () => {
    RestAddress.collection.createIndex({ location: '2dsphere' }, (err, result) => {
      if (err) {
        console.log('Error creating index:', err);
      } else {
        console.log('2dsphere index created:', result);
      }
    });
  });

  export const getitemsNearMe = async (longitude,latitude, userid)=>{
    const radiusInMeters = 5000;

    if (isNaN(longitude) || isNaN(latitude)) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }

    const nearRestaurants = await RestAddress.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude] 
          },
          $maxDistance: radiusInMeters
        }
      }
    }).select('userid');
  

    const results = await Promise.all(
      nearRestaurants.map(async (restaurant) => {
        const restdetail = await restDetail.findOne({
          userid: restaurant.userid,
        });
        const items = await ItemModel.find({
          userid: restaurant.userid,
          isLiveed: true,
        });
        const user = await mainUser.findOne({
          userid:userid
        })
        const finalItems = items?.map(item => {
          const incart = user?.cart?.some(I => I._id == item._id);
          return incart ? {...item.toObject(), inCart: true} : item ;
      })
        if(items.length != 0){
          return {
            rest:restdetail,
            items:finalItems,
          };
        }else{
          return null;
        }
      })
    );
    return results
  }

const getitems = async (req, res) => {
  try {
    const { lon, lat,userid} = req.query;
    const longitude = parseFloat(lon);
    const latitude = parseFloat(lat);
    
    const FullData = await getitemsNearMe(longitude,latitude, userid);

    const Datas = FullData?.filter((data)=> data = data != null);
    if (!FullData.length) return res.status(200).json({ message: 'No nearby restaurants', data: [] });
    return res.status(200).json(Datas);
    
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: err.message }); 
  }
};

export default getitems;    