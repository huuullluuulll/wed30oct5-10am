import React from 'react';
import { Lock, Bell } from 'lucide-react';

export const SettingsPage = () => {
  return (
    <div className="p-8 bg-primary min-h-screen transition-colors duration-200">
      <h1 className="text-3xl font-bold text-white mb-8">الإعدادات</h1>

      <div className="space-y-6 max-w-3xl">
        {/* Password Change */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-white">تغيير كلمة المرور</h2>
          </div>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">كلمة المرور الحالية</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md bg-gray-900/50 border border-gray-700 focus:border-accent focus:ring focus:ring-accent/20 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">كلمة المرور الجديدة</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md bg-gray-900/50 border border-gray-700 focus:border-accent focus:ring focus:ring-accent/20 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">تأكيد كلمة المرور الجديدة</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md bg-gray-900/50 border border-gray-700 focus:border-accent focus:ring focus:ring-accent/20 text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent-light focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
            >
              حفظ التغييرات
            </button>
          </form>
        </div>

        {/* Notifications */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-white">الإشعارات</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">إشعارات البريد الإلكتروني</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">إشعارات المتصفح</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};