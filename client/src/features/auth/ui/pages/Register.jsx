import React from "react";
import { FcGoogle } from "react-icons/fc";
import AuthHook from "../../hooks/AuthHook";

const Register = () => {
    let { register, reset, handleSubmit, errors, registerSubmit, password } = AuthHook()
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">

                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-600">
                        🏏 CricBuzz Clone
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Join the cricket community and stay updated with every match.
                    </p>
                </div>

                {/* Google Button */}
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
                    <span className="px-3 text-sm text-gray-500">OR</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(registerSubmit)}
                    className="space-y-4">

                    <input
                        {...register("name", {
                            required: "Please enter name",
                        })}
                        type="text"
                        placeholder="Full Name"
                        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}


                    <input
                        {...register("email", {
                            required: "Please enter email",
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: "Please enter a valid email"
                            }
                        })}
                        type="email"
                        placeholder="Email Address"
                        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

                    <input
                        {...register("password", {
                            required: "Please enter password",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters"
                            },
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                message:
                                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
                            }
                        })}
                        type="password"
                        placeholder="Password"
                        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                    />

                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )}
                    <input
                        {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) =>
                                value === password || "Password doesn't match"
                        })}
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                    />

                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.confirmPassword.message}
                        </p>
                    )}

                    <button
                        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                    >
                        Create Account
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-gray-500 mt-6">
                    Already have an account?{" "}
                    <span className="text-green-600 font-medium cursor-pointer">
                        Login
                    </span>
                </p>

            </div>
        </div>
    );
};

export default Register;