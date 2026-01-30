
import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, Map, Wine, Utensils } from 'lucide-react';
import { Farm } from '../types';
import { askConcierge } from '../services/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIConciergeProps {
  isOpen: boolean;
  onClose: () => void;
  allFarms: Farm[];
}

const AIConcierge: React.FC<AIConciergeProps> = ({ isOpen, onClose, allFarms }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Buongiorno! Sono il tuo Concierge TerreFVG. Come posso aiutarti a scoprire le eccellenze del Friuli Venezia Giulia oggi?' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: messageText }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const response = await askConcierge(messageText, allFarms);
    setMessages([...newMessages, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  const suggestions = [
    { label: "Consigliami un vino bianco", icon: <Wine size={14} /> },
    { label: "Dove posso dormire in tenda?", icon: <Map size={14} /> },
    { label: "Cosa mangiare a Claut?", icon: <Utensils size={14} /> }
  ];

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1a1614] w-full max-w-2xl h-[600px] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up border dark:border-white/10 transition-colors duration-300">
        {/* Header */}
        <div className="bg-[#5f4f44] dark:bg-[#2a2420] p-6 text-white flex items-center justify-between border-b dark:border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 dark:bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Bot size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Concierge TerreFVG</h2>
              <p className="text-[#d2cbc6] dark:text-gray-400 text-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-[#8d7a6e] rounded-full animate-pulse" />
                Esperto del territorio Online
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-[#12100e] no-scrollbar transition-colors">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                m.role === 'user' 
                ? 'bg-[#5f4f44] dark:bg-[#2a2420] text-white rounded-tr-none border dark:border-white/10' 
                : 'bg-white dark:bg-[#1a1614] text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-white/5 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed">{m.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-[#1a1614] p-4 rounded-2xl border border-gray-100 dark:border-white/5 rounded-tl-none flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#8d7a6e] rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-[#8d7a6e] rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-[#8d7a6e] rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white dark:bg-[#1a1614] border-t border-gray-100 dark:border-white/5 space-y-4 transition-colors">
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(s.label)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#f7f5f4] dark:bg-[#2a2420] text-[#5f4f44] dark:text-[#d2cbc6] rounded-full text-xs font-bold hover:bg-[#d2cbc6] dark:hover:bg-[#4a3e35] transition-colors border border-[#d2cbc6] dark:border-white/10"
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>
          )}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Chiedimi un consiglio..."
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-[#2a2420] border-none rounded-xl focus:ring-2 focus:ring-[#5f4f44] dark:focus:ring-[#8d7a6e] outline-none text-gray-700 dark:text-gray-200"
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="w-12 h-12 bg-[#5f4f44] dark:bg-[#8d7a6e] text-white rounded-xl flex items-center justify-center hover:bg-[#4a3e35] transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes scale-up {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-up { animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default AIConcierge;
