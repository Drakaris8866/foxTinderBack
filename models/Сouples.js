import { model, Schema } from "mongoose";

const СouplesSchema = new Schema({
  users: {
    type: Array,
    required: true,
  },
  roomId: { type: String, required: true },
});

export default model("Сouples", СouplesSchema)
