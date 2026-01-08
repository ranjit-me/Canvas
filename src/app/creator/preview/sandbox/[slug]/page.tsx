"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * ErrorBoundary to catch and display compilation/runtime errors in the sandbox
 */
class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Sandbox Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-10 text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-black text-red-900 mb-2">Code Error Detected</h2>
                    <p className="text-red-700 font-medium mb-8 max-w-md">
                        Your template has an error that prevents it from rendering. Check your syntax or imports.
                    </p>
                    <div className="bg-red-900/5 p-6 rounded-2xl border border-red-200 text-left font-mono text-sm text-red-800 max-w-2xl w-full overflow-auto mb-8">
                        {this.state.error?.message}
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retry Render
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

import { Suspense, useState, useEffect } from "react";
import { QueryProvider } from "@/components/query-provider";
import { EditModeProvider } from "@/app/(dashboard)/web/features/hooks/useEditMode";
import { Toaster } from "sonner";

export default function SandboxPreviewPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [config, setConfig] = useState<Record<string, any>>({});

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === "UPDATE_CONFIG") {
                setConfig(event.data.config);
            }
        };
        window.addEventListener("message", handleMessage);

        // Signal that we are ready
        window.parent.postMessage({ type: "SANDBOX_READY" }, "*");

        return () => window.removeEventListener("message", handleMessage);
    }, []);

    // Dynamically import the sandboxed template
    const DynamicTemplate = dynamic(
        () => import(`@/features/web-projects/templates/sandbox/${slug}`).catch(err => {
            console.error("Import failed:", err);
            throw new Error(`Failed to load template "${slug}". Ensure it's exported as 'default'.`);
        }),
        {
            ssr: false,
            loading: () => (
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <p className="font-black text-blue-600 animate-pulse tracking-widest uppercase text-xs">Compiling Workshop...</p>
                    </div>
                </div>
            )
        }
    ) as any;

    return (
        <div className="min-h-screen bg-white">
            <QueryProvider>
                <EditModeProvider>
                    <Suspense fallback={null}>
                        <ErrorBoundary>
                            <div id="sandbox-root">
                                <DynamicTemplate config={config} />
                            </div>
                        </ErrorBoundary>
                    </Suspense>
                </EditModeProvider>
            </QueryProvider>
            <Toaster position="bottom-right" />
        </div>
    );
}
