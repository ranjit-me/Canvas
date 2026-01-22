"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    LayoutTemplate,
    Users,
    FileText,
    TrendingUp,
    DollarSign,
    PenTool,
    Settings,
    ArrowRight,
    Loader2,
} from "lucide-react";

interface DashboardStats {
    totalTemplates: number;
    totalUsers: number;
    pendingApplications: number;
    totalRevenue: number;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalTemplates: 0,
        totalUsers: 0,
        pendingApplications: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch creator applications
            const appsResponse = await fetch("/api/creator-applications");
            const appsData = await appsResponse.json();
            const pendingApps = appsData.applications?.filter((a: any) => a.status === "pending").length || 0;

            // Fetch users
            const usersResponse = await fetch("/api/users");
            const usersData = await usersResponse.json();
            const totalUsersCount = usersData.users?.length || 0;

            // Fetch templates (admin endpoint returns all merged)
            const templatesResponse = await fetch("/api/web-templates/admin");
            const templatesData = await templatesResponse.json();
            const totalTemplatesCount = templatesData.data?.length || 0;

            setStats({
                totalTemplates: totalTemplatesCount,
                totalUsers: totalUsersCount,
                pendingApplications: pendingApps,
                totalRevenue: 0, // TODO: Fetch from payments API if needed
            });
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const adminSections = [
        {
            title: "Templates Management",
            description: "Manage all templates, categories, and subcategories",
            icon: LayoutTemplate,
            href: "/admin/templates",
            color: "blue",
            stat: stats.totalTemplates,
            statLabel: "Total Templates",
        },
        {
            title: "Creator Applications",
            description: "Review and approve creator applications",
            icon: PenTool,
            href: "/admin/creator-applications",
            color: "purple",
            stat: stats.pendingApplications,
            statLabel: "Pending Applications",
            badge: stats.pendingApplications > 0 ? stats.pendingApplications : undefined,
        },
        {
            title: "User Management",
            description: "View and manage user accounts",
            icon: Users,
            href: "/admin/users",
            color: "green",
            stat: stats.totalUsers,
            statLabel: "Total Users",
        },
        {
            title: "Category Management",
            description: "Manage template categories and subcategories",
            icon: FileText,
            href: "/admin/templates", // Note: Category management is currently inside templates page
            color: "indigo",
            stat: "8",
            statLabel: "Active Categories",
        },
        {
            title: "Orders & Payments",
            description: "Track sales, orders and payment history",
            icon: DollarSign,
            href: "/admin/payments",
            color: "orange",
            stat: stats.totalRevenue,
            statLabel: "Total Revenue",
        },
        {
            title: "Analytics & Insights",
            description: "View detailed platform analytics and growth",
            icon: TrendingUp,
            href: "/admin/analytics",
            color: "yellow",
            stat: "+12%",
            statLabel: "Monthly Growth",
        },
        {
            title: "Site Settings",
            description: "Configure platform branding and information",
            icon: Settings,
            href: "/admin/settings",
            color: "pink",
            stat: "Live",
            statLabel: "System Status",
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-lg text-gray-600">Manage your platform from one central location</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Templates</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalTemplates}</p>
                            </div>
                            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <LayoutTemplate className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Pending Apps</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.pendingApplications}</p>
                            </div>
                            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center relative">
                                <PenTool className="h-6 w-6 text-purple-600" />
                                {stats.pendingApplications > 0 && (
                                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-xs text-white font-bold">{stats.pendingApplications}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Users</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                            </div>
                            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Revenue</p>
                                <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue}</p>
                            </div>
                            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin Sections */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Management Sections</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {adminSections.map((section) => {
                            const Icon = section.icon;
                            const colorClasses = {
                                blue: "bg-blue-50 border-blue-200 hover:border-blue-400",
                                purple: "bg-purple-50 border-purple-200 hover:border-purple-400",
                                green: "bg-green-50 border-green-200 hover:border-green-400",
                                yellow: "bg-yellow-50 border-yellow-200 hover:border-yellow-400",
                                pink: "bg-pink-50 border-pink-200 hover:border-pink-400",
                                indigo: "bg-indigo-50 border-indigo-200 hover:border-indigo-400",
                                orange: "bg-orange-50 border-orange-200 hover:border-orange-400",
                            };

                            const iconColorClasses = {
                                blue: "text-blue-600",
                                purple: "text-purple-600",
                                green: "text-green-600",
                                yellow: "text-yellow-600",
                                pink: "text-pink-600",
                                indigo: "text-indigo-600",
                                orange: "text-orange-600",
                            };

                            const iconBgClasses = {
                                blue: "bg-blue-100",
                                purple: "bg-purple-100",
                                green: "bg-green-100",
                                yellow: "bg-yellow-100",
                                pink: "bg-pink-100",
                                indigo: "bg-indigo-100",
                                orange: "bg-orange-100",
                            };

                            return (
                                <Link
                                    key={section.href + section.title}
                                    href={section.href}
                                    className={`relative block bg-white rounded-xl shadow-sm border-2 ${colorClasses[section.color as keyof typeof colorClasses]} transition-all duration-200 hover:shadow-md group`}
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-12 w-12 ${iconBgClasses[section.color as keyof typeof iconBgClasses]} rounded-lg flex items-center justify-center`}>
                                                    <Icon className={`h-6 w-6 ${iconColorClasses[section.color as keyof typeof iconColorClasses]}`} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                                                    {section.badge && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                            {section.badge} new
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                        <p className="text-gray-600 mb-4 text-sm">{section.description}</p>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-2xl font-bold text-gray-900">{section.stat}</p>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">{section.statLabel}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/admin/templates"
                            className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                        >
                            <FileText className="h-5 w-5 text-blue-600" />
                            <span className="font-medium">Add New Template</span>
                        </Link>
                        <Link
                            href="/admin/creator-applications"
                            className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all"
                        >
                            <PenTool className="h-5 w-5 text-purple-600" />
                            <span className="font-medium">Review Applications</span>
                        </Link>
                        <Link
                            href="/admin/settings"
                            className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all"
                        >
                            <Settings className="h-5 w-5 text-gray-600" />
                            <span className="font-medium">Platform Settings</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
