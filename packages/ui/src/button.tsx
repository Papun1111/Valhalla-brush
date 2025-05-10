"use client";

import React, {
  PropsWithChildren,
  ButtonHTMLAttributes,
} from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size    = "lg" | "sm";

export interface ButtonOwnProps {
  variant?: Variant;
  size?:    Size;
  className?: string;
}

export type ButtonProps =
  ButtonOwnProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant   = "primary",
  size      = "lg",
  className = "",
  children,
  ...props
}: PropsWithChildren<ButtonProps>): JSX.Element {
  const baseClasses =
    "relative inline-flex items-center justify-center overflow-hidden font-medium rounded-2xl focus:outline-none";

  const sizeClasses = size === "lg"
    ? "h-12 px-8 text-lg"
    : "h-8 px-4 text-sm";

  const variantClasses: Record<Variant,string> = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500",
    secondary:
      "bg-gray-800 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-600",
    outline:
      "border-2 border-white text-white hover:bg-indigo-600 hover:border-indigo-600 focus:ring-2 focus:ring-indigo-500",
    ghost:
      "bg-transparent text-white hover:bg-white/20 focus:ring-2 focus:ring-white",
  };

  return (
    <button
      {...props}
      className={`
        ${baseClasses}
        ${sizeClasses}
        ${variantClasses[variant]}
        ${className}
        transition-colors duration-300 ease-in-out transform hover:scale-105
      `}
    >
      <span className="flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}
