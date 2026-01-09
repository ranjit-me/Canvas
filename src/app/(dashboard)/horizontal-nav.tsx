"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import type { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    FolderClock,
    Heart,
    PartyPopper,
    CalendarHeart,
    Sparkles,
    CalendarDays,
    Globe,
    LogIn,
    MapPin,
    ShieldCheck,
    ChevronDown,
    User,
    Settings,
    LogOut,
    Menu,
    X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
    icon: LucideIcon;
    label: string;
    href: string;
}

// Language data with flags
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

// Location Display Component with user-triggered geolocation
const LocationDisplay = () => {
    const [location, setLocation] = useState<string>('Get Location');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetLocation = () => {
        setIsLoading(true);
        setError(null);
        setLocation('Detecting...');

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
                            {
                                headers: {
                                    'User-Agent': 'Giftora-App/1.0'
                                }
                            }
                        );

                        if (response.ok) {
                            const data = await response.json();
                            const address = data.address;
                            const city = address.city || address.town || address.village || address.county || '';
                            const state = address.state || '';

                            if (city && state) {
                                const stateAbbr = state.split(' ').map((word: string) => word[0]).join('').toUpperCase().slice(0, 2);
                                setLocation(`${city}, ${stateAbbr}`);
                            } else if (city) {
                                setLocation(city);
                            } else {
                                setLocation('Location detected');
                            }
                        } else {
                            setLocation(`${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`);
                        }
                    } catch (error) {
                        console.error('Reverse geocoding error:', error);
                        setLocation('Location detected');
                    } finally {
                        setIsLoading(false);
                    }
                },
                (error) => {
                    console.log('Geolocation permission denied or error:', error.message);
                    // Fall back to IP-based location only on explicit error, but warn user if needed
                    fetch('/api/location')
                        .then(res => res.json())
                        .then(data => {
                            if (data.location) {
                                setLocation(data.location);
                            } else {
                                setLocation('Location unavailable');
                            }
                        })
                        .catch((err) => {
                            console.error('Location fetch error:', err);
                            setLocation('Location unavailable');
                        })
                        .finally(() => setIsLoading(false));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0 // Don't use cached position
                }
            );
        } else {
            setError("Geolocation not supported");
            setIsLoading(false);
        }
    };

    // Auto-attempt IP location on mount ONLY as a placeholder, but allow override
    useEffect(() => {
        // Initial placeholder using IP, but user can click to get precise location
        fetch('/api/location')
            .then(res => res.json())
            .then(data => {
                if (data.location) {
                    // Only set if we haven't already got a precise location or are not loading
                    setLocation(prev => prev === 'Get Location' ? data.location : prev);
                }
            })
            .catch(() => { /* mute initial errors */ });
    }, []);

    return (
        <button
            onClick={handleGetLocation}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-xs hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
            title="Click to update location"
        >
            <MapPin className={cn("size-3.5 flex-shrink-0", isLoading && "animate-bounce")} />
            <span className="font-medium max-w-[80px] sm:max-w-none truncate">
                {isLoading ? 'Detecting...' : location}
            </span>
        </button>
    );
};

// Language Selector Component
interface LanguageSelectorProps {
    language: string;
    setLanguage: (lang: any) => void;
}

const LanguageSelector = ({ language, setLanguage }: LanguageSelectorProps) => {
    const currentLang = languages.find(l => l.code === language) || languages[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <span className="text-xl">{currentLang.flag}</span>
                <ChevronDown className="size-3.5 text-gray-600 dark:text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 max-h-80 overflow-y-auto">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => setLanguage(lang.code)}
                    >
                        <span className="text-base">{lang.flag}</span>
                        <span>{lang.name}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};


