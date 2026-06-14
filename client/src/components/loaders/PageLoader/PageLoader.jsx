import React from "react";

const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {/* Cricket ball bounce animation */}
      <div className="relative mb-8">
        <div className="w-16 h-16 relative">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-green-100"></div>
          {/* Spinning arc */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-600 animate-spin"></div>
          {/* Cricket emoji center */}
          <div className="absolute inset-0 flex items-center justify-center text-2xl select-none">
            🏏
          </div>
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-green-400/10 blur-xl scale-150"></div>
      </div>

      {/* Brand */}
      <div className="text-center">
        <p className="text-green-600 font-bold text-xl tracking-wide mb-1">
          CricBuzz
        </p>
        <p className="text-gray-400 text-sm font-medium">{message}</p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-1.5 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default PageLoader;
