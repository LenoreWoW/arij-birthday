import React, { useMemo } from 'react';
import { PROJECT_CODE } from '../utils/projectData';

export const CodeSlide: React.FC = () => {
  const renderedCode = useMemo(() => {
    return PROJECT_CODE.split('\n').map((line, i) => {
      // Very basic semantic coloring based on tokens
      let content: React.ReactNode = line;
      
      const isComment = line.trim().startsWith('#');
      const isImport = line.trim().startsWith('import') || line.trim().startsWith('from');
      const isDef = line.trim().startsWith('def ') || line.trim().startsWith('class ');
      
      if (isComment) {
        content = <span className="text-emerald-600 italic">{line}</span>;
      } else if (isImport) {
        // Highlight import keywords
        const parts = line.split(' ');
        content = parts.map((part, idx) => {
          if (['import', 'from', 'as'].includes(part)) {
             return <span key={idx} className="text-purple-400">{part} </span>;
          }
          return <span key={idx} className="text-slate-300">{part} </span>;
        });
      } else if (isDef) {
         // Highlight function definitions
         content = <span className="text-blue-400 font-bold">{line}</span>;
      } else {
         // Highlight common keywords in normal lines
         const tokens = line.split(/(\s+|[(){},.])/g);
         content = tokens.map((token, idx) => {
             if (['if', 'else', 'for', 'in', 'return', 'print', 'with', 'def', 'class'].includes(token.trim())) {
                 return <span key={idx} className="text-purple-400">{token}</span>
             }
             if (['True', 'False', 'None'].includes(token.trim())) {
                 return <span key={idx} className="text-orange-400">{token}</span>
             }
             if (token.match(/^\d+$/)) {
                 return <span key={idx} className="text-cyan-300">{token}</span>
             }
             // String literals (very basic approximation)
             if (token.startsWith('"') || token.startsWith("'")) {
                 return <span key={idx} className="text-yellow-300">{token}</span>
             }
             return <span key={idx}>{token}</span>;
         });
      }

      return (
        <div key={i} className="hover:bg-slate-800/50">
          <span className="inline-block w-8 mr-4 text-right text-slate-600 select-none text-xs">{i + 1}</span>
          {content}
        </div>
      );
    });
  }, []);

  return (
    <div className="h-full flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 select-none">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5">
             <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"></div>
             <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"></div>
           </div>
           <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-md border border-slate-800">
             <span className="text-blue-400 text-xs font-bold">PY</span>
             <span className="text-sm text-slate-300 font-mono">train_model.py</span>
           </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
           <span>utf-8</span>
           <span>Python 3.10</span>
           <span>Ln {PROJECT_CODE.split('\n').length}</span>
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 overflow-auto p-4 bg-[#0d1117] font-mono text-sm leading-6 text-slate-300">
        {renderedCode}
      </div>
    </div>
  );
};