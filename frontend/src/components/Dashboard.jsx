import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./dashboard_components/Sidebar";
import { TopBar } from "./dashboard_components/TopBar";
import { ActivityPanel } from "./dashboard_components/ActivityPanel";

// Import your sidebar pages
import MeetingsPage from "./dashboard_components/MeetingsPage";
import CalenderPage from "./dashboard_components/CalenderPage";
import ChatsTab from "./dashboard_components/ChatsTab";
import SettingsPage from "./dashboard_components/SettingsPage";
import Communities from "./dashboard_components/Communities";
import ActiveCall from "./ActiveCall";

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#121212] text-white overflow-hidden relative">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content with Nested Routing */}
        <main className="flex-1 overflow-hidden bg-[#1a1a1a]">
          <Routes>
            {/* Default route redirects to /dashboard/chat */}
            <Route path="/" element={<Navigate to="chat" replace />} />

            {/* Full width routes without padding */}
            <Route path="communities" element={<Communities />} />
            <Route path="chat" element={<ChatsTab />} />
            <Route path="active-call/:callId" element={<ActiveCall />} />
            <Route path="active-call" element={<ActiveCall />} />
            <Route path="/activity" element={<ActivityPanel />} />

            {/* Other routes with padding */}
            <Route
              path="*"
              element={
                <div className="max-w-6xl mx-auto p-6 sm:p-8">
                  <Routes>
                    <Route path="meet" element={<MeetingsPage />} />
                    <Route path="calendar" element={<CalenderPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Routes>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
