import React from "react";
import AuthHook from "../../../auth/hooks/AuthHook";

const DashboardPage = () => {
    const { user, logout, isLoading } = AuthHook();

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-4 py-8">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl p-8 relative overflow-hidden">
                {/* Decorative background accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>

                {/* Header */}
                <div className="border-b border-gray-150 pb-6 mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-950 flex items-center gap-3">
                        🏏 CricBuzz Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Welcome to your scorers control panel. Track live matches and administer data.
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
                    {/* User Avatar Placeholder */}
                    <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-2xl uppercase shadow-md">
                        {user?.name ? user.name.charAt(0) : "U"}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-1">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {user?.name || "Scorer Name"}
                        </h2>
                        <p className="text-gray-650 font-medium">
                            {user?.email || "email@cricbuzz.com"}
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 font-semibold rounded-full text-xs uppercase tracking-wider mt-2 border border-green-200">
                            🛡️ {user?.role || "SCORER"}
                        </div>
                    </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="border border-slate-200 rounded-xl p-5 hover:border-green-500 transition duration-300">
                        <h3 className="font-bold text-gray-800 mb-1">🎮 Match Administration</h3>
                        <p className="text-sm text-gray-500">
                            Access live scorer utilities, configure series, teams, and scorecards.
                        </p>
                    </div>
                    <div className="border border-slate-200 rounded-xl p-5 hover:border-green-500 transition duration-300">
                        <h3 className="font-bold text-gray-800 mb-1">📊 Realtime Statistics</h3>
                        <p className="text-sm text-gray-500">
                            Stream matches, track runs, player strike rates, and live commentaries.
                        </p>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="flex justify-end border-t border-gray-150 pt-6">
                    <button
                        onClick={logout}
                        disabled={isLoading}
                        className="px-6 py-3 bg-red-50 text-red-650 border border-red-200 font-bold rounded-xl hover:bg-red-100 hover:text-red-750 transition duration-200 flex items-center gap-2"
                    >
                        {isLoading ? "Signing Out..." : "Sign Out"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
