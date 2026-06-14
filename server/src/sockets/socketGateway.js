let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("client connected socket id ", socket.id);

    socket.on("join-match", (matchId) => {
      socket.join(`match:${matchId}`);
    });

    socket.on("joinMatch", (matchId) => {
      socket.join(`match:${matchId}`);
    });

    socket.on("leave-match", (matchId) => {
      socket.leave(`match:${matchId}`);
    });

    socket.on("leaveMatch", (matchId) => {
      socket.leave(`match:${matchId}`);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected", socket.id);
    });
  });
};

const emitToMatch = (matchId, event, payload) => {
  if (!ioInstance) return;

  ioInstance.to(`match:${matchId}`).emit(event, payload);
};

export default { initSocket, emitToMatch };

// Match create hone ke baad: emitToMatch(match._id, "match.created", match);

// toss completed par : emitToMatch(match._id, "toss.updated", match);

// select Playing XI : emitToMatch( match._id,"playingXI.updated", match);

// LIVE MATCH START : emitToMatch(match._id, "match.started",match);

// COMPLETE MATCH : emitToMatch(match._id,"match.completed",match );

// export const MATCH_STATUS = {
//   UPCOMING: "UPCOMING",
//   TOSS_COMPLETED: "TOSS_COMPLETED",
//   PLAYING_XI_SELECTED: "PLAYING_XI_SELECTED",
//   LIVE: "LIVE",
//   INNINGS_BREAK: "INNINGS_BREAK",
//   COMPLETED: "COMPLETED",
// };

// 

