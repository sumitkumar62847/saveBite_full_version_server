import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mainUser from "../../models/mainUserModel.js";


const router = express.Router();
dotenv.config(); 

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
    try{
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });
        const decoded = jwt.verify(token, 'nahipata');
        const userId = decoded.id;
        const user = await mainUser.findOne({userid:userId});
        if (!user) return res.status(404).json({ message: "User not found" });

        const { amount } = req.body;
        console.log('Amt:', amount)

        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt:`receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        console.log(order)
        res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
        

    }catch (err) {
        console.error("Add Full Error:", err);

        const message = err?.error?.description || err?.message || "Unknown server error";

        return res.status(500).json({
            message: "Server error",
            error: message
        });
        }
    
});

export default router;