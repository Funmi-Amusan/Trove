import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';

interface AuthLayoutProps {
  onLogout?: () => void;
}

export default function AuthLayout({ onLogout }: AuthLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-page-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={onLogout} />
      
      <div className="flex-1 w-full flex flex-col min-h-screen lg:pl-[260px]">
        <header className="bg-card-surface border-b border-border px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-text-neutral hover:bg-background-default rounded-full transition-colors cursor-pointer"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 min-w-0">
            <SearchBar />
          </div>
        </header>
        
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
