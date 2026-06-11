import { createServer } from "http";
import createApp from "./src/app.js";
import env from "./src/config/env.js";
import logger from "./src/config/logger.js";
import connectDB from "./src/database/mongodb.js";
import { createSocketServer } from "./src/socket/socket.js";

const app = createApp();
const httpServer = createServer(app);
const io = createSocketServer(httpServer);
app.set("io", io);

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
