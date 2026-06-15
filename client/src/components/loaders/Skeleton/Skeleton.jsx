import React from "react";

/**
 * Base skeleton shimmer block. Use width/height/className to shape it.
 * variant: "line" | "circle" | "rect" (default)
 */
const Skeleton = ({
  variant = "rect",
  width,
  height,
  className = "",
  count = 1,
}) => {
  const base =
    "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]";

  const shapeClass =
    variant === "circle"
      ? "rounded-full"
      : variant === "line"
      ? "rounded-full"
      : "rounded-lg";

  const style = {
    width: width || undefined,
    height: height || (variant === "line" ? "1rem" : undefined),
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite linear, pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  };

  if (count === 1) {
    return (
      <div
        className={`${base} ${shapeClass} ${className}`}
        style={style}
        aria-busy="true"
        aria-label="Loading..."
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${base} ${shapeClass} ${className}`}
          style={{ ...style, width: i === count - 1 && variant === "line" ? "70%" : undefined }}
          aria-busy="true"
          aria-label="Loading..."
        />
      ))}
    </div>
  );
};

export default Skeleton;
