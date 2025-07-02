// import { Server } from "socket.io";

// /**
//  * @type {Server}
//  */
// export let io = null;

// export function createSocketServer(server) {
//     io = new Server(server, {
//         cors: {
//             origin: process.env.FRONTEND_URL,
//             credentials: true,
//             preflightContinue: true,
//         },
//     });

//     io.on("connection", (socket) => {
//     console.log("✅ New socket connection:", socket.id);

//     if (!socket.request.session?.userId) {
//         console.log("❌ No session.userId found, disconnecting...");
//         return socket.disconnect();
//     }

//     console.log("🔐 User authenticated with session.userId:", socket.request.session.userId);
//     socket.join(socket.request.session.userId);
// });

//     return io;
// }

// export default { io };

// socket.js
// socket.js
import { Server } from "socket.io";

/** @type {Server | null} */
export let io = null;

export function createSocketServer(server, sessionMiddleware) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:2001", // Use environment variable or default to localhost
      credentials: true,
      preflightContinue: true,
    },
  });

  // Middleware to use session inside socket
  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  io.on("connection", (socket) => {
    console.log("✅ New socket connection:", socket.id);

    const session = socket.request.session;

    if (!session?.userId) {
      console.log("❌ No session.userId found, disconnecting...");
      return socket.disconnect();
    }

    console.log("🔐 User authenticated with session.userId:", session.userId);

    // Optionally join room based on userId for private emits
    socket.join(session.userId);

    // Add your events here
    // socket.on("event-name", (payload) => { ... });
  });

  return io;
}
