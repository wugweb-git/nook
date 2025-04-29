import React from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface ModernSwitchProps {
  id?: string;
  label?: string;
  isChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  labelClassName?: string;
  size?: "sm" | "md" | "lg";
  color?: "default" | "yellow" | "black";
  description?: string;
  disabled?: boolean;
}

export const ModernSwitch = React.forwardRef<HTMLButtonElement, ModernSwitchProps>(
  ({
    id,
    label,
    isChecked = false,
    onChange,
    className,
    labelClassName,
    size = "md",
    color = "yellow",
    description,
    disabled = false,
    ...props
  }, ref) => {
    // Generate a unique ID if one is not provided
    const uniqueId = React.useId();
    const switchId = id || uniqueId;

    // Size variants
    const sizeClasses = {
      sm: "h-3.5 w-6",
      md: "h-4 w-8",
      lg: "h-5 w-10",
    };

    // Thumb (circle) size based on switch size
    const thumbSizes = {
      sm: "h-2 w-2",
      md: "h-3 w-3",
      lg: "h-4 w-4",
    };

    // Color variants
    const colorClasses = {
      default: "bg-neutral-200 data-[state=checked]:bg-neutral-800",
      yellow: "bg-neutral-200 data-[state=checked]:bg-yellow-400",
      black: "bg-neutral-200 data-[state=checked]:bg-black",
    };

    // Handle the change event
    const handleCheckedChange = (checked: boolean) => {
      if (onChange) {
        onChange(checked);
      }
    };

    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Switch
          id={switchId}
          ref={ref}
          checked={isChecked}
          onCheckedChange={handleCheckedChange}
          disabled={disabled}
          className={cn(
            sizeClasses[size],
            colorClasses[color],
            "relative rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          {...props}
        >
          <motion.div
            className={cn(
              thumbSizes[size],
              "bg-white rounded-full absolute left-0.5 top-0.5",
              disabled && "bg-neutral-200"
            )}
            animate={{
              x: isChecked ? (size === "sm" ? 10 : size === "md" ? 16 : 20) : 0
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
          />
        </Switch>
        
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <Label
                htmlFor={switchId}
                className={cn(
                  "text-sm font-medium",
                  disabled && "opacity-50 cursor-not-allowed",
                  labelClassName
                )}
              >
                {label}
              </Label>
            )}
            {description && (
              <p className={cn(
                "text-xs text-neutral-500 mt-0.5",
                disabled && "opacity-50"
              )}>
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

ModernSwitch.displayName = "ModernSwitch";