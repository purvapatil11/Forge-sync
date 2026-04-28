'use client'; 

import { useEffect, useState, useRef } from 'react';
import { getWebContainer } from '@/src/lib/webcontainer';
import TerminalComponent from '@/src/components/Terminal';

export default function Dashboard() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bootAttempted = useRef(false);
  const [isRunning, setIsRunning] = useState(false);
  
  // Logic: terminalRef will hold our Xterm instance
  const terminalRef = useRef<any>(null);
  const activeProcessRef = useRef<any>(null);

  useEffect(() => {
    if (bootAttempted.current) return;
    bootAttempted.current = true;

    async function initContainer() {
      try {
        const instance = await getWebContainer();
        console.log("Container instance secured:", instance.workdir);
        setIsReady(true);
      } catch (err) {
        console.error("Boot Error:", err);
        setError("Failed to boot the virtual engine. Check your headers.");
      }
    }
    initContainer();
  }, []);

  const handleRunCode = async () => {
    const instance = await getWebContainer();

    if (activeProcessRef.current) {
      activeProcessRef.current.kill();
    }

    setIsRunning(true);

    const process = await instance.spawn('node', ['index.js']);
    activeProcessRef.current = process;

    // Logic: Use terminalRef.current to write output to the UI
    process.output.pipeTo(
      new WritableStream({
        write(data) {
          if (terminalRef.current) {
            terminalRef.current.write(data);
          }
        },
      })
    );

    process.exit.then((code) => {
      console.log(`Process exited with code ${code}`);
      setIsRunning(false);
    });
  };

  useEffect(() => {
    if(!isRunning || !activeProcessRef.current) return;

    const writer = activeProcessRef.current.input.getWriter();

    const interval = setInterval(() => {
      const data = {
        rpm: 1450 + Math.floor(Math.random() * 10),
        temp : 72 + Math.random(),
        timestamp: Date.now() // Logic: lowercase 's' is standard
      };

      writer.write(JSON.stringify(data) + '\n');
    }, 1000);

    return () => {
      clearInterval(interval);
      writer.releaseLock();
    }
  }, [isRunning]);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Forge-Sync</h1>
        
        <div className="flex items-center gap-4">
          {/* Add a Run Button to trigger handleRunCode */}
          <button 
            onClick={handleRunCode}
            disabled={!isReady}
            className={`px-4 py-2 rounded font-medium text-white transition ${
              isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'
            } disabled:opacity-50`}
          >
            {isRunning ? 'Stop Engine' : 'Run Engine'}
          </button>

          <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${isReady ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
            <span className="text-sm font-medium text-slate-600">
              {isReady ? 'Engine Ready' : 'Booting...'}
            </span>
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded mb-6">{error}</div>}

      {isReady ? (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 bg-white h-96 rounded-lg border border-slate-200 shadow-sm flex items-center justify-center text-slate-400">
            {/* Editor component will go here */}
            Editor Area
          </div>
          <div className="col-span-4 bg-slate-900 h-96 rounded-lg overflow-hidden">
            {/* Logic: Pass the setter to the Terminal component */}
            {/* Assuming your Terminal component has an onReady prop */}
            <TerminalComponent onReady={(instance) => { terminalRef.current = instance; }} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64 text-slate-500 animate-pulse">
          Initializing Virtual Environment...
        </div>
      )}
    </main>
  );
}