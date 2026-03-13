import { useState, useEffect, useCallback } from 'react';
import { io, Socket }   from 'socket.io-client';
import { Terminal }     from './components/Terminal.js';
import type { OutputLine } from './components/Terminal.js';
import type { ClientToServerEvents, ServerToClientEvents } from '@ephemera/shared';

type EphemeraSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
const SERVER_URL = 'http://localhost:3001';

// ------------------------------------------------------------------ //
// Login screen
// ------------------------------------------------------------------ //
function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');

  async function handleSubmit() {
    setError('');
    try {
      const res = await fetch(`${SERVER_URL}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username, password }),
      });
      const data = await res.json() as { token?: string; error?: string };
      if (!res.ok || !data.token) {
        setError(data.error ?? 'Login failed');
        return;
      }
      onLogin(data.token);
    } catch {
      setError('Could not reach server');
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0a0a0a', color:'#c8a96e', fontFamily:'monospace' }}>
      <h1 style={{ letterSpacing:'0.3em', marginBottom:'2rem' }}>EPHEMERA</h1>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', width:'280px' }}>
        <input
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && void handleSubmit()}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && void handleSubmit()}
          style={inputStyle}
        />
        <button onClick={() => void handleSubmit()} style={buttonStyle}>
          ENTER THE CITY
        </button>
        {error && <span style={{ color:'#c0392b', fontSize:'0.8rem', textAlign:'center' }}>{error}</span>}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: '#111', border: '1px solid #333', color: '#c8a96e',
  padding: '0.5rem', fontFamily: 'monospace', fontSize: '1rem',
};
const buttonStyle: React.CSSProperties = {
  background: '#1a1a1a', border: '1px solid #c8a96e', color: '#c8a96e',
  padding: '0.6rem', fontFamily: 'monospace', fontSize: '0.9rem',
  cursor: 'pointer', letterSpacing: '0.1em',
};

// ------------------------------------------------------------------ //
// Game screen
// ------------------------------------------------------------------ //
function GameScreen({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [lines,  setLines]  = useState<OutputLine[]>([]);
  const [socket, setSocket] = useState<EphemeraSocket | null>(null);

  const addLine = useCallback((line: OutputLine) => {
    setLines(prev => [...prev, line]);
  }, []);

  useEffect(() => {
    const sock: EphemeraSocket = io(SERVER_URL, {
      auth:        { token },
      transports:  ['websocket'],
      autoConnect: true,
    });

    sock.on('connect', () => {
      addLine({ kind: 'raw', text: '-- Connected to Ephemera --' });
      // Auto-look on connect
      sock.emit('player:command', { raw: 'look' });
    });

    sock.on('disconnect', () => {
      addLine({ kind: 'raw', text: '-- Disconnected --' });
    });

    sock.on('system:announce', (payload) => {
      if (payload.message === 'LOGOUT') {
        sock.disconnect();
        onLogout();
      }
    });

    sock.on('room:describe', (payload) => {
      addLine({ kind: 'raw', text: '' });
      addLine({ kind: 'raw', text: `[ ${payload.name} ]` });
      addLine({ kind: 'raw', text: payload.description });
      if (payload.exits.length > 0) {
        addLine({ kind: 'raw', text: `Exits: ${payload.exits.join(', ')}` });
      } else {
        addLine({ kind: 'raw', text: 'Exits: none' });
      }
      if (payload.occupants.length > 0) {
        addLine({ kind: 'raw', text: `Also here: ${payload.occupants.join(', ')}` });
      }
      addLine({ kind: 'raw', text: '' });
    });

    sock.on('room:message', (payload) => {
      addLine({ kind: 'room', payload });
    });

    sock.on('player:message', (payload) => {
      addLine({ kind: 'player', payload });
    });

    sock.on('system:error', (payload) => {
      addLine({ kind: 'player', payload: { message: `ERROR: ${payload.message}`, type: 'error' } });
    });

    setSocket(sock);
    return () => { sock.disconnect(); };
  }, [token, addLine]);

  function handleCommand(raw: string) {
    addLine({ kind: 'raw', text: `> ${raw}` });
    socket?.emit('player:command', { raw });
  }

  return (
    <div style={{ height: '100vh', background: '#0a0a0a', color: '#c8a96e', fontFamily: 'monospace', display: 'flex', flexDirection: 'column' }}>
      <div style={{ borderBottom: '1px solid #222', padding: '0.3rem 0.75rem', fontSize: '0.75rem', color: '#555', letterSpacing: '0.2em' }}>
        EPHEMERA
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Terminal lines={lines} onSubmit={handleCommand} />
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ //
// Root
// ------------------------------------------------------------------ //
export default function App() {
  const [token, setToken] = useState<string | null>(null);
  return token
    ? <GameScreen token={token} onLogout={() => setToken(null)} />
    : <LoginScreen onLogin={setToken} />;
}
