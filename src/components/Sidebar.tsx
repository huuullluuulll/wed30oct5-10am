import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  Home,
  Building2,
  FileText,
  Settings,
  LogOut,
  MessageCircle,
  Boxes,
  Receipt,
  LifeBuoy
} from 'lucide-react';

export const Sidebar = () => {
  const { signOut } = useAuthStore();

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      window.location.href = '/login';
    }
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'الرئيسية' },
    { path: '/dashboard/company', icon: Building2, label: 'شركتي' },
    { path: '/dashboard/company/plans', icon: Boxes, label: 'الباقات والخدمات' },
    { path: '/dashboard/documents', icon: FileText, label: 'المستندات' },
    { path: '/dashboard/transactions', icon: Receipt, label: 'تتبع المعاملات' },
    { path: '/dashboard/support', icon: LifeBuoy, label: 'الدعم الفني' },
    { path: '/dashboard/settings', icon: Settings, label: 'الإعدادات' },
  ];

  const handleWhatsAppSupport = () => {
    window.open('https://wa.me/hulul', '_blank');
  };

  return (
    <div className="w-64 bg-[#275349] min-h-screen shadow-lg transition-colors duration-200 relative">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Boxes className="h-8 w-8 text-accent" />
          <h1 className="text-xl font-bold text-white">حلول فورميشنز</h1>
        </div>
      </div>

      <nav className="mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors ${
                isActive ? 'bg-white/10 text-white' : ''
              }`
            }
          >
            <item.icon className="h-5 w-5 ml-3" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleWhatsAppSupport}
        className="fixed bottom-8 left-8 bg-accent hover:bg-accent-light text-black p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center z-50"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute right-full ml-2 bg-gray-900 text-white px-3 py-1 rounded-lg shadow-sm whitespace-nowrap opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 ml-2">
          تواصل معنا
        </span>
      </button>

      <div className="absolute bottom-0 w-64 p-6 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex items-center text-gray-300 hover:text-white w-full transition-colors"
        >
          <LogOut className="h-5 w-5 ml-3" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
};