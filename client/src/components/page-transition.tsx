import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

interface PageTransitionProps {
  children: React.ReactNode;
  mode?: "fade" | "slide" | "scale";
  duration?: number;
}

export function PageTransition({
  children,
  mode = "fade",
  duration = 0.3,
}: PageTransitionProps) {
  const [location] = useLocation();
  
  // Animation variants based on transition mode
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
  };
  
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={variants[mode].initial}
        animate={variants[mode].animate}
        exit={variants[mode].exit}
        transition={{ 
          duration, 
          ease: [0.22, 1, 0.36, 1] 
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Fade-in component for content sections
export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className = "",
  duration = 0.5,
  distance = 20,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  duration?: number;
  distance?: number;
}) {
  const getDirectionValues = () => {
    switch (direction) {
      case "up":
        return { y: distance };
      case "down":
        return { y: -distance };
      case "left":
        return { x: distance };
      case "right":
        return { x: -distance };
      default:
        return { y: distance };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getDirectionValues() }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered children animation for lists and grids
export function StaggeredFadeIn({
  children,
  staggerDelay = 0.1,
  containerDelay = 0,
  className = "",
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  containerDelay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: containerDelay }}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: containerDelay + index * staggerDelay,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}