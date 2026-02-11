import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import { readFile } from "node:fs/promises";
import { WebSocketServer } from "ws";
import { createServer as createHttpServer } from "node:http";
//import { useServer as useWsServer } from "graphql-ws/lib/use/ws.js";
import { useServer as useWsServer } from "graphql-ws/use/ws";

import { makeExecutableSchema } from "@graphql-tools/schema";

import { resolvers } from "./graphApi/resolvers.js";
import {
  authMiddleware,
  decodeTokenForWebSocket,
  handleLogin,
} from "./middleware/authentication.js";
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

// apolloServer.Schema = schemaForWebSocket; // Assign the schema to the Apollo Server instance for WebSocket support
// typeDefs + resolvers = automatically combined to form "executable schema"
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

await apolloServer.start();

app.use("/graphql", apolloMiddleware(apolloServer, { context: getContext }));

// -----------------------------------------------------WEBSOCKET_CONFIG-----------------------------------------------------------

async function getWsContext(connInfo) {
  const { connectionParams } = connInfo;
  const accessToken = connectionParams?.accessToken;
  if (accessToken) {
    const payload = decodeTokenForWebSocket(accessToken);
    //console.log("decoded-payload", payload);
    return { user: payload.sub };
  }
  return {};
}
const httpServer = createHttpServer(app);
const wsServer = new WebSocketServer({ server: httpServer, path: "/graphql" });
// makeExecutableSchema - is used to create a "explicit executable schema" that can be used by
// both Apollo Server and the WebSocket server for subscriptions.
const schemaForWebSocket = makeExecutableSchema({ typeDefs, resolvers });
const configurationProperty = {
  schema: schemaForWebSocket,
  context: getWsContext,
};

// 1. new WebSocketServer() only sets up the connection layer.
// 2. useWsServer() layers on the GraphQL execution engine so it can handle GraphQL operations(GraphQL subscription server).
useWsServer(configurationProperty, wsServer);

export { app, httpServer, wsServer };
