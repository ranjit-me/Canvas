"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
    LayoutTemplate,
    Upload,
    LogOut,
    Loader2,
    Code,
    Settings,
    ChevronLeft,
    FileCode
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SIDEBAR_ITEMS = [
    { id: "dashboard", label: "Studio Home", icon: LayoutTemplate, href: "/creator" },
    { id: "upload", label: "Upload Template", icon: Upload, href: "/creator/upload" },
    { id: "manage", label: "My Templates", icon: Code, href: "/creator/templates" },
    { id: "html-templates", label: "Html Template", icon: FileCode, href: "/creator/html" },
];

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const isLoginPage = pathname === "/creator/login";

    useEffect(() => {
        if (isLoginPage) return;

        const auth = localStorage.getItem("creator_auth");
        if (auth === "authorized") {
            setIsAuthorized(true);
        } else {
            router.push("/creator/login");
        }
    }, [router, isLoginPage]);

    if (!isAuthorized && !isLoginPage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-[#FDFCFD] flex overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="bg-white border-r border-gray-100 flex flex-col relative z-20 group"
            >
                {/* Logo Section */}
                <div className="p-6 h-20 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-100">
                        <Code className="w-6 h-6 text-white" />
                    </div>
                    {isSidebarOpen && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-black text-xl text-gray-900 tracking-tight"
                        >
                            Creator <span className="text-blue-500">Studio</span>
                        </motion.span>
                    )}
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-4 mt-4">
                    <ul className="space-y-2">
                        {SIDEBAR_ITEMS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => router.push(item.href)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group/item",
                                            "hover:bg-blue-50/50 hover:text-blue-600 font-bold text-gray-500"
                                        )}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                                        {isSidebarOpen && (
                                            <span className="truncate">{item.label}</span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-50">
                    <button
                        onClick={() => {
                            localStorage.removeItem("creator_auth");
                            router.push("/creator/login");
                        }}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-red-500 font-bold",
                            "hover:bg-red-50"
                        )}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>

                {/* Collapse Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-24 w-6 h-6 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-500 shadow-sm transition-colors z-30"
                >
                    <ChevronLeft className={cn("w-4 h-4 transition-transform", !isSidebarOpen && "rotate-180")} />
                </button>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 border-b border-gray-50 bg-white/50 backdrop-blur-xl px-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Creator Dashboard</h2>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
