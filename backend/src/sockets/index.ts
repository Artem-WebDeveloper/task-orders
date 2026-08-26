import type { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { socketAuth } from './socket.auth.ts';

export let io: SocketServer;

export function initSocket(httpServer: HttpServer) {
  io = new SocketServer(httpServer, {
    cors: { origin: process.env.CLIENT_URL, credentials: true },
  });

  io.use(socketAuth);

  io.on('connection', (socket) => {
    const user = socket.data.user;
    socket.join(user.role.code === 'operator' ? 'operators' : `team:${user.uuid}`);

    console.log(`Socket connected: ${user.fullname} (${user.role.code})`);

    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${user.fullname}, reason: ${reason}`);
    });
  });

  return io;
}
