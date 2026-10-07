import { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  MessageCircle,
  X,
  Heart,
  Baby,
  Activity,
  Plus,
  Zap,
  Info,
  Stethoscope
} from 'lucide-react';

const pregnancyFAQ = [
  { 
    keywords: ['morning sickness', 'nausea', 'vomit', 'sick'], 
    answer: "Nausea is common in the first trimester. Try frequent small meals, ginger tea, and staying hydrated. If you can't keep any fluids down, please contact your doctor.",
    action: "View Safe Remedies",
    link: "/pregnancy/remedies"
  },
  { 
    keywords: ['vitamin', 'supplement', 'folic', 'iron'], 
    answer: "Prenatal vitamins are essential. Folic acid supports baby's brain development, while iron prevents maternal anemia. Check your trimester guide for specific doses.",
    action: "Nutrition Planner",
    link: "/pregnancy/nutrition"
  },
  { 
    keywords: ['exercise', 'yoga', 'workout', 'walking'], 
    answer: "Gentle exercise like walking and prenatal yoga is generally safe and beneficial. However, avoid high-impact sports and always consult your obstetrician first.",
    action: "Symptom Monitor",
    link: "/pregnancy/symptoms"
  },
  { 
    keywords: ['doctor', 'gynecologist', 'appointment', 'checkup'], 
    answer: "Regular prenatal checkups are vital. You can book an appointment with our board-certified gynecologists directly through the portal.",
    action: "Book Consultation",
    link: "/pregnancy/consultations"
  },
  { 
    keywords: ['hello', 'hi', 'hey'], 
    answer: "Hello! I am your calm Wellness Assistant. I am here to support you through every week of your pregnancy journey. How are you feeling today?",
  }
];

export default function PregnancyChatbot({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Welcome to your Pregnancy Wellness Hub. 🌸 I can help with symptom tracking, nutrition guidance, and prenatal care questions. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate Bot Response
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      const match = pregnancyFAQ.find(faq => faq.keywords.some(k => lowerInput.includes(k)));
      
      const botResponse = match 
        ? { role: 'bot', text: match.answer, action: match.action, link: match.link }
        : { role: 'bot', text: "I want to make sure you get the most accurate medical advice. Would you like to check our Wellness Guides or connect with a prenatal specialist?" };
      
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInput('');
  };

  return (
    <div className="pregnancy-card w-[400px] h-[600px] flex flex-col overflow-hidden border-4 border-rose-200 shadow-2xl shadow-rose-900/20 animate-slide-up !bg-white">
      {/* Header */}
      <div className="bg-rose-400 p-6 flex items-center justify-between text-white shadow-lg relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <Heart className="w-16 h-16" />
        </div>
        <div className="flex items-center gap-4 relative z-10">
           <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center p-2 shadow-inner">
              <Heart className="w-full h-full" />
           </div>
           <div>
              <h3 className="text-xl font-black tracking-tight leading-none uppercase">Wellness Assistant</h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                 <span className="w-2 h-2 rounded-full bg-rose-200 animate-pulse"></span>
                 <p className="text-[10px] font-black uppercase tracking-widest text-rose-50">Prenatal Support Active</p>
              </div>
           </div>
        </div>
        <button onClick={onClose} className="hover:rotate-90 transition-transform"><X className="w-6 h-6" /></button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-rose-50/30 scrollbar-hide">
         {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm font-bold leading-relaxed shadow-xl ${
                 m.role === 'user' 
                   ? 'bg-rose-500 text-white rounded-tr-none' 
                   : 'bg-white text-rose-900 rounded-tl-none border-2 border-rose-100'
               }`}>
                  {m.text}
                  {m.action && (
                    <a href={m.link} className="mt-4 flex items-center justify-center gap-3 bg-rose-50 text-rose-600 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                       {m.action}
                       <Plus className="w-3 h-3" />
                    </a>
                  )}
               </div>
            </div>
         ))}
         <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-6 bg-white border-t-4 border-rose-100 flex items-center gap-4">
         <div className="flex-1 relative group">
            <input 
              type="text" 
              placeholder="Ask about maternal wellness..." 
              className="w-full pl-6 pr-12 py-4 bg-rose-50 border-2 border-rose-100 rounded-3xl text-sm font-bold text-rose-950 focus:border-rose-400 focus:bg-white outline-none transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <MessageCircle className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-300 group-focus-within:text-rose-400 transition-colors" />
         </div>
         <button type="submit" className="w-14 h-14 rounded-2xl bg-rose-400 text-white flex items-center justify-center shadow-lg shadow-rose-400/20 active:scale-95 transition-all">
            <Send className="w-6 h-6" />
         </button>
      </form>
    </div>
  );
}
