"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    LayoutTemplate,
    Upload,
    LogOut,
    Loader2,
    Code,
    Settings,
    ChevronLeft,
    FileCode,
    LogIn
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
        <div className="min-h-screen bg-[#FDFCFD] flex flex-col">
            {/* Top Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
                <Link href="/creator" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all">
                        <Image
                            src="/elyx-logo.png"
                            alt="Creator Studio"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                    <span className="font-black text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-indigo-500 transition-all">
                        Creator <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Studio</span>
                    </span>
                </Link>
                {/* Add User Menu or Logout here if needed later */}
            </header>

            {/* Horizontal Navigation Bar (below top navbar) */}
            <nav className="bg-white border-b border-gray-100 px-6 py-2 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <ul className="flex items-center gap-2">
                        {SIDEBAR_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.id} className="flex-shrink-0">
                                    <button
                                        onClick={() => router.push(item.href)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm",
                                            isActive
                                                ? "bg-blue-50 text-blue-600 font-bold"
                                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                        )}
                                    >
                                        <Icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-gray-400")} />
                                        <span>{item.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Login/Logout Button */}
                    <button
                        onClick={() => {
                            if (isAuthorized) {
                                localStorage.removeItem("creator_auth");
                                router.push("/creator/login");
                            } else {
                                router.push("/creator/login");
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm hover:shadow-md flex-shrink-0"
                    >
                        {isAuthorized ? (
                            <>
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </>
                        ) : (
                            <>
                                <LogIn className="w-4 h-4" />
                                <span>Login</span>
                            </>
                        )}
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-gray-50/50">
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
