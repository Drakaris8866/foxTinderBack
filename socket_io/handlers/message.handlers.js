import Message from "../../models/Message.js";
import { removeFile } from "../../utils/file.js";
import onError from "../../utils/onError.js";

const messages = {};

export default function messageHandlers(io, socket) {
  const { roomId } = socket;

  const updateMessageList = () => {
    io.to(roomId).emit("message_list:update", messages[roomId]);
  };

  socket.on("message:get", async () => {
    try {
      const _messages = await Message.find({
        roomId,
      });
      messages[roomId] = _messages;

      updateMessageList();
    } catch (e) {
      onError(e);
    }
  });
  socket.on("message:add", (message) => {
    Message.create(message).catch(onError);
    messages[roomId].push(message);
    message.createdAt = Date.now();

    updateMessageList();
  });

  socket.on("message:remove", (message) => {
    console.log(message);
    const { _id, messageType, textOrPathToFile } = message;

    Message.deleteOne({ _id })
      .then(() => {
        if (messageType !== "text") {
          removeFile(textOrPathToFile);
        }
      })
      .catch(onError);
    messages[roomId] = messages[roomId].filter((m) => {
      return !JSON.stringify(m._id).includes(_id);
    });

    updateMessageList();
  });
}
