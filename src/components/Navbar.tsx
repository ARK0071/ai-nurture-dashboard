
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sun, Moon, BellRing, User, LogOut } from "lucide-react";
import { logout, getCurrentUser } from '@/lib/auth';
import { getAlertsForUser } from '@/lib/data';
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user prefers dark mode
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    // Update unread alerts count
    const user = getCurrentUser();
    if (user) {
      const alerts = getAlertsForUser(user);
      setUnreadAlerts(alerts.filter(a => !a.isRead).length);
    }
  }, []);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const user = getCurrentUser();
  
  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-card shadow-sm border-b sticky top-0 z-10">
      <div className="flex items-center space-x-2">
        <div className="bg-medical-blue text-white p-1 rounded-md">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19 8V5c0-1-1-2-2-2H7C6 3 5 4 5 5v3" />
            <path d="M5 16v3c0 1 1 2 2 2h10c1 0 2-1 2-2v-3" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="12" y1="3" x2="12" y2="21" />
          </svg>
        </div>
        <Link to="/dashboard" className="text-lg font-bold text-primary">CareVitals AI</Link>
      </div>
      
      <div className="flex items-center space-x-2">
        {user && (
          <>
            <Link to="/alerts" className="relative">
              <Button variant="ghost" size="icon">
                <BellRing className="h-5 w-5" />
                {unreadAlerts > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-status-critical" variant="destructive">
                    {unreadAlerts}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </>
        )}
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
