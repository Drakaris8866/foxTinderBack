import Couples from "../models/Сouples.js";

class FavoriteController {
  async getUserCouples(req, res) {
    try {
      const { _id } = req.params;
      const userCouplesAll = await Couples.find({});
      let userCouples = userCouplesAll.filter((el) => {
        const srtn = JSON.stringify(el.users);
        return srtn.includes(_id);
      });

      return res.json({ userCouples });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new FavoriteController();
