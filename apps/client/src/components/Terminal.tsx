import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import type { RoomMessagePayload, PlayerMessagePayload } from '@ephemera/shared';

export type OutputLine =
  | { kind: 'room';   payload: RoomMessagePayload }
  | { kind: 'player'; payload: PlayerMessagePayload }
  | { kind: 'raw';    text: string };

interface TerminalProps {
  lines:    OutputLine[];
  onSubmit: (raw: string) => void;
}

export function Terminal({ lines, onSubmit }: TerminalProps) {
  const [input,   setInput]   = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef             = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && input.trim()) {
      onSubmit(input.trim());
      setHistory((h) => [input.trim(), ...h].slice(0, 100));
      setHistIdx(-1);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? '' : (history[next] ?? ''));
    }
  }

  return (
    <div className="terminal">
      <div className="terminal__output">
        {lines.map((line, i) => (
          <div key={i} className={'line line--' + line.kind}>
            {line.kind === 'room'   && <span>[{line.payload.from}] {line.payload.message}</span>}
            {line.kind === 'player' && <span className={'msg--' + line.payload.type}>{line.payload.message}</span>}
            {line.kind === 'raw'    && <span>{line.text}</span>}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="terminal__input">
        <span className="prompt">&gt;</span>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
