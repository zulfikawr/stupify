"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Home, Search, Library } from "lucide-react";

export function MobileNav() {
  const { status } = useSession();
  const pathname = usePathname();

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="fixed md:hidden bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 z-50">
      <nav className="flex justify-around items-center h-16">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === "/" ? "text-white" : "text-zinc-400"
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          href="/search"
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === "/search" ? "text-white" : "text-zinc-400"
          }`}
        >
          <Search className="h-6 w-6" />
          <span className="text-xs mt-1">Search</span>
        </Link>
        <Link
          href="/library"
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === "/library" ? "text-white" : "text-zinc-400"
          }`}
        >
          <Library className="h-6 w-6" />
          <span className="text-xs mt-1">Library</span>
        </Link>
      </nav>
    </div>
  );
}
