import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Check, AlertCircle, Copy } from 'lucide-react';

/**
 * Domain Configuration Page
 * Guides users through custom domain setup
 */
export default function DomainConfiguration() {
  const [domain, setDomain] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [dnsRecords, setDnsRecords] = useState<Array<{ type: string; value: string }>>([]);
  const [copied, setCopied] = useState(false);

  const checkDomain = async () => {
    if (!domain) return;

    setStatus('checking');

    // Simulate domain check
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock check - in production, call actual API
    const isAvailable = Math.random() > 0.3;
    setStatus(isAvailable ? 'available' : 'taken');

    if (isAvailable) {
      setDnsRecords([
        { type: 'A', value: '203.0.113.42' },
        { type: 'CNAME', value: 'manus.space' },
        { type: 'TXT', value: 'v=spf1 include:manus.space ~all' },
      ]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="w-8 h-8 text-afro-gold" />
            <h1 className="text-4xl font-bold text-afro-gold">Custom Domain Setup</h1>
          </div>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Connect your own domain to your portfolio for a professional presence
          </p>
        </motion.div>

        {/* Domain Search */}
        <motion.div
          className="bg-gradient-to-br from-afro-gold/10 to-afro-sapphire/10 border border-afro-gold/30 rounded-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-afro-gold mb-4">Step 1: Check Domain Availability</h2>

          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              className="flex-1 px-4 py-3 bg-background border border-afro-gold/30 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-afro-gold/60"
            />
            <motion.button
              onClick={checkDomain}
              disabled={!domain || status === 'checking'}
              className="px-6 py-3 bg-afro-gold/20 border border-afro-gold/50 rounded-lg text-afro-gold hover:bg-afro-gold/30 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {status === 'checking' ? 'Checking...' : 'Check'}
            </motion.button>
          </div>

          {/* Status */}
          {status !== 'idle' && (
            <motion.div
              className={`flex items-center gap-3 p-4 rounded-lg ${
                status === 'available' || status === 'checking'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {status === 'checking' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                />
              ) : status === 'available' ? (
                <Check className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>
                {status === 'checking'
                  ? 'Checking domain availability...'
                  : status === 'available'
                    ? `${domain} is available!`
                    : `${domain} is already taken`}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* DNS Configuration */}
        {status === 'available' && dnsRecords.length > 0 && (
          <motion.div
            className="bg-gradient-to-br from-afro-sapphire/10 to-afro-emerald/10 border border-afro-sapphire/30 rounded-lg p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-afro-sapphire mb-4">Step 2: Configure DNS Records</h2>

            <p className="text-foreground/60 mb-6">
              Add the following DNS records to your domain provider:
            </p>

            <div className="space-y-3">
              {dnsRecords.map((record, index) => (
                <motion.div
                  key={index}
                  className="bg-background border border-afro-sapphire/20 rounded-lg p-4 flex items-center justify-between"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex-1">
                    <p className="text-sm text-foreground/60 mb-1">Type: {record.type}</p>
                    <p className="text-foreground font-mono">{record.value}</p>
                  </div>
                  <motion.button
                    onClick={() => copyToClipboard(record.value)}
                    className="ml-4 p-2 bg-afro-sapphire/20 hover:bg-afro-sapphire/30 rounded-lg text-afro-sapphire transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          className="bg-gradient-to-br from-afro-emerald/10 to-afro-gold/10 border border-afro-emerald/30 rounded-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-afro-emerald mb-4">Step 3: Complete Setup</h2>

          <ol className="space-y-4 text-foreground/80">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-afro-emerald/20 rounded-full flex items-center justify-center text-afro-emerald font-bold">
                1
              </span>
              <span>Log in to your domain registrar (GoDaddy, Namecheap, etc.)</span>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-afro-emerald/20 rounded-full flex items-center justify-center text-afro-emerald font-bold">
                2
              </span>
              <span>Navigate to DNS settings and add the records above</span>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-afro-emerald/20 rounded-full flex items-center justify-center text-afro-emerald font-bold">
                3
              </span>
              <span>Wait for DNS propagation (usually 24-48 hours)</span>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-afro-emerald/20 rounded-full flex items-center justify-center text-afro-emerald font-bold">
                4
              </span>
              <span>Verify domain in your portfolio settings</span>
            </li>
          </ol>
        </motion.div>
      </div>
    </div>
  );
}
