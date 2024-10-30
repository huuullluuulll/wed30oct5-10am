import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { NotificationBell } from '../components/NotificationBell';
import { useAuthStore } from '../store/authStore';
import { Menu } from 'lucide-react';

export const DashboardLayout = () => {
  const { isAuthenticated } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-primary text-white">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 right-0 z-30 w-64 glass shadow-lg 
        transform transition-transform duration-200 ease-in-out lg:transform-none
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="glass shadow-lg h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md lg:hidden text-accent hover:text-accent-light"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl lg:text-2xl font-bold text-accent mr-4">لوحة التحكم</h1>
          </div>
          <NotificationBell />
        </header>
        
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};