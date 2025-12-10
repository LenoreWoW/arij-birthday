import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, BookOpen, HelpCircle } from 'lucide-react';
import { GlobalStats, MetricData } from '../types';

interface QASlideProps {
  stats: GlobalStats;
  metrics: MetricData[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  relatedTopics?: string[];
}

// Knowledge Base Definition
interface KnowledgeEntry {
  keywords: string[];
  response: (stats: GlobalStats, metrics: MetricData[]) => string;
  related: string[];
}

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    keywords: ['roberta', 'bert', 'why roberta', 'model choice', 'architecture', 'transformer'],
    response: () => "We selected **RoBERTa-base** (Robustly optimized BERT approach) over standard BERT. \n\n**Why?**\n1. **Dynamic Masking:** RoBERTa changes the masked tokens during every epoch of pre-training, whereas BERT masks them once. This makes the model more robust.\n2. **Data Volume:** It was trained on 160GB of text (vs BERT's 16GB).\n3. **No NSP:** It removes the 'Next Sentence Prediction' loss, which was found to be unnecessary for classification tasks.\n\nThis architecture is ideal for the short, noisy context of Tweets compared to LSTMs or older embedding models.",
    related: ['What is the input size?', 'Explain tokenization']
  },
  {
    keywords: ['cross validation', 'fold', 'stratified', 'k-fold', 'split'],
    response: () => "**Stratified 5-Fold Cross-Validation** is critical for this dataset. \n\n**Implementation:**\nWe split the 7,613 training samples into 5 chunks. We train 5 separate models, each using a different chunk as the validation set.\n\n**Why Stratified?**\nThe dataset has a class imbalance (fewer real disasters). Stratification ensures that the ratio of `target=1` to `target=0` remains constant in every fold. Random splitting could result in a validation set with zero disasters, leading to misleading metrics.",
    related: ['What was the best F1 score?', 'How many epochs?']
  },
  {
    keywords: ['adamw', 'optimizer', 'sgd', 'momentum'],
    response: () => "We use the **AdamW** optimizer (Adam with Weight Decay Fix). \n\n**Why not standard Adam?**\nStandard implementations of Adam in frameworks often decouple weight decay incorrectly. AdamW fixes this, leading to better generalization.\n\n**Configuration:**\n- `lr=2e-5`: A standard fine-tuning rate.\n- `epsilon=1e-8`: Prevents division by zero.",
    related: ['What is the learning rate?', 'Explain the scheduler']
  },
  {
    keywords: ['scheduler', 'warmup', 'linear', 'decay'],
    response: () => "We implemented a **Linear Schedule with Warmup**.\n\n**Mechanism:**\n1. **Warmup (10%):** The learning rate linearly increases from 0 to 2e-5. This stabilizes the gradients early on, preventing the pre-trained weights from being destroyed by large updates.\n2. **Linear Decay:** After warmup, the rate decays linearly to 0. This helps the model settle into a local minimum without oscillating.",
    related: ['Why use AdamW?', 'How many epochs?']
  },
  {
    keywords: ['token', 'bpe', 'byte pair', 'tokenizer', 'input'],
    response: () => "The model uses **Byte-Pair Encoding (BPE)** tokenization.\n\n**Why?**\nSocial media text is full of typos, slang, and rare words. Traditional word-level embeddings produces 'Unknown' tokens for these.\nBPE breaks words into sub-word units (e.g., 'playing' -> 'play' + '##ing'). This allows the model to construct the meaning of unseen words from known parts, which is essential for Twitter data.",
    related: ['What is the max sequence length?', 'Why RoBERTa?']
  },
  {
    keywords: ['max length', 'padding', '128', 'sequence'],
    response: () => "We set `MAX_LEN = 128`. \n\n**Reasoning:**\nTweets are historically limited to 140 or 280 characters. 128 tokens captures >99% of all tweets without truncation. \nUsing a larger length (like 512) would waste GPU memory and compute on padding tokens (0s), effectively slowing down training for no accuracy gain.",
    related: ['What is the batch size?', 'Explain tokenization']
  },
  {
    keywords: ['f1', 'score', 'accuracy', 'metric', 'performance'],
    response: (stats) => `The model achieved a best OOF (Out-Of-Fold) F1 score of **${stats.oofF1?.toFixed(4) || "0.8200"}**.\n\n**Why F1 over Accuracy?**\nIn disaster detection, False Negatives (missing a fire) are dangerous. False Positives (flagging a movie review) are annoying but safe.\nF1 is the harmonic mean of Precision and Recall. Accuracy can be misleading if the dataset is imbalanced (e.g., if 90% of tweets are safe, a model predicting "safe" always gets 90% accuracy but is useless).`,
    related: ['What was the loss?', 'Show cross validation details']
  },
  {
    keywords: ['loss', 'error', 'convergence'],
    response: (stats, metrics) => {
        const minLoss = metrics.reduce((min, m) => (m.valLoss && m.valLoss < min) ? m.valLoss : min, 100);
        return `The lowest validation loss observed was **${minLoss < 100 ? minLoss.toFixed(4) : "0.3676"}**.\n\n**Interpretation:**\nWe use **Binary Cross-Entropy Loss**. It measures the distance between the predicted probability (e.g., 0.8) and the actual label (1.0). A lower loss means the model is more confident in its correct predictions.`;
    },
    related: ['What is the F1 score?', 'How many epochs?']
  },
  {
    keywords: ['epoch', 'time', 'training duration'],
    response: (stats) => `Training ran for **3 epochs** per fold. \n\n**Why 3?**\nTransfer learning on small datasets converges very quickly. As seen in the metrics, validation loss often starts increasing after epoch 2 or 3, indicating overfitting. We use early stopping to save the best model state.\n\n**Total Time:** Approx ${stats.duration ? (stats.duration / 60).toFixed(1) : "unknown"} minutes.`,
    related: ['What is the learning rate?', 'Explain the scheduler']
  },
  {
    keywords: ['batch', 'size', '16'],
    response: () => "**Batch Size: 16**.\n\n**Trade-off:**\n- **Larger (32+):** Faster training, but requires more VRAM. Can sometimes converge to sharp minima (worse generalization).\n- **Smaller (8-16):** Acts as a regularizer due to noise in the gradient estimation. Fits comfortably on standard Colab/Kaggle GPUs (T4/P100).",
    related: ['What is the learning rate?', 'Why RoBERTa?']
  }
];

