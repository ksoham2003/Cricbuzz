import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { IoSearchOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import NavItem from "../../navigation/NavItem";
import { NAV_LINKS } from "../../../constants/navigation";
import useScrolled from "../../../hooks/useScrolled";

const Navbar = ({ onMenuClick }) => {
  const scrolled = useScrolled(20);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={[
        "sticky top-0 z-40 w-full transition-shadow duration-300",
        scrolled ? "shadow-lg" : "shadow-sm",
      ].join(" ")}
    >
      {/* Top strip — cricket score ticker feel */}
      <div className="bg-green-600 h-0.5 w-full" />

      {/* Main navbar */}
      <nav className="bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">

            {/* ── Left: Hamburger (mobile) + Logo ── */}
            <div className="flex items-center gap-3">
              {/* Hamburger — only visible on mobile */}
              <button
                type="button"
                onClick={onMenuClick}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="Open menu"
              >
                <HiMenuAlt3 className="w-5 h-5" />
              </button>

              {/* Logo */}
              <Link
                to="/"
                className="flex items-center gap-2 group select-none shrink-0"
              >
                <span className="text-xl">🏏</span>
                <span className="text-lg font-black text-white group-hover:text-green-400 transition-colors tracking-tight">
                  Cric<span className="text-green-400">Buzz</span>
                </span>
              </Link>
            </div>

            {/* ── Center: Desktop Nav Links ── */}
            <nav className="hidden lg:flex items-center gap-0.5 relative">
              {NAV_LINKS.map((link) => (
                <NavItem
                  key={link.path}
                  to={link.path}
                  label={link.label}
                  variant="navbar"
                  className="px-3 py-2"
                />
              ))}
            </nav>

            {/* ── Right: Search + Auth ── */}
            <div className="flex items-center gap-2">
              {/* Search */}
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cricket..."
                    className="w-40 sm:w-56 bg-slate-800 text-white text-sm placeholder-gray-400 rounded-lg px-3 py-1.5 outline-none border border-slate-600 focus:border-green-500 transition-colors"
                    onBlur={() => {
                      if (!searchQuery) setSearchOpen(false);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="ml-1 p-1.5 text-gray-400 hover:text-white"
                    aria-label="Close search"
                  >
                    <HiX className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700 transition-colors"
                  aria-label="Search"
                >
                  <IoSearchOutline className="w-5 h-5" />
                </button>
              )}

              {/* Live scores quick link */}
              <Link
                to="/live"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white text-xs font-bold"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                </span>
                LIVE
              </Link>

              {/* Auth */}
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-green-600 hover:bg-green-700 transition-colors text-white font-bold text-sm uppercase"
                  title={user?.name || "Profile"}
                  aria-label="Go to dashboard"
                >
                  {user?.name ? user.name.charAt(0) : <FiUser className="w-4 h-4" />}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 transition-colors text-white text-sm font-semibold"
                >
                  <FiUser className="w-3.5 h-3.5" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile secondary nav — hidden on desktop */}
        <div className="lg:hidden border-t border-slate-800 bg-slate-900">
          <div className="flex items-center overflow-x-auto gap-1 px-4 py-2 scrollbar-none">
            {NAV_LINKS.slice(0, 5).map((link) => (
              <NavItem
                key={link.path}
                to={link.path}
                label={link.label}
                variant="navbar"
                className="px-3 py-1.5 text-xs whitespace-nowrap shrink-0"
              />
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
