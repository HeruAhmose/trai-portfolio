import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowRight, TrendingUp, Clock } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { useSessionId } from '@/hooks/useSessionId';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'page' | 'project' | 'research' | 'feature' | 'admin'>('all');
  const [, navigate] = useLocation();
  const sessionId = useSessionId();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: searchData, isLoading } = trpc.search.search.useQuery(
    { query: debouncedQuery, type: activeFilter, limit: 20, sessionId },
    { enabled: debouncedQuery.length >= 2 }
  );

  const { data: topSearches } = trpc.search.getTopSearches.useQuery();

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'page', label: 'Pages' },
    { id: 'project', label: 'Projects' },
    { id: 'research', label: 'Research' },
    { id: 'feature', label: 'Features' },
  ] as const;

  const results = searchData?.results ?? [];

  const handleSelect = (url: string) => {
    if (url.startsWith('http')) window.open(url, '_blank');
    else navigate(url);
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-r from-[#d6a33a] to-[#f0cc79] bg-clip-text text-transparent mb-4">
            SEARCH
          </h1>
          <p className="text-white/60">Find anything in the TRAI sovereign technology portfolio</p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-6"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d6a33a]" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search patents, research, projects, features..."
            className="w-full bg-white/5 border border-[#d6a33a]/30 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/30 text-lg outline-none focus:border-[#d6a33a]/60 transition-colors"
            autoFocus
          />
          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-[#d6a33a]/30 border-t-[#d6a33a] rounded-full animate-spin" />
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 mb-8 flex-wrap"
        >
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                activeFilter === filter.id
                  ? 'bg-[#d6a33a] text-black font-semibold'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {debouncedQuery.length >= 2 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {results.length > 0 ? (
                <>
                  <p className="text-sm text-white/40 mb-4">
                    {searchData?.total} result{(searchData?.total ?? 0) !== 1 ? 's' : ''} for "{debouncedQuery}"
                  </p>
                  <div className="space-y-3">
                    {results.map((result: any, i: number) => (
                      <motion.button
                        key={result.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => handleSelect(result.url)}
                        className="w-full flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-[#d6a33a]/30 hover:bg-[#d6a33a]/5 transition-all text-left group"
                      >
                        <span className="text-2xl mt-0.5">{result.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-semibold group-hover:text-[#d6a33a] transition-colors">{result.title}</span>
                            <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full capitalize">{result.type}</span>
                          </div>
                          <p className="text-sm text-white/50 line-clamp-2">{result.description}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {result.tags?.slice(0, 4).map((tag: string) => (
                              <span key={tag} className="text-xs text-[#d6a33a]/60 bg-[#d6a33a]/10 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-[#d6a33a] flex-shrink-0 mt-1 transition-colors" />
                      </motion.button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-white/40">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">No results for "{debouncedQuery}"</p>
                  <p className="text-sm mt-2">Try different keywords or browse the sections above</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Recent Searches */}
              {(topSearches?.searches ?? []).length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-white/40" />
                    <span className="text-sm text-white/40 uppercase tracking-wider">Recent Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(topSearches?.searches ?? []).slice(0, 10).map((s: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => setQuery(s.query)}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-white/60 hover:text-white hover:border-[#d6a33a]/30 transition-colors"
                      >
                        {s.query}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested searches */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-[#d6a33a]" />
                  <span className="text-sm text-white/40 uppercase tracking-wider">Explore</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { q: 'quantum', icon: '⚛️' },
                    { q: 'materials science', icon: '🔬' },
                    { q: 'cybersecurity', icon: '🔐' },
                    { q: 'community impact', icon: '🤝' },
                    { q: 'patent claims', icon: '📜' },
                    { q: 'gesture control', icon: '✋' },
                  ].map(({ q, icon }) => (
                    <button
                      key={q}
                      onClick={() => setQuery(q)}
                      className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl hover:border-[#d6a33a]/30 hover:bg-[#d6a33a]/5 transition-all text-left"
                    >
                      <span>{icon}</span>
                      <span className="text-sm text-white/70 capitalize">{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
