import React from "react";
import { NavLink } from "react-router";

/**
 * Shared navigation link used in both Navbar (horizontal) and Sidebar (vertical).
 * variant: "navbar" | "sidebar"
 *
 * React Router v7 NavLink: className/style can be functions ({isActive}) => string,
 * but children must be regular ReactNode.
 * Active underline for navbar variant is handled via [aria-current=page] in className.
 */
const NavItem = ({
  to,
  icon: Icon,
  label,
  badge,
  onClick,
  className = "",
  variant = "navbar",
}) => {
  if (variant === "sidebar") {
    return (
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          [
            "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium",
            "transition-all duration-150",
            isActive
              ? "bg-green-50 text-green-700 font-semibold"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            className,
          ]
            .filter(Boolean)
            .join(" ")
        }
      >
        {Icon && (
          <Icon
            className="w-5 h-5 shrink-0 text-[inherit] opacity-70"
          />
        )}
        <span className="flex-1">{label}</span>
        {badge && (
          <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
            {badge}
          </span>
        )}
      </NavLink>
    );
  }

  // Navbar variant — active underline via pseudo via border-b trick
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "relative flex items-center py-1 text-sm font-medium",
          "transition-colors duration-150",
          isActive
            ? "text-green-400 border-b-2 border-green-400"
            : "text-gray-300 hover:text-white border-b-2 border-transparent",
          className,
        ]
          .filter(Boolean)
          .join(" ")
      }
    >
      {label}
    </NavLink>
  );
};

export default NavItem;
