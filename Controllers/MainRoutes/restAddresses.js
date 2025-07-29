import MapRestAdd from "../../models/restMapAddress.js";
import RestDetail from "../../models/RestDetailModel.js";

const restAddesses = async (req, res) => {
  try {
    const { data } = req.body;

    const addresses = await Promise.all(
      data.restuserid.map(async (id) => {
        const mapData = await MapRestAdd.findOne({ userid: id });
        const restData = await RestDetail.findOne({ userid: id });

        return {
          userid: id,
          location: mapData,
          detail: restData
        };
      })
    );

    res.status(200).json({ orderid: data.orderid, Addresses: addresses });

  } catch (err) {
    console.error("error:", err.message);
    return res.status(500).json({ message: "Server error: " + err.message });
  }
};

export default restAddesses;