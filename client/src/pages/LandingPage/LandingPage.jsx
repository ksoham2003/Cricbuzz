import React, { lazy, Suspense } from "react";
import HeroSection from "./sections/HeroSection";
import FeaturedMatchesSection from "./sections/FeaturedMatchesSection";

// Lazy-load below-fold sections
const NewsHighlightsSection = lazy(
  () => import("./sections/NewsHighlightsSection"),
);
const TrendingSection = lazy(() => import("./sections/TrendingSection"));

const SectionFallback = () => (
  <div className="py-16 flex justify-center">
    <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const LandingPage = () => {
  return (
    <main className="bg-white min-h-screen">
      <HeroSection />
      <FeaturedMatchesSection />
      <Suspense fallback={<SectionFallback />}>
        <NewsHighlightsSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TrendingSection />
      </Suspense>

      {/* Footer strip */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 select-none">
              <span className="text-xl">🏏</span>
              <span className="text-base font-black text-white tracking-tight">
                Cric<span className="text-green-400">Buzz</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 text-center sm:text-right">
              © {new Date().getFullYear()} CricBuzz Clone · Built with ❤️ for
              cricket fans
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
