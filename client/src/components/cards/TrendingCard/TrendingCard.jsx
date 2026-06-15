import React from "react";
import { Link } from "react-router";

const TrendingCard = ({ item, className = "" }) => {
  const { rank, title, category, views } = item;

  const isTop3 = rank <= 3;

  return (
    <Link
      to={`/search?q=${encodeURIComponent(title)}`}
      className={[
        "flex items-center gap-4 group py-3 px-4 rounded-xl",
        "hover:bg-green-50 transition-colors duration-150 cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Rank number */}
      <span
        className={[
          "text-xl font-black w-7 text-center shrink-0 leading-none",
          isTop3 ? "text-green-600" : "text-gray-300",
        ].join(" ")}
      >
        {rank}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium mb-0.5">{category}</p>
        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-green-700 transition-colors">
          {title}
        </p>
      </div>

      {/* Views */}
      <span className="text-xs text-gray-400 shrink-0 hidden sm:block">{views}</span>
    </Link>
  );
};

export default TrendingCard;
