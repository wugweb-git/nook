import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

// Import our custom components
import { ModernButton } from "./modern-button";
import { ModernSwitch } from "./modern-switch";
import { LoadingSpinner, LoadingOverlay } from "./loading-spinner";
import { PageTransition, FadeIn, StaggeredFadeIn } from "./page-transition";
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from "./animated-tabs";

// Export them for easy access
export {
  ModernButton,
  ModernSwitch,
  LoadingSpinner,
  LoadingOverlay,
  PageTransition,
  FadeIn,
  StaggeredFadeIn,
  AnimatedTabs,
  AnimatedTabsContent,
  AnimatedTabsList,
  AnimatedTabsTrigger
};

// ===== Layout Components =====

interface SectionProps {
  children: ReactNode;
  className?: string;
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
}

export function Section({ children, className, spacing = "md" }: SectionProps) {
  const spacingMap = {
    none: "space-y-0",
    sm: "space-y-2",
    md: "space-y-4",
    lg: "space-y-6",
    xl: "space-y-8",
  };

  return (
    <div className={cn(spacingMap[spacing], className)}>
      {children}
    </div>
  );
}

interface GridProps {
  children: ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
  gap?: "none" | "sm" | "md" | "lg";
}

export function Grid({ children, className, cols = 2, gap = "md" }: GridProps) {
  const colsMap = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const gapMap = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  return (
    <div className={cn("grid", colsMap[cols], gapMap[gap], className)}>
      {children}
    </div>
  );
}

// ===== Typography Components =====

interface TextProps {
  children: ReactNode;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "body" | "body-lg" | "body-sm" | "caption" | "overline" | "lead";
  color?: "default" | "muted" | "white" | "black" | "primary";
  align?: "left" | "center" | "right";
  weight?: "normal" | "medium" | "semibold" | "bold";
  className?: string;
  asChild?: boolean;
}

export function Text({
  children,
  variant = "body",
  color = "default",
  align = "left",
  weight = "normal",
  className,
  asChild = false,
  ...props
}: TextProps & React.HTMLAttributes<HTMLElement>) {
  const Comp = asChild ? Slot : getTextComponent(variant);

  // Variant styles
  const variantStyles = {
    h1: "text-4xl md:text-5xl lg:text-6xl",
    h2: "text-3xl md:text-4xl",
    h3: "text-2xl md:text-3xl",
    h4: "text-xl md:text-2xl",
    h5: "text-lg md:text-xl",
    body: "text-base",
    "body-lg": "text-lg",
    "body-sm": "text-sm",
    caption: "text-xs",
    overline: "text-xs uppercase tracking-wider",
    lead: "text-xl",
  };

  // Color styles
  const colorStyles = {
    default: "text-neutral-900 dark:text-neutral-50",
    muted: "text-neutral-500 dark:text-neutral-400",
    white: "text-white",
    black: "text-black",
    primary: "text-yellow-500",
  };

  // Alignment styles
  const alignStyles = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  // Font weight styles
  const weightStyles = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  return (
    <Comp
      className={cn(
        variantStyles[variant],
        colorStyles[color],
        alignStyles[align],
        weightStyles[weight],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

// Helper function to get the appropriate HTML element based on variant
function getTextComponent(variant: TextProps["variant"]): keyof JSX.IntrinsicElements {
  switch (variant) {
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "h5":
      return "h5";
    case "lead":
      return "p";
    case "body":
    case "body-lg":
    case "body-sm":
      return "p";
    case "caption":
      return "span";
    case "overline":
      return "span";
    default:
      return "p";
  }
}

// ===== Card Components =====

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  interactive?: boolean;
}

export function ModernCard({ 
  children,
  className,
  variant = "default",
  interactive = false,
  ...props 
}: ModernCardProps & React.HTMLAttributes<HTMLDivElement>) {
  const variantStyles = {
    default: "bg-white border border-neutral-200 shadow-sm",
    outline: "border border-neutral-200",
    ghost: "bg-transparent",
  };

  const interactiveStyles = interactive 
    ? "transition-all hover:shadow-md hover:border-neutral-300 hover:scale-[1.02] cursor-pointer" 
    : "";

  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden",
        variantStyles[variant],
        interactiveStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ===== Icon Components =====

interface IconContainerProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  color?: "default" | "muted" | "white" | "black" | "primary";
  className?: string;
}

export function IconContainer({ 
  children,
  size = "md",
  color = "default",
  className,
  ...props 
}: IconContainerProps & React.HTMLAttributes<HTMLSpanElement>) {
  const sizeStyles = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  const colorStyles = {
    default: "text-neutral-900 dark:text-neutral-50",
    muted: "text-neutral-500 dark:text-neutral-400",
    white: "text-white",
    black: "text-black",
    primary: "text-yellow-500",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        sizeStyles[size],
        colorStyles[color],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// ===== Misc Components =====

interface DividerProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function Divider({ 
  className,
  orientation = "horizontal",
  ...props 
}: DividerProps & React.HTMLAttributes<HTMLDivElement>) {
  const orientationStyles = {
    horizontal: "w-full h-px",
    vertical: "h-full w-px",
  };

  return (
    <div
      className={cn(
        "bg-neutral-200 dark:bg-neutral-800",
        orientationStyles[orientation],
        className
      )}
      {...props}
    />
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "error";
  className?: string;
}

export function Badge({ 
  children,
  variant = "default",
  className,
  ...props 
}: BadgeProps & React.HTMLAttributes<HTMLSpanElement>) {
  const variantStyles = {
    default: "bg-yellow-100 text-yellow-800",
    secondary: "bg-neutral-100 text-neutral-800",
    outline: "border border-neutral-200 text-neutral-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}