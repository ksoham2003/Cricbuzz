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
        const readMatchId = (payload) => {
            if (typeof payload === "string") return payload;
            return payload?.matchId;
        };

        const joinMatch = (payload) => {
            const matchId = readMatchId(payload);
            if (mongoose.isObjectIdOrHexString(matchId)) {
                socket.join(`match:${matchId}`);
            }
        };

        const leaveMatch = (payload) => {
            const matchId = readMatchId(payload);
            if (mongoose.isObjectIdOrHexString(matchId)) {
                socket.leave(`match:${matchId}`);
            }
        };

        socket.on("match.join", joinMatch);
        socket.on("join-match", joinMatch);

        socket.on("match.leave", leaveMatch);
        socket.on("leave-match", leaveMatch);
    });

    return io;
}
