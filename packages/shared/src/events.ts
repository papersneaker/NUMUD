import type { CharacterId, RoomId } from './ids.js';

// ------------------------------------------------------------------ //
// Server → Client events
// ------------------------------------------------------------------ //
export interface ServerToClientEvents {
  // Room narrative
  'room:describe':  (payload: RoomDescribePayload) => void;
  'room:message':   (payload: RoomMessagePayload)  => void;

  // Player feedback
  'player:message': (payload: PlayerMessagePayload) => void;
  'player:state':   (payload: PlayerStatePayload)   => void;

  // System
  'system:error':   (payload: SystemErrorPayload)   => void;
  'system:announce':(payload: SystemAnnouncePayload)=> void;
}

// ------------------------------------------------------------------ //
// Client → Server events
// ------------------------------------------------------------------ //
export interface ClientToServerEvents {
  'player:command': (payload: PlayerCommandPayload) => void;
}

// ------------------------------------------------------------------ //
// Socket data attached to each connection
// ------------------------------------------------------------------ //
export interface SocketData {
  characterId: CharacterId;
  userId:      string;
  roomId:      RoomId;
}

// ------------------------------------------------------------------ //
// Payload shapes
// ------------------------------------------------------------------ //
export interface RoomDescribePayload {
  roomId:      RoomId;
  name:        string;
  description: string;
  exits:       string[];
  occupants:   string[];  // character names
}

export interface RoomMessagePayload {
  from:    string;        // character name
  message: string;
  type:    'say' | 'emote' | 'system';
}

export interface PlayerMessagePayload {
  message: string;
  type:    'info' | 'warning' | 'error' | 'success';
}

export interface PlayerStatePayload {
  name:    string;
  hp:      number;
  maxHp:   number;
  roomId:  RoomId;
}

export interface PlayerCommandPayload {
  raw: string;            // the raw text the player typed
}

export interface SystemErrorPayload {
  code:    string;
  message: string;
}

export interface SystemAnnouncePayload {
  message: string;
}