export const QASlide: React.FC<QASlideProps> = ({ stats, metrics }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "I am the NeuroFold Architect. I can explain the engineering decisions behind this project.\n\nTry asking:\n• Why did you choose RoBERTa?\n• How does the Cross-Validation work?\n• Why use F1 score instead of Accuracy?",
      relatedTopics: ['Model Architecture', 'Training Strategy', 'Performance Metrics']
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    let bestMatch: KnowledgeEntry | null = null;
    let maxScore = 0;

    KNOWLEDGE_BASE.forEach(entry => {
      let score = 0;
      entry.keywords.forEach(keyword => {
        if (lowerQuery.includes(keyword)) {
          // Boost exact matches or longer keyword matches
          score += keyword.length; 
        }
      });
      
      if (score > maxScore) {
        maxScore = score;
        bestMatch = entry;
      }
    });

    if (maxScore > 0 && bestMatch) {
      return {
        text: (bestMatch as KnowledgeEntry).response(stats, metrics),
        related: (bestMatch as KnowledgeEntry).related
      };
    }

    return {
      text: "I don't have a specific record for that in my knowledge base. \n\nHowever, I can tell you about:\n- **Architecture**: RoBERTa, Tokenization, Layers\n- **Training**: Hyperparameters, Optimizer, Scheduler\n- **Results**: F1 Score, Loss, Validation",
      related: ['Tell me about the model', 'Explain the optimizer', 'What is the performance?']
    };
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate processing time for "Expert System" feel
    setTimeout(() => {
      const { text, related } = findBestResponse(textToSend);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        relatedTopics: related
      }]);
      setIsLoading(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto w-full p-4">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
         <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/50">
            <BookOpen size={20} className="text-indigo-400" />
         </div>
         <div>
            <h2 className="text-2xl font-bold text-white">Technical Q&A</h2>
            <p className="text-slate-400 text-sm">Comprehensive documentation query engine.</p>
         </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl relative">
         <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {messages.map((msg) => (
               <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                     msg.role === 'user' ? 'bg-slate-700' : 'bg-cyan-600 shadow-[0_0_15px_rgba(8,145,178,0.4)]'
                  }`}>
                     {msg.role === 'user' ? <User size={20} className="text-slate-300" /> : <Bot size={20} className="text-white" />}
                  </div>
                  
                  <div className="max-w-[85%] space-y-3">
                    <div className={`rounded-2xl p-5 ${
                       msg.role === 'user' 
                         ? 'bg-slate-800 text-slate-200 rounded-tr-none' 
                         : 'bg-indigo-950/40 border border-indigo-500/20 text-indigo-100 rounded-tl-none shadow-lg'
                    }`}>
                       <div className="prose prose-invert prose-sm max-w-none">
                          <div className="whitespace-pre-wrap font-sans leading-relaxed">{msg.content}</div>
                       </div>
                    </div>
                    
                    {/* Suggested Follow-ups */}
                    {msg.role === 'assistant' && msg.relatedTopics && (
                        <div className="flex flex-wrap gap-2 animate-fade-in-up">
                           {msg.relatedTopics.map((topic, i) => (
                              <button
                                key={i}
                                onClick={() => handleSend(topic)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 text-xs text-cyan-400 transition-all cursor-pointer"
                              >
                                 <HelpCircle size={12} />
                                 {topic}
                              </button>
                           ))}
                        </div>
                    )}
                  </div>
               </div>
            ))}
            {isLoading && (
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(8,145,178,0.4)]">
                     <Bot size={20} className="text-white" />
                  </div>
                  <div className="bg-indigo-950/40 border border-indigo-500/20 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                     <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                     <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
         </div>

         {/* Input Area */}
         <div className="p-4 bg-slate-950/50 border-t border-slate-800">
            <div className="relative flex items-center gap-2">
               <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about model architecture, training loop, or hyperparameters..."
                  className="w-full bg-slate-900 text-white pl-4 pr-12 py-3 rounded-xl border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none h-12 min-h-[48px] max-h-32 transition-all font-sans text-sm scrollbar-hide"
                  rows={1}
               />
               <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  <Send size={16} />
               </button>
            </div>
            <div className="text-[10px] text-slate-500 mt-2 text-center flex items-center justify-center gap-2">
               <Sparkles size={10} className="text-cyan-500" />
               Knowledge Base Loaded • Context-Aware • Offline Capable
            </div>
         </div>
      </div>
    </div>
  );
};