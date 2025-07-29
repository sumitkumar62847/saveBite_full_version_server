import mainUser from "../../models/mainUserModel.js";
import jwt from "jsonwebtoken";

const getCartItems = async (req, res) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token, 'nahipata');
    const userId = decoded.id;
    const user = await mainUser.findOne({userid:userId});
    return res.status(200).json({cart: user?.cart });
  } catch (err) {
    console.error("Add to cart error:", err.message);
    return res.status(500).json({ message: "Server error: " + err.message });
  }
};

export default getCartItems;