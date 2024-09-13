import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './GardenHeading.css';

export default function AnimatedHeading() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Hide after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="top-bar">
      <AnimatePresence>
        {isVisible && (
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 1 }}
            className="heading"
          >
            GARDEN
          </motion.h1>
        )}
      </AnimatePresence>
    </div>
  );
}
