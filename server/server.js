import createApp from "./src/app.js";
import env from "./src/config/env.js";
import logger from "./src/config/logger.js";
import connectDB from "./src/database/mongodb.js";

const app = createApp();

function startServer() {
    connectDB().then(() => {
        app.listen(env.PORT, () => {
            logger.info({ port: env.PORT },"Server is running");
        });
    }).catch((error) => {
        logger.error("Server failed to start", error);
        process.exit(1);
    });
}

startServer();