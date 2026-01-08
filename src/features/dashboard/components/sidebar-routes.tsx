"use client";

import {
  CreditCard,
  Crown,
  Home,
  MessageCircleQuestion,
  LayoutTemplate,
  FolderClock,
  Heart,
  Cake,
  Globe,
  Briefcase,
  Building2,
  Music,
  Baby,
  Loader2
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { useCheckout } from "@/features/subscriptions/api/use-checkout";
import { useBilling } from "@/features/subscriptions/api/use-billing";
import { useCreateProject } from "@/features/projects/api/use-create-project";

import { Button } from "@/components/ui/button";

import { SidebarItem } from "./sidebar-item";

export const SidebarRoutes = () => {
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  const createProjectMutation = useCreateProject();
  const mutation = useCheckout();
  const billingMutation = useBilling();
  const { shouldBlock, isLoading, triggerPaywall } = usePaywall();

  const pathname = usePathname();

  const onBillingClick = () => {
    if (shouldBlock) {
      triggerPaywall();
      return;
    }

    billingMutation.mutate();
  };

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

  return (
    <div className="flex flex-col gap-y-1 flex-1 pt-4 overflow-hidden">
      {/* Create Button */}
      <div className="px-3 mb-2">
        <Button
          className="w-full h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full"
          size="sm"
          onClick={onCreateClick}
          disabled={createProjectMutation.isPending}
        >
          {creating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <span className="text-2xl leading-none">+</span>
          )}
        </Button>
        <p className="text-xs text-center mt-1 font-medium">Create</p>
      </div>

      {/* Main Menu Items */}
      <ul className="flex flex-col gap-y-1 px-2 overflow-y-auto flex-1">
        <SidebarItem
          href="/dashboard"
          icon={Home}
          label="Home"
          isActive={pathname === "/dashboard"}
        />
        <SidebarItem
          href="/dashboard/projects"
          icon={FolderClock}
          label="Projects"
          isActive={pathname === "/dashboard/projects"}
        />
        <SidebarItem
          href="/dashboard/templates"
          icon={LayoutTemplate}
          label="Templates"
          isActive={pathname === "/dashboard/templates"}
        />
        <SidebarItem
          href="/dashboard"
          icon={Cake}
          label="Birthday Mini Web"
          isActive={false}
        />
        <SidebarItem
          href="/dashboard"
          icon={Heart}
          label="Anniversary Mini Web"
          isActive={false}
        />
        <SidebarItem
          href="/dashboard"
          icon={Globe}
          label="Wedding Mini Web"
          isActive={false}
        />
        <SidebarItem
          href="/dashboard"
          icon={Briefcase}
          label="Business Event Mini Web"
          isActive={false}
        />
        <SidebarItem
          href="/dashboard"
          icon={Building2}
          label="Corporate Event Mini Web"
          isActive={false}
        />
        <SidebarItem
          href="/dashboard"
          icon={Music}
          label="Music Mini Web"
          isActive={false}
        />
        <SidebarItem
          href="/dashboard"
          icon={Baby}
          label="Kids Birth Mini Web"
          isActive={false}
        />
      </ul>
    </div>
  );
};
