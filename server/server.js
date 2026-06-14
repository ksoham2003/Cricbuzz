import { createServer } from "http";
import createApp from "./src/app.js";
import env from "./src/config/env.js";
import logger from "./src/config/logger.js";
import connectDB from "./src/database/mongodb.js";
import { Server } from "socket.io";
import initSocket from "./src/sockets/socketGateway.js";

const app = createApp();
const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:"*"
    },
});

initSocket(io);


function startServer() {
  connectDB()
    .then(() => {
      app.listen(env.PORT, () => {
        logger.info({ port: env.PORT }, "Server is running");
      });
    })
    .catch((error) => {
      logger.error("Server failed to start", error);
      process.exit(1);
    });
}

startServer();
