"use client";

import { useState, useEffect } from "react";
import {
    DollarSign,
    TrendingUp,
    ShoppingCart,
    Clock,
    XCircle,
    ChevronDown,
    Download,
    Search,
    Filter,
    Calendar,
    Sparkles,
    CreditCard,
    User,
    Package,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from "lucide-react";

interface Payment {
    id: string;
    name: string;
    templateId: string;
    paymentStatus: string;
    pricePaid: number;
    country: string;
    razorpayOrderId: string | null;
    razorpayPaymentId: string | null;
    purchasedAt: Date | null;
    createdAt: Date;
    userId: string;
    userName: string | null;
    userEmail: string;
}

interface Stats {
    totalRevenue: number;
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    failedOrders: number;
}

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalRevenue: 0,
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        failedOrders: 0,
    });
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchPayments();
    }, [statusFilter]);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const url = new URL("/api/admin/payments", window.location.origin);
            if (statusFilter !== "all") {
                url.searchParams.set("status", statusFilter);
            }

            const response = await fetch(url.toString());
            const data = await response.json();

            if (data.success) {
                setPayments(data.payments);
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Error fetching payments:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.razorpayPaymentId?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const formatCurrency = (amount: number | null) => {
        if (!amount) return "₹0";
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
        }).format(amount / 100);
    };

    const formatDate = (date: Date | string | null) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-700 border-green-300";
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-300";
            case "failed":
                return "bg-red-100 text-red-700 border-red-300";
            default:
                return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle2 className="w-4 h-4" />;
            case "pending":
                return <Clock className="w-4 h-4" />;
            case "failed":
                return <XCircle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="relative">
                    <div
                        className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-500 animate-spin"
                        style={{ clipPath: "polygon(0 0, 100% 0, 100% 75%, 0 100%)" }}
                    ></div>
                    <div className="absolute inset-2 bg-gray-50 rounded-full"></div>
                </div>
                <p className="mt-6 text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                    Loading Payments...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/20 via-pink-300/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div
                    className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-blue-400/15 via-purple-300/10 to-transparent rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-12 space-y-8">
                {/* Premium Header */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-white/40 shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur-md opacity-50"></div>
                                <div className="relative bg-gradient-to-tr from-purple-600 via-pink-600 to-blue-600 p-4 rounded-2xl">
                                    <CreditCard className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
                                    Payments & Orders
                                </h1>
                                <p className="text-lg text-gray-600 font-medium">Track transactions and revenue</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Revenue */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition"></div>
                        <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-100 shadow-lg hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Total Revenue</p>
                            <p className="text-3xl font-black text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                        </div>
                    </div>

                    {/* Total Orders */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition"></div>
                        <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                                    <ShoppingCart className="w-6 h-6 text-white" />
                                </div>
                                <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Total Orders</p>
                            <p className="text-3xl font-black text-gray-900">{stats.totalOrders}</p>
                        </div>
                    </div>

                    {/* Completed */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition"></div>
                        <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Completed</p>
                            <p className="text-3xl font-black text-gray-900">{stats.completedOrders}</p>
                        </div>
                    </div>

                    {/* Pending */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition"></div>
                        <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-100 shadow-lg hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Pending</p>
                            <p className="text-3xl font-black text-gray-900">{stats.pendingOrders}</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition"></div>
                    <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-purple-100/50 shadow-lg">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by order, email, or payment ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-sm border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-800"
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="pl-12 pr-10 py-3 bg-white/60 backdrop-blur-sm border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-800 font-medium appearance-none cursor-pointer min-w-[180px]"
                                >
                                    <option value="all">All Payments</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payments Table */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition"></div>
                    <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-purple-100/50 shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Order Details
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Payment ID
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredPayments.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Package className="w-12 h-12 text-gray-300 mb-3" />
                                                    <p className="text-gray-500 font-medium">No payments found</p>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        Try adjusting your filters
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredPayments.map((payment) => (
                                            <tr
                                                key={payment.id}
                                                className="hover:bg-purple-50/50 transition-colors group/row"
                                            >
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{payment.name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Template: {payment.templateId}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                                                            <User className="w-4 h-4 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {payment.userName || "N/A"}
                                                            </p>
                                                            <p className="text-sm text-gray-500">{payment.userEmail}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                                                            <DollarSign className="w-4 h-4 text-green-600" />
                                                        </div>
                                                        <span className="font-bold text-gray-900">
                                                            {formatCurrency(payment.pricePaid)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(payment.paymentStatus)}`}
                                                    >
                                                        {getStatusIcon(payment.paymentStatus)}
                                                        {payment.paymentStatus.charAt(0).toUpperCase() +
                                                            payment.paymentStatus.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">
                                                            {formatDate(payment.purchasedAt)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-700">
                                                        {payment.razorpayPaymentId || "N/A"}
                                                    </code>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary Footer */}
                        {filteredPayments.length > 0 && (
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-t border-purple-200">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-gray-600">
                                        Showing {filteredPayments.length} of {payments.length} payments
                                    </p>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold">
                                        <Download className="w-4 h-4" />
                                        Export
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
