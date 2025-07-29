import { getitemsNearMe } from "./getitems.js";
import Fuse from "fuse.js";
const getItemsBySearch = async (req, res)=>{
    try{
        const {searchdata,lon,lat,userid} = req.body;
        const longitude = parseFloat(lon);
        const latitude = parseFloat(lat);

        const FullData = await getitemsNearMe(longitude,latitude,userid);
        const data = FullData?.filter((data)=> data = data != null);

        const rests = new Array();
        const items = new Array();
        data?.forEach(e => {
            rests.push(e?.rest);
            items.push(...e?.items);
        });

        const option = {
            keys:['Restaurant_name'], 
            threshold:0.5,
        }
        const fuse = new Fuse(rests,option);
        const searchRest = fuse.search(searchdata.suggested).map(e => e.item);
        if(searchRest?.length != 0){
            const searchRestId = new Array();
            searchRest.forEach(e=>{ 
                searchRestId.push(e.userid);
            })
            const searchItems = items.filter(e=> searchRestId.includes(e.userid));
            if(searchItems.length != 0){
                const sendData = {search:'rest',searchdata,data};
                const Data = new Array();
                searchRest.forEach(rest =>{
                    const items = searchItems.filter(ele => rest.userid.includes(ele.userid))
                    Data.push({rest,items});
                })
                sendData.data = Data;
                return res.status(200).json(sendData);
            }
            return res.status(200).json({data:'nan'});
        }
        
        if(searchRest.length == 0){
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
            const searchRest = rests.filter(e=> searchItemsId.includes(e.userid));
            if(searchItems.length != 0){
                const sendData = {search:'item',searchdata,data};
                const Data = new Array();
                searchRest.forEach(rest =>{
                    const items = searchItems.filter(ele => rest.userid.includes(ele.userid))
                    Data.push({rest,items});
                })
                sendData.data = Data;
                return res.status(200).json(sendData);
            }
            return res.status(200).json({data:'nan'});
        }
         
    }catch(err){
        console.error('Error:', err);
        return res.status(500).json({ message: err.message });
    }
}

export default getItemsBySearch;