import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { LevelUpModal } from '../modals/LevelUpModal';
import { LootChestModal } from '../modals/LootChestModal';
import { QuestCompleteOverlay } from '../modals/QuestCompleteOverlay';
import { FloatingFloater } from '../ui/FloatingFloater';
import { ToastContainer } from '../ui/ToastContainer';
import { Chatbot } from '../chatbot/Chatbot';

export const MainLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-rpg-dark text-slate-100 flex flex-col antialiased">
      {/* Sidebar (Desktop fixed, mobile off-canvas) */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen pb-16 lg:pb-0">
        {/* Sticky Header */}
        <Header onMobileMenuToggle={() => setMobileMenuOpen(true)} />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Bar */}
      <MobileNav onOpenFullMenu={() => setMobileMenuOpen(true)} />

      {/* Global Interactive Overlays */}
      <LevelUpModal />
      <LootChestModal />
      <QuestCompleteOverlay />
      <FloatingFloater />
      <ToastContainer />
      <Chatbot />
    </div>
  );
};
