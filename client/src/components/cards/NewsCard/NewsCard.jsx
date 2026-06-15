import React, { useState } from "react";
import { Link } from "react-router";
import Tag from "../../common/Tag";

const CATEGORY_VARIANT = {
  "Match Report": "green",
  "Transfer News": "blue",
  Rankings: "purple",
  Schedule: "amber",
  Interview: "red",
  Analysis: "default",
};

const NewsCard = ({ article, className = "", compact = false }) => {
  const { id, category, title, summary, image, time, readTime, tag } = article;
  const [imgError, setImgError] = useState(false);

  if (compact) {
    return (
      <Link
        to={`/news/${id}`}
        className={[
          "flex gap-3 group hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Thumbnail */}
        <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
          {!imgError ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">
              🏏
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-green-600 font-semibold mb-1">
            {category}
          </p>
          <p className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-green-700 transition-colors">
            {title}
          </p>
          <p className="text-xs text-gray-400 mt-1">{time}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/news/${id}`}
      className={[
        "block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group",
        "hover:border-green-300 hover:shadow-md transition-all duration-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Image */}
      <div className="w-full h-44 bg-gray-100 overflow-hidden relative">
        {!imgError ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl text-gray-200">
            🏏
          </div>
        )}
        {/* Category overlay */}
        <div className="absolute top-3 left-3">
          <Tag variant={CATEGORY_VARIANT[category] || "default"}>
            {category}
          </Tag>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Tag */}
        {tag && (
          <span className="inline-block text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded mb-2">
            {tag}
          </span>
        )}

        {/* Title */}
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-green-700 transition-colors leading-snug mb-2">
          {title}
        </h3>

        {/* Summary */}
        {summary && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{summary}</p>
        )}

        {/* Footer */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{time}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{readTime}</span>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
