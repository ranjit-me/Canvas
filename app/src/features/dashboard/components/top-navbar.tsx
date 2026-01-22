"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { FolderClock, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCreateProject } from "@/features/projects/api/use-create-project";
import { useLeadCaptureModal } from "@/features/leads/store/use-lead-capture-modal";

export const TopNavbar = () => {
    const { onOpen: openLeadModal } = useLeadCaptureModal();
    const [creating, setCreating] = useState(false);
    const router = useRouter();
    const session = useSession();
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

    const name = session.data?.user?.name || "User";
    const email = session.data?.user?.email || "";
    const imageUrl = session.data?.user?.image;

    if (session.status === "loading") {
        return null;
    }

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-50">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Logo/Brand */}
                <Link href="/dashboard">
                    <div className="flex items-center gap-2 hover:opacity-75 transition-opacity">
                        <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            ELYX
                        </div>
                    </div>
                </Link>

                {/* Right Side - Actions */}
                <div className="flex items-center gap-4">
                    {/* Create Button */}
                    <Button
                        onClick={onCreateClick}
                        disabled={createProjectMutation.isPending}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
                        size="sm"
                    >
                        {creating ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Plus className="size-4" />
                        )}
                        <span>Create</span>
                    </Button>

                    {/* Projects Link */}
                    <Link href="/dashboard/projects">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <FolderClock className="size-4" />
                            <span className="hidden sm:inline">Projects</span>
                        </Button>
                    </Link>

                    {/* Profile Dropdown */}
                    {session.status !== "unauthenticated" && session.data && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-full"
                                >
                                    <Avatar className="size-9 ring-2 ring-purple-200">
                                        <AvatarImage alt={name} src={imageUrl || ""} />
                                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 font-medium text-white text-sm">
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
                                <DropdownMenuItem onClick={() => router.push('/profile')}>
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/orders')}>
                                    Orders
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </nav>
    );
};
