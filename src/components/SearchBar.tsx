import { Search, Bell, HelpCircle } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="flex justify-between items-center gap-4">
      <div className="relative w-full max-w-[400px]">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-neutral">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search stocks, crypto..."
          className="w-full py-2.5 pl-12 pr-4 text-sm border border-transparent rounded-full bg-background-default text-text-default placeholder:text-text-neutral outline-none transition-all focus:border-border focus:bg-white focus:shadow-sm"
        />
      </div>
      <div className="flex items-center gap-4 text-text-neutral">
        <button className="p-2 hover:bg-background-default rounded-full transition-colors cursor-pointer">
          <Bell size={20} />
        </button>
        <button className="p-2 hover:bg-background-default rounded-full transition-colors cursor-pointer">
          <HelpCircle size={20} />
        </button>
      </div>
    </div>
  );
}
