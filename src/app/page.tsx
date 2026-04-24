'use client'; // Logic: WebContainers are browser-only!

import { useEffect, useState, useRef } from 'react';
import { getWebContainer } from '@/src/lib/webcontainer';

export default function Dashboard() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bootAttempted = useRef(false);

  useEffect(() => {
    // Logic: Prevent strict-mode double-mounting from booting twice
    if (bootAttempted.current) return;
    bootAttempted.current = true;

    async function initContainer() {
      try {
        const instance = await getWebContainer();
        
        // Logic: Once booted, we can trigger an initial process
        // like 'npm install' or just confirm readiness
        console.log("Container instance secured:", instance.workdir);
        
        setIsReady(true);
      } catch (err) {
        console.error("Boot Error:", err);
        setError("Failed to boot the virtual engine. Check your headers.");
      }
    }

    initContainer();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      {/* Sober Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Forge-Sync</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${isReady ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
            <span className="text-sm font-medium text-slate-600">
              {isReady ? 'Engine Ready' : 'Booting Engine...'}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Logic: Only show the dashboard if the engine is ready */}
      {isReady ? (
        <div className="grid grid-cols-12 gap-6">
          {/* We will put our Editor and Terminal components here next */}
          <div className="col-span-8 bg-white h-96 rounded-lg border border-slate-200 shadow-sm flex items-center justify-center text-slate-400">
            Editor Loading...
          </div>
          <div className="col-span-4 bg-slate-900 h-96 rounded-lg border border-slate-800 shadow-lg text-white p-4 font-mono text-xs">
            Terminal Active
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
           <p className="text-slate-500 animate-pulse">Initializing Virtual Environment...</p>
        </div>
      )}
    </main>
  );
}