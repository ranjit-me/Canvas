"use client";

import { useSession, signOut } from "next-auth/react";
import { User, Package, Loader, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserButton = () => {
  const router = useRouter();
  const session = useSession();

  if (session.status === "loading") {
    return <Loader className="size-4 animate-spin text-muted-foreground" />
  }

  if (session.status === "unauthenticated" || !session.data) {
    return null;
  }

  const name = session.data?.user?.name!;
  const imageUrl = session.data?.user?.image;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition">
          <AvatarImage alt={name} src={imageUrl || ""} />
          <AvatarFallback className="bg-blue-500 font-medium text-white flex items-center justify-center">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuItem
          onClick={() => router.push('/profile')}
          className="h-10"
        >
          <User className="size-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/orders')}
          className="h-10"
        >
          <Package className="size-4 mr-2" />
          Orders
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="h-10" onClick={() => signOut({ callbackUrl: "/" })}>
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
