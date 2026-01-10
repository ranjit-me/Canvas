"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Eye, Loader2, Clock, CheckCircle, XCircle } from "lucide-react";

interface Application {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    mobile: string;
    country: string;
    state: string;
    qualification: string;
    portfolioUrl?: string;
    bio?: string;
    specialization?: string;
    resumeUrl?: string;
    profilePhotoUrl?: string;
    status: "pending" | "approved" | "rejected";
    adminNotes?: string;
    submittedAt: Date;
    reviewedAt?: Date;
}

export default function CreatorApplicationsAdminPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await fetch("/api/creator-applications");
            const data = await response.json();
            setApplications(data.applications || []);
        } catch (error) {
            console.error("Failed to fetch applications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appId: string, status: "approved" | "rejected") => {
        try {
            const response = await fetch(`/api/creator-applications/${appId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                fetchApplications();
                setSelectedApp(null);
                alert(`Application ${status} successfully!`);
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update application status");
        }
    };

    const filteredApps = applications.filter(app => {
        if (filter === "all") return true;
        return app.status === filter;
    });

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === "pending").length,
        approved: applications.filter(a => a.status === "approved").length,
        rejected: applications.filter(a => a.status === "rejected").length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Creator Applications</h1>
                <p className="text-gray-600">Review and manage creator applications</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600 mb-1">Total Applications</div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                </div>
                <div className="bg-yellow-50 rounded-lg shadow p-4">
                    <div className="text-sm text-yellow-800 mb-1">Pending Review</div>
                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                </div>
                <div className="bg-green-50 rounded-lg shadow p-4">
                    <div className="text-sm text-green-800 mb-1">Approved</div>
                    <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                </div>
                <div className="bg-red-50 rounded-lg shadow p-4">
                    <div className="text-sm text-red-800 mb-1">Rejected</div>
                    <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4">
                <Button
                    variant={filter === "all" ? "default" : "outline"}
                    onClick={() => setFilter("all")}
                >
                    All ({stats.total})
                </Button>
                <Button
                    variant={filter === "pending" ? "default" : "outline"}
                    onClick={() => setFilter("pending")}
                >
                    Pending ({stats.pending})
                </Button>
                <Button
                    variant={filter === "approved" ? "default" : "outline"}
                    onClick={() => setFilter("approved")}
                >
                    Approved ({stats.approved})
                </Button>
                <Button
                    variant={filter === "rejected" ? "default" : "outline"}
                    onClick={() => setFilter("rejected")}
                >
                    Rejected ({stats.rejected})
                </Button>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Applicant
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Submitted
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredApps.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No applications found
                                    </td>
                                </tr>
                            ) : (
                                filteredApps.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {app.fullName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {app.qualification}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{app.email}</div>
                                            <div className="text-sm text-gray-500">{app.mobile}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{app.country}</div>
                                            <div className="text-sm text-gray-500">{app.state}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {app.status === "pending" && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    Pending
                                                </span>
                                            )}
                                            {app.status === "approved" && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Approved
                                                </span>
                                            )}
                                            {app.status === "rejected" && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                    Rejected
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(app.submittedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedApp(app)}
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold">Application Details</h2>
                                <button
                                    onClick={() => setSelectedApp(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                                        <p className="text-gray-900">{selectedApp.fullName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Email</label>
                                        <p className="text-gray-900">{selectedApp.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Mobile</label>
                                        <p className="text-gray-900">{selectedApp.mobile}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Qualification</label>
                                        <p className="text-gray-900">{selectedApp.qualification}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Country</label>
                                        <p className="text-gray-900">{selectedApp.country}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">State</label>
                                        <p className="text-gray-900">{selectedApp.state}</p>
                                    </div>
                                </div>

                                {selectedApp.portfolioUrl && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Portfolio</label>
                                        <a
                                            href={selectedApp.portfolioUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {selectedApp.portfolioUrl}
                                        </a>
                                    </div>
                                )}

                                {selectedApp.bio && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Bio</label>
                                        <p className="text-gray-900">{selectedApp.bio}</p>
                                    </div>
                                )}

                                {selectedApp.specialization && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Specialization</label>
                                        <p className="text-gray-900">{selectedApp.specialization}</p>
                                    </div>
                                )}

                                {selectedApp.status === "pending" && (
                                    <div className="flex gap-3 pt-4 border-t">
                                        <Button
                                            onClick={() => handleStatusUpdate(selectedApp.id, "approved")}
                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                        >
                                            <Check className="w-4 h-4 mr-2" />
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate(selectedApp.id, "rejected")}
                                            variant="destructive"
                                            className="flex-1"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Reject
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
