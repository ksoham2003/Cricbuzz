import React, { useState } from "react";
import MatchCard from "../../../components/cards/MatchCard";
import MatchCardSkeleton from "../../../components/loaders/MatchCardSkeleton";
import SectionHeader from "../../../components/common/SectionHeader";
import { FEATURED_MATCHES } from "../../../constants/mockData";

const FILTERS = ["All", "LIVE", "UPCOMING", "RESULT"];

const FeaturedMatchesSection = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading] = useState(false);

  const filtered =
    activeFilter === "All"
      ? FEATURED_MATCHES
      : FEATURED_MATCHES.filter((m) => m.status === activeFilter);

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Featured Matches"
          subtitle="Live scores and upcoming fixtures"
          viewAllPath="/matches"
          viewAllLabel="All Matches"
        />

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {FILTERS.map((filter) => {
            const liveCount =
              filter === "LIVE"
                ? FEATURED_MATCHES.filter((m) => m.status === "LIVE").length
                : null;

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={[
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold",
                  "border transition-all duration-150",
                  activeFilter === filter
                    ? "bg-green-600 text-white border-green-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600",
                ].join(" ")}
              >
                {filter === "LIVE" && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        activeFilter === "LIVE" ? "bg-white" : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                        activeFilter === "LIVE" ? "bg-white" : "bg-red-500"
                      }`}
                    />
                  </span>
                )}
                {filter}
                {liveCount && (
                  <span
                    className={`ml-0.5 text-xs font-bold ${
                      activeFilter === "LIVE" ? "text-white" : "text-red-500"
                    }`}
                  >
                    {liveCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Match cards grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <MatchCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4">🏏</span>
            <p className="text-gray-500 font-medium">
              No {activeFilter.toLowerCase()} matches right now
            </p>
            <button
              onClick={() => setActiveFilter("All")}
              className="mt-3 text-sm text-green-600 hover:underline font-medium"
            >
              View all matches
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedMatchesSection;
