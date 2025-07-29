import mainUser from "../../models/mainUserModel.js";

const removeItemByCart = async (req, res) =>{
  try {
    const {id,userId} = req.query;
    if((id === 'All_Clear')){
      const result = await mainUser.updateOne(
        { userid: userId },   
        { $set: { cart: [] } }   
      );
        return res.status(200).json({message:"All Deleted"});
    }else{
      const result = await mainUser.updateOne(
        {userid:userId},
        {$pull: {cart:{_id: id}}}
      );
      return res.status(200).json({itemId:id});

    }
  } catch (err) {
    console.error("Add to cart error:", err.message);
    return res.status(500).json({ message: "Server error: " + err.message });
  }
};

export default removeItemByCart;