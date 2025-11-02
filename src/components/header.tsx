"use client";

import { useState } from "react";
import {
  Menu,
  X,
  LogOut,
  Settings,
  Home,
  Users,
  Mic,
  FileText,
  CheckSquare,
  User,
  UserRoundPen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Home", value: "/home", icon: Home },
    // { label: "Community", value: "/community", icon: Users },
    { label: "HrInterview", value: "/upload", icon: Mic },
    { label: "TechInterview", value: "/interview/tech", icon: Mic },
    { label: "Resume", value: "/resume", icon: FileText },
    { label: "Question Practice", value: "/questions", icon: CheckSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-full h-16 px-4">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center">
            <Link
              href="/home"
              className="flex items-center gap-2 group relative"
            >
              <div
                className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent group-hover:opacity-90 transition-all duration-300"
                style={{
                  textShadow: "0 0 15px var(--color-ring)",
                  WebkitBackgroundClip: "text",
                }}
              >
                NEXTURE
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.value;
              return (
                <Link
                  key={item.value}
                  href={item.value}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
                    transition-all duration-300 hover:bg-accent/10
                    ${
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_var(--color-ring)] hover:bg-primary/15"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Desktop User Menu */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="
                      w-10 h-10 rounded-full 
                      bg-gradient-to-br from-primary to-accent 
                      flex items-center justify-center 
                      text-primary-foreground font-semibold 
                      cursor-pointer hover:opacity-90 
                      transition-all duration-300 
                      border border-border/50 hover:border-accent
                      shadow-[0_0_15px_var(--color-ring)]
                      hover:shadow-[0_0_20px_var(--color-ring)]
                      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    "
                  >
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="cursor-pointer group" onClick={()=>{router.push("/profile")}}>
                    <UserRoundPen className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                    <span className="group-hover:text-primary transition-colors">
                      Profile
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive group">
                    <LogOut className="w-4 h-4 mr-2 group-hover:text-destructive transition-colors" />
                    <span className="group-hover:text-destructive transition-colors">
                      Logout
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-accent/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-1.5 animate-in slide-in-from-top-2 duration-300">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.value;
              return (
                <Link
                  key={item.value}
                  href={item.value}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 w-full px-4 py-3 
                    rounded-md text-sm font-medium 
                    transition-all duration-300 
                    ${
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_var(--color-ring)] hover:bg-primary/15"
                        : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Mobile User Menu */}
            <div className="pt-2 mt-2 border-t border-border/40">
              <Link
                href="/settings"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-all duration-300"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
              <button className="flex items-center gap-3 w-full px-4 py-3 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-300">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
