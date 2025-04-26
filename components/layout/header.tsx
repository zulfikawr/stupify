"use client";

import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.slice(0, 2).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-end px-6 bg-gradient-to-b from-zinc-900 to-zinc-800">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="focus:outline-none">
            <Avatar className="h-8 w-8 cursor-pointer rounded-full bg-zinc-700 hover:ring-2 hover:ring-white/50 transition-all">
              {user.image ? (
                <AvatarImage src={user.image} alt={user.name || "User"} />
              ) : (
                <AvatarFallback className="text-white font-medium">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-zinc-800 border-zinc-700 text-zinc-200 rounded-xl shadow-lg"
        >
          <DropdownMenuLabel className="text-sm font-medium text-zinc-200 px-3 py-2">
            {user.name || "User"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-zinc-700" />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-zinc-200 hover:bg-zinc-700 hover:text-white px-3 py-2 cursor-pointer rounded-md"
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}