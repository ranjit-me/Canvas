"use client";

import { motion } from "framer-motion";
import {
    Plus,
    Zap,
    Code,
    Eye,
    Star,
    ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreatorDashboardHome() {
    const router = useRouter();

    const stats = [
        { label: "My Templates", value: "0", icon: Code, color: "blue" },
        { label: "Live Previews", value: "0", icon: Eye, color: "indigo" },
        { label: "Rating", value: "5.0", icon: Star, color: "yellow" },
    ];

    const quickActions = [
        {
            title: "Upload New Template",
            desc: "Paste your raw React/HTML code and let our engine handle the rest.",
            icon: Plus,
            href: "/creator/upload",
            color: "from-blue-600 to-indigo-600"
        },
        {
            title: "Manage Templates",
            desc: "Edit settings, pricing, and view analytics for your templates.",
            icon: Zap,
            href: "/creator/templates",
            color: "from-indigo-600 to-purple-600"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(31,38,135,0.04)] overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
                            Welcome to <span className="text-blue-600 tracking-tighter">Creator Studio</span>
                        </h1>
                        <p className="text-xl text-gray-500 font-medium max-w-xl leading-relaxed">
                            Upload your raw code and transform it into an interactive gift experience in seconds.
                        </p>
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-48 h-48 bg-gray-50 rounded-[2.5rem] flex items-center justify-center -rotate-3 border border-gray-100"
                    >
                        <Code className="w-20 h-20 text-blue-500 opacity-20" />
                    </motion.div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className={`w-12 h-12 bg-${stat.color}-50 rounded-xl flex items-center justify-center mb-6`}>
                                <Icon className={`w-6 h-6 text-${stat.color}-500`} />
                            </div>
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {quickActions.map((action, i) => {
                    const Icon = action.icon;
                    return (
                        <motion.button
                            key={action.title}
                            onClick={() => router.push(action.href)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="group text-left"
                        >
                            <div className="bg-white border border-gray-100 p-1 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500">
                                <div className="p-8 h-full">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
                                        {action.title}
                                        <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" />
                                    </h3>
                                    <p className="text-gray-500 font-medium leading-relaxed">
                                        {action.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
