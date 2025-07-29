import { orderDelivered } from "../MainRoutes/currentitems.js";

const deliveryTime = (orderid,userid)=>{
    const orderTime = Date.now();
    // --- real deliverytime calculate in future
    let deliverytime = 15;
    const deliveredTime = new Date(orderTime + deliverytime*60*1000);
    const xyz = setInterval(()=>{
        const nowTime = Date.now()
        if((deliveredTime - nowTime) <= 0){
            orderDelivered(orderid,userid);
            clearInterval(xyz);
        }
    },60000)
}   

export default deliveryTime;