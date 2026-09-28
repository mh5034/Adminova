"use client";

import { LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AppHeader() {
  const supabase = createClient();
  const router = useRouter();

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
          <h1 className="text-lg font-semibold">Dashboard</h1>
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
              <AvatarImage src="" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>

            <div className="hidden text-left md:block">
              <p className="text-sm font-medium">Mohammad</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <LogOut />
              <button onClick={handleLogout}>Sign out</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
