import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Page transition animations
export interface PageTransitionProps {
  children: ReactNode;
  mode?: "fade" | "slide" | "scale";
  className?: string;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function PageTransition({
  children,
  mode = "fade",
  className,
  duration = 0.3,
  direction = "up",
}: PageTransitionProps) {
  // Motion variants based on mode
  const getVariants = () => {
    switch (mode) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case "slide":
        const offset = 50;
        const x = direction === "left" ? -offset : direction === "right" ? offset : 0;
        const y = direction === "up" ? -offset : direction === "down" ? offset : 0;
        
        return {
          initial: { opacity: 0, x, y },
          animate: { opacity: 1, x: 0, y: 0 },
          exit: { opacity: 0, x: -x, y: -y },
        };
      case "scale":
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 },
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={React.useId()}
        className={cn("w-full", className)}
        initial={getVariants().initial}
        animate={getVariants().animate}
        exit={getVariants().exit}
        transition={{
          duration,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Component for fading in
export interface FadeInProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
}

export function FadeIn({
  children,
  className,
  duration = 0.5,
  delay = 0,
}: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Component for staggered children
export interface StaggeredFadeInProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  childrenDelay?: number;
  duration?: number;
}

export function StaggeredFadeIn({
  children,
  className,
  staggerDelay = 0.1,
  childrenDelay = 0.2,
  duration = 0.5,
}: StaggeredFadeInProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: childrenDelay,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
      },
    },
  };

  // If children is a single React element, wrap it in an array
  const childrenArray = React.Children.toArray(children);

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {childrenArray.map((child, index) => (
        <motion.div key={index} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}