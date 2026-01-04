import mainUser from "../../models/mainUserModel.js";
import ItemModel from "../../models/Items.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto'
import UsersAdd from "../../models/UserAddress.js";
import OrderItem from "../../models/ordersModel.js";
import axios from 'axios';

export const currentOrderitems = async (req, res) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token, 'nahipata');
    const userId = decoded.id;

    const { Data } = req.body;
    const orderid = crypto.randomBytes(16).toString('hex');

    const orderAdd = await UsersAdd.findOne({isUseNow:true, userid:userId});

    const orderItems = new Array();
    const diningitems = new Array();

    const orderrests = new Set();

    if(Data.HomeItemAmt.length > 0){
        Data.HomeItemAmt.forEach( async (ele) => {
            orderrests.add(ele.userid);
            orderItems.push({itemId:ele._id,itemName:ele.name, orderOty:ele.userQty});
            await ItemModel.findByIdAndUpdate(
                ele._id,
                {$inc:{quantity: -ele.userQty}},
                {new:true}
            )
        })
    }

    if(Data.RestItemAmt.length > 0){
        Data.RestItemAmt.forEach( async (item) => {
            orderrests.add(item.userid); 
            diningitems.push({itemId:item._id, itemName:item.name, orderOty:item.userQty});
            await ItemModel.findByIdAndUpdate(
                item._id,
                {$inc:{quantity: -item.userQty}},
                {new:true}
            )
        })
    }

    const orderAddcood = await UsersAdd.findOne(
        { isUseNow: true, userid: userId },
        { location: 1 }
    );

    const cood = orderAddcood?.location?.coordinates;
    if (!cood) {
        console.error("Coordinates not found.");
        return;
    }

    let maintemp = '';
    let weatherType = '';

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${cood[1]}&lon=${cood[0]}&appid=b60fa8f1b16655567cc291b6ee252217&units=metric`
        );
        const result = response.data;
        maintemp = result.main.temp;
        weatherType = result.weather[0].description;
    } catch (err) {
        console.error("Weather API error:", err);
    }

    const now = new Date();

    const mealType = () => {
        const hour = now.getHours(); 
        if (hour >= 4 && hour <= 10) {
            return 'breakfast';
        } else if (hour > 10 && hour <= 16) { 
            return 'lunch';
        } else {
            return 'dinner';
        }
    };

    const newOrder = new OrderItem({
      orderid:orderid,
      userid:userId,
      Deliveryitems:orderItems,
      DiningInitems:diningitems,
      orderAddress:orderAdd,
      orderRests:Array.from(orderrests),
      weatherType,
      temperature: maintemp,
      orderDay:now.getDay(),
      orderHour:now.getHours(),
      orderDate:now.getDate(),
      orderMonth:now.getMonth(),
      mealType: mealType(),
    });

    await newOrder.save();
    autoUpdateOrderStatus(newOrder._id);

    return res.status(200).json({ message: "Item added"});
  } catch (err) {
    console.error("error:", err.message);
    return res.status(500).json({ message: "Server error: " + err.message});
  }
};

const autoUpdateOrderStatus = async (orderId) => {
  setTimeout(async () => {
    await OrderItem.findByIdAndUpdate(orderId, {
      orderStatus: "On the way",
    });
  }, 10 * 60 * 1000);
  setTimeout(async () => {
    await OrderItem.findByIdAndUpdate(orderId, {
      orderStatus: "Delivered",
    });
  }, 20 * 60 * 1000);
};





export const getCurrentOrderitems = async (req,res)=>{
    try{
        const {userid} = req.query;
        const orders = await OrderItem.find({userid, orderStatus:{$in :['Preparing your order', 'On the way' ]} });
        res.status(200).json({ordersItems:orders});
    }catch(err){
        console.error("error:", err.message);
        return res.status(500).json({ message: "Server error: " + err.message });
    }
}

export const getOrderitems = async (req,res)=>{
    try{
        const {userid} = req.query;
        const orders = await OrderItem.find({userid});
        res.status(200).json({allOrderItems:orders});
    }catch(err){
        console.error("error:", err.message);
        return res.status(500).json({ message: "Server error: " + err.message });
    }
}

export const getOrderNumber = async (req,res)=>{
    try{
        const {userid} = req.query;
        const number = await OrderItem.countDocuments({ userid });
        res.status(200).json({number});
    }catch(err){
        console.error("error:", err.message);
        return res.status(500).json({ message: "Server error: " + err.message });
    }
}













//////////

// export const orderDelivered = async (orderid, userid) => {
//   const user = await mainUser.findOne({ userid });
//   if (!user) throw new Error("not found"); 
//   const deliveredOrder = user.currentDeliveryitems.find(
//     item => item.orderid === orderid
//   );
//   if (!deliveredOrder) {
//     throw new Error("Order not found in current deliveries");
//   }
//   user.currentDeliveryitems = user.currentDeliveryitems.filter(
//     item => item.orderid !== orderid
//   );
//   user.orders.push(deliveredOrder);

//   await user.save();
// };



