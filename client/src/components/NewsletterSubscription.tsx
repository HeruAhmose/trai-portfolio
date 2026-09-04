import React from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

/**
 * The public estate has no newsletter backend. This contact card deliberately
 * avoids collecting an address or simulating a subscription.
 */
export const NewsletterSubscription: React.FC = () => (
  <motion.div
    className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-afro-gold/10 to-afro-sapphire/10 border border-afro-gold/30 rounded-lg"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <div className="flex items-center gap-2 mb-4">
      <Mail className="w-5 h-5 text-afro-gold" />
      <h3 className="text-lg font-bold text-afro-gold">Research Updates</h3>
    </div>

    <p className="text-foreground/60 text-sm mb-4">
      This static site has no subscription backend. Request project and research
      updates directly by email.
    </p>

    <a
      href="mailto:aitconsult22@gmail.com?subject=TRAI%20Research%20Updates"
      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-afro-gold/20 border border-afro-gold/50 rounded-lg text-afro-gold hover:bg-afro-gold/30 transition-colors"
    >
      <Mail className="w-4 h-4" />
      Request updates by email
    </a>

    <p className="text-foreground/40 text-xs mt-4">
      No address is collected or stored by this site.
    </p>
  </motion.div>
);
