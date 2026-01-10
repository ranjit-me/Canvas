"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

export default function ApplicationStatusPage() {
    const router = useRouter();
    const { data: session } = useSession();

    const status = session?.user?.creatorStatus || 'none';

    // If not pending, redirect
    if (status !== 'pending' && status !== 'rejected') {
        if (status === 'approved') {
            router.push("/creator/html");
        } else {
            router.push("/creator/apply");
        }
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/dashboard")}
                    className="mb-6"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center">
                        {status === 'pending' && (
                            <>
                                <Clock className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Application Pending
                                </h1>
                                <p className="text-lg text-gray-600 mb-6">
                                    Your creator application is under review
                                </p>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
                                    <h3 className="font-semibold text-yellow-900 mb-2">
                                        What happens next?
                                    </h3>
                                    <ul className="space-y-2 text-sm text-yellow-800">
                                        <li>• Our team is reviewing your application</li>
                                        <li>• This usually takes 2-3 business days</li>
                                        <li>• You'll receive an email once we make a decision</li>
                                        <li>• Check back here for updates</li>
                                    </ul>
                                </div>
                            </>
                        )}

                        {status === 'rejected' && (
                            <>
                                <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Application Not Approved
                                </h1>
                                <p className="text-lg text-gray-600 mb-6">
                                    Unfortunately, your creator application was not approved at this time
                                </p>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left mb-6">
                                    <h3 className="font-semibold text-red-900 mb-2">
                                        Admin Feedback
                                    </h3>
                                    <p className="text-sm text-red-800">
                                        {/* TODO: Show actual admin feedback */}
                                        Please ensure all required documents are properly submitted and meet our quality standards.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => router.push("/creator/apply")}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Reapply
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
