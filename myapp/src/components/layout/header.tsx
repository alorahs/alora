"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { User, Settings, LogOut, Menu } from "lucide-react";
import { useIsMobile } from "../../hooks/use-mobile";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/auth_provider";
import { NotificationDropdown } from "./notification_dropdown";

const navigationItems = [
  { href: "/", label: "Home" },
  // { href: "/professionals-dashboard", label: "Dashboard" },
  { href: "/professionals", label: "Professionals" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/feedback", label: "Feedback" },

  // { href: "/faq", label: "FAQ" },
  // { href: "/help", label: "Help" },
];
const navigationItemsforProfessionals = [
  { href: "/", label: "Home" },
  { href: "/professionals-dashboard", label: "Dashboard" },
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

  // Determine which navigation items to show based on user role
  const getNavigationItems = () => {
    if (!user || user.role === "admin" || user.role === "customer") {
      return navigationItems;
    } else if (user.role === "professional") {
      return navigationItemsforProfessionals;
    }
    return navigationItems;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
      <div className="mx-auto max-w-screen-xl flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
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
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {getNavigationItems().map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side - Auth & Mobile Menu */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {!user ? (
            <div className="hidden sm:flex items-center space-x-2">
              <Button
                variant="ghost"
                asChild
                className="rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground/100 font-medium hover:bg-muted/80 transition-all duration-200"
              >
                <Link to="/auth/login">Sign In</Link>
              </Button>
              <Button
                asChild
                className="rounded-full px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary to-primary/90 shadow-lg hover:opacity-90 transition-all duration-200"
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

          {/* Mobile Menu Button */}
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
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg h-8 w-8">
                      <img
                        src="/alora-logo.png"
                        alt="Alora Logo"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <span className="font-semibold text-lg text-foreground">
                      Alora
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </div>

                {/* Mobile Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {/* User Info or Auth Options */}
                  {!user ? (
                    <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3">Welcome</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Sign in to access your account and features
                      </p>
                      <div className="flex flex-col gap-2">
                        <Button asChild className="w-full">
                          <Link
                            to="/auth/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Sign In
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                          <Link
                            to="/auth/signup"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Sign Up
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
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
                          <p className="font-semibold truncate">
                            {user.fullName}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col gap-2">
                        <Button
                          variant="outline"
                          asChild
                          className="w-full justify-start"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link to="/profile" className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          asChild
                          className="w-full justify-start"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link to="/settings" className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </Link>
                        </Button>
                        {user.role === "admin" && (
                          <Button
                            variant="outline"
                            asChild
                            className="w-full justify-start"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Link to="/admin" className="flex items-center">
                              <Settings className="mr-2 h-4 w-4" />
                              Admin Dashboard
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          asChild
                          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link to="/auth/logout" className="flex items-center">
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Navigation Menu */}
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg mb-3">Navigation</h3>
                    {getNavigationItems().map((item) => (
                      <Button
                        key={item.href}
                        variant="ghost"
                        asChild
                        className="w-full justify-start text-base font-medium h-12 rounded-lg hover:bg-muted/50"
                        onClick={() => handleNavigation(item.href)}
                      >
                        <Link to={item.href}>{item.label}</Link>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Mobile Footer */}
                <div className="p-4 border-t border-border text-center">
                  <p className="text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Alora. All rights reserved.
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
