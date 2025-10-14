'use client';

import { motion } from 'framer-motion';

interface SimpleProgressProps {
  currentPage: number;
  totalPages: number;
}

export function SimpleProgress({ currentPage, totalPages }: SimpleProgressProps) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        const isActive = page === currentPage;
        const isCompleted = page < currentPage;

        return (
          <div key={page} className="flex items-center">
            <div className="relative">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold transition-colors ${
                  isActive
                    ? 'border-primary bg-primary text-white'
                    : isCompleted
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                ) : (
                  <span>{page}</span>
                )}
              </motion.div>

              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </div>

            {page < totalPages && (
              <div
                className={`w-12 h-0.5 mx-2 transition-colors ${
                  isCompleted ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        );
      })}

      <div className="ml-4 text-sm text-muted-foreground">
        Step {currentPage} of {totalPages}
      </div>
    </div>
  );
}
