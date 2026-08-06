import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, RefreshCw } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useSessionId } from '@/hooks/useSessionId';
import { Streamdown } from 'streamdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const GREETING = `I am **H.K.** — your bridge to TechBridge.

Named for Horace King, the enslaved master bridge builder who built bridges across the American South.

Ask me about digital access programs, Navigator services, or how TechBridge serves the Triangle Area.`;

const QUICK_PROMPTS = [
  'What is TechBridge?',
  'How do I get help?',
  'What is a Digital Navigator?',
  'Where are the hubs?',
];

export function HKPortalWidget() {
  const sessionId = useSessionId();
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: GREETING },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryHK = trpc.hk.query.useMutation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const result = await queryHK.mutateAsync({ message: text, sessionId });
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: result.response }]);
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'The bridge is temporarily unavailable. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[400px] max-h-[600px]" style={{ background: 'rgba(3,4,6,0.85)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#2ecc71]/15 flex-shrink-0">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'radial-gradient(circle at 35% 35%, #2ecc71cc, #1a8a4a88)', color: '#050709' }}
            animate={{ boxShadow: ['0 0 12px #2ecc7140', '0 0 24px #2ecc7160', '0 0 12px #2ecc7140'] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            H.K.
          </motion.div>
          <div>
            <p className="text-xs font-mono text-[#2ecc71] tracking-[0.1em]">H.K. ASSISTANT</p>
            <p className="text-[9px] font-mono text-[#f4f0e6]/30 tracking-[0.08em]">TechBridge AI · Claude API</p>
          </div>
        </div>
        <button
          onClick={() => setMessages([{ id: '0', role: 'assistant', content: GREETING }])}
          className="text-[#f4f0e6]/20 hover:text-[#f4f0e6]/50 transition-colors"
          title="Reset conversation"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[85%] px-4 py-2.5 text-xs font-sans leading-relaxed"
                style={{
                  background: msg.role === 'user' ? 'rgba(46,204,113,0.12)' : 'rgba(244,240,230,0.04)',
                  border: `1px solid ${msg.role === 'user' ? 'rgba(46,204,113,0.25)' : 'rgba(244,240,230,0.06)'}`,
                  color: msg.role === 'user' ? '#f4f0e6' : 'rgba(244,240,230,0.75)',
                }}
              >
                <Streamdown>{msg.content}</Streamdown>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="px-4 py-2.5 border border-[#f4f0e6]/06" style={{ background: 'rgba(244,240,230,0.04)' }}>
              <Loader2 size={12} className="animate-spin text-[#2ecc71]/60" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
          {QUICK_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => send(p)}
              className="text-[9px] font-mono px-2.5 py-1 border border-[#2ecc71]/20 text-[#2ecc71]/50 hover:text-[#2ecc71] hover:border-[#2ecc71]/50 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2 flex-shrink-0 border-t border-[#2ecc71]/10">
        <form
          onSubmit={e => { e.preventDefault(); send(input); }}
          className="flex gap-2 items-center"
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask H.K. anything about TechBridge..."
            disabled={isLoading}
            className="flex-1 bg-transparent border border-[#2ecc71]/15 px-3 py-2 text-xs font-sans text-[#f4f0e6]/80 placeholder-[#f4f0e6]/20 focus:outline-none focus:border-[#2ecc71]/40 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 border border-[#2ecc71]/20 text-[#2ecc71]/50 hover:text-[#2ecc71] hover:border-[#2ecc71]/50 transition-colors disabled:opacity-30"
          >
            <Send size={12} />
          </button>
        </form>
      </div>
    </div>
  );
}
