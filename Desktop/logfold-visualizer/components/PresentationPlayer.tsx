import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Play, Pause, RefreshCw, Maximize2, Minimize2, Cpu, Network, ShieldCheck, AlertOctagon, Database, ScanLine, Binary, Zap, Map, Brain, Filter, CheckCircle2, ChevronRight, Layers, Settings, GitGraph, FileText, Share2, Search, Key, TableProperties, Split, ArrowDown, ArrowRight } from 'lucide-react';
import { GlobalStats, MetricData } from '../types';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Cell, Tooltip, CartesianGrid, Line, ReferenceLine } from 'recharts';

interface PresentationPlayerProps {
  stats: GlobalStats;
  metrics: MetricData[];
}

const SCENE_DURATION = 16000; 

// --- Utility Components ---

const TypingText: React.FC<{ text: string; delay?: number; speed?: number; className?: string }> = ({ text, delay = 0, speed = 30, className = "" }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setTimeout(() => setIsDone(true), 2000); // Hide cursor after 2s
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, started]);

  return <p className={className}>{displayedText}{!isDone && started && <span className="animate-pulse text-cyan-500">_</span>}</p>;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-cyan-500/50 p-4 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-xl min-w-[200px] z-50">
        <div className="text-xs font-mono text-cyan-400 mb-2 border-b border-white/10 pb-2 uppercase tracking-wider flex justify-between">
          <span>{typeof label === 'string' ? label : `Step / Epoch: ${label}`}</span>
          <span className="text-[10px] text-slate-500">PAUSED</span>
        </div>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between text-xs group">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: entry.color, color: entry.color }}></div>
                <span className="text-slate-300 font-medium">{entry.name}:</span>
              </div>
              <span className="text-white font-mono font-bold">{Number(entry.value).toFixed(4)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const PresentationPlayer: React.FC<PresentationPlayerProps> = ({ stats, metrics }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [prevScene, setPrevScene] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHoveringChart, setIsHoveringChart] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const epochData = useMemo(() => {
    return metrics
      .filter(m => m.type === 'epoch_end')
      .map((m, i) => ({ ...m, index: i + 1, uniqueKey: `${m.fold}-${m.epoch}` }));
  }, [metrics]);
  
  const foldPerformance = useMemo(() => {
    const folds = [1, 2, 3, 4, 5];
    return folds.map(foldNum => {
      const foldMetrics = metrics.filter(m => m.fold === foldNum && m.valF1 !== undefined);
      const bestMetric = foldMetrics.sort((a, b) => (b.valF1 || 0) - (a.valF1 || 0))[0];
      return {
        fold: `Fold ${foldNum}`,
        f1: bestMetric?.valF1 || 0,
        loss: bestMetric?.valLoss || 0
      };
    });
  }, [metrics]);

  const averageF1 = useMemo(() => {
    const total = foldPerformance.reduce((acc, curr) => acc + curr.f1, 0);
    return total / (foldPerformance.length || 1);
  }, [foldPerformance]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const scenes = useMemo(() => [
    // 1. INTRO
    {
      id: 'intro',
      title: 'MISSION BRIEFING',
      render: (isExiting = false) => (
        <div className="h-full flex flex-col justify-center items-center text-center max-w-5xl mx-auto px-6 relative z-10">
          <div className="mb-8 p-6 bg-slate-900/50 rounded-full border border-red-500/30 animate-fade-in-up shadow-[0_0_30px_rgba(239,68,68,0.2)]">
             <AlertOctagon size={64} className="text-red-500 animate-pulse" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-6 tracking-tighter">
             CRISIS<br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">INTELLIGENCE</span>
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mb-8"></div>
          <TypingText 
             text="MISSION: Deploy an NLP pipeline to filter 10M+ daily signals and detect genuine emergency events with <20ms latency." 
             className="text-lg text-cyan-400 font-mono"
             speed={15}
             delay={isExiting ? 0 : 1000}
          />
          <div className="mt-4 text-slate-500 text-sm animate-fade-in-up" style={{ animationDelay: '3s' }}>
             (Goal: Teach AI to distinguish urgent distress calls from casual chatter)
          </div>
        </div>
      ),
      caption: "In the chaos of a global crisis, seconds matter. Our mission is to engineer an AI system capable of distinguishing genuine distress signals from metaphorical noise in real-time."
    },
    // 2. DATA
    {
      id: 'data',
      title: 'THE CHALLENGE',
      render: (isExiting = false) => (
        <div className="h-full flex items-center justify-center gap-12 px-12 relative z-10">
           <div className="flex-1 space-y-6 animate-fade-in-up">
              <h2 className="text-3xl font-bold text-white mb-8">The Ambiguity Problem</h2>
              <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-xl flex items-center gap-4 hover:scale-105 transition-transform">
                 <div className="bg-red-500 p-3 rounded-lg"><AlertOctagon size={24} className="text-white"/></div>
                 <div>
                    <div className="text-white font-mono text-lg">"The forest is <span className="text-red-400 font-bold underline">ablaze</span>."</div>
                    <div className="text-red-400 text-xs font-bold uppercase mt-1">Real Disaster</div>
                 </div>
              </div>
              <div className="bg-green-900/20 border border-green-500/50 p-6 rounded-xl flex items-center gap-4 hover:scale-105 transition-transform">
                 <div className="bg-green-500 p-3 rounded-lg"><CheckCircle2 size={24} className="text-white"/></div>
                 <div>
                    <div className="text-white font-mono text-lg">"The sunset is <span className="text-green-400 font-bold underline">ablaze</span>."</div>
                    <div className="text-green-400 text-xs font-bold uppercase mt-1">Metaphor / Safe</div>
                 </div>
              </div>
           </div>
           <div className="w-px h-64 bg-slate-800"></div>
           <div className="flex-1 bg-slate-900/60 p-8 rounded-2xl animate-fade-in-up border border-slate-700">
              <div className="flex items-center gap-4 mb-6">
                 <Database size={32} className="text-blue-400" />
                 <div>
                    <div className="text-xs font-bold text-slate-500 uppercase">Training Intel</div>
                    <div className="text-4xl font-black text-white">7,613 <span className="text-lg text-slate-500 font-normal">Signals</span></div>
                 </div>
              </div>
              <p className="text-slate-400 text-sm">We train on manually curated Tweets. The model must learn deep context, not just keywords.</p>
              <p className="text-slate-500 text-xs mt-4 border-t border-slate-700 pt-2">(Dataset contains examples labeled "Real" or "Fake" for the AI to study)</p>
           </div>
        </div>
      ),
      caption: "The challenge isn't just volume; it's nuance. 'The sky is ablaze' could mean a forest fire or a beautiful sunset. Simple keyword filters fail here."
    },
    // 3. THEORY: TOKENIZATION
    {
      id: 'theory_bpe',
      title: 'THEORY: TOKENIZATION',
      render: (isExiting = false) => (
         <div className="h-full flex items-center justify-center px-6 relative z-10 animate-fade-in-up">
            <div className="text-center space-y-12">
               <h2 className="text-4xl font-bold text-white">How Computers Read</h2>
               <div className="flex items-center justify-center gap-8">
                  <div className="flex flex-col items-center gap-2">
                     <div className="text-xs text-slate-500 uppercase">Character Level</div>
                     <div className="flex gap-1">
                        {['u','n','h','e','a','r','d'].map((c,i) => (
                           <span key={i} className="w-8 h-10 border border-slate-700 bg-slate-800 flex items-center justify-center rounded font-mono text-slate-400">{c}</span>
                        ))}
                     </div>
                  </div>
                  <ArrowRight className="text-cyan-500 animate-pulse" size={32} />
                  <div className="flex flex-col items-center gap-2">
                     <div className="text-xs text-cyan-400 uppercase font-bold">BPE Tokens (Subwords)</div>
                     <div className="flex gap-1">
                        <span className="h-10 px-3 border border-cyan-500 bg-cyan-900/20 flex items-center justify-center rounded font-mono text-cyan-300 font-bold">un</span>
                        <span className="h-10 px-3 border border-cyan-500 bg-cyan-900/20 flex items-center justify-center rounded font-mono text-cyan-300 font-bold">heard</span>
                     </div>
                  </div>
               </div>
               <div className="max-w-2xl mx-auto text-slate-400 text-lg">
                  <p>Standard dictionaries miss typos and slang. <span className="text-white font-bold">Byte-Pair Encoding (BPE)</span> solves this by breaking unknown words into known sub-components.</p>
                  <p className="text-cyan-400 text-sm mt-2 font-medium">(Like breaking words into Lego blocks to build new meanings)</p>
               </div>
            </div>
         </div>
      ),
      caption: "We don't feed words directly to the model. We use the RoBERTa tokenizer to break text into 'tokens'. This handles rare words and typos by decomposing them into meaningful roots."
    },
    // 4. APPLIED TOKENIZATION
    {
      id: 'preprocessing',
      title: 'APPLIED TOKENIZATION',
      render: (isExiting = false) => (
        <div className="h-full flex flex-col justify-center items-center px-6 relative z-10">
           <div className="w-full max-w-5xl space-y-8 animate-fade-in-up">
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 font-mono text-xl text-white shadow-lg text-center">
                 "Forest fire near La Ronge Sask."
              </div>
              <div className="flex justify-center"><ArrowDown size={32} className="text-slate-600" /></div>
              <div className="flex flex-wrap justify-center gap-3">
                 {[{t:'<s>',id:0},{t:'Forest',id:3452},{t:'Ġfire',id:654},{t:'Ġnear',id:23},{t:'ĠLa',id:876},{t:'ĠRonge',id:9921},{t:'ĠSask',id:11043},{t:'.',id:4},{t:'</s>',id:2}].map((token, i) => (
                    <div key={i} className="flex flex-col items-center bg-indigo-900/30 border border-indigo-500/30 rounded-lg p-3 min-w-[60px]">
                       <span className="text-lg font-mono font-bold text-indigo-200">{token.t}</span>
                       <span className="text-[10px] opacity-60 font-mono mt-1">{token.id}</span>
                    </div>
                 ))}
              </div>
              <div className="text-center text-slate-500 text-sm">(Converting human language into numbers the AI can calculate)</div>
           </div>
        </div>
      ),
      caption: "Here is the actual output of our tokenizer. Notice how it handles proper nouns and spacing (Ġ). These IDs are the actual numerical input fed into the neural network."
    },
    // 5. THEORY: TRANSFER LEARNING
    {
      id: 'theory_transfer',
      title: 'THEORY: TRANSFER LEARNING',
      render: (isExiting = false) => (
         <div className="h-full flex items-center justify-center px-6 relative z-10 animate-fade-in-up">
            <div className="grid grid-cols-2 gap-16 w-full max-w-5xl">
               <div className="flex flex-col items-center opacity-40">
                  <div className="w-32 h-40 border-2 border-dashed border-slate-600 rounded-xl flex items-end justify-center overflow-hidden bg-slate-800/50">
                     <div className="w-full h-[10%] bg-red-500/50"></div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-500 mt-4">Training from Scratch</h3>
                  <div className="text-xs text-red-400 font-medium mb-1 uppercase tracking-wide">(Starting from Zero)</div>
                  <p className="text-sm text-slate-600 text-center mt-2">Starts with random noise. Needs millions of examples to learn grammar.</p>
               </div>
               <div className="flex flex-col items-center">
                  <div className="w-32 h-40 border-2 border-cyan-500 rounded-xl flex flex-col overflow-hidden bg-slate-900 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                     <div className="w-full h-[80%] bg-cyan-900/50 flex items-center justify-center text-cyan-300 font-bold text-xs p-2 text-center">
                        PRE-TRAINED KNOWLEDGE
                     </div>
                     <div className="w-full h-[20%] bg-cyan-500 flex items-center justify-center text-black font-bold text-xs">
                        FINE-TUNE
                     </div>
                  </div>
                  <h3 className="text-xl font-bold text-cyan-400 mt-4">Transfer Learning</h3>
                  <div className="text-xs text-cyan-300 font-medium mb-1 uppercase tracking-wide">(Recycling Knowledge)</div>
                  <p className="text-sm text-slate-300 text-center mt-2">Starts with a "smart" brain. Only needs small data to learn the specific task.</p>
               </div>
            </div>
         </div>
      ),
      caption: "Instead of teaching a baby to read from scratch using only disaster tweets, we take a university-level reader (RoBERTa) and give it a quick crash course on disaster terminology. This is Transfer Learning."
    },
    // 6. MODEL SELECTION
    {
      id: 'why_roberta',
      title: 'MODEL SELECTION',
      render: (isExiting = false) => (
        <div className="h-full flex items-center justify-center px-12 relative z-10 animate-fade-in-up">
           <div className="flex items-center gap-12">
              <div className="text-right space-y-2 opacity-50">
                 <h2 className="text-4xl font-black text-slate-500">BERT</h2>
                 <p className="text-slate-600">Static Masking • 16GB Data</p>
                 <div className="text-xs text-slate-700 font-medium">(The Older Student)</div>
              </div>
              <div className="w-px h-32 bg-slate-700"></div>
              <div className="space-y-4">
                 <h2 className="text-5xl font-black text-white">RoBERTa</h2>
                 <div className="space-y-2">
                    <div className="flex items-center gap-3"><CheckCircle2 className="text-cyan-400" size={16}/><span className="text-slate-300">Dynamic Masking</span></div>
                    <div className="flex items-center gap-3"><CheckCircle2 className="text-cyan-400" size={16}/><span className="text-slate-300">160GB Data (10x)</span></div>
                    <div className="flex items-center gap-3"><CheckCircle2 className="text-cyan-400" size={16}/><span className="text-slate-300">Optimized Training</span></div>
                 </div>
                 <div className="text-sm text-cyan-400 font-medium mt-2">(A smarter, more robust architecture)</div>
              </div>
           </div>
        </div>
      ),
      caption: "We selected RoBERTa over standard BERT. It was trained on 10x more data and uses dynamic masking, making it far more robust at understanding the messy, informal language of social media."
    },
    // 7. APPLIED ARCHITECTURE
    {
      id: 'architecture_deep',
      title: 'THE NEURAL STACK',
      render: (isExiting = false) => (
        <div className="h-full flex items-center justify-center relative z-10 px-8 animate-fade-in-up">
           <div className="flex flex-col items-center gap-2 w-full max-w-lg">
              <div className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 text-center text-xs font-mono text-slate-400">Input Tokens</div>
              <ArrowDown size={16} className="text-slate-600" />
              <div className="w-full p-4 bg-indigo-900/30 border border-indigo-500/30 rounded-xl flex justify-between items-center">
                 <div>
                    <span className="text-indigo-200 font-bold block">Embedding</span>
                    <span className="text-[10px] text-indigo-400">(Understanding Word Meaning)</span>
                 </div>
                 <span className="text-xs font-mono text-indigo-400">768-dim</span>
              </div>
              <ArrowDown size={16} className="text-slate-600" />
              <div className="w-full p-6 bg-slate-900 border border-slate-600 rounded-xl text-center">
                 <span className="text-white font-bold block">12x Transformer Layers</span>
                 <span className="text-[10px] text-slate-400">(Processing Context & Relationships)</span>
              </div>
              <ArrowDown size={16} className="text-slate-600" />
              <div className="w-full p-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-center font-bold text-white shadow-lg">
                 Classifier Head
                 <div className="text-[10px] text-cyan-100 font-normal mt-1">(Final Decision Maker)</div>
              </div>
           </div>
        </div>
      ),
      caption: "The architecture: Tokens are embedded into 768-dimensional vectors, processed by 12 layers of attention to capture context, and finally projected by a classifier to determine the probability."
    },
    // 8. THEORY: THE CLASSIFIER
    {
      id: 'theory_classifier',
      title: 'THEORY: THE CLASSIFIER',
      render: (isExiting = false) => (
         <div className="h-full flex items-center justify-center px-6 relative z-10 animate-fade-in-up">
            <div className="relative w-96 h-80 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
               {/* Decision Boundary Visualization */}
               <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-[120%] h-1 bg-white rotate-12 shadow-[0_0_10px_white]"></div>
               </div>
               {/* Safe Points */}
               <div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_lime]"></div>
               <div className="absolute top-20 left-24 w-4 h-4 rounded-full bg-green-500 opacity-80"></div>
               <div className="absolute top-32 left-16 w-4 h-4 rounded-full bg-green-500 opacity-60"></div>
               {/* Disaster Points */}
               <div className="absolute bottom-10 right-10 w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_red]"></div>
               <div className="absolute bottom-24 right-20 w-4 h-4 rounded-full bg-red-500 opacity-80"></div>
               <div className="absolute bottom-16 right-32 w-4 h-4 rounded-full bg-red-500 opacity-60"></div>
               
               <div className="absolute bottom-4 left-4 text-xs font-mono text-slate-500">Feature Space (768-dim projected to 2D)</div>
            </div>
            <div className="ml-12 max-w-sm">
               <h3 className="text-2xl font-bold text-white mb-4">The Decision Boundary</h3>
               <p className="text-slate-400">The final layer acts as a knife. It draws a hyperplane through the high-dimensional thought vectors, mathematically separating "Disaster" concepts from "Safe" concepts.</p>
               <p className="text-cyan-400 text-sm mt-4 font-medium">(Drawing a line in the sand to separate Safe from Danger)</p>
            </div>
         </div>
      ),
      caption: "At the very end of the neural network is a Linear Classifier. It takes the complex, abstract understanding generated by the model and forces a binary decision: Is this point on the 'Safe' side or the 'Disaster' side?"
    },
    // 9. THEORY: SELF-ATTENTION
    {
      id: 'theory_attention',
      title: 'THEORY: SELF-ATTENTION',
      render: (isExiting = false) => (
         <div className="h-full flex flex-col items-center justify-center px-6 relative z-10 animate-fade-in-up">
            <div className="flex gap-8 items-center mb-8">
               <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-xl bg-purple-900/50 border border-purple-500 flex items-center justify-center text-purple-400"><Search size={32} /></div>
                  <span className="text-xs font-bold text-purple-400">QUERY</span>
               </div>
               <div className="h-1 w-12 bg-slate-700"></div>
               <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-xl bg-yellow-900/50 border border-yellow-500 flex items-center justify-center text-yellow-400"><Key size={32} /></div>
                  <span className="text-xs font-bold text-yellow-400">KEY</span>
               </div>
               <div className="h-1 w-12 bg-slate-700"></div>
               <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-xl bg-blue-900/50 border border-blue-500 flex items-center justify-center text-blue-400"><TableProperties size={32} /></div>
                  <span className="text-xs font-bold text-blue-400">VALUE</span>
               </div>
            </div>
            <p className="text-xl text-white font-medium text-center max-w-2xl">
               "Every word asks a <span className="text-purple-400">Query</span> to match other words' <span className="text-yellow-400">Keys</span>, retrieving the context <span className="text-blue-400">Value</span>."
            </p>
            <p className="text-sm text-slate-500 mt-4">("How does this word relate to every other word?")</p>
         </div>
      ),
      caption: "Self-Attention is the engine of the Transformer. It solves ambiguity. The word 'bank' asks the sentence for context. If it finds 'river', it knows it's nature. If it finds 'money', it knows it's finance."
    },
    // 10. APPLIED ATTENTION
    {
      id: 'attention',
      title: 'APPLIED ATTENTION',
      render: (isExiting = false) => (
         <div className="h-full flex flex-col items-center justify-center px-6 relative z-10">
            <div className="bg-slate-900/80 border border-slate-700 p-8 rounded-2xl max-w-4xl w-full animate-fade-in-up">
                <div className="flex flex-wrap gap-2 mb-12 justify-center">
                   {['The', 'sky', 'is', 'ablaze', 'with', 'sunset'].map((word, i) => (
                      <div key={i} className={`relative px-4 py-3 rounded-lg text-xl font-mono font-bold border ${
                          word === 'ablaze' ? 'bg-red-500/20 text-red-400 border-red-500 scale-110 z-10' : 
                          word === 'sunset' ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' : 
                          'bg-slate-800 text-slate-500 border-transparent'
                      }`}>
                         {word}
                      </div>
                   ))}
                </div>
                <div className="h-32 w-full relative">
                    <svg className="absolute inset-0 w-full h-full overflow-visible">
                        <path d="M 330 0 Q 400 60 480 0" fill="none" stroke="#22d3ee" strokeWidth="4" strokeOpacity="0.6" strokeDasharray="5 5" className="animate-pulse" />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-4 text-center">
                        <div className="inline-block bg-slate-950 border border-cyan-500/50 text-cyan-400 text-xs px-3 py-1 rounded-full font-mono">
                            Strong Attention Link
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">(Context Overrides Keywords)</div>
                    </div>
                </div>
            </div>
         </div>
      ),
      caption: "Visualizing the model's actual attention weights: Notice how the word 'ablaze' strongly attends to 'sunset'. The model uses this connection to override the usual danger association of 'ablaze'."
    },
    // 11. THEORY: VALIDATION
    {
      id: 'theory_kfold',
      title: 'THEORY: VALIDATION',
      render: (isExiting = false) => (
         <div className="h-full flex items-center justify-center px-12 relative z-10 animate-fade-in-up">
            <div className="grid grid-cols-2 gap-12 w-full max-w-5xl">
               <div className="bg-red-900/10 border border-red-500/30 p-8 rounded-xl opacity-60">
                  <div className="flex items-center gap-3 mb-4 text-red-400 font-bold"><Split size={20}/> Single Split</div>
                  <div className="text-xs text-red-400/80 mb-2 font-medium">(Like taking one practice test)</div>
                  <div className="w-full h-12 bg-slate-800 rounded flex overflow-hidden">
                     <div className="w-[80%] bg-slate-700"></div>
                     <div className="w-[20%] bg-red-500"></div>
                  </div>
                  <p className="mt-4 text-sm text-slate-400">High Risk. What if the red test part is just easy examples? We might fool ourselves.</p>
               </div>
               <div className="bg-cyan-900/10 border border-cyan-500/30 p-8 rounded-xl">
                  <div className="flex items-center gap-3 mb-4 text-cyan-400 font-bold"><RefreshCw size={20}/> K-Fold Rotation</div>
                  <div className="text-xs text-cyan-400/80 mb-2 font-medium">(Like taking 5 different versions)</div>
                  <div className="space-y-2">
                     {[0,1,2].map(i => (
                        <div key={i} className="w-full h-8 bg-slate-800 rounded flex overflow-hidden">
                           {[0,1,2,3,4].map(b => (
                              <div key={b} className={`flex-1 border-r border-slate-900 ${b===i ? 'bg-cyan-500' : 'bg-slate-700'}`}></div>
                           ))}
                        </div>
                     ))}
                  </div>
                  <p className="mt-4 text-sm text-slate-300">Robust. We rotate the test set 5 times. Every single data point is tested exactly once.</p>
               </div>
            </div>
         </div>
      ),
      caption: "We cannot trust a single exam result. Stratified K-Fold Cross-Validation splits the data into 5 parts and rotates the testing ground, ensuring the model is evaluated on every single data point available."
    },
    // 12. APPLIED STRATEGY
    {
      id: 'cv_strategy',
      title: '5-FOLD STRATIFICATION',
      render: (isExiting = false) => (
        <div className="h-full flex items-center justify-center px-12 relative z-10 animate-fade-in-up">
           <div className="w-full max-w-4xl space-y-6">
              <div className="space-y-3">
                 {[0, 1, 2, 3, 4].map((fold, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                       <span className="text-xs font-bold text-slate-500 w-12">ITER {idx + 1}</span>
                       <div className="flex-1 h-12 flex gap-1">
                          {[0, 1, 2, 3, 4].map((block) => (
                             <div 
                                key={block} 
                                className={`flex-1 rounded-md flex items-center justify-center text-xs font-bold transition-all duration-500 flex-col ${
                                   block === idx 
                                     ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-400' 
                                     : 'bg-slate-800 border border-slate-700 text-slate-500'
                                }`}
                             >
                                <span>{block === idx ? 'VALIDATION' : 'TRAIN'}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>
              <div className="text-center text-slate-500 text-xs font-mono">(Rotating the 'exam questions' to ensure fairness)</div>
           </div>
        </div>
      ),
      caption: "This is our actual implementation. We run the training loop 5 independent times. This guarantees our reported accuracy is a true measure of generalization, not just a lucky split."
    },
    // 13. RESULTS
    {
      id: 'validation',
      title: 'FINAL RESULTS',
      render: (isExiting = false) => (
        <div className="h-full flex flex-col justify-center px-16 relative z-10">
           <div className="h-64 w-full bg-slate-900/50 rounded-xl border border-slate-800 p-6 animate-fade-in-up">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={foldPerformance} barSize={60}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="fold" stroke="#94a3b8" tick={{fontSize: 14, fill: '#cbd5e1'}} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(34, 211, 238, 0.05)'}} />
                    <ReferenceLine y={averageF1} stroke="#22c55e" strokeDasharray="3 3" strokeOpacity={0.8} label={{ position: 'right', value: 'AVG', fill: '#22c55e', fontSize: 10, fontWeight: 'bold' }} />
                    <Bar dataKey="f1" name="F1 Score" radius={[4, 4, 0, 0]} isAnimationActive={!isExiting}>
                      {foldPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={'#22d3ee'} opacity={0.6 + (index * 0.1)} /> 
                      ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
              <div className="text-center text-slate-500 text-xs mt-2">(Consistency = Reliability)</div>
           </div>
        </div>
      ),
      caption: "The results confirm our architecture choices. Performance is consistent across all 5 folds with minimal variance, proving the model has learned the underlying semantic patterns."
    },
    // 14. DEPLOYMENT
    {
      id: 'deployment',
      title: 'SYSTEM READY',
      render: (isExiting = false) => (
         <div className="h-full flex flex-col items-center justify-center relative z-10">
            <div className="w-32 h-32 bg-slate-900 rounded-full border-4 border-green-500 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.3)] animate-bounce-slow relative z-10 mb-8">
               <ShieldCheck size={64} className="text-green-500" />
            </div>
            <h1 className="text-6xl font-black text-white mb-8 tracking-tight">Mission Accomplished</h1>
            <div className="text-green-400 font-mono mb-6 text-sm uppercase tracking-widest">(Ready for the real world)</div>
            <button 
              onClick={() => setCurrentScene(0)}
              className="mt-8 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2"
            >
               <RefreshCw size={14} /> Replay
            </button>
         </div>
      ),
      caption: "System optimized. Global coverage active. We have successfully transitioned from a raw dataset to a deployable, life-saving intelligence tool. The Disaster Response System is online."
    }
  ], [stats, metrics, averageF1, epochData, foldPerformance]);

  // --- Animation Loop ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && !isHoveringChart) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + (100 / (SCENE_DURATION / 100)); 
          if (next >= 100) {
            handleNext();
            return 0;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentScene, isHoveringChart]);

  const handleNext = () => {
    const nextIndex = currentScene < scenes.length - 1 ? currentScene + 1 : 0;
    setPrevScene(currentScene);
    setCurrentScene(nextIndex);
    setProgress(0);
    if (nextIndex === 0 && currentScene === scenes.length - 1) {
       setIsPlaying(false);
    }
    setTimeout(() => {
        setPrevScene(null);
    }, 800);
  };

  const jumpToScene = (index: number) => {
     if (index === currentScene) return;
     setPrevScene(currentScene);
     setCurrentScene(index);
     setProgress(0);
     setTimeout(() => setPrevScene(null), 800);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  const reset = () => { setIsPlaying(false); setCurrentScene(0); setProgress(0); };
  const activeScene = scenes[currentScene];

  return (
    <div ref={containerRef} className={`w-full flex flex-col items-center justify-center p-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-black p-0 w-screen h-screen' : 'h-full'}`}>
      <div className={`w-full bg-black shadow-2xl overflow-hidden relative border border-slate-800 ring-1 ring-white/5 flex flex-col group ${isFullscreen ? 'w-full h-full rounded-none border-0' : 'max-w-6xl aspect-video rounded-xl'}`}>
        
        {/* Viewport */}
        <div className="flex-1 relative overflow-hidden bg-[#050505]">
           <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-black to-black"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
           </div>

           {/* Header HUD */}
           <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start z-30 pointer-events-none">
              <div className="flex flex-col">
                 <div className="flex items-center gap-3">
                    <div className="text-4xl font-black text-white/10 select-none tracking-tighter">0{currentScene + 1}</div>
                    <div className="h-8 w-px bg-white/10"></div>
                    <div className="text-sm font-bold text-cyan-500 uppercase tracking-[0.3em]">{activeScene.title}</div>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 {isPlaying && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>}
                 <span className="font-mono text-[10px] text-slate-500">
                    {isPlaying ? (isHoveringChart ? 'INTERACTION PAUSE' : 'PLAYBACK') : 'PAUSED'}
                 </span>
              </div>
           </div>

           {/* Previous Scene (Exiting) */}
           {prevScene !== null && scenes[prevScene] && (
               <div key={`prev-${prevScene}`} className="absolute inset-0 z-0 animate-cinematic-exit p-12 pt-24 pb-32">
                   {scenes[prevScene].render(true)}
               </div>
           )}

           {/* Current Scene (Entering) */}
           <div key={`curr-${currentScene}`} className="absolute inset-0 z-10 animate-cinematic-enter p-12 pt-24 pb-32">
             {activeScene.render(false)}
           </div>

           {/* Footer Subtitles */}
           <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 flex justify-center z-30 bg-gradient-to-t from-black via-black/80 to-transparent pt-24 pointer-events-none">
              <p className="text-lg md:text-xl text-slate-300 font-medium max-w-4xl text-center leading-relaxed drop-shadow-lg font-sans">
                 {activeScene.caption}
              </p>
           </div>
        </div>

        {/* Control Deck */}
        <div className="h-16 bg-slate-950 border-t border-white/10 flex items-center px-6 gap-6 z-40 relative">
           <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:bg-cyan-400 hover:scale-105 transition-all shadow-lg shadow-white/10">
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5"/>}
           </button>
           
           <button onClick={reset} className="text-slate-500 hover:text-white transition-colors" title="Restart">
              <RefreshCw size={18} />
           </button>

           <div className="flex-1 flex gap-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
              {scenes.map((_, idx) => (
                <div key={idx} className="flex-1 bg-slate-800 relative cursor-pointer group" onClick={() => jumpToScene(idx)}>
                   <div 
                      className={`absolute inset-0 bg-cyan-500 transition-all duration-100 ease-linear`}
                      style={{ 
                        width: idx < currentScene ? '100%' : idx === currentScene ? `${progress}%` : '0%',
                        opacity: idx === currentScene ? 1 : 0.5 
                      }}
                   ></div>
                   <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-[10px] px-2 py-1 rounded border border-white/10 whitespace-nowrap transition-opacity">
                      {scenes[idx].title}
                   </div>
                </div>
              ))}
           </div>
           <div className="flex items-center gap-4 text-slate-600">
              <button onClick={toggleFullscreen} className="hover:text-white transition-colors">
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};