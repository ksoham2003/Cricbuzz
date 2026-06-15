import React from "react";

const VARIANTS = {
  default: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  green: "bg-green-50 text-green-700 hover:bg-green-100",
  red: "bg-red-50 text-red-700 hover:bg-red-100",
  blue: "bg-blue-50 text-blue-700 hover:bg-blue-100",
  purple: "bg-purple-50 text-purple-700 hover:bg-purple-100",
  amber: "bg-amber-50 text-amber-700 hover:bg-amber-100",
};

const Tag = ({
  children,
  variant = "default",
  className = "",
  onClick,
  active = false,
}) => {
  const isClickable = !!onClick;

  return (
    <span
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={isClickable ? (e) => e.key === "Enter" && onClick(e) : undefined}
      className={[
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        "transition-colors duration-150",
        VARIANTS[variant] || VARIANTS.default,
        isClickable ? "cursor-pointer" : "",
        active ? "ring-2 ring-offset-1 ring-green-500" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
};

export default Tag;
