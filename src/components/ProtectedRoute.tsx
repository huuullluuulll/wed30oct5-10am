// src/components/AdminDashboard/AdminLayout.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  Ticket, 
  FileText, 
  Settings,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'لوحة التحكم' },
  { path: '/admin/users', icon: Users, label: 'المستخدمين' },
  { path: '/admin/tickets', icon: Ticket, label: 'التذاكر' },
  { path: '/admin/documents', icon: FileText, label: 'المستندات' },
  { path: '/admin/settings', icon: Settings, label: 'الإعدادات' },
];

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">لوحة المشرف</h1>
        </div>
        
        <nav className="mt-6">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                location.pathname === item.path ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : ''
              }`}
            >
              <item.icon className="h-5 w-5 ml-3" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSignOut}
            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 w-full transition-colors"
          >
            <LogOut className="h-5 w-5 ml-3" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};