export const HorizontalNav = () => {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t, language, setLanguage } = useLanguage();
    const { data: session } = useSession();

    const name = session?.user?.name || "User";
    const email = session?.user?.email || "";
    const imageUrl = session?.user?.image;
    const isAuthenticated = !!session;

    const navItems: NavItem[] = [
        { icon: Home, label: t("nav.home"), href: "/dashboard" },
        { icon: FolderClock, label: t("nav.orders"), href: "/dashboard/projects" },
        { icon: Heart, label: t("nav.valentine"), href: "/web/valentine-week" },
        { icon: PartyPopper, label: t("nav.birthday"), href: "/web/birthday" },
        { icon: CalendarHeart, label: t("nav.anniversary"), href: "/web/anniversary" },
        { icon: Sparkles, label: t("nav.special"), href: "/web/special-days" },
        { icon: CalendarDays, label: t("nav.wedding"), href: "/web/wedding" },
        { icon: Globe, label: t("nav.cultural"), href: "/web/religious-cultural" },
    ];

    const allNavItems = isAuthenticated ? navItems : navItems.filter(item => item.href !== "/dashboard/projects");
    const isAdmin = session?.user?.email === "admin@example.com";

    return (
        <>
            <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800 sticky top-0 z-40 shadow-sm">
                <div className="px-4 sm:px-6 flex items-center gap-4 h-16">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="size-6 text-gray-600" /> : <Menu className="size-6 text-gray-600" />}
                    </button>

                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2 group flex-shrink-0">
                        <div className="relative w-8 h-8 rounded-xl overflow-hidden ring-2 ring-purple-100 dark:ring-purple-900/30 group-hover:ring-purple-300 transition-all">
                            <Image
                                src="/elyx-logo.png"
                                alt="ELYX"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                        <span className="font-black text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-pink-500 transition-all">
                            ELYX
                        </span>
                    </Link>

                    {/* Divider */}
                    <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-700 to-transparent flex-shrink-0" />

                    {/* Navigation Items - Single Line with Scroll (Desktop Only) */}
                    <div className="hidden lg:flex flex-1 overflow-x-auto scrollbar-hide ml-4">
                        <ul className="flex items-center gap-1">
                            {allNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                                return (
                                    <motion.li key={item.href} className="flex-shrink-0" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                                        <Link href={item.href}>
                                            <div className={cn(
                                                "relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 font-medium text-sm whitespace-nowrap group",
                                                isActive
                                                    ? "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-700 dark:text-purple-300 shadow-md"
                                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100"
                                            )}>
                                                <Icon className={cn(
                                                    "size-4 transition-all duration-300",
                                                    isActive ? "text-purple-600 dark:text-purple-400" : "group-hover:scale-110"
                                                )} />
                                                <span className="hidden md:inline">{item.label}</span>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeTab"
                                                        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl"
                                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                    />
                                                )}
                                            </div>
                                        </Link>
                                    </motion.li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Right Side Controls */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div>
                            <LocationDisplay />
                        </div>
                        <div className="hidden lg:block h-4 w-px bg-gray-300 dark:bg-gray-700" />

                        {isAdmin && (
                            <>
                                <Link href="/admin" className="hidden md:flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm">
                                    <ShieldCheck className="size-4" />
                                    <span className="font-medium">Admin Portal</span>
                                </Link>
                                <div className="hidden md:block h-4 w-px bg-gray-300 dark:bg-gray-700" />
                            </>
                        )}

                        <div>
                            <LanguageSelector language={language} setLanguage={setLanguage} />
                        </div>

                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                                        <Avatar className="size-8 ring-2 ring-purple-300/50 dark:ring-purple-700/50">
                                            <AvatarImage alt={name} src={imageUrl || ""} />
                                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-semibold">
                                                {name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem className="flex flex-col items-start cursor-default focus:bg-transparent">
                                        <div className="font-medium">{name}</div>
                                        <div className="text-xs text-muted-foreground">{email}</div>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                                        <Link href="/dashboard/profile">
                                            <User className="size-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                                        <Link href="/dashboard/projects">
                                            <FolderClock className="size-4" />
                                            <span>Orders</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                                        <Link href="/dashboard/settings">
                                            <Settings className="size-4" />
                                            <span>Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="gap-2 text-red-600 dark:text-red-400 cursor-pointer">
                                        <LogOut className="size-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/sign-in">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-md font-medium text-sm transition-all whitespace-nowrap"
                                >
                                    <LogIn className="size-4" />
                                    <span>Login</span>
                                </motion.button>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {
                    isMobileMenuOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
                            />
                            {/* Drawer */}
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-gray-900 shadow-2xl z-[60] lg:hidden flex flex-col"
                            >
                                <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800">
                                    <span className="font-black text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        ELYX
                                    </span>
                                </div>

                                <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
                                    {/* Navigation Items */}
                                    {allNavItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <div className={cn(
                                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                                                    isActive
                                                        ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                )}>
                                                    <Icon className="size-5" />
                                                    <span>{item.label}</span>
                                                </div>
                                            </Link>
                                        );
                                    })}

                                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-4" />

                                    {/* Extra Controls in Drawer */}
                                    <div className="px-4 py-2 space-y-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Location</span>
                                            <LocationDisplay />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Language</span>
                                            <div className="flex items-center gap-2">
                                                {languages.map((lang) => (
                                                    <button
                                                        key={lang.code}
                                                        onClick={() => setLanguage(lang.code)}
                                                        className={cn(
                                                            "p-2 rounded-lg transition-all text-xl",
                                                            language === lang.code ? "bg-purple-100 dark:bg-purple-900/40 ring-1 ring-purple-200" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                                        )}
                                                        title={lang.name}
                                                    >
                                                        {lang.flag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )
                }
            </AnimatePresence >
        </>
    );
};
