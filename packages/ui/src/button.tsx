"use client";

import React, {
  PropsWithChildren,
  ButtonHTMLAttributes,
} from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "lg" | "md" | "sm";

export interface ButtonOwnProps {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  className?: string;
}

export type ButtonProps = ButtonOwnProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  children,
  disabled,
  ...props
}: PropsWithChildren<ButtonProps>): JSX.Element {
  
  // 1. Base Structure & Transitions
  const baseClasses = 
    "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 hover:-translate-y-0.5";

  // 2. Responsive Sizing (Mobile -> Desktop)
  const sizeClasses = {
    sm: "h-8 px-3 text-xs md:h-9 md:px-4 md:text-sm",
    md: "h-10 px-4 text-sm md:h-12 md:px-6 md:text-base",
    lg: "h-12 px-6 text-base md:h-14 md:px-8 md:text-lg",
  };

  // 3. Variant Styling with Glow Effects
  const variantClasses: Record<Variant, string> = {
    primary: `
      bg-indigo-600 text-white 
      shadow-lg shadow-indigo-500/30 
      hover:bg-indigo-500 hover:shadow-indigo-500/50 
      focus:ring-indigo-500 border border-transparent
    `,
    secondary: `
      bg-slate-800 text-white 
      shadow-lg shadow-slate-900/20 
      hover:bg-slate-700 
      focus:ring-slate-500 border border-transparent
    `,
    outline: `
      bg-transparent text-indigo-100 
      border-2 border-indigo-500/30 
      hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white
      focus:ring-indigo-500
    `,
    ghost: `
      bg-transparent text-slate-200 
      hover:bg-white/10 hover:text-white
      focus:ring-slate-400
    `,
    danger: `
      bg-rose-600 text-white
      shadow-lg shadow-rose-500/30
      hover:bg-rose-500 hover:shadow-rose-500/50
      focus:ring-rose-500 border border-transparent
    `
  };

  return (
    <button
      disabled={disabled || isLoading}
      {...props}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `.trim()}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 md:h-5 md:w-5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      
      <span className={`flex items-center gap-2 ${isLoading ? 'opacity-90' : ''}`}>
        {children}
      </span>
    </button>
  );
}