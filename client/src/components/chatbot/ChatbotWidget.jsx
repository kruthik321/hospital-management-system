import { useState, useRef, useEffect } from 'react';
import { chatbotAPI } from '../../services/api';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import KidsChatbot from '../ai/KidsChatbot';
import PregnancyChatbot from '../ai/PregnancyChatbot';

export default function ChatbotWidget({ portal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '👋 **Welcome to MedCare Assistant.**\n\nHow can I help you today? I can assist with:\n\n*   **Appointments** (Booking & Scheduling)\n*   **Medical Records** (Lab Results & Reports)\n*   **Prescriptions** (Refills & Dosage)\n*   **Billing** (Payments & Invoices)\n\nWhat is on your mind?', suggestions: ['Book appointment', 'View prescriptions', 'Check symptoms', 'Billing help'] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // If in a specialized portal, show the specialized bot
  if (portal === 'kids' && isOpen) {
    return (
      <div className="fixed bottom-8 right-8 z-50">
        <KidsChatbot onClose={() => setIsOpen(false)} />
      </div>
    );
  }

  if (portal === 'pregnancy' && isOpen) {
    return (
      <div className="fixed bottom-8 right-8 z-50">
        <PregnancyChatbot onClose={() => setIsOpen(false)} />
      </div>
    );
  }

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);

    try {
      const res = await chatbotAPI.query(msg);
      setMessages(prev => [...prev, { role: 'bot', text: res.data.response, suggestions: res.data.suggestions }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: '❌ **System Offline.** I encountered a connection error. Please try again in a moment.' }]);
    }
    setLoading(false);
  };

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      {/* Enhanced Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-8 right-8 w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center text-white hover:scale-110 hover:-rotate-3 transition-all duration-300 z-50 group border-4 border-white ${
            portal === 'kids' ? 'bg-sky-500 shadow-sky-500/40' : 
            portal === 'pregnancy' ? 'bg-rose-400 shadow-rose-400/40' : 
            'bg-blue-800 shadow-blue-800/40'
          }`}
          id="chatbot-toggle"
        >
          <div className="relative">
            <MessageCircle className="w-7 h-7" />
            <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 animate-pulse ${
              portal === 'kids' ? 'bg-amber-400 border-sky-500' : 
              portal === 'pregnancy' ? 'bg-rose-200 border-rose-400' : 
              'bg-emerald-500 border-blue-800'
            }`}></span>
          </div>
          <div className="absolute -top-12 right-0 bg-white text-blue-900 text-xs font-black px-3 py-1.5 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest border border-blue-100">
            Ask {portal === 'kids' ? 'Kids' : portal === 'pregnancy' ? 'Wellness' : 'MedCare'} AI
          </div>
        </button>
      )}

      {/* Modern Chat Window (Default Bot) */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 w-[400px] h-[600px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(30,58,138,0.3)] border border-blue-50 flex flex-col z-50 animate-slide-up overflow-hidden">
          {/* Header */}
          <div className="bg-blue-900 px-6 py-5 flex items-center justify-between border-b border-blue-800/50">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-white/10 rounded-2xl p-0.5 border border-white/20">
                  <Bot className="w-full h-full text-white/40" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-blue-900"></div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-white font-black text-sm uppercase tracking-widest">MedCare AI</h3>
                  <Sparkles className="w-3 h-3 text-blue-300 fill-blue-300" />
                </div>
                <span className="text-blue-300/80 text-[10px] font-bold uppercase tracking-tight">Active Clinical Assistant</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-blue-50/30 to-white scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`rounded-3xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-800 text-white rounded-br-none'
                      : 'bg-white border border-blue-100 text-gray-800 rounded-bl-none'
                  }`} dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
                  
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pl-1">
                      {msg.suggestions.map((s, j) => (
                        <button 
                          key={j} 
                          onClick={() => sendMessage(s)} 
                          className="text-[10px] font-black uppercase tracking-widest bg-blue-50 border border-blue-100 text-blue-700 rounded-xl px-3 py-2 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95 shadow-sm"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white border border-blue-50 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm">
                  <div className="flex gap-1.5 italic text-blue-300 text-xs font-bold uppercase tracking-widest">
                    Consulting AI Knowledge base
                    <span className="flex gap-1 ml-2">
                       <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                       <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                       <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Professional Input Section */}
          <div className="p-5 border-t border-blue-50 bg-white">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your health..."
                className="w-full bg-blue-50/50 border border-blue-100 rounded-2xl pl-5 pr-14 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-300 outline-none transition-all placeholder:text-blue-300/80 font-medium"
                disabled={loading}
                id="chatbot-input"
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()} 
                className="absolute right-2 top-2 w-10 h-10 bg-blue-800 text-white rounded-xl flex items-center justify-center hover:bg-blue-900 transition-all disabled:opacity-30 shadow-lg shadow-blue-800/20 active:scale-90"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <p className="text-[9px] text-center text-gray-400 mt-4 font-bold uppercase tracking-[0.2em]">MedCare AI can make mistakes. Verify critical clinical info.</p>
          </div>
        </div>
      )}
    </>
  );
}
