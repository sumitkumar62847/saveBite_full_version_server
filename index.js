import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import {AdminUserLogin, AdminUserEmail} from './Controllers/AdminRoutes/NewUserLogin.js';
import MobileOptVerify from './Controllers/AdminRoutes/MobileOptVerify.js';
import EmailOptVerify from './Controllers/AdminRoutes/EmailOptVerify.js'
import RestDetailRoute from './Controllers/AdminRoutes/RestDetail.js';
import RestAddressRoute from './Controllers/AdminRoutes/RestAddressRoute.js';
import MapAddressRoute from './Controllers/AdminRoutes/MapAddress.js';
import getAdminInfo from './Controllers/AdminRoutes/getAdminInfo.js';
import ItemRoute from './Controllers/AdminRoutes/itemUpload.js';
import dotenv from 'dotenv';
import ItemModel from './models/Items.js';
import Admingetitem, { getEditItem, UpdataItem } from './Controllers/AdminRoutes/getitem.js';
import deleteItem from './Controllers/AdminRoutes/deleteitem.js';
import LiveItem from './Controllers/AdminRoutes/Liveitem.js';
import getRestInfo from './Controllers/AdminRoutes/getRestInfo.js';
import getRestAddressInfo from './Controllers/AdminRoutes/getRestAddressInfo.js';
import { mainUserLogin } from './Controllers/MainRoutes/userLogin.js';
import MOptVerify from './Controllers/MainRoutes/mOtpVerify.js';
import getitems from './Controllers/MainRoutes/getitems.js'
import { LoginUser } from './Controllers/MainRoutes/Loginuser.js';
import suggestionSocket from './Controllers/Sockets/searchSuggesation.js';
import getItemsBySearch from './Controllers/MainRoutes/getBySearch.js';
import addtocart from './Controllers/MainRoutes/addToCart.js';
import getCartItems from './Controllers/MainRoutes/getCartItem.js';
import removeItemByCart from './Controllers/MainRoutes/removeItemByCart.js';
import mainUser from './models/mainUserModel.js';
import getitem from './Controllers/MainRoutes/getItem.js';
import UserAddressRoute, { setCurrentAdd } from './Controllers/MainRoutes/UsersAddRoute.js';
import payOrder from './Controllers/PaymentGateWay/paymentOrder.js'
import payverify from './Controllers/PaymentGateWay/paymentVerify.js';
import getUserAddress, { removeUserAddress } from './Controllers/MainRoutes/getUserAdd.js';
import getUserInfo, { createProfile } from './Controllers/MainRoutes/getUserInfo.js';
import { currentOrderitems, getCurrentOrderitems, getOrderitems, getOrderNumber } from './Controllers/MainRoutes/currentitems.js';
import restAddesses from './Controllers/MainRoutes/restAddresses.js';
import { mlPrediction } from './Controllers/MainRoutes/Mlprediction.js';
import OrderItem from './models/ordersModel.js';


dotenv.config(); 
const app = express();
const server = http.createServer(app); 

export const io = new Server(server,{
  cors: {origin:[process.env.FRONTA, process.env.FRONTB]}
})

io.on('connection', (socket) => {
  suggestionSocket(socket);
});

const PORT = process.env.SERVER_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: [process.env.FRONTA, process.env.FRONTB]})); 


mongoose.connect(process.env.MONGOURL,{
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// ----Admin-----------------
app.get('/admininfo',getAdminInfo);
app.get('/restinfo',getRestInfo);
app.get('/restaddressinfo',getRestAddressInfo); 
app.get('/adminitems', Admingetitem);
app.get('/getedititem', getEditItem);


app.delete('/adminitemdelete',deleteItem);

app.patch('/updataitem',UpdataItem);

app.use('/itemupload',ItemRoute); 


app.post('/prediction', mlPrediction);
app.post('/AdminLogin', AdminUserLogin);
app.post('/emailverify', AdminUserEmail);
app.post('/otpmverify', MobileOptVerify);
app.post('/otpeverify', EmailOptVerify);
app.post('/restdetail', RestDetailRoute);
app.post('/restaddress', RestAddressRoute);
app.post('/mapaddress', MapAddressRoute);
app.post('/itemlive',LiveItem);


//------main--------------------
app.get('/getitems',getitems);
app.get('/getitem',getitem);
app.get('/getCartItems',getCartItems);
app.get('/getuseradd', getUserAddress);
app.get('/userInfo',getUserInfo);
app.get('/crtitems',getCurrentOrderitems);
app.get('/ordereditems',getOrderitems);
app.get('/orderedNbr', getOrderNumber )

app.delete('/CartItemDelete', removeItemByCart);
app.delete('/deleteAdd',removeUserAddress);

app.use('/api',payOrder);
app.use('/api',payverify);

app.post('/useraddset', UserAddressRoute);
app.post('/login', LoginUser);
app.post('/mainLogin', mainUserLogin);
app.post('/otpverify', MOptVerify);
app.post('/getSitems',getItemsBySearch);
app.post('/addtocart', addtocart); 
app.post('/createprofile',createProfile);
app.post('/CrtOrderitems',currentOrderitems);
app.post('/setAdd',setCurrentAdd);
app.post('/restaddresses',restAddesses);



setInterval( async () => {
  const now = new Date();
  try {
    const expiredItems = await ItemModel.find({
      isLiveed:true, LiveUntil: {$lte:now}
    })
    const orders = await OrderItem.find({
      orderStatus: { $ne: "Delivered" }
    });
    if(expiredItems.length > 0){
      const expiredIds = expiredItems.map(item => item._id.toString());
      await ItemModel.updateMany(
          { _id:{$in:expiredIds}},
          { $set: { isLiveed: false, LiveUntil: null } }
      );
      const result = await mainUser.updateMany(
        {},
        {
          $pull: { cart: { _id: { $in:expiredIds} } }
        }
      );
    }



    for (const order of orders) {
      const diffMinutes = Math.floor(
        (now.getTime() - order.date.getTime()) / 60000
      );

      let newStatus = order.orderStatus;

      if (diffMinutes >= 20) {
        newStatus = "Delivered";
      } else if (diffMinutes >= 10) {
        newStatus = "On the way";
      }

      if (newStatus !== order.orderStatus) {
        await OrderItem.updateOne(
          { _id: order._id, orderStatus: { $ne: newStatus } },
          { $set: { orderStatus: newStatus } }
        );
      }
    }

  } catch (err) {
      console.error("Error", err.message);
  }
},1000);



server.listen(PORT, () => {
  // console.log(process.uptime());
  console.log(`Server running on port ${PORT}`)
}); 