'use client'; // CRITICAL: Xterm.js only works in the browser!

import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

interface TerminalProps {
  onReady: (terminal: Terminal) => void;
}

export default function TerminalComponent({ onReady }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!terminalRef.current || isInitialized.current) return;
    
    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#0f172a', 
        foreground: '#f8fafc', 
      },
      fontSize: 12,
      fontFamily: 'JetBrains Mono, monospace',
    });

    term.open(terminalRef.current);
    isInitialized.current = true;
    
    onReady(term);

    return () => {
      term.dispose();
    };
  }, [onReady]);

  return <div ref={terminalRef} className="h-full w-full" />;
}