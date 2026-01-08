"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  FolderClock,
  Heart,
  Cake,
  Globe,
  Briefcase,
  Building2,
  Music,
  Baby,
  Loader2,
  Facebook,
  Instagram,
  MessageCircle,
  Bell,
  Plus,
  ShoppingBag,
  User,
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

import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { useCheckout } from "@/features/subscriptions/api/use-checkout";
import { useBilling } from "@/features/subscriptions/api/use-billing";
import { useCreateProject } from "@/features/projects/api/use-create-project";

// SidebarItem Component with Enhanced Design
interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isActive,
  onClick,
}: SidebarItemProps) => {
  return (
    <Link href={href} onClick={onClick}>
      <div
        className={cn(
          "flex flex-col items-center justify-center py-3 px-2 min-w-[80px] rounded-xl bg-white/50 backdrop-blur-sm hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 hover:shadow-md hover:scale-105 transition-all duration-200 gap-1 border border-gray-200/50",
          isActive && "bg-gradient-to-br from-purple-100 to-blue-100 shadow-md border-purple-200"
        )}
      >
        <Icon className={cn(
          "size-6 stroke-2",
          isActive ? "text-purple-600" : "text-gray-700"
        )} />
        <span className={cn(
          "text-xs font-medium",
          isActive ? "text-purple-700" : "text-gray-700"
        )}>
          {label}
        </span>
      </div>
    </Link>
  );
};

// SidebarFooter Component
const SidebarFooter = () => {
  const session = useSession();

  if (session.status === "loading") {
    return null;
  }

  if (session.status === "unauthenticated" || !session.data) {
    return null;
  }

  const name = session.data?.user?.name || "User";
  const email = session.data?.user?.email || "";
  const imageUrl = session.data?.user?.image;

  return (
    <div className="p-3 mt-auto flex flex-col gap-4 items-center border-t border-gray-100 w-full group/footer">
      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center w-full cursor-pointer hover:bg-gray-100 rounded-2xl p-1 transition-all">
            <Avatar className="size-10 ring-2 ring-purple-200 shrink-0">
              <AvatarImage alt={name} src={imageUrl || ""} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 font-medium text-white text-sm">
                {name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3 hidden group-hover/footer:flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-gray-700 truncate">{name}</span>
              <span className="text-[10px] text-gray-500 truncate">{email}</span>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="right" className="w-56 ml-2">
          <DropdownMenuItem className="flex flex-col items-start">
            <div className="font-medium">{name}</div>
            <div className="text-xs text-muted-foreground">{email}</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Notification Bell with badge */}
      <Button
        variant="ghost"
        size="icon"
        className="relative shrink-0 h-10 w-10 hover:bg-white/80 transition-all hover:scale-110 rounded-2xl"
      >
        <Bell className="size-5 text-gray-700" />
        <span className="absolute top-1 right-1 bg-gradient-to-br from-red-500 to-red-600 text-[10px] text-white rounded-full h-4 w-4 flex items-center justify-center shadow-lg border-2 border-white">
          1
        </span>
      </Button>
    </div>
  );
};

// Main Sidebar Component
export const Sidebar = () => {
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const createProjectMutation = useCreateProject();

  const onCreateClick = () => {
    setCreating(true);
    createProjectMutation.mutate(
      {
        name: "Untitled project",
        json: "",
        width: 900,
        height: 1200,
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/editor/${data.id}`);
        },
        onError: () => {
          setCreating(false);
        },
      }
    );
  };

  const routes = [
    { label: "Home", icon: Home, href: "/dashboard" },
    { label: "Birthday Website", icon: Cake, href: "/web/birthday" },
    { label: "Anniversary Website", icon: Heart, href: "/web/anniversary" },
    { label: "Wedding / Engagement", icon: Globe, href: "/web/wedding" },
    { label: "Kids Birthday Party", icon: Baby, href: "/web/kids-birth" },
    { label: "Orders", icon: ShoppingBag, href: "/dashboard/projects" },
    { label: "Profile", icon: User, href: "/dashboard" },
  ];

  return (
    <div className="hidden lg:block fixed left-6 inset-y-6 z-50 group">
      <aside className="w-[72px] hover:w-64 transition-all duration-500 ease-&lsqb;cubic-bezier(0.23,1,0.32,1)&rsqb; bg-white/90 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] flex flex-col items-center py-8 gap-y-4 overflow-hidden h-full">
        {/* Logo/Home */}
        <Link href="/dashboard" className="mb-6 shrink-0">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-[20px] shadow-lg hover:rotate-12 transition-all duration-300 hover:scale-110">
            <Image
              src="/logo.png"
              alt="Logo"
              width={24}
              height={24}
              className="brightness-0 invert shrink-0"
            />
          </div>
        </Link>

        {/* Create Button */}
        <div className="px-4 w-full shrink-0">
          <Button
            onClick={onCreateClick}
            disabled={createProjectMutation.isPending}
            className="w-10 group-hover:w-full h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-[16px] shadow-md transition-all duration-500 overflow-hidden p-0 group-hover:px-4"
          >
            {creating ? (
              <Loader2 className="size-5 animate-spin shrink-0" />
            ) : (
              <Plus className="size-5 shrink-0" />
            )}
            <span className="ml-3 font-semibold text-sm hidden group-hover:block whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
              Create New
            </span>
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-y-1 w-full px-4 mt-4 flex-1 overflow-y-auto scrollbar-hide">
          {routes.map((route) => {
            const Icon = route.icon;
            const isActive = pathname === route.href ||
              (route.href !== "/dashboard" && pathname.startsWith(route.href)) ||
              (route.href === "/dashboard" && pathname === "/");

            return (
              <Link key={route.label} href={route.href}>
                <div
                  className={cn(
                    "flex items-center w-10 group-hover:w-full h-11 rounded-[16px] transition-all duration-500 group-hover:px-3 gap-x-4 overflow-hidden cursor-pointer",
                    isActive
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className={cn("size-5 shrink-0 ml-[10px] group-hover:ml-0 transition-all duration-500", isActive && "text-white")} />
                  <span className="font-semibold text-sm hidden group-hover:block whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                    {route.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100 w-full flex flex-col items-center gap-y-6 shrink-0">
          <SidebarFooter />
        </div>
      </aside>
    </div>
  );
};



