import React, { useState } from 'react';
import { ASSETS } from '../data/mockData';
import { ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  activeEventName: string;
  onOpenHelp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  activeEventName,
  onOpenHelp,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEventSelect, setShowEventSelect] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Viral Surge Detected',
      desc: 'David Kim\'s post just reached 84+ reactions on LinkedIn.',
      time: '4m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Stage Webhook Triggered',
      desc: 'Elena Rostova\'s quote approved and sent to Main Stage AV screens.',
      time: '12m ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Activation Milestone',
      desc: 'Reached 480+ total posts generated (80% of summit goal).',
      time: '35m ago',
      unread: false,
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff] border-b border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onViewChange('organizer-dashboard')}>
          <img
            alt="EventPulse Logo"
            className="h-8 w-auto object-contain"
            src={ASSETS.logo}
          />
          <span className="font-bold text-[19px] tracking-tight text-[#111c2d]">EventPulse</span>
          <span className="px-1.5 py-0.5 bg-[#d6e3ff] text-[#001b3d] text-[11px] font-semibold rounded tracking-wider">
            PRO
          </span>
        </div>

        {/* Central Segmented Pill Navigation */}
        <div className="flex items-center">
          <nav className="flex items-center bg-[#f0f3ff] p-1 rounded-lg border border-[#e2e8f0]/60">
            <button
              type="button"
              onClick={() => onViewChange('organizer-dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                currentView === 'organizer-dashboard'
                  ? 'bg-[#ffffff] text-[#004e99] shadow-[0_1px_3px_rgba(15,23,42,0.08)]'
                  : 'text-[#414752] hover:text-[#111c2d]'
              }`}
            >
              Organizer Dashboard
            </button>
            <button
              type="button"
              onClick={() => onViewChange('attendee-generator')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                currentView === 'attendee-generator'
                  ? 'bg-[#ffffff] text-[#004e99] shadow-[0_1px_3px_rgba(15,23,42,0.08)]'
                  : 'text-[#414752] hover:text-[#111c2d]'
              }`}
            >
              Attendee Generator
            </button>
          </nav>
        </div>

        {/* Right Actions: Event Badge, Help, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* Active Event Badge */}
          <div className="relative hidden xl:block">
            <button
              type="button"
              onClick={() => setShowEventSelect(!showEventSelect)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0f3ff] hover:bg-[#e7eeff] text-[#414752] text-xs transition-colors border border-[#dee8ff]"
            >
              <span className="material-symbols-outlined text-[16px] text-[#004e99]">event</span>
              <span>
                Active Event:{' '}
                <strong className="text-[#111c2d] font-semibold">{activeEventName}</strong>
              </span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>

            {showEventSelect && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#e2e8f0] p-2 z-50">
                <span className="block px-3 py-1 text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                  Select Event Workspace
                </span>
                <button
                  type="button"
                  onClick={() => setShowEventSelect(false)}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg bg-[#f0f3ff] text-[#004e99] font-medium flex items-center justify-between"
                >
                  <span>{activeEventName}</span>
                  <span className="w-2 h-2 rounded-full bg-[#006d3c]"></span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowEventSelect(false)}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-50 text-[#111c2d] transition-colors"
                >
                  TechPulse Global Summit (Archived)
                </button>
                <button
                  type="button"
                  onClick={() => setShowEventSelect(false)}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-50 text-[#111c2d] transition-colors"
                >
                  DevOps World Arena 2026 (Upcoming)
                </button>
              </div>
            )}
          </div>

          {/* Quick Help */}
          <button
            type="button"
            onClick={onOpenHelp}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#414752] hover:bg-[#f0f3ff] hover:text-[#111c2d] transition-colors cursor-pointer"
            title="Help & Documentation"
          >
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
          </button>

          {/* Notifications with Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#414752] hover:bg-[#f0f3ff] hover:text-[#111c2d] transition-colors cursor-pointer"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-[#e2e8f0] p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
                  <span className="font-semibold text-xs text-[#111c2d]">Live Stream Alerts</span>
                  <span className="text-[11px] text-[#004e99] hover:underline cursor-pointer">Mark all read</span>
                </div>
                <div className="divide-y divide-[#f1f5f9] mt-1 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 px-1 hover:bg-[#f8fafc] rounded-lg transition-colors cursor-pointer">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#111c2d]">{n.title}</span>
                        <span className="text-[10px] text-[#64748b]">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[#414752] mt-0.5 leading-snug">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-1 border-l border-[#e2e8f0]">
            <img
              alt="Sarah Jenkins"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#dee8ff]"
              src={ASSETS.sarahAvatar}
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs text-[#111c2d] leading-tight font-semibold">Sarah Jenkins</span>
              <span className="text-[11px] text-[#64748b] leading-tight">Head of Community</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
