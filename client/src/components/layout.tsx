import { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingOverlay } from "./ui/loading-overlay";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  isLoading?: boolean;
}

export default function Layout({ children, title = "Dashboard", isLoading = false }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    return () => {
      setMobileMenuOpen(false);
    };
  }, [setLocation]);

  // Add overflow-hidden to body when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [mobileMenuOpen]);

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-40 lg:hidden"
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0
        transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        z-50 lg:z-0 w-64 h-full
      `}>
        <Sidebar 
          isOpen={mobileMenuOpen || window.innerWidth >= 1024} 
          onClose={() => setMobileMenuOpen(false)} 
        />
      </div>

      {/* Main content */}
      <main className="flex-1 min-h-screen bg-neutral-50 overflow-auto w-full lg:w-[calc(100%-16rem)]">
        <LoadingOverlay isLoading={isLoading}>
          <Header 
            title={title} 
            onMenuClick={toggleMobileMenu} 
          />
          <div className="container px-4 sm:px-6 py-6 max-w-7xl mx-auto">
            {children}
          </div>
        </LoadingOverlay>
      </main>
    </div>
  );
}