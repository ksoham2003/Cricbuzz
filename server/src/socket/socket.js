import mongoose from "mongoose";
import { Server } from "socket.io";
import env from "../config/env.js";

export function createSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: env.CORS_ORIGIN,
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        socket.on("match.join", (matchId) => {
            if (mongoose.isObjectIdOrHexString(matchId)) {
                socket.join(`match:${matchId}`);
            }
        });

        socket.on("match.leave", (matchId) => {
            if (mongoose.isObjectIdOrHexString(matchId)) {
                socket.leave(`match:${matchId}`);
            }
        });
    });

    return io;
}
