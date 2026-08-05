import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Check, AlertCircle } from 'lucide-react';
import { soundDesignService } from '@/services/soundDesign';

/**
 * Newsletter Subscription Component
 * Allows users to subscribe to project updates and announcements
 */
export const NewsletterSubscription: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      soundDesignService.playUISound('error');
      return;
    }

    setStatus('loading');
    soundDesignService.playUISound('click');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStatus('success');
      setMessage('Successfully subscribed! Check your email for confirmation.');
      setEmail('');
      soundDesignService.playUISound('success');

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');
      soundDesignService.playUISound('error');
    }
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-afro-gold/10 to-afro-sapphire/10 border border-afro-gold/30 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5 text-afro-gold" />
        <h3 className="text-lg font-bold text-afro-gold">Stay Updated</h3>
      </div>

      <p className="text-foreground/60 text-sm mb-4">
        Subscribe to receive updates about new projects, research, and innovations.
      </p>

      <form onSubmit={handleSubscribe} className="space-y-3">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={status === 'loading' || status === 'success'}
            className="w-full px-4 py-2 bg-background border border-afro-gold/30 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-afro-gold/60 transition-colors disabled:opacity-50"
          />
        </div>

        <motion.button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-afro-gold/20 border border-afro-gold/50 rounded-lg text-afro-gold hover:bg-afro-gold/30 transition-colors disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {status === 'loading' ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-4 h-4 border-2 border-afro-gold border-t-transparent rounded-full"
              />
              <span>Subscribing...</span>
            </>
          ) : status === 'success' ? (
            <>
              <Check className="w-4 h-4" />
              <span>Subscribed!</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Subscribe</span>
            </>
          )}
        </motion.button>

        {/* Status Message */}
        {message && (
          <motion.div
            className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              status === 'success'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {status === 'error' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            {status === 'success' && <Check className="w-4 h-4 flex-shrink-0" />}
            <span>{message}</span>
          </motion.div>
        )}
      </form>

      <p className="text-foreground/40 text-xs mt-4">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </motion.div>
  );
};
