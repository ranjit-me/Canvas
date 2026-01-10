"use client";

import { motion } from "framer-motion";
import {
    Plus,
    Zap,
    Code,
    Eye,
    Star,
    ArrowRight,
    Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CreatorStatsCard } from "@/features/creators/components/CreatorStatsCard";
import { CreatorTemplateCard } from "@/features/creators/components/CreatorTemplateCard";

interface CreatorStats {
    totalTemplates: number;
    totalSales: number;
    totalEarnings: number;
    averageRating: number;
    totalReviews: number;
    earningsByCountry: Record<string, number>;
    earningsByState: Record<string, number>;
    templates: any[];
}

export default function CreatorDashboardHome() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [stats, setStats] = useState<CreatorStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            if (status !== "authenticated" || !session?.user?.id) return;

            try {
                const response = await fetch(`/api/creator-analytics/${session.user.id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch analytics");
                }
                const data = await response.json();
                setStats(data.stats);
            } catch (err) {
                console.error("Error loading stats:", err);
                setError("Failed to load your dashboard data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (status === "authenticated") {
            fetchStats();
        } else if (status === "unauthenticated") {
            router.push("/creator/login");
        }
    }, [status, session, router]);

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

    if (status === "loading" || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <p className="text-red-500 font-medium">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
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
                            Welcome back, <span className="text-blue-600 tracking-tighter">{session?.user?.name || "Creator"}</span>
                        </h1>
                        <p className="text-xl text-gray-500 font-medium max-w-xl leading-relaxed">
                            Here's what's happening with your templates today.
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
                <CreatorStatsCard
                    label="My Templates"
                    value={stats?.totalTemplates || 0}
                    icon={Code}
                    color="blue"
                    delay={0}
                />
                <CreatorStatsCard
                    label="Total Earnings"
                    value={`₹${stats?.totalEarnings?.toLocaleString() || "0"}`}
                    icon={Eye} // Should probably be DollarSign but aligning with existing mockup pref, let's swap for DollarSign actually
                    color="indigo"
                    delay={0.1}
                />
                <CreatorStatsCard
                    label="Average Rating"
                    value={stats?.averageRating?.toFixed(1) || "0.0"}
                    icon={Star}
                    color="yellow"
                    delay={0.2}
                />
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

            {/* My Templates Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-gray-900">Recent Templates</h2>
                    <button
                        onClick={() => router.push('/creator/templates')}
                        className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                        View All
                    </button>
                </div>

                {stats?.templates && stats.templates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.templates.map((template, i) => (
                            <CreatorTemplateCard key={template.id} template={template} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-[2rem] p-12 text-center border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Code className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No templates yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-6">
                            Upload your first template to start earning money from your creative work.
                        </p>
                        <button
                            onClick={() => router.push('/creator/upload')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Create Template
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
