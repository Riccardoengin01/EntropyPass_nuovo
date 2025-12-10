import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Sparkles, Settings, Check, Lock, Zap, ChevronLeft, ChevronRight, Ear, Clock, Hash, Shield, Sliders } from 'lucide-react';
import { generateRandomString, calculateEntropy, estimateCrackTime, getNatoPhonetic } from '../utils/entropy';
import { generateMemorablePassphrases } from '../services/geminiService';
import { GeneratedPassword } from '../types';

type GeneratorMode = 'random' | 'pin' | 'ai';

const Generator: React.FC = () => {
  // Mode State
  const [mode, setMode] = useState<GeneratorMode>('random');

  // Random Generator State
  const [length, setLength] = useState(24);
  const [useSymbols, setUseSymbols] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useUppercase, setUseUppercase] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  
  // PIN Generator State
  const [pinLength, setPinLength] = useState(6);
  const [pinExcludeAmbiguous, setPinExcludeAmbiguous] = useState(false);

  // AI Generator State
  const [context, setContext] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  
  // Results State
  const [currentResult, setCurrentResult] = useState<GeneratedPassword | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Batch & View State
  const [batchResults, setBatchResults] = useState<string[]>([]);
  const [batchIndex, setBatchIndex] = useState(0);
  const [showPhonetic, setShowPhonetic] = useState(false);

  // Auto-generate on mount
  useEffect(() => {
    handleStandardGenerate();
  }, []);

  const updateCurrentResult = (val: string, type: 'random' | 'memorable' | 'pin') => {
    const entropy = calculateEntropy(val).entropy;
    setCurrentResult({
      value: val,
      type,
      entropy
    });
    setCopied(false);
    setShowPhonetic(false); // Reset view
  };

  const handleStandardGenerate = () => {
    const raw = generateRandomString(length, useSymbols, useNumbers, useUppercase, excludeAmbiguous, true);
    setBatchResults([]); 
    updateCurrentResult(raw, 'random');
  };

  const handlePinGenerate = () => {
    const raw = generateRandomString(pinLength, false, true, false, pinExcludeAmbiguous, false);
    setBatchResults([]);
    updateCurrentResult(raw, 'pin');
  };

  const handleAiGenerate = async () => {
    setIsGeneratingAi(true);
    setCopied(false);
    const phrases = await generateMemorablePassphrases(context);
    
    if (phrases.length > 0) {
      setBatchResults(phrases);
      setBatchIndex(0);
      updateCurrentResult(phrases[0], 'memorable');
    }
    setIsGeneratingAi(false);
  };

  const handleBatchNav = (direction: 'prev' | 'next') => {
    if (batchResults.length === 0) return;
    
    let newIndex = direction === 'next' ? batchIndex + 1 : batchIndex - 1;
    if (newIndex >= batchResults.length) newIndex = 0;
    if (newIndex < 0) newIndex = batchResults.length - 1;
    
    setBatchIndex(newIndex);
    updateCurrentResult(batchResults[newIndex], 'memorable');
  };

  const copyToClipboard = () => {
    if (!currentResult) return;
    navigator.clipboard.writeText(currentResult.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCrackTime = () => {
    if (!currentResult) return 'N/A';
    return estimateCrackTime(currentResult.entropy);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* LEFT COLUMN: Configuration Panel */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-black/40 p-1.5 rounded-lg border border-eng-silver/10 backdrop-blur-sm">
          <button 
            onClick={() => setMode('random')}
            className={`py-2.5 rounded-md flex flex-col items-center justify-center gap-1 transition-all duration-300 ${mode === 'random' ? 'bg-eng-silver text-black shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
          >
            <Settings size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Random</span>
          </button>
          
          <button 
            onClick={() => setMode('pin')}
            className={`py-2.5 rounded-md flex flex-col items-center justify-center gap-1 transition-all duration-300 ${mode === 'pin' ? 'bg-eng-silver text-black shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
          >
            <Hash size={16} />
             <span className="text-[10px] font-bold uppercase tracking-wider">PIN</span>
          </button>

          <button 
            onClick={() => setMode('ai')}
            className={`py-2.5 rounded-md flex flex-col items-center justify-center gap-1 transition-all duration-300 ${mode === 'ai' ? 'bg-eng-gold text-black shadow-lg shadow-eng-gold/20' : 'text-zinc-500 hover:text-eng-gold hover:bg-eng-gold/5'}`}
          >
            <Sparkles size={16} />
             <span className="text-[10px] font-bold uppercase tracking-wider">Smart AI</span>
          </button>
        </div>

        {/* Dynamic Config Area */}
        <div className={`flex-1 bg-eng-panel p-6 rounded-xl border shadow-xl transition-all duration-500 ${mode === 'ai' ? 'border-eng-gold/20 shadow-eng-gold/5' : 'border-eng-silver/10'}`}>
          
          {/* HEADER of Config Panel */}
          <div className="mb-6 border-b border-white/5 pb-4 flex justify-between items-center">
            <h3 className={`font-bold font-mono text-sm uppercase tracking-wider flex items-center gap-2 ${mode === 'ai' ? 'text-eng-gold' : 'text-white'}`}>
              {mode === 'random' && <><Sliders size={16} /> Parametric Config</>}
              {mode === 'pin' && <><Shield size={16} /> PIN Security</>}
              {mode === 'ai' && <><Zap size={16} /> Intelligence</>}
            </h3>
            {mode === 'random' && <span className="text-xs font-mono text-eng-silver bg-white/5 px-2 py-1 rounded">{length} chars</span>}
            {mode === 'pin' && <span className="text-xs font-mono text-eng-silver bg-white/5 px-2 py-1 rounded">{pinLength} digits</span>}
          </div>

          {/* MODE: RANDOM */}
          {mode === 'random' && (
            <div className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-300">
               <div>
                <input 
                  type="range" min="8" max="64" value={length} 
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full accent-eng-silver h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer hover:bg-zinc-700 transition-colors"
                />
                <div className="flex justify-between text-[10px] text-zinc-600 mt-2 font-mono">
                  <span>8</span>
                  <span>32</span>
                  <span>64</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {[
                  { label: 'Uppercase (A-Z)', state: useUppercase, setter: setUseUppercase },
                  { label: 'Numbers (0-9)', state: useNumbers, setter: setUseNumbers },
                  { label: 'Symbols (!@#$)', state: useSymbols, setter: setUseSymbols },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center justify-between p-3 rounded bg-black/40 border border-white/5 cursor-pointer hover:border-eng-silver/30 transition-all group">
                    <span className="font-mono text-xs uppercase text-zinc-300 group-hover:text-white transition-colors">{item.label}</span>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${item.state ? 'bg-eng-silver border-eng-silver' : 'border-zinc-700 bg-black'}`}>
                      {item.state && <Check size={12} className="text-black" strokeWidth={3} />}
                    </div>
                    <input type="checkbox" checked={item.state} onChange={() => item.setter(!item.state)} className="hidden" />
                  </label>
                ))}

                <label className="flex items-center justify-between p-3 rounded bg-black/40 border border-white/5 cursor-pointer hover:border-eng-silver/30 transition-all group mt-4">
                    <span className="font-mono text-xs uppercase text-zinc-400 group-hover:text-white transition-colors">Exclude Ambiguous</span>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${excludeAmbiguous ? 'bg-eng-silverDim border-eng-silverDim' : 'border-zinc-700 bg-black'}`}>
                      {excludeAmbiguous && <Check size={12} className="text-black" strokeWidth={3} />}
                    </div>
                    <input type="checkbox" checked={excludeAmbiguous} onChange={() => setExcludeAmbiguous(!excludeAmbiguous)} className="hidden" />
                </label>
              </div>

              <button 
                onClick={handleStandardGenerate}
                className="w-full bg-eng-silver text-black font-bold py-4 rounded-lg hover:bg-white hover:scale-[1.02] transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95"
              >
                <RefreshCw size={16} /> Generate Sequence
              </button>
            </div>
          )}

          {/* MODE: PIN */}
          {mode === 'pin' && (
            <div className="space-y-8 animate-in slide-in-from-left-4 fade-in duration-300">
               <div>
                <input 
                  type="range" min="4" max="8" value={pinLength} 
                  onChange={(e) => setPinLength(parseInt(e.target.value))}
                  className="w-full accent-eng-silver h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
                 <div className="flex justify-between text-[10px] text-zinc-600 mt-2 font-mono">
                  <span>4</span>
                  <span>6</span>
                  <span>8</span>
                </div>
              </div>

              <label className="flex items-center justify-between p-3 rounded bg-black/40 border border-white/5 cursor-pointer hover:border-eng-silver/30 transition-all group">
                  <span className="font-mono text-xs uppercase text-zinc-400 group-hover:text-white transition-colors">No Ambiguous (0, 1)</span>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${pinExcludeAmbiguous ? 'bg-eng-silverDim border-eng-silverDim' : 'border-zinc-700 bg-black'}`}>
                    {pinExcludeAmbiguous && <Check size={12} className="text-black" strokeWidth={3} />}
                  </div>
                  <input type="checkbox" checked={pinExcludeAmbiguous} onChange={() => setPinExcludeAmbiguous(!pinExcludeAmbiguous)} className="hidden" />
              </label>

               <div className="pt-4">
                <button 
                  onClick={handlePinGenerate}
                  className="w-full bg-zinc-800 text-eng-silver border border-eng-silver/20 font-bold py-4 rounded-lg hover:bg-eng-silver hover:text-black hover:scale-[1.02] transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm active:scale-95"
                >
                  <Hash size={16} /> Generate Code
                </button>
              </div>
            </div>
          )}

          {/* MODE: AI */}
          {mode === 'ai' && (
            <div className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-300">
              <p className="text-xs text-zinc-400 font-mono leading-relaxed border-l-2 border-eng-gold/50 pl-3">
                Uses Google Gemini to generate <span className="text-eng-gold">XKCD-style</span> memorable passphrases with high entropy.
              </p>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-eng-goldDim font-bold tracking-widest">Context / Theme</label>
                <input 
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g. 'Cyberpunk City' or 'Italian Cuisine'"
                  className="w-full bg-black/60 border border-eng-gold/20 rounded-lg px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-eng-gold focus:ring-1 focus:ring-eng-gold transition-all"
                />
              </div>

              <button 
                onClick={handleAiGenerate}
                disabled={isGeneratingAi}
                className="w-full bg-eng-gold/10 text-eng-gold border border-eng-gold/40 font-bold py-4 rounded-lg hover:bg-eng-gold hover:text-black hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(255,215,0,0.1)] active:scale-95 mt-4"
              >
                {isGeneratingAi ? <RefreshCw className="animate-spin" size={16}/> : <Sparkles size={16} />} 
                {isGeneratingAi ? 'Processing Batch...' : 'Generate Batch'}
              </button>
            </div>
          )}

        </div>
      </div>

      {/* RIGHT COLUMN: Results Display */}
      <div className="lg:col-span-8 flex flex-col h-full">
        <div className="bg-eng-panel rounded-xl border border-eng-silver/10 p-8 md:p-12 shadow-2xl relative overflow-hidden flex-1 flex flex-col items-center justify-center text-center">
          
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
             {mode === 'random' && <Settings size={200} />}
             {mode === 'pin' && <Hash size={200} />}
             {mode === 'ai' && <Sparkles size={200} />}
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

          {!currentResult ? (
            <div className="z-10 text-zinc-600 flex flex-col items-center animate-pulse">
              <Zap size={48} className="mb-4 opacity-50" />
              <p className="font-mono text-sm uppercase tracking-widest">Initializing...</p>
            </div>
          ) : (
            <div className="z-10 w-full max-w-3xl animate-in zoom-in-95 duration-300">
               
               {/* Metrics Chips */}
               <div className="mb-10 flex flex-wrap justify-center items-center gap-3">
                  <div className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md ${currentResult.type === 'memorable' ? 'bg-eng-gold/10 border-eng-gold/30 text-eng-gold' : 'bg-eng-silver/10 border-eng-silver/20 text-eng-silver'}`}>
                    {currentResult.type === 'memorable' ? 'AI Passphrase' : currentResult.type === 'pin' ? 'Secure PIN' : 'Random Sequence'}
                  </div>
                  <div className="px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest border border-zinc-800 bg-black/40 text-zinc-400">
                    {Math.floor(currentResult.entropy)} bits
                  </div>
                   <div className="px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest border border-eng-success/20 bg-eng-success/5 text-eng-success flex items-center gap-1">
                    <Clock size={10}/> {getCrackTime()}
                  </div>
               </div>

               {/* Main Display Area */}
               <div className="relative group mb-10">
                 <div className={`absolute -inset-4 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition duration-700 ${mode === 'ai' ? 'bg-eng-gold/10' : 'bg-eng-silver/5'}`}></div>
                 <div className="relative">
                   
                   {/* Batch Nav Buttons */}
                   {batchResults.length > 1 && (
                     <>
                        <button 
                          onClick={() => handleBatchNav('prev')}
                          className="absolute left-[-20px] md:left-[-60px] top-1/2 -translate-y-1/2 text-zinc-700 hover:text-eng-gold transition-all hover:scale-125 p-2"
                        >
                          <ChevronLeft size={36} />
                        </button>
                        <button 
                          onClick={() => handleBatchNav('next')}
                          className="absolute right-[-20px] md:right-[-60px] top-1/2 -translate-y-1/2 text-zinc-700 hover:text-eng-gold transition-all hover:scale-125 p-2"
                        >
                          <ChevronRight size={36} />
                        </button>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] text-eng-gold font-mono tracking-widest bg-eng-gold/10 px-2 py-0.5 rounded border border-eng-gold/20">
                          VAR {batchIndex + 1} / {batchResults.length}
                        </div>
                     </>
                   )}

                   <div 
                    onClick={copyToClipboard}
                    className={`bg-black/60 backdrop-blur border rounded-xl p-8 break-all shadow-2xl cursor-pointer hover:border-opacity-50 transition-all active:scale-[0.99] select-all ${
                        mode === 'ai' ? 'border-eng-gold/30 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)]' : 'border-eng-silver/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]'
                    }`}
                   >
                      <p className={`font-mono text-white font-bold tracking-tight selection:bg-eng-gold selection:text-black ${currentResult.type === 'pin' ? 'text-6xl tracking-[0.3em] text-eng-silver' : 'text-3xl md:text-5xl'}`}>
                        {currentResult.value}
                      </p>
                   </div>
                   <p className="text-[10px] text-zinc-600 mt-3 font-mono">CLICK_TO_COPY_TO_CLIPBOARD</p>
                 </div>
               </div>

               {/* Phonetic Panel */}
               {showPhonetic && (
                 <div className="mb-8 bg-black/60 border border-eng-silver/10 p-5 rounded-lg text-left animate-in slide-in-from-top-4 backdrop-blur-sm">
                   <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3 border-b border-zinc-800 pb-2 flex items-center gap-2">
                     <Ear size={12}/> NATO Phonetic Breakdown
                   </p>
                   <div className="flex flex-wrap gap-2 justify-center">
                     {currentResult.value.split('').map((char, idx) => (
                       <div key={idx} className="flex flex-col items-center bg-zinc-900/80 border border-zinc-700/50 px-2.5 py-1.5 rounded min-w-[3rem]">
                         <span className={`font-mono text-lg font-bold leading-none mb-1 ${mode === 'ai' ? 'text-eng-gold' : 'text-white'}`}>{char}</span>
                         <span className="text-[9px] text-zinc-400 uppercase">{getNatoPhonetic(char)}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {/* Action Buttons */}
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                 <button 
                  onClick={copyToClipboard}
                  className={`w-full sm:w-auto px-10 py-3.5 rounded-lg font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 ${
                    copied 
                    ? 'bg-eng-success text-white shadow-[0_0_20px_rgba(39,174,96,0.4)] scale-105' 
                    : `${mode === 'ai' ? 'bg-eng-gold text-black hover:bg-white' : 'bg-white text-black hover:bg-eng-silver'} hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]`
                  }`}
                 >
                   {copied ? <Check size={16} /> : <Copy size={16} />}
                   {copied ? 'Copied to Clipboard' : 'Copy Password'}
                 </button>
                 
                 <button 
                   onClick={() => setShowPhonetic(!showPhonetic)}
                   className={`w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 border ${
                     showPhonetic
                     ? 'bg-zinc-800 text-white border-zinc-700'
                     : 'bg-transparent text-zinc-500 border-zinc-800 hover:text-white hover:border-zinc-600'
                   }`}
                 >
                   <Ear size={16} /> {showPhonetic ? 'Hide Phonetic' : 'Phonetic Readout'}
                 </button>
               </div>
               
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Generator;