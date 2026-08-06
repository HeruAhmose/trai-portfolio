import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Brain, Loader2, RefreshCw } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSessionId } from "@/hooks/useSessionId";
import { Streamdown } from "streamdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface HistoryMessage {
  role: string;
  content: string;
  timestamp: string | number | Date;
}
interface HKAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialGreeting = `Greetings. I am **H.K.**, your bridge to understanding the TRAI sovereign technology ecosystem — named after Horace King, the master bridge builder.

I can guide you through:
- **AMC composite architecture** and material science
- **Patent claims** and manufacturing processes
- **Quantum sensing** and research methodology
- **TechBridge** community programs and digital access
- **Cybersecurity** concepts and best practices

*Your conversation is remembered across sessions.* How may I assist you today?`;

export default function HKAssistant({ isOpen, onClose }: HKAssistantProps) {
  const sessionId = useSessionId();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content: initialGreeting,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const queryHK = trpc.hk.query.useMutation();

  // Load conversation history when opened
  const { data: historyData } = trpc.hk.getHistory.useQuery(
    { sessionId },
    { enabled: isOpen && !!sessionId }
  );

  useEffect(() => {
    if (historyData?.messages && historyData.messages.length > 0) {
      const historicMessages: Message[] = historyData.messages.map((m: HistoryMessage, i: number) => ({
        id: `history-${i}`,
        role: m.role as "user" | "assistant",
        content: m.content,
        timestamp: new Date(m.timestamp),
      }));
      setMessages([
        {
          id: "0",
          role: "assistant",
          content: initialGreeting,
          timestamp: new Date(),
        },
        ...historicMessages,
      ]);
    }
  }, [historyData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const conversationHistory = messages
        .filter(m => m.id !== "0")
        .slice(-8)
        .map(m => ({ role: m.role, content: m.content }));

      const result = await queryHK.mutateAsync({
        question: currentInput,
        conversationHistory,
        sessionId,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: String(result.response),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I encountered an issue. Please try again or contact a Digital Navigator.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([
      {
        id: "0",
        role: "assistant",
        content: initialGreeting,
        timestamp: new Date(),
      },
    ]);
  };

  const quickPrompts = [
    "What is the AMC hypothesis?",
    "Explain the patent claims",
    "Tell me about TechBridge",
    "What is quantum sensing?",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-20 right-4 w-96 bg-[#0a0d10] border border-[#d6a33a]/30 rounded-xl shadow-2xl flex flex-col z-50"
          style={{
            height: "520px",
            boxShadow: "0 0 40px rgba(214,163,58,0.15)",
          }}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#d6a33a]/20 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#d6a33a]/20 flex items-center justify-center">
                <Brain className="w-4 h-4 text-[#d6a33a]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">H.K. ASSISTANT</h3>
                <p className="text-xs text-white/40">
                  Powered by Claude · Memory enabled
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearHistory}
                className="p-1.5 text-white/30 hover:text-white/60 transition-colors"
                title="Clear conversation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-white/30 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, idx) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.03, 0.2) }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2.5 rounded-xl text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-[#d6a33a] text-black font-medium"
                      : "bg-white/5 border border-white/10 text-white/90"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none">
                      <Streamdown>{message.content}</Streamdown>
                    </div>
                  ) : (
                    message.content
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-white/5 border border-white/10 px-3 py-2.5 rounded-xl flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-[#d6a33a] animate-spin" />
                  <span className="text-xs text-white/40">
                    H.K. is thinking...
                  </span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
              {quickPrompts.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="text-xs px-2.5 py-1 bg-[#d6a33a]/10 border border-[#d6a33a]/20 text-[#d6a33a] rounded-full hover:bg-[#d6a33a]/20 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="px-4 pb-4 pt-2 border-t border-white/5 flex gap-2 flex-shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask H.K. anything..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#d6a33a]/40 transition-colors"
              disabled={isLoading}
            />
            <motion.button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-[#d6a33a] text-black rounded-lg hover:bg-[#f0cc79] disabled:opacity-40 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
