import React from "react";
import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-600">
                        🏏 CricBuzz Clone
                    </h1>

                    <h2 className="text-2xl font-semibold mt-4">
                        Welcome Back!
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Sign in to continue following live scores and match updates.
                    </p>
                </div>

                {/* Google Login */}
                <button
                    className="w-full border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
                >
                    <FcGoogle size={24} />
                    <span className="font-medium">
                        Continue with Google
                    </span>
                </button>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="px-3 text-sm text-gray-500">
                        OR
                    </span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Form */}
                <form className="space-y-4">

                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="text-sm text-green-600 hover:text-green-700"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                    >
                        Login
                    </button>

                </form>

                {/* Footer */}
                <p className="text-center text-gray-500 mt-6">
                    Don't have an account?{" "}
                    <span className="text-green-600 font-medium cursor-pointer">
                        Register
                    </span>
                </p>

            </div>

        </div>
    );
};

export default LoginPage;