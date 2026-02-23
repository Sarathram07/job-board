import UserModel from "../models/UserModel.js";

export async function getUserById(id) {
  return await UserModel.findOne({ id });
}

export async function getUserByEmail(email) {
  return await UserModel.findOne({ email }).select("+password");
}
