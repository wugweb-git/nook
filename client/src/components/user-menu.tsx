import { useRef, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { UserIcon, SettingsIcon, LogOutIcon, FileTextIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UserMenuProps {
  onClose: () => void;
}

export default function UserMenu({ onClose }: UserMenuProps) {
  const { user, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    logout();
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  
  if (!user) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        ref={menuRef}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
      >
        <div className="px-4 py-3 border-b">
          <p className="text-sm font-semibold text-black">{`${user.firstName} ${user.lastName}`}</p>
          <p className="text-xs text-neutral-medium mt-1">{user.email}</p>
        </div>
        
        <Link 
          href="/profile" 
          className="block px-4 py-2.5 text-sm text-neutral-dark hover:bg-yellow-50 hover:text-black transition-colors"
          onClick={onClose}
        >
          <div className="flex items-center">
            <UserIcon className="w-4 h-4 mr-3" />
            <span>My Profile</span>
          </div>
        </Link>
        
        <Link 
          href="/documents" 
          className="block px-4 py-2.5 text-sm text-neutral-dark hover:bg-yellow-50 hover:text-black transition-colors"
          onClick={onClose}
        >
          <div className="flex items-center">
            <FileTextIcon className="w-4 h-4 mr-3" />
            <span>My Documents</span>
          </div>
        </Link>
        
        <Link 
          href="/settings"
          className="block px-4 py-2.5 text-sm text-neutral-dark hover:bg-yellow-50 hover:text-black transition-colors"
          onClick={onClose}
        >
          <div className="flex items-center">
            <SettingsIcon className="w-4 h-4 mr-3" />
            <span>Settings</span>
          </div>
        </Link>
        
        <div className="border-t my-1"></div>
        
        <a 
          href="#"
          className="block px-4 py-2.5 text-sm text-neutral-dark hover:bg-gray-50 hover:text-black transition-colors"
          onClick={handleLogout}
        >
          <div className="flex items-center">
            <LogOutIcon className="w-4 h-4 mr-3" />
            <span>Sign Out</span>
          </div>
        </a>
      </motion.div>
    </AnimatePresence>
  );
}
