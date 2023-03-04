import User from "../models/User.js";
import randomFox from "random-fox-img";

class UserController {
  async updateInfo(req, res) {
    try {
      const { about, interests, gender, _id, images } = req.body;
      console.log(about, interests, gender, _id, images)
      await User.findByIdAndUpdate(_id, {
        $set: {
          "personalization.about": about,
          "personalization.gender": gender,
          "personalization.interests": interests,
        },
      });
      const updatedUser = await User.findOne({ _id });
      return res.json({ updatedUser });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async getRandomImg(req, res) {
    try {
      const { _id } = req.body;

      const {
        personalization: { images },
      } = await User.findOne({ _id });

      async function getImageUrl() {
        const {
          data: { message },
        } = await randomFox();

        if (images.includes(message)) {
          return getImageUrl();
        }
        return message;
      }

      const imageUrl = await getImageUrl()

      await User.findByIdAndUpdate(_id, {
        $push: {
          "personalization.images": imageUrl,
        },
      });

      const updatedUser = await User.findOne({_id})

      return res.json({ updatedUser });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async deleteImg(req, res) {
    try {
      const { _id, imageId } = req.params;
      await User.updateOne(
        { _id },
        {
          $pull: {
            "personalization.images": `https://cdn.sefinek.net/images/animals/fox/${imageId}`,
          },
        }
      );
      const updatedUser = await User.findOne({ _id });
      res.json({ updatedUser });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async getUsers(req, res){
    try{
      const users = [...(await User.find())].map(
        ({ password, username, personalization, _id }) => {
          return {
            username,
            _id,
            personalization: {...personalization}
          };
        }
      );
      return res.json([...users])
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}

export default new UserController();
