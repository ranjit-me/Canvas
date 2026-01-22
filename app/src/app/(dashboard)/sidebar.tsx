"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  FolderClock,
  Heart,
  Cake,
  PartyPopper,
  CalendarHeart,
  Sparkles,
  Baby,
  Loader2,
  User,
  LogOut,
  LogIn,
  ChevronRight,
  CalendarDays,
  Globe,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLeadCaptureModal } from "@/features/leads/store/use-lead-capture-modal";
import { useLanguage } from "@/contexts/LanguageContext";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive?: boolean;
  isExpanded: boolean;
  onClick?: () => void;
}

const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isActive,
  isExpanded,
  onClick,
}: SidebarItemProps) => {
  return (
    <Link href={href} onClick={onClick}>
      <div
        className={cn(
          "flex items-center h-12 px-3 rounded-xl transition-all duration-200 gap-4 group mb-1",
          isActive
            ? "bg-purple-100/80 text-purple-700 shadow-sm"
            : "text-gray-600 hover:bg-white hover:shadow-sm"
        )}
      >
        <div className="shrink-0 w-6 flex justify-center">
          <Icon className={cn(
            "size-6 transition-colors",
            isActive ? "text-purple-600" : "group-hover:text-purple-500"
          )} />
        </div>
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium whitespace-nowrap overflow-hidden"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
};

export const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();
  const { onOpen: openLeadModal } = useLeadCaptureModal();
  const { t } = useLanguage();

  const name = session.data?.user?.name || "User";
  const email = session.data?.user?.email || "";
  const imageUrl = session.data?.user?.image;

  return (
    <div className="hidden lg:block">
      <motion.aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        animate={{ width: isExpanded ? 260 : 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 bottom-0 bg-white border-r border-gray-200/60 shadow-xl z-[100] flex flex-col overflow-hidden"
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-4 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="ELYX Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-xl font-bold text-gray-800 whitespace-nowrap"
                >
                  ELYX
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>


        {/* Navigation Items */}
        <div className="flex-1 px-3 overflow-y-auto flex flex-col justify-center gap-y-2">
          <SidebarItem
            href="/dashboard"
            icon={Home}
            label={t('sidebar.home')}
            isActive={pathname === "/dashboard"}
            isExpanded={isExpanded}
          />
          <SidebarItem
            href="/web/birthday"
            icon={PartyPopper}
            label={t('sidebar.birthday')}
            isActive={pathname.startsWith("/web/birthday")}
            isExpanded={isExpanded}
          />
          <SidebarItem
            href="/web/anniversary"
            icon={CalendarHeart}
            label={t('sidebar.anniversary')}
            isActive={pathname.startsWith("/web/anniversary")}
            isExpanded={isExpanded}
          />
          <SidebarItem
            href="/web/wedding"
            icon={Sparkles}
            label={t('sidebar.wedding')}
            isActive={pathname.startsWith("/web/wedding")}
            isExpanded={isExpanded}
          />
          <SidebarItem
            href="/web/valentine-week"
            icon={Heart}
            label={t('sidebar.valentine')}
            isActive={pathname.startsWith("/web/valentine-week")}
            isExpanded={isExpanded}
          />
          <SidebarItem
            href="/web/special-days"
            icon={CalendarDays}
            label={t('sidebar.special')}
            isActive={pathname.startsWith("/web/special-days")}
            isExpanded={isExpanded}
          />
          <SidebarItem
            href="/web/religious-cultural"
            icon={Globe}
            label={t('sidebar.religious')}
            isActive={pathname.startsWith("/web/religious-cultural")}
            isExpanded={isExpanded}
          />
        </div>

        {/* Footer / Profile Section */}
        <div className="p-3 border-t border-gray-100 bg-gray-50/50">
          <SidebarItem
            href="/dashboard/projects"
            icon={FolderClock}
            label={t('sidebar.orders')}
            isActive={pathname === "/dashboard/projects"}
            isExpanded={isExpanded}
          />
          <div className="mt-2" />
          {session.status === "unauthenticated" ? (
            <Link href="/api/auth/signin">
              <Button
                variant="ghost"
                className={cn(
                  "w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 text-left hover:bg-white",
                  !isExpanded && "justify-center"
                )}
              >
                <div className="shrink-0 w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                  <LogIn className="size-5 text-purple-600" />
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-bold text-gray-800"
                    >
                      Sign In
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-all duration-200 text-left group",
                    !isExpanded && "justify-center"
                  )}
                >
                  <div className="shrink-0">
                    <Avatar className="size-10 ring-2 ring-purple-100">
                      <AvatarImage alt={name} src={imageUrl || ""} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 font-medium text-white text-sm">
                        {name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="flex-1 min-w-0"
                      >
                        <div className="text-sm font-bold text-gray-800 truncate">{name}</div>
                        <div className="text-xs text-gray-500 truncate">{email}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {isExpanded && <ChevronRight className="size-4 text-gray-400 group-hover:text-purple-500 transition-colors" />}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="right" sideOffset={12} className="w-64 p-2">
                <div className="px-2 py-4 mb-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                  <div className="text-sm font-bold text-gray-800">{name}</div>
                  <div className="text-xs text-gray-500">{email}</div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 p-3 cursor-pointer rounded-lg"
                  onClick={() => openLeadModal()}
                >
                  <User className="size-4" />
                  <span className="font-medium">Edit Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 p-3 text-red-600 focus:text-red-600 cursor-pointer rounded-lg"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="size-4" />
                  <span className="font-medium">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </motion.aside>
    </div>
  );
};
