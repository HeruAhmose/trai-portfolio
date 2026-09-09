import React from "react";
import { motion } from "framer-motion";
import { Mail, Github, ExternalLink } from "lucide-react";
import { NewsletterSubscription } from "./NewsletterSubscription";
import "../styles/premiumDesign.css";

const SOCIAL_LINKS = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/HeruAhmose",
    external: true,
    color: "text-gray-400 hover:text-accent-gold",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:aitconsult22@gmail.com",
    external: false,
    color: "text-gray-400 hover:text-accent-cyan",
  },
];

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Validation Plans", href: "/case-studies" },
  { label: "Research", href: "/research" },
  { label: "Timeline", href: "/timeline" },
  { label: "Contact", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Foundation", href: "/peoples-foundation" },
  { label: "Founder", href: "/founder" },
  { label: "Contact", href: "/contact" },
];

function siteHref(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, "");
}

/**
 * Public estate footer with verified destinations only.
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

  return (
    <footer className="relative bg-gradient-to-t from-accent-gold/5 to-transparent border-t border-accent-gold/20">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.03) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10">
        <div className="divider-premium" />

        <motion.div
          className="max-w-6xl mx-auto px-4 py-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold text-gradient mb-4">TRAI</h3>
              <p className="text-gray-400 mb-6">
                One living Sovereignty Stack: seven independently viable,
                mutually reinforcing organs.
              </p>
              <div className="flex gap-4">
                {SOCIAL_LINKS.map(link => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className={[link.color, "transition-colors"].join(" ")}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    title={link.label}
                    aria-label={link.label}
                  >
                    <link.icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-semibold text-white mb-6">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {FOOTER_LINKS.map(link => (
                  <li key={link.label}>
                    <motion.a
                      href={siteHref(link.href)}
                      className="text-gray-400 hover:text-accent-gold transition-colors flex items-center gap-2"
                      whileHover={{ x: 4 }}
                    >
                      <ExternalLink className="w-4 h-4 opacity-60" />
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <NewsletterSubscription />
            </motion.div>
          </div>

          <div className="divider-premium" />

          <motion.div
            className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8"
            variants={itemVariants}
          >
            <p className="text-gray-500 text-sm">
              © {currentYear} Jonathan Peoples. All rights reserved.
            </p>

            <div className="flex gap-6">
              {LEGAL_LINKS.map(link => (
                <motion.a
                  key={link.label}
                  href={siteHref(link.href)}
                  className="text-gray-500 hover:text-accent-gold text-sm transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            <motion.button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="btn-premium btn-premium-cyan text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Top ↑
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="border-t border-accent-gold/20 px-4 py-4"
          initial={{ opacity: 0 }}
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-gray-500">
            <span>✦ Estate Online</span>
            <span className="hidden md:inline">
              Mandate of Mistrust · Evidence before authority
            </span>
            <span>v2.1</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
