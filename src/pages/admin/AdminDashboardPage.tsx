import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../../components/AdminDashboard/AdminLayout';
import { AdminHome } from '../../components/AdminDashboard/AdminHome';
import { AdminUsers } from '../../components/AdminDashboard/AdminUsers';
import { AdminTickets } from '../../components/AdminDashboard/AdminTickets';
import { AdminCompanies } from '../../components/AdminDashboard/AdminCompanies';
import { AdminDocuments } from '../../components/AdminDashboard/AdminDocuments';
import { AdminSettings } from '../../components/AdminDashboard/AdminSettings';
import { useAuthStore } from '../../store/authStore';

export const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuthStore();

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="companies" element={<AdminCompanies />} />
        <Route path="tickets" element={<AdminTickets />} />
        <Route path="documents" element={<AdminDocuments />} />
        <Route path="settings" element={<AdminSettings />} />
      </Routes>
    </AdminLayout>
  );
};