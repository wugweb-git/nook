import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  elevation?: "none" | "sm" | "md" | "lg";
  hover?: "none" | "lift" | "grow" | "highlight";
  background?: "white" | "light" | "dark" | "black" | "transparent";
  border?: boolean;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
}

export function ModernCard({
  children,
  className,
  animate = true,
  elevation = "md",
  hover = "lift",
  background = "white",
  border = false,
  rounded = "lg",
  padding = "md",
  onClick,
}: ModernCardProps) {
  // Get elevation classes
  const getElevationClasses = () => {
    switch (elevation) {
      case "none":
        return "";
      case "sm":
        return "shadow-sm";
      case "md":
        return "shadow-md";
      case "lg":
        return "shadow-lg";
      default:
        return "shadow-md";
    }
  };

  // Get hover effect classes
  const getHoverClasses = () => {
    switch (hover) {
      case "none":
        return "";
      case "lift":
        return "hover-lift active-scale transition-transform";
      case "grow":
        return "hover-scale active-scale transition-transform";
      case "highlight":
        return "hover:border-yellow-400 transition-colors";
      default:
        return "hover-lift transition-transform";
    }
  };

  // Get background classes
  const getBackgroundClasses = () => {
    switch (background) {
      case "white":
        return "bg-white text-black";
      case "light":
        return "bg-neutral-50 text-black";
      case "dark":
        return "bg-neutral-900 text-white";
      case "black":
        return "bg-black text-white";
      case "transparent":
        return "bg-transparent";
      default:
        return "bg-white text-black";
    }
  };

  // Get border radius classes
  const getRoundedClasses = () => {
    switch (rounded) {
      case "none":
        return "rounded-none";
      case "sm":
        return "rounded-sm";
      case "md":
        return "rounded-md";
      case "lg":
        return "rounded-lg";
      case "xl":
        return "rounded-xl";
      case "full":
        return "rounded-full";
      default:
        return "rounded-lg";
    }
  };

  // Get padding classes
  const getPaddingClasses = () => {
    switch (padding) {
      case "none":
        return "p-0";
      case "sm":
        return "p-3";
      case "md":
        return "p-5";
      case "lg":
        return "p-7";
      case "xl":
        return "p-10";
      default:
        return "p-5";
    }
  };

  const CardComponent = animate ? motion.div : "div";

  return (
    <CardComponent
      className={cn(
        getBackgroundClasses(),
        getElevationClasses(),
        getHoverClasses(),
        getRoundedClasses(),
        getPaddingClasses(),
        border && "border border-neutral-200",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      whileHover={animate && hover === "lift" ? { y: -4 } : hover === "grow" ? { scale: 1.02 } : {}}
      whileTap={animate ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </CardComponent>
  );
}

export const ModernCardHeader = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div className={cn("mb-4", className)}>
    {children}
  </div>
);

export const ModernCardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <h3 className={cn("text-xl font-semibold", className)}>
    {children}
  </h3>
);

export const ModernCardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <p className={cn("text-sm text-neutral-500", className)}>
    {children}
  </p>
);

export const ModernCardContent = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div className={cn("", className)}>
    {children}
  </div>
);

export const ModernCardFooter = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div className={cn("mt-4 flex items-center justify-end space-x-2", className)}>
    {children}
  </div>
);