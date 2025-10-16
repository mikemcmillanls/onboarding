'use client';

import { motion } from 'framer-motion';

interface HeroSectionProps {
  businessName: string;
  completed: number;
  total: number;
}

export function HeroSection({ businessName, completed, total }: HeroSectionProps) {
  const isComplete = completed === total;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center py-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {isComplete ? (
          <>You&apos;re all set, {businessName}!</>
        ) : (
          <>Hi {businessName}, let&apos;s get your store set up!</>
        )}
      </h1>
      <p className="text-base text-gray-600">
        {isComplete ? (
          'Your store is ready to start accepting payments.'
        ) : (
          'Follow our lead to get the basics in order.'
        )}
      </p>
    </motion.div>
  );
}
