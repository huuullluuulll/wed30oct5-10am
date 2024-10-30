import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TicketList } from '../../components/support/TicketList';
import { TicketFilters } from '../../components/support/TicketFilters';
import { Plus } from 'lucide-react';

export const SupportPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">نظام التذاكر والدعم</h1>
        <button
          onClick={() => navigate('/dashboard/support/new')}
          className="px-4 py-2 bg-accent hover:bg-accent-light text-black rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          تذكرة جديدة
        </button>
      </div>

      <TicketFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <TicketList
        searchTerm={searchTerm}
        statusFilter={statusFilter}
      />
    </div>
  );
};