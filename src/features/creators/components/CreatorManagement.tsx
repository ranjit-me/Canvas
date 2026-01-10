"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, TrendingUp, DollarSign, MapPin, Eye } from "lucide-react";
import { useGetCreatorAnalytics } from "../api/use-get-creator-analytics";
import { cn } from "@/lib/utils";
import { CreatorDetailsModal } from "./CreatorDetailsModal";

export function CreatorManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("all");
    const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<"earnings" | "templates" | "sales">("earnings");
    const { data, isLoading } = useGetCreatorAnalytics();

    const creators = data?.creators || [];

    // Filter creators
    const filteredCreators = creators
        .filter((creator: any) => {
            const matchesSearch =
                creator.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                creator.email?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCountry = selectedCountry === "all" || creator.country === selectedCountry;
            return matchesSearch && matchesCountry;
        })
        .sort((a: any, b: any) => {
            switch (sortBy) {
                case "earnings":
                    return b.stats.totalEarnings - a.stats.totalEarnings;
                case "templates":
                    return b.stats.totalTemplates - a.stats.totalTemplates;
                case "sales":
                    return b.stats.totalSales - a.stats.totalSales;
                default:
                    return 0;
            }
        });

    // Get unique countries
    const countries = ["all", ...Array.from(new Set(creators.map((c: any) => c.country).filter(Boolean)))];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Creator Management</h2>
                    <p className="text-gray-500">Manage and track all approved creators</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-bold text-blue-900">{creators.length} Creators</span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                    />
                </div>

                <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 bg-white"
                >
                    {countries.map((country) => (
                        <option key={country} value={country}>
                            {country === "all" ? "All Countries" : country}
                        </option>
                    ))}
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 bg-white"
                >
                    <option value="earnings">Sort by Earnings</option>
                    <option value="templates">Sort by Templates</option>
                    <option value="sales">Sort by Sales</option>
                </select>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-blue-600 uppercase">Total Templates</span>
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-blue-900">
                        {creators.reduce((sum: number, c: any) => sum + c.stats.totalTemplates, 0)}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-green-600 uppercase">Total Sales</span>
                        <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-green-900">
                        {creators.reduce((sum: number, c: any) => sum + c.stats.totalSales, 0)}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-purple-600 uppercase">Total Earnings</span>
                        <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-3xl font-bold text-purple-900">
                        ₹{creators.reduce((sum: number, c: any) => sum + c.stats.totalEarnings, 0).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Creator Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCreators.map((creator: any, index: number) => (
                    <motion.div
                        key={creator.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl border-2 border-gray-100 p-6 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer group"
                    >
                        {/* Creator Header */}
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-md">
                                {creator.profilePhotoUrl ? (
                                    <img
                                        src={creator.profilePhotoUrl}
                                        alt={creator.name}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    creator.name?.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                    {creator.name}
                                </h3>
                                <p className="text-sm text-gray-500 truncate">{creator.email}</p>
                                {creator.specialization && (
                                    <span className="text-xs text-blue-600 font-medium">{creator.specialization}</span>
                                )}
                            </div>
                        </div>

                        {/* Location */}
                        {creator.country && (
                            <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>
                                    {creator.state && `${creator.state}, `}
                                    {creator.country}
                                </span>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="bg-blue-50 p-3 rounded-lg text-center">
                                <div className="text-xs font-semibold text-blue-600 uppercase mb-1">Templates</div>
                                <div className="text-lg font-bold text-blue-900">{creator.stats.totalTemplates}</div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg text-center">
                                <div className="text-xs font-semibold text-green-600 uppercase mb-1">Sales</div>
                                <div className="text-lg font-bold text-green-900">{creator.stats.totalSales}</div>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg text-center">
                                <div className="text-xs font-semibold text-purple-600 uppercase mb-1">Earnings</div>
                                <div className="text-sm font-bold text-purple-900">
                                    ₹{creator.stats.totalEarnings.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {/* View Details Button */}
                        <button
                            onClick={() => setSelectedCreatorId(creator.id)}
                            className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                            <Eye className="w-4 h-4" />
                            View Details
                        </button>
                    </motion.div>
                ))}
            </div>

            {filteredCreators.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No creators found matching your filters</p>
                </div>
            )}

            {/* Detailed Analytics Modal */}
            <CreatorDetailsModal
                creatorId={selectedCreatorId}
                isOpen={!!selectedCreatorId}
                onClose={() => setSelectedCreatorId(null)}
            />
        </div>
    );
}
