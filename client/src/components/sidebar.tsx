import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { 
  HomeIcon, 
  ClipboardListIcon, 
  FileTextIcon, 
  BarChartIcon, 
  UserIcon, 
  SettingsIcon, 
  LogOutIcon, 
  FileIcon, 
  UsersIcon, 
  BookOpenIcon, 
  HeartIcon,
  BanknoteIcon,
  FilePenIcon,
  Briefcase,
  Building,
  CheckSquare,
  ChevronRightIcon
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  const isActive = (path: string) => {
    return location === path || location === path + "/";
  };

  const userInitials = `${(user?.firstName || "").charAt(0)}${(user?.lastName || "").charAt(0)}`;
  const userName = `${user?.firstName || ""} ${user?.lastName || ""}`;
  const userEmail = user?.email || "";

  return (
    <motion.aside 
      initial={{ x: -320 }}
      animate={{ x: isOpen ? 0 : -320 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "w-64 h-screen bg-white shadow-lg overflow-y-auto flex-shrink-0",
        "transform transition-transform duration-300 ease-in-out fixed lg:relative",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="p-5 border-b">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center space-x-3"
        >
          <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-white font-bold shadow-md">
            WT
          </div>
          <h1 className="text-xl font-semibold text-black">Wugweb Team</h1>
        </motion.div>
      </div>

      <div className="py-6 px-3">
        {/* Main Navigation */}
        <div className="mb-6">
          <div className="px-3 mb-3">
            <span className="text-xs font-semibold text-black/50 bg-yellow-50 px-2 py-0.5 rounded-md tracking-wider">WORKSPACE</span>
          </div>
          <nav>
            <Link 
              href="/dashboard" 
              onClick={onClose}
              className={cn(
                "flex items-center px-3 py-2.5 my-1 rounded-lg font-medium transition-all hover:bg-yellow-50 hover:text-black group",
                isActive("/dashboard") ? "text-black bg-yellow-50 font-semibold" : "text-neutral-7"
              )}
            >
              <HomeIcon className="w-5 h-5 mr-3 group-hover:text-yellow-500 transition-colors" />
              <span>Dashboard</span>
              {isActive("/dashboard") && (
                <div className="ml-auto w-1.5 h-5 bg-yellow-400 rounded-full" />
              )}
            </Link>

            <Link 
              href="/salary-slips" 
              onClick={onClose}
              className={cn(
                "flex items-center px-3 py-2.5 my-1 rounded-lg font-medium transition-all hover:bg-yellow-50 hover:text-black group",
                isActive("/salary-slips") ? "text-black bg-yellow-50 font-semibold" : "text-neutral-7"
              )}
            >
              <BanknoteIcon className="w-5 h-5 mr-3 group-hover:text-yellow-500 transition-colors" />
              <span>Payroll</span>
              {isActive("/salary-slips") && (
                <div className="ml-auto w-1.5 h-5 bg-yellow-400 rounded-full" />
              )}
            </Link>

            <Link 
              href="/self-service" 
              onClick={onClose}
              className={cn(
                "flex items-center px-3 py-2.5 my-1 rounded-lg font-medium transition-all hover:bg-yellow-50 hover:text-black group",
                isActive("/self-service") || location.startsWith("/self-service/") ? "text-black bg-yellow-50 font-semibold" : "text-neutral-7"
              )}
            >
              <FilePenIcon className="w-5 h-5 mr-3 group-hover:text-yellow-500 transition-colors" />
              <span>Self Service</span>
              {(isActive("/self-service") || location.startsWith("/self-service/")) && (
                <div className="ml-auto w-1.5 h-5 bg-yellow-400 rounded-full" />
              )}
            </Link>
          </nav>
        </div>

        {/* Company Section */}
        <div className="mb-6">
          <div className="px-3 mb-3">
            <span className="text-xs font-semibold text-black/50 bg-gray-50 px-2 py-0.5 rounded-md tracking-wider">COMPANY</span>
          </div>
          <nav>
            <Link 
              href="/employee-directory" 
              onClick={onClose}
              className={cn(
                "flex items-center px-3 py-2.5 my-1 rounded-lg font-medium transition-all hover:bg-yellow-50 hover:text-black group",
                isActive("/employee-directory") ? "text-black bg-yellow-50 font-semibold" : "text-neutral-7"
              )}
            >
              <UsersIcon className="w-5 h-5 mr-3 group-hover:text-yellow-500 transition-colors" />
              <span>Team Members</span>
              {isActive("/employee-directory") && (
                <div className="ml-auto w-1.5 h-5 bg-yellow-400 rounded-full" />
              )}
            </Link>

            <Link 
              href="/company-profile" 
              onClick={onClose}
              className={cn(
                "flex items-center px-3 py-2.5 my-1 rounded-lg font-medium transition-all hover:bg-yellow-50 hover:text-black group",
                isActive("/company-profile") ? "text-black bg-yellow-50 font-semibold" : "text-neutral-7"
              )}
            >
              <Building className="w-5 h-5 mr-3 group-hover:text-yellow-500 transition-colors" />
              <span>Company Profile</span>
              {isActive("/company-profile") && (
                <div className="ml-auto w-1.5 h-5 bg-yellow-400 rounded-full" />
              )}
            </Link>

            <Link 
              href="/key-tasks" 
              onClick={onClose}
              className={cn(
                "flex items-center px-3 py-2.5 my-1 rounded-lg font-medium transition-all hover:bg-yellow-50 hover:text-black group",
                isActive("/key-tasks") ? "text-black bg-yellow-50 font-semibold" : "text-neutral-7"
              )}
            >
              <CheckSquare className="w-5 h-5 mr-3 group-hover:text-yellow-500 transition-colors" />
              <span>Key Tasks</span>
              {isActive("/key-tasks") && (
                <div className="ml-auto w-1.5 h-5 bg-yellow-400 rounded-full" />
              )}
            </Link>
          </nav>
        </div>

        {/* Account Section */}
        <div className="mb-6">
          <div className="px-3 mb-3">
            <span className="text-xs font-semibold text-black/50 bg-yellow-50 px-2 py-0.5 rounded-md tracking-wider">PERSONAL</span>
          </div>
          <nav>
            <Link 
              href="/profile" 
              onClick={onClose}
              className={cn(
                "flex items-center px-3 py-2.5 my-1 rounded-lg font-medium transition-all hover:bg-yellow-50 hover:text-black group",
                isActive("/profile") ? "text-black bg-yellow-50 font-semibold" : "text-neutral-7"
              )}
            >
              <UserIcon className="w-5 h-5 mr-3 group-hover:text-yellow-500 transition-colors" />
              <span>My Profile</span>
              {isActive("/profile") && (
                <div className="ml-auto w-1.5 h-5 bg-yellow-400 rounded-full" />
              )}
            </Link>

            {/* Documents moved to personal section */}
            <Link 
              href="/documents" 
              onClick={onClose}
              className={cn(
                "flex items-center px-3 py-2.5 my-1 rounded-lg font-medium transition-all hover:bg-yellow-50 hover:text-black group",
                isActive("/documents") || location.startsWith("/documents/") ? "text-black bg-yellow-50 font-semibold" : "text-neutral-7"
              )}
            >
              <FileTextIcon className="w-5 h-5 mr-3 group-hover:text-yellow-500 transition-colors" />
              <span>My Documents</span>
              {(isActive("/documents") || location.startsWith("/documents/")) && (
                <div className="ml-auto w-1.5 h-5 bg-yellow-400 rounded-full" />
              )}
            </Link>

            <Link 
              href="/settings" 
              onClick={onClose}
              className={cn(
                "flex items-center px-3 py-2.5 my-1 rounded-lg font-medium transition-all hover:bg-yellow-50 hover:text-black group",
                isActive("/settings") ? "text-black bg-yellow-50 font-semibold" : "text-neutral-7"
              )}
            >
              <SettingsIcon className="w-5 h-5 mr-3 group-hover:text-yellow-500 transition-colors" />
              <span>Settings</span>
              {isActive("/settings") && (
                <div className="ml-auto w-1.5 h-5 bg-yellow-400 rounded-full" />
              )}
            </Link>
          </nav>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-0 left-0 right-0 p-5 border-t bg-neutral-50"
      >
        <div className="mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-medium overflow-hidden">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={userName}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span>{userInitials || "U"}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-black truncate">
                {userName}
              </p>
              <p className="text-xs text-neutral-600 truncate">
                {userEmail}
              </p>
            </div>
          </div>
        </div>
        <motion.button 
          whileHover={{ y: -2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
          whileTap={{ y: 0 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-black bg-yellow-400/80 hover:bg-yellow-400 transition-colors group"
        >
          <LogOutIcon className="w-5 h-5 mr-3 group-hover:transform group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Sign Out</span>
        </motion.button>
      </motion.div>
    </motion.aside>
  );
}