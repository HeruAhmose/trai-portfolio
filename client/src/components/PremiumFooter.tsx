import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';
import { NewsletterSubscription } from './NewsletterSubscription';
import { SocialMediaShare } from './SocialMediaShare';
import '../styles/premiumDesign.css';

/**
 * Premium Footer Component
 * Cinematic footer with newsletter, social links, and premium styling
 */
export const PremiumFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com',
      color: 'text-gray-400 hover:text-accent-gold',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://linkedin.com',
      color: 'text-gray-400 hover:text-accent-cyan',
    },
    {
      icon: Twitter,
      label: 'Twitter',
      href: 'https://twitter.com',
      color: 'text-gray-400 hover:text-accent-gold',
    },
    {
      icon: Mail,
      label: 'Email',
      href: 'mailto:contact@example.com',
      color: 'text-gray-400 hover:text-accent-cyan',
    },
  ];

  const footerLinks = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Research', href: '/research' },
    { label: 'Timeline', href: '/timeline' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="relative bg-gradient-to-t from-accent-gold/5 to-transparent border-t border-accent-gold/20">
      {/* Background Effects */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.03) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10">
        {/* Premium Divider */}
        <div className="divider-premium" />

        {/* Main Footer Content */}
        <motion.div
          className="max-w-6xl mx-auto px-4 py-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* Brand Section */}
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold text-gradient mb-4">PEOPLES</h3>
              <p className="text-gray-400 mb-6">
                Pioneering sovereign intelligence through advanced research and innovation.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${link.color} transition-colors`}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    title={link.label}
                  >
                    <link.icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {footerLinks.map((link) => (
                  <li key={link.label}>
                    <motion.a
                      href={link.href}
                      className="text-gray-400 hover:text-accent-gold transition-colors flex items-center gap-2"
                      whileHover={{ x: 4 }}
                    >
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter */}
            <motion.div variants={itemVariants}>
              <NewsletterSubscription />
            </motion.div>
          </div>

          {/* Premium Divider */}
          <div className="divider-premium" />

          {/* Bottom Section */}
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8"
            variants={itemVariants}
          >
            <p className="text-gray-500 text-sm">
              © {currentYear} Jonathan Peoples. All rights reserved.
            </p>

            <div className="flex gap-6">
              <motion.a
                href="/privacy"
                className="text-gray-500 hover:text-accent-gold text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Privacy Policy
              </motion.a>
              <motion.a
                href="/terms"
                className="text-gray-500 hover:text-accent-gold text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Terms of Service
              </motion.a>
              <motion.a
                href="/sitemap"
                className="text-gray-500 hover:text-accent-gold text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Sitemap
              </motion.a>
            </div>

            {/* Scroll to Top */}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-premium btn-premium-cyan text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Top ↑
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Status Bar */}
        <motion.div
          className="border-t border-accent-gold/20 px-4 py-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-gray-500">
            <span>✦ Portfolio Online</span>
            <span className="hidden md:inline">Sovereign Intelligence Architecture</span>
            <span>v2.0</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
