import axios from 'axios';
import UsersAdd from '../../models/UserAddress.js';
import ordersDetail from '../../models/restOrdersModel.js';

export const restItemWithDetail = async (orderItemsObj) => {
    // console.log(orderItemsObj);


    const orderAdd = await UsersAdd.findOne(
        { isUseNow: true, userid: orderItemsObj.orderuserid },
        { location: 1 }
    );

    const cood = orderAdd?.location?.coordinates;
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

    for (const item of orderItemsObj.items || []) {
        const newOrderDetail = new ordersDetail({
            weatherType,
            temperature: maintemp,
            orderDay:now.getDay(),
            orderHour:now.getHours(),
            orderDate:now.getDate(),
            orderMonth:now.getMonth(),
            mealType: mealType(),
            itemId: item.itemId,
            userid: item.userid,
            orderQty: item.orderQty
        });
        await newOrderDetail.save();
    }
};

