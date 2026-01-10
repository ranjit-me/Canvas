"use client";

import Link from "next/link";
import { LayoutDashboard, Home, LogOut, ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Language data with flags from dashboard
const languages = [
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'hi', flag: '🇮🇳', name: 'हिंदी' },
    { code: 'es', flag: '🇪🇸', name: 'Español' },
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
    { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
    { code: 'zh', flag: '🇨🇳', name: '中文' },
    { code: 'pt', flag: '🇵🇹', name: 'Português' },
    { code: 'ar', flag: '🇸🇦', name: 'العربية' },
    { code: 'bn', flag: '🇧🇩', name: 'বাংলা' },
    { code: 'ru', flag: '🇷🇺', name: 'Русский' },
    { code: 'ur', flag: '🇵🇰', name: 'اردو' },
    { code: 'te', flag: '🇮🇳', name: 'తెలుగు' },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Horizontal Navbar */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/admin" className="flex items-center gap-2 group">
                            <div className="bg-gray-900 p-1.5 rounded-lg group-hover:bg-gray-800 transition-colors">
                                <LayoutDashboard className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">
                                ADMIN <span className="text-gray-500 font-medium">PANEL</span>
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all outline-none">
                                Web Language
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="w-48 max-h-80 overflow-y-auto">
                                {languages.map((lang) => (
                                    <DropdownMenuItem key={lang.code} className="flex items-center gap-2 cursor-pointer">
                                        <span className="text-base">{lang.flag}</span>
                                        <span>{lang.name}</span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all outline-none">
                                Template Language
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="w-48 max-h-80 overflow-y-auto">
                                {languages.map((lang) => (
                                    <DropdownMenuItem key={lang.code} className="flex items-center gap-2 cursor-pointer">
                                        <span className="text-base">{lang.flag}</span>
                                        <span>{lang.name}</span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                        >
                            <Home className="h-4 w-4" />
                            Back to Site
                        </Link>
                        <div className="h-6 w-px bg-gray-200" />
                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all">
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full flex flex-col">
                {children}
            </main>
        </div>
    );
}
