import { useEffect, useRef } from 'react';
import { io, Socket }        from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '@ephemera/shared';

type EphemeraSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const SERVER_URL = 'http://localhost:3001';

export function useSocket(token: string | null): EphemeraSocket | null {
  const socketRef = useRef<EphemeraSocket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket: EphemeraSocket = io(SERVER_URL, {
      auth:        { token },
      transports:  ['websocket'],
      autoConnect: true,
    });

    socket.on('connect',      ()    => console.log('[Socket] Connected'));
    socket.on('disconnect',   (r)   => console.log('[Socket] Disconnected:', r));
    socket.on('system:error', (err) => console.error('[Socket] Error:', err));

    socketRef.current = socket;
    return () => { socket.disconnect(); };
  }, [token]);

  return socketRef.current;
}
