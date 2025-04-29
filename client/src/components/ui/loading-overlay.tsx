import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  fullScreen?: boolean;
  showDelay?: number;
  className?: string;
  backgroundColor?: "white" | "black" | "transparent";
  spinnerColor?: "primary" | "black" | "white" | "muted";
  spinnerSize?: "sm" | "md" | "lg" | "xl";
  blur?: boolean;
  zIndex?: number;
  children?: React.ReactNode;
}

export function LoadingOverlay({
  isLoading,
  message,
  fullScreen = false,
  showDelay = 300,
  className,
  backgroundColor = "white",
  spinnerColor = "primary",
  spinnerSize = "md",
  blur = false,
  zIndex = 50,
  children,
}: LoadingOverlayProps) {
  const [showLoader, setShowLoader] = useState(false);

  // Delay showing the loader to prevent flashes for quick loads
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoader(true);
      }, showDelay);
      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, [isLoading, showDelay]);

  if (!showLoader && !isLoading) {
    return <>{children}</>;
  }

  // Get background color class
  const getBackgroundColor = () => {
    switch (backgroundColor) {
      case "white":
        return "bg-white/90";
      case "black":
        return "bg-black/90";
      case "transparent":
        return "bg-transparent";
      default:
        return "bg-white/90";
    }
  };

  return (
    <div className={cn("relative", className)}>
      {children}

      <AnimatePresence>
        {showLoader && isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              getBackgroundColor(),
              blur && "backdrop-blur-sm",
              fullScreen && "fixed",
              `z-[${zIndex}]`
            )}
          >
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <LoadingSpinner
                size={spinnerSize}
                color={spinnerColor}
                text={message}
                textPosition="bottom"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Full page loading screen
export function FullPageLoading({
  isLoading,
  message = "Loading...",
  blur = true,
  backgroundColor = "white",
  spinnerColor = "primary",
  logo,
}: {
  isLoading: boolean;
  message?: string;
  blur?: boolean;
  backgroundColor?: "white" | "black" | "transparent";
  spinnerColor?: "primary" | "black" | "white";
  logo?: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed inset-0 z-50 flex flex-col items-center justify-center",
            backgroundColor === "white" && "bg-white",
            backgroundColor === "black" && "bg-black",
            blur && "backdrop-blur-sm"
          )}
        >
          {logo && <div className="mb-8">{logo}</div>}
          <LoadingSpinner
            size="lg"
            color={spinnerColor}
            text={message}
            textPosition="bottom"
            textClassName={cn(
              backgroundColor === "black" ? "text-white" : "text-black"
            )}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}