"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Predefined credentials
        if (id === "admin" && password === "admin") {
            // Set a simple cookie/localStorage for admin access
            localStorage.setItem("admin_auth", "authorized");
            router.push("/admin/templates");
        } else {
            setError("Invalid credentials. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFD] flex items-center justify-center p-6 bg-texture">
            {/* Romantic Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-100/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-100/40 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(31,38,135,0.07)]">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-200">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Access</span>
                        </h1>
                        <p className="text-gray-500 font-medium tracking-tight">Enter your credentials to manage templates</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Admin ID</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-4 bg-white/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all font-medium"
                                    placeholder="Enter admin ID"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-4 bg-white/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-red-500 text-sm font-bold text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-purple-200 hover:shadow-2xl hover:shadow-purple-300 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {isLoading ? "Checking..." : (
                                <>
                                    Login to Dashboard
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="text-center">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-purple-600 transition-colors py-2"
                            >
                                <ArrowRight className="w-4 h-4 rotate-180" />
                                Back to Landing Page
                            </Link>
                        </div>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-center gap-2 text-gray-400">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Secured Admin Portal</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
