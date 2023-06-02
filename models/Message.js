import { model, Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    messageType: {
      type: String,
      required: true,
    },
    textOrPathToFile: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Message", MessageSchema);
