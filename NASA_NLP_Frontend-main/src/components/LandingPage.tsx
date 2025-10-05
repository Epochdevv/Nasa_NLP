import { motion } from 'framer-motion';
import { StarField } from './StarField';
import logo from '@/assets/knowledge-verse-logo.png';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage = ({ onEnter }: LandingPageProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      <StarField />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center gap-8"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="cursor-pointer"
        >
          <motion.img
            src={logo}
            alt="Knowledge-Verse"
            className="w-64 h-64 drop-shadow-2xl animate-pulse-glow"
            animate={{ 
              filter: [
                'drop-shadow(0 0 30px rgba(0, 212, 255, 0.4))',
                'drop-shadow(0 0 60px rgba(0, 212, 255, 0.8))',
                'drop-shadow(0 0 30px rgba(0, 212, 255, 0.4))',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Knowledge-Verse
          </h1>
          <p className="text-muted-foreground text-lg">
            Exploring 20 NASA Bioscience Publications
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-accent text-sm mt-8"
        >
          Click the logo to enter
        </motion.p>
      </motion.div>
    </div>
  );
};
