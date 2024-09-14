import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./GardenHeading.css";

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
            <div
              style={{
                display: "flex",
                flexDirection:'column',
                justifyContent: "center",
                alignItems: "center",
                textAlign: "justify",
                margin: "0 auto",
                pointerEvents: 'none',
                
              }}
            >
              Garden Scape
            <motion.p
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 1 }}
              style={{
                fontSize: 25,
                textAlign: "justify",
                margin: "0 auto",
                width: "80%",
                pointerEvents: 'none',
                // zIndex: '-1',
              }}
            >
              Welcome to our Virtual Herbal Garden project which offers an immersive and
              educational platform that allows users to explore a diverse range
              of medicinal plants used in AYUSH (Ayurveda, Yoga & Naturopathy,
              Unani, Siddha, and Homeopathy).
            </motion.p>
            </div>

          </motion.h1>
        )}
      </AnimatePresence>
    </div>
  );
}
