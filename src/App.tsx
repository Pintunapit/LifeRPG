import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { GameProvider } from './context/GameContext';
import { ChatProvider } from './context/ChatContext';
import { MainLayout } from './components/layout/MainLayout';
import { supabase } from './lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { QuestsPage } from './pages/QuestsPage';
import { WorldPage } from './pages/WorldPage';
import { CharacterPage } from './pages/CharacterPage';
import { SkillTreePage } from './pages/SkillTreePage';
import { AchievementsPage } from './pages/AchievementsPage';
import { RewardsPage } from './pages/RewardsPage';
import { InventoryPage } from './pages/InventoryPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

// Protected Route Guard
// Uses Supabase's async getSession() so the route never flash-redirects
// to /login while the session is being loaded from localStorage on mount.
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    // Resolve the current session once on mount
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    // Keep the session up-to-date on auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Still loading – render nothing to avoid flash-redirect
  if (session === undefined) return null;

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <GameProvider>
        <ChatProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected In-Game Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/quests" element={<QuestsPage />} />
              <Route path="/world" element={<WorldPage />} />
              <Route path="/character" element={<CharacterPage />} />
              <Route path="/skills" element={<SkillTreePage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        </ChatProvider>
      </GameProvider>
    </ToastProvider>
  );
};

export default App;
