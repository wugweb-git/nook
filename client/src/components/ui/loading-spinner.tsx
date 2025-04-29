import React from "react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "default" | "yellow" | "white" | "black";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  color = "default",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  const colorClasses = {
    default: "text-neutral-400",
    yellow: "text-yellow-400",
    white: "text-white",
    black: "text-black"
  };

  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-solid border-current border-e-transparent",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// With overlay for full-page or container loading
export interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  spinnerSize?: LoadingSpinnerProps["size"];
  spinnerColor?: LoadingSpinnerProps["color"];
  overlayColor?: "light" | "dark" | "transparent";
  className?: string;
  spinnerClassName?: string;
  text?: string;
}

export function LoadingOverlay({
  isLoading,
  children,
  spinnerSize = "lg",
  spinnerColor = "yellow",
  overlayColor = "light",
  className,
  spinnerClassName,
  text,
}: LoadingOverlayProps) {
  const overlayClasses = {
    light: "bg-white/70",
    dark: "bg-black/30",
    transparent: "bg-transparent"
  };

  return (
    <div className={cn("relative", className)}>
      {children}
      
      {isLoading && (
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center z-50",
            overlayClasses[overlayColor]
          )}
        >
          <LoadingSpinner 
            size={spinnerSize} 
            color={spinnerColor}
            className={spinnerClassName}
          />
          {text && (
            <p className={cn(
              "mt-2 text-sm font-medium",
              spinnerColor === "white" ? "text-white" : "text-neutral-800"
            )}>
              {text}
            </p>
          )}
        </div>
      )}
    </div>
  );
}