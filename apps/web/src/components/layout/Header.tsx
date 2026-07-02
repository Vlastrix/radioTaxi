import { Menu, Bell, User as UserIcon } from 'lucide-react';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="bg-white border-b border-slate-100 h-20 flex items-center justify-between px-4 lg:px-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-slate-800 hidden sm:block">Panel de Control</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors relative group">
          <Bell className="w-5 h-5 group-hover:animate-swing" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>
        
        <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 shadow-sm">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <UserIcon className="w-5 h-5" />
          </div>
          <div className="hidden sm:block text-sm pr-2">
            <p className="font-semibold text-slate-700">Admin User</p>
            <p className="text-slate-500 text-xs">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  );
}
