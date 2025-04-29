import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, useInView, Variants } from "framer-motion";

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  animation?: "fade" | "slide" | "scale" | "none";
  from?: "bottom" | "top" | "left" | "right";
  duration?: number;
  distance?: number;
  viewport?: { amount?: number; margin?: number | string };
}

export function AnimatedContainer({
  children,
  className,
  delay = 0,
  once = true,
  animation = "fade",
  from = "bottom",
  duration = 0.5,
  distance = 30,
  viewport = { amount: 0.3 },
}: AnimatedContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    amount: viewport.amount,
    margin: viewport.margin,
  });
  
  // Animation variants
  const fadeVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  
  const slideVariants: Variants = {
    hidden: {
      opacity: 0,
      x: from === "left" ? -distance : from === "right" ? distance : 0,
      y: from === "top" ? -distance : from === "bottom" ? distance : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };
  
  const scaleVariants: Variants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  };
  
  // Determine which variant to use
  const getVariants = () => {
    switch (animation) {
      case "fade":
        return fadeVariants;
      case "slide":
        return slideVariants;
      case "scale":
        return scaleVariants;
      case "none":
        return {};
      default:
        return fadeVariants;
    }
  };
  
  return (
    <motion.div
      ref={ref}
      initial={animation !== "none" ? "hidden" : undefined}
      animate={isInView ? "visible" : "hidden"}
      variants={getVariants()}
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

interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
  once?: boolean;
  animation?: "fade" | "slide" | "scale";
  from?: "bottom" | "top" | "left" | "right";
  distance?: number;
  viewport?: { amount?: number; margin?: number | string };
}

export function AnimatedList({
  children,
  className,
  staggerDelay = 0.1,
  initialDelay = 0,
  once = true,
  animation = "fade",
  from = "bottom",
  distance = 20,
  viewport = { amount: 0.1 },
}: AnimatedListProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    amount: viewport.amount,
    margin: viewport.margin,
  });
  
  const childrenArray = React.Children.toArray(children);
  
  // Animation variants
  const fadeVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  
  const slideVariants: Variants = {
    hidden: {
      opacity: 0,
      x: from === "left" ? -distance : from === "right" ? distance : 0,
      y: from === "top" ? -distance : from === "bottom" ? distance : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };
  
  const scaleVariants: Variants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  };
  
  // Determine which variant to use
  const getVariants = () => {
    switch (animation) {
      case "fade":
        return fadeVariants;
      case "slide":
        return slideVariants;
      case "scale":
        return scaleVariants;
      default:
        return fadeVariants;
    }
  };
  
  return (
    <motion.div ref={ref} className={className}>
      {childrenArray.map((child, index) => (
        <motion.div
          key={index}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={getVariants()}
          transition={{
            duration: 0.5,
            delay: initialDelay + index * staggerDelay,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Hover animation container
interface HoverAnimationProps {
  children: React.ReactNode;
  className?: string;
  type?: "lift" | "glow" | "scale" | "tilt";
  scale?: number;
  glowColor?: string;
  liftAmount?: number;
}

export function HoverAnimation({
  children,
  className,
  type = "lift",
  scale = 1.05,
  glowColor = "rgba(255, 215, 0, 0.4)",
  liftAmount = -4,
}: HoverAnimationProps) {
  const getAnimationProps = () => {
    switch (type) {
      case "lift":
        return {
          whileHover: { y: liftAmount, boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" },
          transition: { duration: 0.2 },
        };
      case "glow":
        return {
          whileHover: { boxShadow: `0 0 20px ${glowColor}` },
          transition: { duration: 0.2 },
        };
      case "scale":
        return {
          whileHover: { scale },
          transition: { duration: 0.2 },
        };
      case "tilt":
        return {
          whileHover: { rotateX: 2, rotateY: 2, z: 1 },
          style: { perspective: "1000px" },
        };
      default:
        return {};
    }
  };
  
  return (
    <motion.div className={className} {...getAnimationProps()}>
      {children}
    </motion.div>
  );
}