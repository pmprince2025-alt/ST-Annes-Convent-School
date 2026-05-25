import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, GraduationCap } from 'lucide-react';
import clsx from 'clsx';
import { supabase } from '../lib/supabase';
import { SYSTEM_PROMPT, STARTER_QUESTIONS } from '../constants/chatbot';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Anne, the ST. Anne's Convent School assistant. How can I help you today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showStarters, setShowStarters] = useState(true);
  const [schoolContext, setSchoolContext] = useState('');
  const [isFetchingContext, setIsFetchingContext] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Fetch school data for AI context when opened
  useEffect(() => {
    if (isOpen && !schoolContext) {
      const stripHtml = (html) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
      };

      const fetchContext = async () => {
        setIsFetchingContext(true);
        try {
          const now = new Date();
          const firstDay = new Date(now.getFullYear(), now.getUTCMonth(), 1).toISOString();
          
          const [noticesRes, eventsRes, holidaysRes] = await Promise.all([
            supabase.from('notices').select('date, title, description').eq('published', true).order('date', { ascending: false }).limit(5),
            supabase.from('events').select('date, title, description, category').order('date', { ascending: true }).limit(5),
            supabase.from('holidays').select('date, title, type').eq('published', true).gte('date', firstDay).order('date', { ascending: true })
          ]);

          let contextString = "\n\nLATEST NOTICES:\n";
          if (noticesRes.data?.length) {
            noticesRes.data.forEach(n => {
              const cleanDesc = n.description ? stripHtml(n.description).substring(0, 200) : "";
              contextString += `- [${n.date}] ${n.title}: ${cleanDesc}...\n`;
            });
          } else {
            contextString += "No recent notices.\n";
          }

          contextString += "\nUPCOMING EVENTS:\n";
          if (eventsRes.data?.length) {
            eventsRes.data.forEach(e => {
              const cleanDesc = e.description ? stripHtml(e.description).substring(0, 150) : "";
              contextString += `- [${e.date}] ${e.title} (${e.category}): ${cleanDesc}...\n`;
            });
          } else {
            contextString += "No upcoming events scheduled.\n";
          }

          contextString += "\nHOLIDAYS & PROGRAMMES (This Month onwards):\n";
          if (holidaysRes.data?.length) {
            holidaysRes.data.forEach(h => {
              contextString += `- [${h.date}] ${h.title} (${h.type})\n`;
            });
          } else {
            contextString += "No holidays currently listed.\n";
          }

          setSchoolContext(contextString);
        } catch (error) {
          console.error("Error fetching school context:", error);
        } finally {
          setIsFetchingContext(false);
        }
      };

      fetchContext();
    }
  }, [isOpen, schoolContext]);

  const handleClose = () => {
    setIsOpen(false);
    // Reset state after closing
    setTimeout(() => {
      setMessages([{ role: 'assistant', content: "Hi! I'm Anne, the ST. Anne's Convent School assistant. How can I help you today?", timestamp: new Date() }]);
      setShowStarters(true);
      setInput('');
      setIsLoading(false);
    }, 300);
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    setShowStarters(false);
    
    const userMessage = { role: 'user', content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const fullSystemPrompt = SYSTEM_PROMPT + (schoolContext ? `\n\n${schoolContext}` : "");
      
      const apiMessages = [
        { role: 'system', content: fullSystemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: text }
      ];

      const res = await fetch('/.netlify/functions/chat-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: apiMessages,
          max_tokens: 300,
          temperature: 0.7
        })
      });

      if (!res.ok) throw new Error('Network response was not ok');
      
      const data = await res.json();
      const reply = data.choices[0].message.content;

      setMessages((prev) => [...prev, { role: 'assistant', content: reply, timestamp: new Date() }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please try again later or contact the school office directly.", 
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage(input);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[99] w-14 h-14 bg-yellow rounded-full flex items-center justify-center shadow-lg text-blue-deeper group animate-[pulse_2s_infinite]"
        >
          <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed sm:bottom-6 sm:right-6 bottom-0 right-0 z-[99] w-full sm:w-[360px] h-[100dvh] sm:h-[520px] bg-white sm:rounded-tl-[16px] sm:rounded-tr-[16px] sm:rounded-bl-[4px] rounded-none shadow-[0_20px_60px_rgba(10,39,68,0.25)] flex flex-col chatbot-panel overflow-hidden">
          {/* Header */}
          <div className="h-[72px] bg-gradient-to-br from-blue-primary to-blue-dark flex items-center justify-between px-4 text-white shrink-0">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Anne" className="w-10 h-10 rounded-full bg-white p-0.5" />
              <div>
                <h3 className="font-display font-bold text-base">Ask Anne</h3>
                <p className="text-xs text-blue-100 flex items-center gap-1">Your School Assistant <GraduationCap size={14} /></p>
              </div>
            </div>
            <button onClick={handleClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-off-white flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={clsx("flex flex-col max-w-[85%]", msg.role === 'user' ? "self-end items-end" : "self-start items-start")}>
                <div 
                  className={clsx(
                    "px-4 py-2.5 text-[14px] font-body",
                    msg.role === 'user' 
                      ? "bg-yellow text-blue-deeper rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[16px] rounded-br-[4px]" 
                      : "bg-white text-dark border border-gray-200 rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[4px] rounded-br-[16px]",
                    msg.isError && "bg-red-50 text-red border-red-200"
                  )}
                >
                  {msg.content}
                </div>
                <span className="text-[11px] text-gray-mid mt-1 px-1">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="self-start px-4 py-3 bg-white border border-gray-200 rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[4px] rounded-br-[16px]">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            
            {/* Starter Chips */}
            {showStarters && messages.length === 1 && !isLoading && (
              <div className="flex flex-wrap gap-2 mt-2">
                {STARTER_QUESTIONS.map((q, idx) => (
                  <button 
                    key={idx}
                    onClick={() => sendMessage(q)}
                    className="bg-white border text-left border-blue-200 text-blue-dark text-[13px] px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3 bg-white shrink-0">
            <div className="flex items-center gap-2 bg-off-white rounded-full pr-1 pl-4 py-1 border border-gray-200 focus-within:border-blue-primary transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask a question..."
                className="flex-1 bg-transparent border-none outline-none text-[14px]"
              />
              <button 
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 rounded-full bg-blue-primary text-white flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-dark transition-colors"
              >
                <Send size={16} className="-ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
