import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LandingPage } from '@/components/LandingPage';
import { Dashboard } from '@/components/Dashboard';

const Index = () => {
  const [hasEntered, setHasEntered] = useState(false);

  const handleEnter = () => {
    setHasEntered(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!hasEntered ? (
          <LandingPage key="landing" onEnter={handleEnter} />
        ) : (
          <motion.div
            key="dashboard"
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <Dashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
