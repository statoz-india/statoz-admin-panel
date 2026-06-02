import { io, Socket } from "socket.io-client";
import type { FormattedMatchEvent } from "@/app/api/match/route";

export type MatchEventUpdate = {
  _id: string;
  matchId: string;
  tournament: string;
  matchEvent: FormattedMatchEvent;
};

export type MatchEventUpdatedPayload = {
  updatedAt: string;
  updates: MatchEventUpdate[];
};

let socket: Socket | null = null;
let currentToken: string | null = null;

function resolveSocketUrl(): string {
  const url = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_SOCKET_URL is not set");
  }
  return url;
}

export function getSocket(token: string): Socket {
  if (socket && currentToken === token) {
    return socket;
  }

  if (socket && currentToken !== token) {
    socket.disconnect();
    socket = null;
  }

  currentToken = token;
  socket = io(resolveSocketUrl(), {
    auth: { token },
    transports: ["websocket"],
    withCredentials: true,
    reconnection: true,
  });

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentToken = null;
  }
}
