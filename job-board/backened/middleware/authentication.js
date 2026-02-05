import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "../controllers/UserController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../backend_config.env"),
});

const key = process.env.JWT_SECRET;
//const secret = Buffer.from("Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt", "base64");
const secret = Buffer.from(key, "base64");

export const authMiddleware = expressjwt({
  algorithms: ["HS256"],
  credentialsRequired: false,
  secret,
});

export async function handleLogin(req, res) {
  const { name, email, password } = req.body;
  const user = await getUserByEmail(email);
  if (!user || user.password !== password) {
    res.sendStatus(401);
  } else {
    const claims = { name: user.name, sub: user.id, email: user.email };
    const token = jwt.sign(claims, secret);
    res.json({ token });
  }
}
