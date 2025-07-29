import mainUser from "../../models/mainUserModel.js";
import jwt from "jsonwebtoken";

const addtocart = async (req, res) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, 'nahipata');
    const userId = decoded.id;

    const { itemData } = req.body;
    if (!itemData) return res.status(400).json({ message: "Item data is required" });

    const user = await mainUser.findOne({userid:userId});
    if (!user) return res.status(404).json({ message: "User not found" }); 

    user.cart.push(itemData);
    await user.save(); 

    return res.status(200).json({ message: "Item added to cart", cart: user.cart });
  } catch (err) {
    console.error("Add to cart error:", err.message);
    return res.status(500).json({ message: "Server error: " + err.message });
  }
};

export default addtocart;