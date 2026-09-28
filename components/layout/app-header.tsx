"use client"

import { Bell, Search, LogOut, Settings, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export default function AppHeader() {
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
        
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search..."
            className="w-64 pl-9"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon">
          <Bell className="size-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="h-10 gap-2 px-2" />
            }
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
              <User />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Settings />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}