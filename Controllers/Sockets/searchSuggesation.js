import RestDetail from "../../models/RestDetailModel.js";
import ItemModel from "../../models/Items.js";

const suggestionSocket = (socket)=>{
    socket.on('search', async (query)=> {
        if(!query) return;

        const regex = new RegExp(query,'i');
        try{
            const [restaurants, items] = await Promise.all([
                RestDetail.find({Restaurant_name: regex}).select('Restaurant_name').limit(5),
                ItemModel.find({item_name: regex}).select('item_name').limit(5)
            ]);
            socket.emit('suggestions',{restaurants, items});
        }catch(err){
            console.log(err);
            socket.emit('suggestions', {restaurants:[], items:[]})
        }
    });
    socket.on('disconnected', ()=>{
        console.log('socket disconnected');
    })
};

export default suggestionSocket;