import { connectDataBase } from "./connection/conn.js";
import app from "./app.js";

connectDataBase();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server listening to the port: ${process.env.PORT} in  ${process.env.NODE_ENV} `,
  );
  console.log(`GraphQL endpoint: http://localhost:${process.env.PORT}/graphql`);
  console.log(
    "--------------------------------------------------------------------------",
  );
});

// used to listen for events emitted by the Node.js process itself.
// These events are about the lifecycle and stability of your application, not HTTP requests.
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to unhandled rejection error");
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to uncaught exception error");
  server.close(() => {
    process.exit(1);
  });
});
