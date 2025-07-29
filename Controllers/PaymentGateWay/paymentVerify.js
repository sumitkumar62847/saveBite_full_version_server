import express from "express";
import dotenv from "dotenv";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import mainUser from "../../models/mainUserModel.js";

const router = express.Router();
dotenv.config(); 

router.post("/verify", async (req, res) => {
    try{
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });
        const decoded = jwt.verify(token, 'nahipata');
        const userId = decoded.id;
        const user = await mainUser.findOne({userid:userId});
        if (!user) return res.status(404).json({ message: "User not found" });
        
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generated_signature === razorpay_signature) {
            return res.json({ success: true, message: "Payment verified" });
        } else {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

    }catch(err){
        console.error("Add to cart error:", err.message);
        return res.status(500).json({ message: "Server error: " + err.message });
    }
});
export default router;