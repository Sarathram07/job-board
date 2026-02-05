import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import { readFile } from "node:fs/promises";

import { resolvers } from "./graphApi/resolvers.js";
import { authMiddleware, handleLogin } from "./middleware/authentication.js";
import { getUserById } from "./controllers/UserController.js";
import { createCompanyLoader } from "./controllers/CompanyController.js";

// -----------------------------------------------------EXPRESS_CONFIG---------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "backend_config.env"),
});

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(authMiddleware);

app.use("/login", handleLogin);

// -----------------------------------------------------APOLLO_SERVER---------------------------------------------------------------

const typeDefs = await readFile("./graphApi/schema.graphql", "utf-8");

async function getContext({ req, res }) {
  const companyLoader = createCompanyLoader();
  const context = { companyLoader };
  if (req.auth) {
    context.user = await getUserById(req.auth.sub);
  }
  return context;
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

await apolloServer.start();

app.use("/graphql", apolloMiddleware(apolloServer, { context: getContext }));

export default app;
