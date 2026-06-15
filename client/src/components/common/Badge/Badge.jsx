import React from "react";

const VARIANTS = {
  live: "bg-red-500 text-white",
  upcoming: "bg-blue-100 text-blue-700",
  result: "bg-gray-100 text-gray-600",
  t20: "bg-purple-100 text-purple-700",
  odi: "bg-green-100 text-green-700",
  test: "bg-amber-100 text-amber-700",
  t10: "bg-pink-100 text-pink-700",
  ipl: "bg-indigo-100 text-indigo-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  default: "bg-gray-100 text-gray-600",
};

const Badge = ({ children, variant = "default", className = "", pulse = false }) => {
  const variantClass = VARIANTS[variant?.toLowerCase()] || VARIANTS.default;

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider",
        variantClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
};

export default Badge;
