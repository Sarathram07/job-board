import { v4 as uuidv4 } from "uuid";
import MessageModel from "../models/MessageModel.js";

export async function getAllMessages() {
  return await MessageModel.find().sort({ createdAt: 1 });
}

export async function createMessage(user, text) {
  const newId = `m${uuidv4().split("-")[0]}`;
  const message = {
    id: newId,
    user: user.name,
    text,
  };
  const createdMessage = await MessageModel.create(message);
  return createdMessage;
}
