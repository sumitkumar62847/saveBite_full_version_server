import RestDetail from "../../models/RestDetailModel.js";
import ItemModel from "../../models/Items.js";

import { getitemsNearMe } from "./getitems.js";
import Fuse from "fuse.js";
import { searchByAi } from "../SearchByAi/filterItem.js";
import mainUser from "../../models/mainUserModel.js";
const getItemsBySearch = async (req, res)=>{
    try{
        const {searchdata,lon,lat,userid} = req.body;
        const longitude = parseFloat(lon);
        const latitude = parseFloat(lat);

        const Restaurents = await RestDetail.find();
        const Items = await ItemModel.find();


        const FullData = await getitemsNearMe(longitude,latitude,userid);
        const data = FullData?.filter((data)=> data = data != null);

        const items = new Array();
        data?.forEach(e => {
            items.push(...e?.items);
        });

        const option = {
            keys:['Restaurant_name'], 
            threshold:0.5,
        }
        const fuse = new Fuse(Restaurents,option);
        const searchRests = fuse.search(searchdata.suggested).map(e => e.item);

        const option01 = {
            keys:['item_name'], 
            threshold:0.5,
        }
        const fuse01 = new Fuse(items , option01);

        const searchItems = fuse01.search(searchdata.suggested).map(e => e.item);

        if(searchItems?.length == 0 && searchRests?.length == 0){
            const data = await searchByAi(searchdata,items);
            if(data){
                const sendData = {search:'ai',searchdata,data};
                console.log(sendData);
                return res.status(200).json(sendData);
            }else{
                return res.status(200).json({data:'error in Ai'}); 
            }
            
        }else{
            if(searchRests?.length != 0){
                const searchRestId = new Array();
                searchRests.forEach(e=>{ 
                    searchRestId.push(e.userid);
                })
                const searchItems = items.filter(e=> searchRestId.includes(e.userid));
                const user = await mainUser.findOne({
                    userid:userid
                    })
                const finalItems = searchItems?.map(item => {
                        const incart = user?.cart?.some(I => I._id == item._id);
                        return incart ? {...item.toObject(), inCart: true} : item ;
                    })
                if(searchItems.length != 0){
                    const sendData = {search:'rest',searchdata,data};
                    const Data = new Array();
                    searchRests.forEach(rest =>{
                        const items = finalItems.filter(ele => rest.userid.includes(ele.userid))
                        
                        Data.push({rest,items});
                    })
                    sendData.data = Data;
                    return res.status(200).json(sendData);
                }
                return res.status(200).json({data:'Restnan'});
            }else{
                const option = {
                    keys:['item_name'],
                    threshold:0.5,
                }
                const fuse = new Fuse(items,option);
                const searchItems = fuse.search(searchdata.suggested).map(i => i.item);

                const searchItemsId = new Array();
                searchItems.forEach(e=>{
                    searchItemsId.push(e.userid);
                })

                const searchRest = Restaurents.filter(e=> searchItemsId.includes(e.userid));
                const sendData = {search:'item',searchdata,data};
                const Data = new Array();
                searchRest.forEach(rest =>{
                    const items = searchItems.filter(ele => rest.userid.includes(ele.userid))
                    Data.push({rest,items});
                });

                sendData.data = Data;
                return res.status(200).json(sendData);
            }
        }

        
         
    }catch(err){
        console.error('Error:', err);
        return res.status(500).json({ message: err.message });
    }
}

export default getItemsBySearch;