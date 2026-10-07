import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ChatbotWidget from '../chatbot/ChatbotWidget';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout({ theme }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { role } = useAuth();

  return (
    <div className={`flex h-screen overflow-hidden bg-gray-50 ${theme ? `theme-${theme}` : ''}`}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} theme={theme} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Chatbot (for patients and specialized portals) */}
      {['PATIENT', 'PARENT', 'PREGNANT_WOMAN'].includes(role) && <ChatbotWidget portal={theme} />}
    </div>
  );
}
