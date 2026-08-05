import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: searchData, isLoading } = trpc.search.search.useQuery(
    { query: debouncedQuery, type: 'all', limit: 8 },
    { enabled: debouncedQuery.length >= 2 }
  );

  const { data: suggestionsData } = trpc.search.getSuggestions.useQuery(
    { partial: query },
    { enabled: query.length >= 1 && query.length < 2 }
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSelect = useCallback((url: string) => {
    onClose();
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      navigate(url);
    }
  }, [onClose, navigate]);

  const quickLinks = [
    { title: 'Quantum Research', url: '/quantum', icon: '⚛️' },
    { title: 'Materials Science', url: '/materials', icon: '🔬' },
    { title: 'Community Impact', url: '/community', icon: '🤝' },
    { title: 'Patent Claims', url: '/patent-claims', icon: '📜' },
    { title: 'Project Gallery', url: '/projects', icon: '🎨' },
    { title: 'Career Timeline', url: '/career-timeline', icon: '⏳' },
  ];

  const results = searchData?.results ?? [];
  const showQuickLinks = query.length < 2;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[101] mx-4"
          >
            <div className="bg-[#0a0d10] border border-[#d6a33a]/30 rounded-2xl shadow-2xl shadow-[#d6a33a]/10 overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-[#d6a33a]/20">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-[#d6a33a] animate-spin flex-shrink-0" />
                ) : (
                  <Search className="w-5 h-5 text-[#d6a33a] flex-shrink-0" />
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search the portfolio... (Esc to close)"
                  className="flex-1 bg-transparent text-white placeholder-white/40 text-base outline-none"
                />
                <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {showQuickLinks ? (
                  <div className="p-3">
                    <p className="text-xs text-white/40 uppercase tracking-wider px-2 mb-2">Quick Navigation</p>
                    {quickLinks.map(link => (
                      <button
                        key={link.url}
                        onClick={() => handleSelect(link.url)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#d6a33a]/10 transition-colors text-left group"
                      >
                        <span className="text-xl">{link.icon}</span>
                        <span className="text-white/80 group-hover:text-white transition-colors">{link.title}</span>
                        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#d6a33a] ml-auto transition-colors" />
                      </button>
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-3">
                    <p className="text-xs text-white/40 uppercase tracking-wider px-2 mb-2">
                      {searchData?.total} result{(searchData?.total ?? 0) !== 1 ? 's' : ''} for "{query}"
                    </p>
                    {results.map((result: any) => (
                      <button
                        key={result.id}
                        onClick={() => handleSelect(result.url)}
                        className="w-full flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-[#d6a33a]/10 transition-colors text-left group"
                      >
                        <span className="text-xl mt-0.5">{result.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium group-hover:text-[#d6a33a] transition-colors">{result.title}</span>
                            <span className="text-xs text-white/30 bg-white/5 px-1.5 py-0.5 rounded capitalize">{result.type}</span>
                          </div>
                          <p className="text-sm text-white/50 truncate mt-0.5">{result.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#d6a33a] flex-shrink-0 mt-1 transition-colors" />
                      </button>
                    ))}
                  </div>
                ) : debouncedQuery.length >= 2 ? (
                  <div className="p-8 text-center text-white/40">
                    <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
                    <p>No results for "{query}"</p>
                    <p className="text-sm mt-1">Try different keywords</p>
                  </div>
                ) : null}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-[#d6a33a]/10 flex items-center gap-4 text-xs text-white/30">
                <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/50">↵</kbd> to select</span>
                <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/50">Esc</kbd> to close</span>
                <span className="ml-auto">TRAI Search</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
