import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Award, Zap, Target } from 'lucide-react';

export interface TimelineEventData {
  id: string;
  year: number;
  title: string;
  description: string;
  details?: string[];
  achievement?: string;
  icon?: React.ReactNode;
  color?: string;
  side?: 'left' | 'right';
}

interface TimelineEventProps {
  event: TimelineEventData;
  index: number;
  isVisible: boolean;
}

export const TimelineEvent: React.FC<TimelineEventProps> = ({
  event,
  index,
  isVisible,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, x: event.side === 'left' ? -50 : 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        type: 'spring' as const,
        stiffness: 100,
      },
    },
  } as any;

  const cardVariants = {
    collapsed: { height: 'auto' },
    expanded: { height: 'auto' },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, delay: 0.1 },
    },
  };

  const getIconForEvent = (title: string) => {
    if (title.includes('Award') || title.includes('Recognition'))
      return <Award className="w-5 h-5" />;
    if (title.includes('Launch') || title.includes('Release'))
      return <Zap className="w-5 h-5" />;
    if (title.includes('Goal') || title.includes('Milestone'))
      return <Target className="w-5 h-5" />;
    return event.icon || <Zap className="w-5 h-5" />;
  };

  return (
    <motion.div
      className="relative mb-12"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
    >
      <div
        className={`flex ${
          event.side === 'right' ? 'flex-row-reverse' : 'flex-row'
        } items-start gap-8`}
      >
        {/* Timeline marker */}
        <motion.div
          className="flex flex-col items-center"
          whileHover={{ scale: 1.1 }}
        >
          <motion.div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg border-4 cursor-pointer relative z-10 transition-all ${
              event.color ||
              'bg-gradient-to-br from-afro-gold to-afro-terracotta border-afro-gold'
            }`}
            whileHover={{
              scale: 1.15,
              boxShadow: '0 0 30px rgba(255, 200, 0, 0.8)',
            }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {event.icon ? (
              <div className="text-xl">{event.icon}</div>
            ) : (
              getIconForEvent(event.title)
            )}
          </motion.div>

          {/* Connecting line */}
          <motion.div
            className="w-1 bg-gradient-to-b from-afro-gold to-transparent mt-4"
            initial={{ height: 0 }}
            animate={isVisible ? { height: '80px' } : { height: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
          />
        </motion.div>

        {/* Content card */}
        <motion.div
          className={`flex-1 ${event.side === 'right' ? 'text-right' : 'text-left'}`}
          variants={cardVariants}
        >
          <motion.div
            className="afro-tech-card p-6 cursor-pointer transition-all hover:shadow-lg hover:shadow-afro-gold/30"
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ y: -5 }}
          >
            {/* Year badge */}
            <motion.div
              className="inline-block mb-3"
              initial={{ scale: 0 }}
              animate={isVisible ? { scale: 1 } : { scale: 0 }}
              transition={{ delay: index * 0.1 + 0.1 }}
            >
              <span className="text-sm font-bold text-afro-gold bg-afro-gold/20 px-3 py-1 rounded-full">
                {event.year}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h3
              className="text-xl font-bold text-afro-gold mb-2"
              variants={contentVariants}
              initial="hidden"
              animate={isVisible ? 'visible' : 'hidden'}
            >
              {event.title}
            </motion.h3>

            {/* Description */}
            <motion.p
              className="text-foreground/80 text-sm mb-3"
              variants={contentVariants}
              initial="hidden"
              animate={isVisible ? 'visible' : 'hidden'}
            >
              {event.description}
            </motion.p>

            {/* Achievement badge */}
            {event.achievement && (
              <motion.div
                className="inline-block mb-4"
                variants={contentVariants}
                initial="hidden"
                animate={isVisible ? 'visible' : 'hidden'}
              >
                <span className="text-xs font-semibold text-afro-emerald bg-afro-emerald/20 px-2 py-1 rounded">
                  ✓ {event.achievement}
                </span>
              </motion.div>
            )}

            {/* Expand button */}
            {event.details && event.details.length > 0 && (
              <motion.button
                className="flex items-center gap-2 text-afro-gold text-sm font-semibold hover:text-afro-emerald transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? 'Show Less' : 'Show More'}
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>
            )}
          </motion.div>

          {/* Expanded details */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={
              isExpanded
                ? { opacity: 1, height: 'auto' }
                : { opacity: 0, height: 0 }
            }
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <motion.div
              className="mt-3 p-4 bg-afro-gold/5 border border-afro-gold/30 rounded-lg space-y-2"
              variants={contentVariants}
              initial="hidden"
              animate={isExpanded ? 'visible' : 'hidden'}
            >
              {event.details?.map((detail, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-2 text-sm text-foreground/70"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isExpanded ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span className="text-afro-emerald font-bold mt-1">→</span>
                  <span>{detail}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TimelineEvent;
