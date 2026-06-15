import React from "react";

const VARIANTS = {
  primary:
    "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 border border-transparent",
  secondary:
    "bg-white text-green-700 hover:bg-green-50 border border-green-600",
  outline:
    "bg-transparent text-gray-700 hover:bg-gray-100 border border-gray-300",
  ghost:
    "bg-transparent text-green-600 hover:bg-green-50 border border-transparent",
  danger:
    "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
  dark:
    "bg-slate-800 text-white hover:bg-slate-700 border border-transparent",
};

const SIZES = {
  xs: "px-2.5 py-1 text-xs rounded-lg",
  sm: "px-3.5 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
  xl: "px-8 py-4 text-base rounded-2xl",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = false,
  onClick,
  type = "button",
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center gap-2 font-semibold",
        "transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1",
        "select-none cursor-pointer",
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        isDisabled ? "opacity-60 cursor-not-allowed pointer-events-none" : "",
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : LeftIcon ? (
        <LeftIcon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
      {!loading && RightIcon && <RightIcon className="w-4 h-4 shrink-0" />}
    </button>
  );
};

export default Button;
