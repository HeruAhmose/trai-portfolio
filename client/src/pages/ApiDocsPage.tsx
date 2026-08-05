import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Copy, Check, ChevronDown, ChevronRight, Terminal, Globe, Lock } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export const ApiDocsPage: React.FC = () => {
  const { data: docs } = trpc.systemInfo.getApiDocs.useQuery();
  const [activeExample, setActiveExample] = useState<'javascript' | 'python' | 'curl'>('javascript');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const endpoints = docs?.endpoints ?? [];
  const codeExamples = docs?.codeExamples ?? {};

  const authColors: Record<string, string> = {
    none: 'text-green-400 bg-green-400/10',
    optional: 'text-[#d6a33a] bg-[#d6a33a]/10',
    required: 'text-red-400 bg-red-400/10',
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-8 h-8 text-[#d6a33a]" />
            <h1 className="text-4xl font-black text-white">API Documentation</h1>
          </div>
          <p className="text-white/60 text-lg">
            {docs?.description ?? 'TRAI Portfolio API — version 2.0.0'}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <span className="text-xs bg-[#d6a33a]/20 text-[#d6a33a] px-3 py-1 rounded-full">v{docs?.version}</span>
            <span className="text-xs bg-white/10 text-white/60 px-3 py-1 rounded-full font-mono">{docs?.baseUrl}</span>
          </div>
        </motion.div>

        {/* Authentication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-5 h-5 text-[#d6a33a]" />
            <h2 className="text-lg font-bold text-white">Authentication</h2>
          </div>
          <p className="text-white/60 text-sm">
            {docs?.authentication?.description ?? 'Use Manus OAuth for protected endpoints.'}
            {' '}Public endpoints require no authentication.
          </p>
        </motion.div>

        {/* Code Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#050607] border border-white/10 rounded-xl overflow-hidden mb-8"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-[#d6a33a]" />
              <span className="text-sm font-semibold text-white">Code Examples</span>
            </div>
            <div className="flex gap-1">
              {(['javascript', 'python', 'curl'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setActiveExample(lang)}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    activeExample === lang
                      ? 'bg-[#d6a33a] text-black'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <pre className="p-4 text-sm text-green-400 font-mono overflow-x-auto">
              <code>{(codeExamples as any)[activeExample] ?? ''}</code>
            </pre>
            <button
              onClick={() => copyToClipboard((codeExamples as any)[activeExample] ?? '', 'example')}
              className="absolute top-3 right-3 p-1.5 bg-white/10 rounded hover:bg-white/20 transition-colors"
            >
              {copiedId === 'example' ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-white/60" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Endpoints */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-[#d6a33a]" />
            <h2 className="text-xl font-bold text-white">Endpoints</h2>
            <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{endpoints.length} total</span>
          </div>
          <div className="space-y-2">
            {endpoints.map((endpoint: any, i: number) => (
              <motion.div
                key={endpoint.path}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.03 }}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedEndpoint(expandedEndpoint === endpoint.path ? null : endpoint.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                >
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                    endpoint.method === 'query' ? 'bg-[#6ea8da]/20 text-[#6ea8da]' : 'bg-purple-400/20 text-purple-400'
                  }`}>
                    {endpoint.method.toUpperCase()}
                  </span>
                  <code className="text-sm text-white/80 flex-1 font-mono">{endpoint.path}</code>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${authColors[endpoint.auth] ?? authColors.none}`}>
                    {endpoint.auth}
                  </span>
                  {expandedEndpoint === endpoint.path ? (
                    <ChevronDown className="w-4 h-4 text-white/30" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  )}
                </button>
                {expandedEndpoint === endpoint.path && (
                  <div className="px-4 pb-4 border-t border-white/5">
                    <p className="text-sm text-white/60 mt-3">{endpoint.description}</p>
                    {endpoint.params && (
                      <div className="mt-3">
                        <p className="text-xs text-white/40 uppercase tracking-wider mb-1.5">Parameters</p>
                        <div className="flex flex-wrap gap-1.5">
                          {endpoint.params.map((param: string) => (
                            <code key={param} className="text-xs bg-white/10 text-[#d6a33a] px-2 py-0.5 rounded font-mono">
                              {param}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

