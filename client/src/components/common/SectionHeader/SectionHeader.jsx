import React from "react";
import { Link } from "react-router";

const SectionHeader = ({
  title,
  subtitle,
  viewAllPath,
  viewAllLabel = "View All",
  accent = true,
  className = "",
}) => {
  return (
    <div className={`flex items-end justify-between mb-6 ${className}`}>
      <div>
        <div className="flex items-center gap-3">
          {accent && (
            <div className="w-1 h-6 rounded-full bg-green-600 shrink-0" />
          )}
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1 ml-4">{subtitle}</p>
        )}
      </div>

      {viewAllPath && (
        <Link
          to={viewAllPath}
          className="text-sm font-semibold text-green-600 hover:text-green-700 hover:underline transition-colors shrink-0"
        >
          {viewAllLabel} →
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
