import React, { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export interface ModernButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "subtle" | "black";
  size?: "sm" | "md" | "lg" | "xl" | "icon";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  asChild?: boolean;
  isActive?: boolean;
}

const ModernButton = forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({
    className,
    variant = "primary",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    asChild = false,
    isActive = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button";

    // Common styles
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    // Variants
    const variantStyles = {
      primary: "bg-yellow-400 hover:bg-yellow-500 text-black",
      secondary: "bg-neutral-200 hover:bg-neutral-300 text-black",
      outline: "border border-neutral-300 hover:bg-neutral-100 text-black",
      ghost: "hover:bg-neutral-100 text-black",
      link: "text-yellow-500 hover:text-yellow-600 underline-offset-4 hover:underline p-0 h-auto",
      subtle: "bg-neutral-100 hover:bg-neutral-200 text-black",
      black: "bg-black hover:bg-neutral-800 text-white"
    };

    // Sizes
    const sizeStyles = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-6 text-lg",
      xl: "h-14 px-8 text-xl",
      icon: "h-10 w-10"
    };

    // Active state
    const activeStyles = isActive 
      ? "ring-2 ring-yellow-400 ring-offset-2" 
      : "";

    // Full class string
    const buttonClasses = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      activeStyles,
      className
    );

    // Hover animation values for the button
    const hoverAnimation = {
      scale: variant === "link" ? 1 : 1.02,
      transition: { duration: 0.2 }
    };

    // Tap animation values
    const tapAnimation = {
      scale: variant === "link" ? 1 : 0.98
    };

    return (
      <motion.div
        whileHover={hoverAnimation}
        whileTap={tapAnimation}
        className="inline-block"
      >
        <Comp
          className={buttonClasses}
          ref={ref}
          disabled={isLoading || props.disabled}
          {...props}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {children}
            </>
          ) : (
            <>
              {leftIcon && <span className="mr-2">{leftIcon}</span>}
              {children}
              {rightIcon && <span className="ml-2">{rightIcon}</span>}
            </>
          )}
        </Comp>
      </motion.div>
    );
  }
);

ModernButton.displayName = "ModernButton";

export { ModernButton };