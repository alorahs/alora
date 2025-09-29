"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { User, Settings, LogOut, Menu } from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/auth_provider";
import { NotificationDropdown } from "./notification_dropdown";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/professionals", label: "Professionals" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  
  { href: "/feedback", label: "Feedback" },

  // { href: "/faq", label: "FAQ" },
  // { href: "/help", label: "Help" },
];

export function Header() {
  const { user } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const handleNavigation = (href: string) => {
    setIsMobileMenuOpen(false);
    // Close mobile menu when navigating
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
      <div className="mx-auto max-w-screen-xl flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg h-9 w-9">
            <img
              src="/alora-logo.png"
              alt="Alora Logo"
              className="h-full w-full object-contain"
            />
          </div>
          {/* <span className="font-semibold text-xl text-foreground">Alora</span> */}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side - Auth & Mobile Menu */}
        <div className="flex items-center space-x-3">
          {!user ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                asChild
                className="hidden sm:inline-flex rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground/100 font-medium hover:bg-muted/80 transition-all duration-200"
              >
                <Link to="/auth/login">Sign In</Link>
              </Button>
              <Button
                asChild
                className="rounded-full px-5 py-2 text-sm font-medium bg-gradient-to-r from-primary to-primary/90 shadow-lg hover:opacity-90 transition-all duration-200"
              >
                <Link to="/auth/signup">Get Started</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <NotificationDropdown />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open user menu"
                    className="relative rounded-full p-1 hover:bg-muted/30 transition-all duration-200"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user.profilePicture || "/placeholder.svg"}
                        alt={user.fullName || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-medium">
                        {(user.fullName || "U")
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-56 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none">
                        {user.fullName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-border/50" />

                  <DropdownMenuItem
                    asChild
                    className="rounded-lg mx-2 my-1 hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                  >
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-3 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  {user.role === "admin" && (
                    <DropdownMenuItem
                      asChild
                      className="rounded-lg mx-2 my-1 hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                    >
                      <Link to="/admin" className="flex items-center">
                        <Settings className="mr-3 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    asChild
                    className="rounded-lg mx-2 my-1 hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                  >
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-3 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-border/50" />

                  <DropdownMenuItem className="rounded-lg mx-2 my-1 mb-2 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 cursor-pointer flex items-center">
                    <Link to="/auth/logout" className="flex items-center">
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>Log out</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full hover:bg-muted/50 transition-all duration-200"
                aria-label="Open mobile menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6">
              <SheetHeader>
                <SheetTitle className="text-left">Navigation</SheetTitle>
                <SheetDescription className="text-left">
                  Access all pages and features
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col space-y-4 mt-8">
                {/* Navigation Links */}
                <div className="space-y-2">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.href}
                      variant="ghost"
                      asChild
                      className="w-full justify-start text-base font-medium h-12 rounded-lg hover:bg-black/50"
                      onClick={() => handleNavigation(item.href)}
                    >
                      <Link to={item.href}>{item.label}</Link>
                    </Button>
                  ))}
                </div>

                {/* Auth Buttons for Mobile */}
                {!user && (
                  <div className="space-y-3 pt-6 border-t border-border">
                    <Button
                      variant="outline"
                      asChild
                      className="w-full h-12 rounded-lg bg-transparent"
                      onClick={() => handleNavigation("/login")}
                    >
                      <Link to="/auth/login">Sign In</Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full h-12 rounded-lg bg-gradient-to-r from-primary to-primary/90 shadow-lg hover:opacity-80 transition-all duration-200"
                      onClick={() => handleNavigation("/signup")}
                    >
                      <Link to="/auth/signup">Get Started</Link>
                    </Button>
                  </div>
                )}

                {/* User Info for Mobile */}
                {user && (
                  <div className="pt-6 border-t border-border space-y-3">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.profilePicture || "/placeholder.svg"}
                          alt={user.fullName || "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-medium">
                          {(user.fullName || "U")
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      asChild
                      className="w-full justify-start h-12 rounded-lg hover:bg-muted/50"
                      onClick={() => handleNavigation("/profile")}
                    >
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-3 h-4 w-4" />
                        Profile
                      </Link>
                    </Button>

                    {user.role === "admin" && (
                      <Button
                        variant="ghost"
                        asChild
                        className="w-full justify-start h-12 rounded-lg hover:bg-muted/50"
                        onClick={() => handleNavigation("/admin")}
                      >
                        <Link to="/admin" className="flex items-center">
                          <Settings className="mr-3 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      asChild
                      className="w-full justify-start h-12 rounded-lg hover:bg-muted/50"
                      onClick={() => handleNavigation("/settings")}
                    >
                      <Link to="/settings" className="flex items-center">
                        <Settings className="mr-3 h-4 w-4" />
                        Settings
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start h-12 rounded-lg hover:bg-destructive/10 hover:text-destructive text-destructive"
                    >
                      <Link to="/auth/logout" className="flex items-center">
                        <LogOut className="mr-3 h-4 w-4" />
                        Log out
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
