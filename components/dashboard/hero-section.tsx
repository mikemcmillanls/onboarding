'use client';

import { motion } from 'framer-motion';

interface HeroSectionProps {
  businessName: string;
  completed: number;
  total: number;
}

export function HeroSection({ businessName, completed, total }: HeroSectionProps) {
  const isComplete = completed === total;
  const remaining = total - completed;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-black text-white rounded-lg px-6 py-6 md:px-8 md:py-7 shadow-sm"
    >
      <h1 className="text-xl md:text-2xl font-bold mb-2">
        {isComplete ? (
          <>You&apos;re ready to go!</>
        ) : (
          <>Get set up to check out customers</>
        )}
      </h1>
      <p className="text-sm md:text-base text-gray-300">
        {isComplete ? (
          'Your Lightspeed POS and Payments are ready to accept payments.'
        ) : (
          <>
            Complete these quick steps to start accepting payments with Lightspeed.{' '}
            <span className="text-white font-medium">
              {remaining} task{remaining !== 1 ? 's' : ''} remaining
            </span>
          </>
        )}
      </p>
    </motion.div>
  );
}
