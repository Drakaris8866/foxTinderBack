import User from "../models/User.js";
import Сouples from "../models/Сouples.js";
import { v4 as uuidv4 } from "uuid";

class CouplesService {
  async createCouples(candidateId, currUserId) {
    const candidate = await User.findById(candidateId);
    const currentUser = await User.findById(currUserId);

    const cha = await this.couplesHasAlready(candidateId, currUserId);
    if (cha.includes(true)) {
      return;
    }

    if (currentUser.liked.includes(candidate._id)) {
      await Сouples.create({
        users: [candidate, currentUser],
        roomId: uuidv4(),
      });
    }
  }
  async couplesHasAlready(candidateId, currUserId) {
    const d = await Сouples.find();
    const arr = [];
    for (const key in d) {
      await arr.push(d[key]);
    }
    return arr.map(({ users }) => {
      let id0 = JSON.stringify(users[0]._id);
      let id1 = JSON.stringify(users[1]._id);
      return (
        id0.includes(candidateId) ||
        (id0.includes(currUserId) && id1.includes(candidateId)) ||
        id1.includes(currUserId)
      );
    });
  }
}

export default new CouplesService();
