import React, { useState } from 'react';
import { Shield, Lock, Activity, Terminal } from 'lucide-react';
import Analyzer from './components/Analyzer';
import Generator from './components/Generator';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.GENERATOR); // Default to Generator for utility focus

  return (
    <div className="min-h-screen bg-eng-black text-white selection:bg-eng-gold selection:text-black font-sans">
      
      {/* Engineering Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-6 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 border-b border-eng-silver/10 pb-6 pt-2">
          <div className="flex items-center gap-4 mb-6 md:mb-0">
            <div className="bg-eng-gold p-2 rounded-sm shadow-[0_0_15px_rgba(255,215,0,0.3)]">
              <Shield className="text-black w-8 h-8" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                ENTROPY<span className="text-eng-gold">PASS</span>
                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono font-normal align-middle ml-2">v2.0</span>
              </h1>
              <p className="text-xs text-eng-silver uppercase tracking-[0.3em] font-mono mt-1">Engineering-Grade Security</p>
            </div>
          </div>

          <nav className="flex bg-eng-dark p-1 rounded border border-eng-silver/10">
             <button
              onClick={() => setMode(AppMode.GENERATOR)}
              className={`flex items-center gap-2 px-6 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                mode === AppMode.GENERATOR 
                  ? 'bg-eng-silver text-black shadow-lg' 
                  : 'text-zinc-500 hover:text-eng-silver'
              }`}
            >
              <Lock size={14} /> Generator
            </button>
            <button
              onClick={() => setMode(AppMode.ANALYZER)}
              className={`flex items-center gap-2 px-6 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                mode === AppMode.ANALYZER 
                  ? 'bg-eng-gold text-black shadow-lg' 
                  : 'text-zinc-500 hover:text-eng-gold'
              }`}
            >
              <Activity size={14} /> Analyzer
            </button>
          </nav>
        </header>

        {/* Content Area */}
        <main className="flex-1">
          {mode === AppMode.ANALYZER ? <Analyzer /> : <Generator />}
        </main>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-eng-silver/5 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <div>
             <p className="text-zinc-500 text-xs font-mono">
              <Terminal size={12} className="inline mr-2" />
              SYSTEM_STATUS: <span className="text-eng-success">SECURE</span>
            </p>
          </div>
          
          <div className="text-xs text-zinc-600">
             <p className="mb-1">
               Engineered by <span className="text-eng-silver hover:text-white transition-colors cursor-pointer">Riccardo Righini</span>
             </p>
             <p className="text-[10px] opacity-60">Made in Italy 🇮🇹 • MIT License</p>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default App;