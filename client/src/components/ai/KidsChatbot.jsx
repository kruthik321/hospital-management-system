import { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  User, 
  Baby, 
  Heart, 
  ShieldCheck, 
  MessageCircle,
  X,
  Stethoscope,
  Utensils,
  Plus
} from 'lucide-react';

const kidsFAQ = [
  { 
    keywords: ['fever', 'temperature', 'hot'], 
    answer: "For a mild fever, keep your child hydrated and dressed in light clothing. If the temperature exceeds 102°F or persists for over 48 hours, please consult a pediatrician immediately.",
    action: "View Symptom Checker",
    link: "/kids/symptom-checker"
  },
  { 
    keywords: ['vaccination', 'vaccine', 'shot', 'injection'], 
    answer: "A complete vaccination schedule is critical for long-term health. Common early vaccines include BCG, Polio, and Hepatitis B. You can view your child's personalized schedule in the tracker.",
    action: "Timeline Tracker",
    link: "/kids/vaccinations"
  },
  { 
    keywords: ['food', 'toddler', 'nutrition', 'diet'], 
    answer: "Toddlers need a balanced diet of healthy fats, proteins, and complex carbs. For 2-5 year olds, focus on whole grains, poultry, and plenty of colorful fruits like berries and broccoli.",
    action: "Nutrition Planner",
    link: "/kids/nutrition"
  },
  { 
    keywords: ['emergency', 'pediatrician', 'doctor', 'help'], 
    answer: "In case of a pediatric emergency, our Rapid Response ER is open 24/7. You can find the nearest pediatric specialist using our search tool.",
    action: "Find Doctor",
    link: "/kids/nearby"
  },
  { 
    keywords: ['hello', 'hi', 'hey'], 
    answer: "Hello! I am your friendly Pediatric Assistant. How can I help you take care of your little ones today?",
  }
];

export default function KidsChatbot({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi there! 👋 I am MedCare Kids Assistant. I can help with symptom guidance, vaccination schedules, and nutrition tips. What is on your mind?' }
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
      const match = kidsFAQ.find(faq => faq.keywords.some(k => lowerInput.includes(k)));
      
      const botResponse = match 
        ? { role: 'bot', text: match.answer, action: match.action, link: match.link }
        : { role: 'bot', text: "I am not quite sure about that. Would you like to check our Symptoms Guide or speak with a pediatric nurse?" };
      
      setMessages(prev => [...prev, botResponse]);
    }, 800);

    setInput('');
  };

  return (
    <div className="kids-card w-[400px] h-[600px] flex flex-col overflow-hidden border-4 border-sky-400 shadow-2xl shadow-sky-900/40 animate-slide-up">
      {/* Header */}
      <div className="bg-sky-500 p-6 flex items-center justify-between text-white shadow-lg relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <Baby className="w-16 h-16" />
        </div>
        <div className="flex items-center gap-4 relative z-10">
           <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center p-2 shadow-inner">
              <Baby className="w-full h-full" />
           </div>
           <div>
              <h3 className="text-xl font-black tracking-tight leading-none">Kids Assistant</h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                 <p className="text-[10px] font-black uppercase tracking-widest text-sky-100">AI Pediatric Guidance</p>
              </div>
           </div>
        </div>
        <button onClick={onClose} className="hover:rotate-90 transition-transform"><X className="w-6 h-6" /></button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-sky-50/50 scrollbar-hide">
         {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm font-bold leading-relaxed shadow-xl ${
                 m.role === 'user' 
                   ? 'bg-sky-500 text-white rounded-tr-none' 
                   : 'bg-white text-sky-900 rounded-tl-none border-2 border-sky-100'
               }`}>
                  {m.text}
                  {m.action && (
                    <a href={m.link} className="mt-4 flex items-center justify-center gap-3 bg-sky-50 text-sky-600 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all">
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
      <form onSubmit={handleSend} className="p-6 bg-white border-t-4 border-sky-100 flex items-center gap-4">
         <div className="flex-1 relative group">
            <input 
              type="text" 
              placeholder="Ask about pediatric health..." 
              className="w-full pl-6 pr-12 py-4 bg-sky-50 border-2 border-sky-100 rounded-3xl text-sm font-bold text-sky-900 focus:border-sky-500 focus:bg-white outline-none transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <MessageCircle className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400 group-focus-within:text-sky-600 transition-colors" />
         </div>
         <button type="submit" className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/20 active:scale-95 transition-all">
            <Send className="w-6 h-6" />
         </button>
      </form>
    </div>
  );
}
