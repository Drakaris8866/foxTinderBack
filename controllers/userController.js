import axios from "axios";
import User from "../models/User.js";
import CouplesService from "../services/Couples.service.js";

class UserController {
  async updateInfo(req, res) {
    try {
      const { about, interests, gender, _id, images } = req.body;
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

      const { image } = await axios.get(
        "https://randomfox.ca/floof/?ref=apilist.fun"
      );

      async function getImageUrl() {
        const { image } = await axios
          .get("https://randomfox.ca/floof/?ref=apilist.fun")
          .then((res) => res.data);
        if (images.includes(image)) {
          return getImageUrl();
        }
        return image;
      }

      const imageUrl = await getImageUrl();

      await User.findByIdAndUpdate(_id, {
        $push: {
          "personalization.images": imageUrl,
        },
      });

      const updatedUser = await User.findOne({ _id });

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
            "personalization.images": `https://randomfox.ca/images/${imageId}`,
          },
        }
      );
      const updatedUser = await User.findOne({ _id });
      res.json({ updatedUser });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async getUsers(req, res) {
    const {_id} = req.params
    const currentUser = await User.findById(_id)
    try {
      const users = [...(await User.find())].map(
        ({ username, personalization, _id, disliked, liked }) => {
          return {
            username,
            _id,
            disliked,
            liked,
            personalization: { ...personalization },
          };
        }
      ).filter((user) => {
        return user.username !== currentUser.username && !currentUser.disliked?.includes(user._id) && !currentUser.liked?.includes(user._id)
      });
      return res.json([...users]);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async getFavotiteUsers(req, res) {
    try {
      const { _id } = req.params;
      const { liked } = await User.findOne({ _id });
      let favoriteUsers = await User.find({ _id: liked.map((l) => l) });
      favoriteUsers = favoriteUsers.map(
        ({ username, personalization, _id, disliked, liked }) => {
          return {
            username,
            _id,
            disliked,
            liked,
            personalization: { ...personalization },
          };
        }
      );
      return res.json({ favoriteUsers });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async updatedDislikedUser(req, res) {
    try {
      const { usersId } = req.body;
      const { _id } = req.params;
      const { disliked } = await User.findOne({ _id });
      if (!disliked.includes(usersId)) {
        await User.updateOne(
          { _id },
          {
            $push: {
              disliked: usersId,
            },
          }
        );
        const updatedUser = await User.findOne({ _id });
        res.json({ updatedUser });
      }
      res.status(400).json({ message: "Уже есть" });
    } catch (e) {
      console.log(e.message);
    }
  }

  async updatedLikedUser(req, res) {
    try {
      const { usersId } = req.body;
      const { _id } = req.params;
      const { liked } = await User.findOne({ _id });
      CouplesService.createCouples(usersId[0], _id)

      if (!liked.includes(usersId)) {
        await User.updateOne(
          { _id },
          {
            $push: {
              liked: usersId,
            },
          }
        );
        const updatedUser = await User.findOne({ _id });
        res.json({ updatedUser });
      }
      res.status(400).json({ message: "Уже есть" });
    } catch (e) {
      console.log(e.message);
    }
  }
}

export default new UserController();
