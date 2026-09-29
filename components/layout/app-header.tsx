"use client";

import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface CurrentUser {
  email: string;
  role: "admin" | "viewer";
  name: string;
}

export default function AppHeader() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const pathname = usePathname();

  function getPageTitle() {
    if (pathname === "/dashboard") return "Dashboard";

    if (pathname === "/products") return "Products";

    if (pathname === "/products/new") return "Add Product";

    if (pathname.endsWith("/edit")) return "Edit Product";

    if (/^\/products\/[^/]+$/.test(pathname)) {
      return "Product Details";
    }

    return "Adminova";
  }

  const pageTitle = getPageTitle();

  useEffect(() => {
    async function loadUser() {
      const response = await fetch("/api/me");

      if (!response.ok) return;

      const data: CurrentUser = await response.json();
      setUser(data);
    }

    void loadUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <SidebarTrigger />

        <div>
          <h1 className="text-lg font-semibold">{pageTitle}</h1>{" "}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" className="h-10 gap-2 px-2" />}
          >
            <Avatar className="size-8">
              <AvatarFallback>
                {user?.role === "admin"
                  ? "DA"
                  : user?.role === "viewer"
                    ? "DV"
                    : "DU"}
              </AvatarFallback>
            </Avatar>

            <div className="hidden text-left md:block">
              <p className="max-w-40 truncate text-sm font-medium">
                {user?.name ?? "Loading..."}
              </p>

              <p className="text-xs capitalize text-muted-foreground">
                {user?.role ?? "User"}
              </p>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
