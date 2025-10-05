import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX } from 'react-icons/fi';
import { Button } from './ui/button';
import { useState } from 'react';

export const FilterPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-card hover:bg-card/80 text-card-foreground border border-border gap-2"
      >
        <FiFilter className="w-4 h-4" />
        Filters
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Filter Publications</h3>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-destructive/20"
                >
                  <FiX className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-6 border-2 border-dashed border-border rounded-lg text-center">
                  <FiFilter className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Filter functionality placeholder
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Future filters: Author, Year, Topic, Experiment Type
                  </p>
                </div>

                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
