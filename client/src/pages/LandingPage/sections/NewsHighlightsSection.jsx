import React, { useState } from "react";
import NewsCard from "../../../components/cards/NewsCard";
import NewsCardSkeleton from "../../../components/loaders/NewsCardSkeleton";
import SectionHeader from "../../../components/common/SectionHeader";
import { NEWS_HIGHLIGHTS } from "../../../constants/mockData";

const CATEGORIES = [
  "All",
  "Match Report",
  "Rankings",
  "Transfer News",
  "Analysis",
  "Interview",
];

const NewsHighlightsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading] = useState(false);

  const filtered =
    activeCategory === "All"
      ? NEWS_HIGHLIGHTS
      : NEWS_HIGHLIGHTS.filter((n) => n.category === activeCategory);

  // Featured article is first, rest go in grid
  const [featured, ...rest] = filtered;

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="News &amp; Highlights"
          subtitle="Latest from the cricket world"
          viewAllPath="/news"
          viewAllLabel="All News"
        />

        {/* Category filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={[
                "px-4 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap",
                "transition-all duration-150 shrink-0",
                activeCategory === cat
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900",
              ].join(" ")}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Featured article — spans 2 cols on large screens */}
            {featured && (
              <div className="lg:col-span-2">
                <div className="h-full">
                  <NewsCard article={featured} />
                </div>
              </div>
            )}

            {/* Rest of articles */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
              {rest.slice(0, 5).map((article) => (
                <NewsCard key={article.id} article={article} compact />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4">📰</span>
            <p className="text-gray-500 font-medium">
              No articles in this category right now
            </p>
            <button
              onClick={() => setActiveCategory("All")}
              className="mt-3 text-sm text-green-600 hover:underline font-medium"
            >
              View all news
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsHighlightsSection;
