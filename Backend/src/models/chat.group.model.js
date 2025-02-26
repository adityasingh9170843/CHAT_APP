import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    isGroupChat: { type: Boolean, default: false },
    name: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Multiple members
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Group admin
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
