import { BellIcon, MenuIcon, HelpCircleIcon, SearchIcon, ChevronDownIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import { getInitials, formatDateTime } from "@/lib/utils";
import UserMenu from "./user-menu";
import { Breadcrumbs } from "./breadcrumbs";
import wugwebLogo from "../assets/wugweb-logo.png";
import { motion } from "framer-motion";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle outside clicks for search
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Mock notifications count - in a real app, this would come from an API
  const notificationsCount = 3;

  if (!user) return null;

  const initials = getInitials(user.firstName, user.lastName);
  const lastLoginTime = user.lastLogin ? formatDateTime(user.lastLogin) : "Unknown";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={onMenuClick} 
            className="lg:hidden mr-3 text-black hover:bg-gray-100 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
            aria-label="Toggle menu"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search */}
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger asChild>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center text-black hover:bg-gray-100 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
                aria-label="Search"
              >
                <SearchIcon className="w-5 h-5" />
              </motion.button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-medium" />
                <Input 
                  ref={searchInputRef}
                  placeholder="Search..." 
                  className="pl-10 rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="p-4 border-t">
                <h4 className="text-sm font-medium mb-2">Recent Searches</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded-md cursor-pointer">
                    <span className="text-neutral-dark flex items-center">
                      <SearchIcon className="w-3 h-3 mr-2 text-neutral-medium" />
                      Salary structure
                    </span>
                    <span className="text-xs text-neutral-medium">1d ago</span>
                  </div>
                  <div className="flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded-md cursor-pointer">
                    <span className="text-neutral-dark flex items-center">
                      <SearchIcon className="w-3 h-3 mr-2 text-neutral-medium" />
                      Holiday policy
                    </span>
                    <span className="text-xs text-neutral-medium">3d ago</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Help Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center text-black hover:bg-gray-100 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
                  aria-label="Help"
                >
                  <HelpCircleIcon className="w-5 h-5" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Help & Resources</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Notifications Button */}
          <Popover>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center text-black hover:bg-gray-100 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400/40 relative"
                      aria-label="Notifications"
                    >
                      <BellIcon className="w-5 h-5" />
                      {notificationsCount > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-yellow-400 text-black"
                        >
                          {notificationsCount}
                        </Badge>
                      )}
                    </motion.button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Notifications</h4>
                  <button className="text-xs text-black hover:underline">
                    Mark all as read
                  </button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors border-l-2 border-l-yellow-400">
                  <div className="flex items-start">
                    <div className="bg-yellow-400/10 p-2 rounded-full mr-3">
                      <BellIcon className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Your document has been verified</p>
                      <p className="text-xs text-neutral-medium mt-1">Your Aadhaar document has been verified by the admin.</p>
                      <p className="text-xs text-neutral-medium mt-1">1 hour ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-start">
                    <div className="bg-neutral-100 p-2 rounded-full mr-3">
                      <BellIcon className="w-4 h-4 text-neutral-medium" />
                    </div>
                    <div>
                      <p className="text-sm">April 2025 salary slip is ready</p>
                      <p className="text-xs text-neutral-medium mt-1">Your salary slip for April 2025 is now available.</p>
                      <p className="text-xs text-neutral-medium mt-1">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 text-center border-t">
                <button className="text-sm text-black font-medium hover:underline">
                  View all notifications
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* User Menu */}
          <div className="relative">
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 rounded-full pl-2" 
              id="user-menu-button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white overflow-hidden shadow-sm border-2 border-white">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-medium">{initials}</span>
                )}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium">{`${user.firstName} ${user.lastName}`}</div>
              </div>
              <ChevronDownIcon className="w-4 h-4 text-black hidden md:block" />
            </motion.button>

            {userMenuOpen && (
              <UserMenu onClose={() => setUserMenuOpen(false)} />
            )}
          </div>
        </div>
      </div>

      {/* Title and Breadcrumbs - Moved below header */}
      <div className="px-4 sm:px-6 lg:px-8 py-3 border-t">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
          <div className="flex items-center gap-3 mb-2 sm:mb-0">
            <h2 className="text-xl font-heading font-semibold">{title}</h2>
          </div>
          <Breadcrumbs />
        </div>
      </div>
    </header>
  );
}