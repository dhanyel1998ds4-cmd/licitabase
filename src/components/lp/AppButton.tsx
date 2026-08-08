import React from "react";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

type AppButtonVariant = "primary" | "search" | "secondary" | "ghost" | "dark" | "light-pricing";
type AppButtonSize = "sm" | "md" | "lg";

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  responsiveFull?: boolean;
  children: React.ReactNode;
}

export const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ 
    className, 
    variant = "primary", 
    size = "md", 
    iconLeft, 
    iconRight, 
    isLoading, 
    fullWidth,
    responsiveFull,
    children, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(
          "lp-button-system app-button",
          `app-button--${variant}`,
          `app-button--${size}`,
          fullWidth && "app-button--full-width",
          responsiveFull && "app-button--responsive-full",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <LoaderCircle className="app-button__icon animate-spin" aria-hidden="true" />
            <span className="leading-none">{children}</span>
          </>
        ) : (
          <>
            {iconLeft && (
              <span className="app-button__icon app-button__icon--left shrink-0">
                {iconLeft}
              </span>
            )}
            <span className="leading-none">{children}</span>
            {iconRight && (
              <span className="app-button__icon app-button__icon--right shrink-0">
                {iconRight}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

AppButton.displayName = "AppButton";
