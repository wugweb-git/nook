import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Inherit tabs behavior from @radix-ui/react-tabs
import {
  Tabs as RadixTabs,
  TabsList as RadixTabsList,
  TabsTrigger as RadixTabsTrigger,
  TabsContent as RadixTabsContent,
} from "@/components/ui/tabs";

// ===== Animated Tabs =====
export interface AnimatedTabsProps extends React.ComponentPropsWithoutRef<typeof RadixTabs> {
  fadeContent?: boolean;
  slideContent?: boolean;
}

export const AnimatedTabs = React.forwardRef<
  React.ElementRef<typeof RadixTabs>,
  AnimatedTabsProps
>(({ className, fadeContent = true, slideContent = false, ...props }, ref) => {
  return (
    <RadixTabs
      ref={ref}
      className={cn("w-full", className)}
      {...props}
    />
  );
});
AnimatedTabs.displayName = "AnimatedTabs";

// ===== Animated Tabs Trigger =====
export interface AnimatedTabsTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixTabsTrigger> {
  activeColor?: string;
  activeTextColor?: string;
  inactiveTextColor?: string;
  accentColor?: "yellow" | "black" | "primary";
}

export const AnimatedTabsTrigger = React.forwardRef<
  React.ElementRef<typeof RadixTabsTrigger>,
  AnimatedTabsTriggerProps
>(({ 
  className, 
  activeColor = "bg-yellow-400", 
  activeTextColor = "text-black", 
  inactiveTextColor = "text-gray-600",
  accentColor = "yellow",
  children, 
  ...props 
}, ref) => {
  const accentMap = {
    yellow: "after:bg-yellow-400",
    black: "after:bg-black",
    primary: "after:bg-primary"
  };

  return (
    <RadixTabsTrigger
      ref={ref}
      className={cn(
        "relative px-4 py-2 transition-all duration-300 ease-out",
        "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:transition-all after:duration-300",
        `data-[state=active]:${activeTextColor} data-[state=inactive]:${inactiveTextColor}`,
        "data-[state=active]:after:w-full",
        accentMap[accentColor],
        "hover:text-black",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/20 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </RadixTabsTrigger>
  );
});
AnimatedTabsTrigger.displayName = "AnimatedTabsTrigger";

// ===== Animated Tabs Content =====
export interface AnimatedTabsContentProps extends React.ComponentPropsWithoutRef<typeof RadixTabsContent> {
  slideDirection?: "left" | "right" | "up" | "down";
  duration?: number;
}

export const AnimatedTabsContent = React.forwardRef<
  React.ElementRef<typeof RadixTabsContent>,
  AnimatedTabsContentProps
>(({ 
  className, 
  slideDirection = "up", 
  duration = 0.3,
  children, 
  ...props 
}, ref) => {
  // Map direction to X/Y values
  const directionMap = {
    left: { x: -20, y: 0 },
    right: { x: 20, y: 0 },
    up: { x: 0, y: -20 },
    down: { x: 0, y: 20 },
  };
  
  const { x, y } = directionMap[slideDirection];

  return (
    <RadixTabsContent
      ref={ref}
      className={cn(
        "mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/20 focus-visible:ring-offset-2",
        className
      )}
      asChild
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, x, y }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x, y }}
        transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </RadixTabsContent>
  );
});
AnimatedTabsContent.displayName = "AnimatedTabsContent";

// Export TabsList with a different name
export { RadixTabsList as AnimatedTabsList };