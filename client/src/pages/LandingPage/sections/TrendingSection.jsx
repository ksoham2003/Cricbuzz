import React from "react";
import { Link } from "react-router";
import TrendingCard from "../../../components/cards/TrendingCard";
import SectionHeader from "../../../components/common/SectionHeader";
import { TRENDING_TOPICS, UPCOMING_SERIES } from "../../../constants/mockData";
import Badge from "../../../components/common/Badge";

const FORMAT_VARIANT = {
  ODI: "odi",
  T20: "t20",
  T20I: "t20",
  TEST: "test",
};

const SeriesRow = ({ series }) => (
  <Link
    to={`/series/${series.id}`}
    className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-gray-50 transition-colors group"
  >
    <div className="flex items-center gap-3 min-w-0">
      <span className="text-lg">🏆</span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-green-700 transition-colors">
          {series.name}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {series.startDate} – {series.endDate} · {series.teams} teams
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2 shrink-0 ml-3">
      <Badge variant={FORMAT_VARIANT[series.format] || "default"}>
        {series.format}
      </Badge>
      {series.status === "ONGOING" && (
        <Badge variant="live" pulse>
          LIVE
        </Badge>
      )}
    </div>
  </Link>
);

const TrendingSection = () => {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trending Topics — takes up 2 columns */}
          <div className="lg:col-span-2">
            <SectionHeader
              title="Trending Now"
              subtitle="What the cricket world is talking about"
              viewAllPath="/search"
              viewAllLabel="Explore"
            />

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <span className="text-base">🔥</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Top Searches
                  </span>
                </div>
                <span className="text-xs text-gray-400">Updated just now</span>
              </div>

              {/* Two-column grid for trending items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-gray-50">
                <div className="divide-y divide-gray-50">
                  {TRENDING_TOPICS.slice(0, 4).map((item) => (
                    <TrendingCard key={item.id} item={item} />
                  ))}
                </div>
                <div className="divide-y divide-gray-50">
                  {TRENDING_TOPICS.slice(4, 8).map((item) => (
                    <TrendingCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming / Ongoing Series — 1 column */}
          <div>
            <SectionHeader
              title="Ongoing Series"
              viewAllPath="/series"
              viewAllLabel="All Series"
            />

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <span className="text-base">🏆</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Series Schedule
                </span>
              </div>

              <div className="px-2 py-2 divide-y divide-gray-50">
                {UPCOMING_SERIES.map((series) => (
                  <SeriesRow key={series.id} series={series} />
                ))}
              </div>

              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
                <Link
                  to="/series"
                  className="text-xs font-semibold text-green-600 hover:text-green-700 hover:underline transition-colors"
                >
                  View all series →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
