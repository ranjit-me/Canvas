"use client";

import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { useLeadCaptureModal } from "@/features/leads/store/use-lead-capture-modal";

export const SidebarFooter = () => {
    const session = useSession();
    const { onOpen: openLeadModal } = useLeadCaptureModal();

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
        <div className="p-3 mt-auto flex flex-col gap-3 items-center">
            {/* Notification Bell with badge */}
            <Button variant="ghost" size="icon" className="relative shrink-0 h-10 w-10">
                <Bell className="size-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    1
                </span>
            </Button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 p-0">
                        <Avatar className="size-10">
                            <AvatarImage alt={name} src={imageUrl || ""} />
                            <AvatarFallback className="bg-green-600 font-medium text-white text-sm">
                                {name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem className="flex flex-col items-start">
                        <div className="font-medium">{name}</div>
                        <div className="text-xs text-muted-foreground">{email}</div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openLeadModal()}>
                        Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
