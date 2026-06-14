import React from "react";
import { Link } from "react-router";
import Button from "../../../components/common/Button";

const StatBubble = ({ value, label }) => (
  <div className="text-center">
    <p className="text-2xl sm:text-3xl font-black text-white">{value}</p>
    <p className="text-xs text-green-200 mt-0.5 font-medium">{label}</p>
  </div>
);

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-slate-900 min-h-[520px] flex items-center">
      {/* Background cricket field pattern */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Large decorative circles — like a cricket field aerial view */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-white/5" />
        {/* Green gradient glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-green-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-green-500/10 blur-3xl" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
            </span>
            <span className="text-xs font-bold text-red-300 uppercase tracking-wider">
              3 Matches Live Now
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            Live Cricket.{" "}
            <span className="text-green-400 relative">
              Every Ball.
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-400/50 rounded-full" />
            </span>
          </h1>

          {/* Sub-heading */}
          <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
            Follow live scores, breaking news, in-depth stats, and match
            analysis — all in one place. Never miss a ball.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3">
            <Link to="/live">
              <Button variant="primary" size="lg" className="gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                View Live Scores
              </Button>
            </Link>
            <Link to="/series">
              <Button variant="secondary" size="lg">
                Explore Series
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10">
            <StatBubble value="50+" label="Live Series" />
            <div className="w-px h-8 bg-white/10" />
            <StatBubble value="2.4M+" label="Daily Fans" />
            <div className="w-px h-8 bg-white/10" />
            <StatBubble value="100+" label="Teams Tracked" />
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <StatBubble
              value="500K+"
              label="Player Stats"
              className="hidden sm:block"
            />
          </div>
        </div>
      </div>

      {/* Right side decorative element (hidden on mobile) */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden xl:flex items-center justify-center pointer-events-none">
        <div className="relative">
          <div className="text-[160px] opacity-10 select-none">🏏</div>
          <div className="absolute inset-0 rounded-full bg-green-500/5 blur-2xl scale-150" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
