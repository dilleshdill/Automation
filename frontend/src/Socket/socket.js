import { io } from "socket.io-client";

const DOMAIN = import.meta.env.VITE_DOMAIN;

export const socket = io(DOMAIN, {
  withCredentials: true,
  autoConnect: true,
  transports: ["websocket"],
});
