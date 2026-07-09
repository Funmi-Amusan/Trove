import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, ScrollText, TrendingUp, Settings, X, LogOut, User, ChevronUp } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Portfolio', path: '/portfolio', icon: <Wallet size={20} /> },
  { name: 'Transactions', path: '/transactions', icon: <ScrollText size={20} /> },
  { name: 'Markets', path: '/markets', icon: <TrendingUp size={20} /> },
  { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
];

export default function Sidebar({ isOpen = false, onClose, onLogout }: SidebarProps) {
  const location = useLocation();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState<string>('');
  const [userInitials, setUserInitials] = useState<string>('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await portfolioService.getUser();
        setUserName(user.name);
        const initials = user.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
        setUserInitials(initials);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);



  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    }
    if (popoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [popoverOpen]);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}
      <div className={`w-[260px] bg-card-surface border-r border-border flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="px-6 py-6 flex-shrink-0 flex justify-between items-start">
          <h1 className="text-2xl font-bold text-primary mb-1">
            Trove
          </h1>
          <button 
            onClick={onClose} 
            className="lg:hidden p-1.5 -mr-2 text-text-neutral hover:bg-background-default rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

      <nav className="flex-1 px-3 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={`w-full py-3 px-4 text-sm font-medium rounded-lg cursor-pointer text-left mb-1 transition-all flex items-center gap-3 ${
              location.pathname === item.path
                ? 'text-primary bg-primary-light'
                : 'text-text-neutral hover:bg-background-default'
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="px-4 border-t border-border pt-4 pb-5 flex-shrink-0">
        {/* User card — clickable to open popover */}
        <div className="relative" ref={popoverRef}>
          {/* Popover */}
          {popoverOpen && (
            <div
              className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-border overflow-hidden shadow-lg bg-card-surface"
            >
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-default hover:bg-background-default transition-colors text-left"
                onClick={() => setPopoverOpen(false)}
              >
                <User size={16} className="text-text-neutral flex-shrink-0" />
                View profile
              </button>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-default hover:bg-background-default transition-colors text-left"
                onClick={() => setPopoverOpen(false)}
              >
                <Settings size={16} className="text-text-neutral flex-shrink-0" />
                Settings
              </button>
              <div className="border-t border-border" />
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                onClick={() => {
                  setPopoverOpen(false);
                  onLogout?.();
                }}
              >
                <LogOut size={16} className="flex-shrink-0" />
                Log out
              </button>
            </div>
          )}

          {/* Clickable user card */}
          <button
            id="user-menu-trigger"
            onClick={() => setPopoverOpen((prev) => !prev)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-left group ${
              popoverOpen
                ? 'bg-primary-light'
                : 'hover:bg-background-default'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {userInitials || 'AO'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-text-default truncate">
                {userName || 'Loading...'}
              </div>
              <div className="text-xs text-text-neutral truncate">
                Premium Member
              </div>
            </div>
            <ChevronUp
              size={16}
              className={`text-text-neutral flex-shrink-0 transition-transform duration-200 ${
                popoverOpen ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </button>
        </div>

        <button className="w-full mt-3 py-2.5 text-sm font-semibold text-primary bg-primary-light rounded-lg cursor-pointer transition-colors hover:bg-[#d0ebd1]">
          Add Funds
        </button>
      </div>
      </div>
    </>
  );
}
