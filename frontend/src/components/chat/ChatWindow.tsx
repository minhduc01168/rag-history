import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { useLanguage } from '../../context/LanguageContext';
import { API_BASE_URL } from '../../config/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  agent?: string;
  sources?: string[];
}

export function ChatWindow() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [sessionId] = useState<string>(() => {
    let sid = localStorage.getItem('chat_session_id');
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem('chat_session_id', sid);
    }
    return sid;
  });

  // Initialize welcome message when language changes or on first mount
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          text: t('bot.welcome'),
          sender: 'bot',
          timestamp: new Date(),
          agent: 'Cụ Rùa Thông Thái',
        },
      ]);
    } else if (messages[0]?.id === 'welcome') {
      setMessages((prev) => [
        {
          ...prev[0],
          text: t('bot.welcome'),
        },
        ...prev.slice(1),
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/rag/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: text, session_id: sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        sender: 'bot',
        timestamp: new Date(),
        agent: data.route_taken === 'knowledge' ? 'Cụ Rùa SGK' : 'Cụ Rùa Thông Thái',
        sources: data.sources,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t('bot.errorMsg'),
        sender: 'bot',
        timestamp: new Date(),
        agent: 'Cụ Rùa Thông Thái',
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickReplies = [
    t('bot.replyWeather'),
    t('bot.replyCpr'),
    t('bot.replyFlood'),
    t('bot.replyWater'),
  ];

  return (
    <div className="flex flex-col h-full bg-[#FFFDF7]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 mb-3 animate-in fade-in">
            <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-xs">
              🐢
            </div>
            <div className="bg-white border-2 border-amber-300 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-amber-900 mr-1">Cụ Rùa đang tra sử sách</span>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0ms]" />
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:150ms]" />
                <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies for Grade 4 & 5 History */}
      <div className="px-3 py-2 bg-amber-50/80 border-t border-amber-200/80">
        <div className="flex items-center gap-1 mb-1.5">
          <span className="text-[11px] font-black text-amber-950">💡 Gợi ý chủ đề Lịch sử 4 & 5:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => handleSend(reply)}
              disabled={isLoading}
              className="px-3 py-1 bg-white hover:bg-amber-400 border border-amber-300 hover:border-amber-400
                         rounded-full text-xs font-bold text-slate-800 hover:text-slate-950 transition-all duration-200 disabled:opacity-40 shadow-xs hover:scale-105 active:scale-95"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
