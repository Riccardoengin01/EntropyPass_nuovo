import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, RefreshCw, Eye, EyeOff, Search, Clock, Cpu, Lock, AlertTriangle, CheckCircle, Terminal } from 'lucide-react';
import { calculateEntropy, estimateCrackTime } from '../utils/entropy';
import { analyzePasswordStrength } from '../services/geminiService';
import { EntropyResult, AiAnalysisResult } from '../types';
import Visualizer from './Visualizer';

const Analyzer: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [entropyResult, setEntropyResult] = useState<EntropyResult>({ entropy: 0, charSetSize: 0, length: 0, strengthLabel: 'Very Weak' });
  const [crackTime, setCrackTime] = useState<string>('Instant');
  const [aiResult, setAiResult] = useState<AiAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Real-time Math Entropy
  useEffect(() => {
    const result = calculateEntropy(password);
    setEntropyResult(result);
    setCrackTime(estimateCrackTime(result.entropy));
    
    // Reset AI result when password changes to avoid stale data
    if (aiResult && password !== '') setAiResult(null);
  }, [password]);

  const handleDeepAnalyze = async () => {
    if (!password) return;
    setIsAnalyzing(true);
    const result = await analyzePasswordStrength(password);
    setAiResult(result);
    setIsAnalyzing(false);
  };

  const getMeterColor = (label: string) => {
     switch (label) {
      case 'Very Strong': return 'bg-eng-gold shadow-[0_0_15px_#FFD700]';
      case 'Strong': return 'bg-eng-success shadow-[0_0_15px_#27AE60]';
      case 'Reasonable': return 'bg-eng-goldDim';
      case 'Weak': return 'bg-orange-600';
      default: return 'bg-red-600';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      {/* SECTION 1: HERO INPUT */}
      <div className="relative group z-20">
        <div className="absolute -inset-1 bg-gradient-to-r from-eng-gold/20 to-eng-silver/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-eng-panel border border-eng-silver/20 rounded-xl overflow-hidden shadow-2xl">
          
          <div className="flex items-center p-2">
            <div className="pl-4 pr-2 text-zinc-500">
                <Terminal size={20} />
            </div>
            <input
              type={isVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER_SEQUENCE_FOR_AUDIT..."
              className="w-full bg-transparent border-none outline-none text-white px-2 py-5 font-mono text-xl placeholder-zinc-700 tracking-wide"
              autoComplete="off"
            />
            <button 
              onClick={() => setIsVisible(!isVisible)}
              className="p-4 text-zinc-500 hover:text-eng-gold transition-colors hover:bg-white/5 rounded-lg mr-1"
            >
              {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {/* Integrated Strength Meter Bar */}
          <div className="h-1 w-full bg-black/50 relative">
            <div 
              className={`h-full transition-all duration-700 ease-out relative z-10 ${password ? getMeterColor(entropyResult.strengthLabel) : 'w-0'}`}
              style={{ width: `${Math.min(100, (entropyResult.entropy / 128) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: DASHBOARD */}
      {!password ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-40 border border-dashed border-zinc-800 rounded-xl bg-black/20">
            <ShieldCheck size={64} className="mb-4 text-zinc-600"/>
            <p className="font-mono text-sm text-zinc-500 uppercase tracking-widest">Awaiting Input Sequence</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* LEFT COLUMN: DETERMINISTIC (MATH) */}
            <div className="bg-eng-panel rounded-xl border border-eng-silver/10 p-0 shadow-xl overflow-hidden flex flex-col h-full animate-in slide-in-from-left-4 duration-500">
                <div className="bg-black/40 p-4 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-eng-silver text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <Cpu size={14} className="text-eng-gold" /> Deterministic Analysis
                    </h3>
                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-zinc-500 font-mono">SHANNON_ENTROPY</span>
                </div>

                <div className="p-6 space-y-8 flex-1">
                    {/* Visualizer Chart */}
                    <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                        <Visualizer entropyData={entropyResult} aiScore={aiResult?.score} />
                    </div>

                    {/* Data Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-eng-dark p-3 rounded border border-white/5">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Length</p>
                            <p className="text-xl font-mono text-white">{entropyResult.length} <span className="text-xs text-zinc-600">chars</span></p>
                        </div>
                        <div className="bg-eng-dark p-3 rounded border border-white/5">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Pool Size</p>
                            <p className="text-xl font-mono text-white">{entropyResult.charSetSize} <span className="text-xs text-zinc-600">vars</span></p>
                        </div>
                        <div className="col-span-2 bg-eng-dark p-4 rounded border border-white/5 flex items-center justify-between group hover:border-eng-gold/30 transition-colors">
                            <div>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <Clock size={10} /> Time to Crack (Brute Force)
                                </p>
                                <p className="text-lg font-mono text-eng-gold">{crackTime}</p>
                            </div>
                            <Lock size={24} className="text-zinc-700 group-hover:text-eng-gold transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: SEMANTIC (AI) */}
            <div className="bg-eng-panel rounded-xl border border-eng-silver/10 p-0 shadow-xl overflow-hidden flex flex-col h-full animate-in slide-in-from-right-4 duration-500 relative">
                
                {/* Background Grid Effect for AI Panel */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                <div className="bg-black/40 p-4 border-b border-white/5 flex justify-between items-center relative z-10">
                    <h3 className="text-eng-silver text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <Zap size={14} className="text-eng-gold" /> Semantic Intelligence
                    </h3>
                    <span className="text-[10px] bg-eng-gold/10 text-eng-gold border border-eng-gold/20 px-2 py-1 rounded font-mono">GEMINI_2.5</span>
                </div>

                <div className="p-6 flex-1 flex flex-col relative z-10">
                    {!aiResult && !isAnalyzing ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-6">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-eng-gold/20 blur-xl rounded-full opacity-0 hover:opacity-100 transition-opacity"></div>
                                <Search size={48} className="text-zinc-600 relative z-10" strokeWidth={1} />
                            </div>
                            <div className="space-y-2 max-w-xs mx-auto">
                                <p className="text-zinc-300 font-bold text-sm">Deep Audit Required</p>
                                <p className="text-zinc-500 text-xs leading-relaxed">
                                    Analyze keyboard patterns, dictionary words, and common substitutions that math misses.
                                </p>
                            </div>
                            <button
                                onClick={handleDeepAnalyze}
                                className="bg-eng-gold text-black px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                            >
                                Run Deep Scan
                            </button>
                        </div>
                    ) : isAnalyzing ? (
                         <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-eng-gold blur-xl opacity-20 animate-pulse"></div>
                                <RefreshCw size={48} className="text-eng-gold animate-spin relative z-10" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-eng-gold font-mono text-sm uppercase tracking-widest">Auditing Sequence</p>
                                <p className="text-zinc-600 text-[10px] font-mono">CHECKING_COMMON_PATTERNS...</p>
                            </div>
                         </div>
                    ) : aiResult ? (
                        <div className="space-y-6 animate-in zoom-in-95 duration-300">
                             {/* Score Card */}
                            <div className="flex items-center justify-between bg-black/60 p-5 rounded-lg border-l-4 border-eng-gold backdrop-blur-sm">
                                <div>
                                    <span className="text-zinc-400 text-[10px] uppercase tracking-wider block mb-1">Security Score</span>
                                    <span className={`text-3xl font-mono font-bold ${aiResult.score > 80 ? 'text-eng-success' : aiResult.score > 50 ? 'text-eng-gold' : 'text-eng-alert'}`}>
                                    {aiResult.score}<span className="text-sm text-zinc-600">/100</span>
                                    </span>
                                </div>
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${aiResult.score > 70 ? 'border-eng-success bg-eng-success/10' : 'border-eng-gold bg-eng-gold/10'}`}>
                                    {aiResult.score > 70 ? <CheckCircle size={20} className="text-eng-success"/> : <AlertTriangle size={20} className="text-eng-gold"/>}
                                </div>
                            </div>
                            
                            {/* Critique Box */}
                            <div className="bg-eng-dark p-4 rounded-lg border border-white/5 relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800 rounded-l-lg"></div>
                                <p className="text-sm text-zinc-300 font-mono leading-relaxed pl-2">
                                    <span className="text-eng-gold/50 mr-2">root@ai:~#</span>
                                    "{aiResult.critique}"
                                </p>
                            </div>

                            {/* Improvements List */}
                            <div className="space-y-3">
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-1">Tactical Improvements</p>
                                <ul className="space-y-2">
                                {aiResult.improvements.map((imp, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-xs text-zinc-400 font-mono bg-white/5 p-2 rounded hover:bg-white/10 transition-colors">
                                        <span className="text-eng-gold mt-0.5">›</span> 
                                        {imp}
                                    </li>
                                ))}
                                </ul>
                            </div>
                            
                            <button 
                                onClick={handleDeepAnalyze}
                                className="w-full mt-2 py-3 border border-white/10 rounded text-xs text-zinc-500 hover:text-white hover:border-white/30 transition-all uppercase tracking-wider"
                            >
                                Re-Scan Sequence
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Analyzer;