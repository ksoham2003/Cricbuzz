import React, { useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { HiX } from "react-icons/hi";
import { FiUser, FiChevronDown, FiChevronRight } from "react-icons/fi";
import NavItem from "../../navigation/NavItem";
import { SIDEBAR_LINKS } from "../../../constants/navigation";

const SidebarGroup = ({ link, onClose }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = link.subLinks && link.subLinks.length > 0;
  const Icon = link.icon;

  if (!hasChildren) {
    return (
      <div className="relative">
        <NavItem
          to={link.to || link.path}
          icon={link.icon}
          label={link.label}
          badge={link.badge}
          variant="sidebar"
          onClick={onClose}
        />
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150"
      >
        {Icon && <Icon className="w-5 h-5 shrink-0 text-gray-400" />}
        <span className="flex-1 text-left">{link.label}</span>
        {expanded ? (
          <FiChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <FiChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="ml-9 mt-1 space-y-0.5 border-l border-gray-100 pl-3">
          {link.subLinks.map((sub) => (
            <NavItem
              key={sub.path}
              to={sub.path}
              label={sub.label}
              variant="sidebar"
              onClick={onClose}
              className="py-2 text-xs"
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <>
      {/* Backdrop */}
      <div
        className={[
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        className={[
          "fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl",
          "flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-label="Navigation sidebar"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-slate-900">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-2 select-none"
          >
            <span className="text-xl">🏏</span>
            <span className="text-lg font-black text-white tracking-tight">
              Cric<span className="text-green-400">Buzz</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Close menu"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* User section (if authenticated) */}
        {isAuthenticated && user && (
          <div className="px-5 py-3 border-b border-gray-100 bg-green-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm uppercase shrink-0">
                {user.name?.charAt(0) || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Live scores quick access */}
        <div className="px-5 py-3 border-b border-gray-100">
          <Link
            to="/live"
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            Live Scores
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {SIDEBAR_LINKS.map((link) => (
            <SidebarGroup key={link.path} link={link} onClose={onClose} />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-4 space-y-2">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              onClick={onClose}
              className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
            >
              <FiUser className="w-4 h-4" />
              My Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-green-700 border border-green-200 hover:bg-green-50 transition-colors"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
