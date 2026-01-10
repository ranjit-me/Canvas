"use client";

import { useState, useEffect } from "react";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    ShoppingCart,
    Eye,
    Download,
    Calendar,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
    revenue: {
        total: number;
        change: number;
        trend: "up" | "down";
    };
    users: {
        total: number;
        new: number;
        change: number;
    };
    templates: {
        total: number;
        downloads: number;
        views: number;
    };
    orders: {
        total: number;
        pending: number;
        completed: number;
    };
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData>({
        revenue: { total: 0, change: 0, trend: "up" },
        users: { total: 0, new: 0, change: 0 },
        templates: { total: 0, downloads: 0, views: 0 },
        orders: { total: 0, pending: 0, completed: 0 },
    });
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<"today" | "week" | "month" | "year">("month");

    useEffect(() => {
        // Simulate fetching analytics data
        setTimeout(() => {
            setData({
                revenue: { total: 45250, change: 12.5, trend: "up" },
                users: { total: 1248, new: 142, change: 8.3 },
                templates: { total: 156, downloads: 3420, views: 12540 },
                orders: { total: 892, pending: 23, completed: 869 },
            });
            setLoading(false);
        }, 1000);
    }, [period]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Insights</h1>
                    <p className="text-gray-600">Track your platform's performance and growth</p>
                </div>
                <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                </Button>
            </div>

            {/* Period Selector */}
            <div className="mb-6 flex gap-2">
                <Button
                    variant={period === "today" ? "default" : "outline"}
                    onClick={() => setPeriod("today")}
                    size="sm"
                >
                    Today
                </Button>
                <Button
                    variant={period === "week" ? "default" : "outline"}
                    onClick={() => setPeriod("week")}
                    size="sm"
                >
                    This Week
                </Button>
                <Button
                    variant={period === "month" ? "default" : "outline"}
                    onClick={() => setPeriod("month")}
                    size="sm"
                >
                    This Month
                </Button>
                <Button
                    variant={period === "year" ? "default" : "outline"}
                    onClick={() => setPeriod("year")}
                    size="sm"
                >
                    This Year
                </Button>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Revenue */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                            <TrendingUp className="h-4 w-4" />
                            <span>{data.revenue.change}%</span>
                        </div>
                    </div>
                    <div className="text-sm opacity-90 mb-1">Total Revenue</div>
                    <div className="text-3xl font-bold">${data.revenue.total.toLocaleString()}</div>
                </div>

                {/* Users */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                            <Users className="h-6 w-6" />
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                            <TrendingUp className="h-4 w-4" />
                            <span>{data.users.change}%</span>
                        </div>
                    </div>
                    <div className="text-sm opacity-90 mb-1">Total Users</div>
                    <div className="text-3xl font-bold">{data.users.total.toLocaleString()}</div>
                    <div className="text-xs opacity-75 mt-2">+{data.users.new} new this month</div>
                </div>

                {/* Downloads */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                            <Download className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="text-sm opacity-90 mb-1">Total Downloads</div>
                    <div className="text-3xl font-bold">{data.templates.downloads.toLocaleString()}</div>
                    <div className="text-xs opacity-75 mt-2">{data.templates.total} templates</div>
                </div>

                {/* Orders */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="text-sm opacity-90 mb-1">Total Orders</div>
                    <div className="text-3xl font-bold">{data.orders.total.toLocaleString()}</div>
                    <div className="text-xs opacity-75 mt-2">{data.orders.pending} pending</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Overview</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Chart visualization coming soon...</p>
                    </div>
                </div>

                {/* User Growth Chart */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">User Growth</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Chart visualization coming soon...</p>
                    </div>
                </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Templates */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Top Templates</h3>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <div className="font-medium text-sm">Template {i}</div>
                                    <div className="text-xs text-gray-500">Category</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-sm">{1000 - i * 100}</div>
                                    <div className="text-xs text-gray-500">downloads</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Users className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium">New user registered</div>
                                    <div className="text-xs text-gray-500">{i} hours ago</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Traffic Sources */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Traffic Sources</h3>
                    <div className="space-y-3">
                        {[
                            { name: "Direct", value: 45 },
                            { name: "Search", value: 30 },
                            { name: "Social", value: 15 },
                            { name: "Referral", value: 10 },
                        ].map((source) => (
                            <div key={source.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{source.name}</span>
                                    <span className="font-medium">{source.value}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${source.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
