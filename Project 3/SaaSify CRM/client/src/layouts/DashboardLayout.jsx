import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RxDashboard,
  RxLayers,
  RxExit,
  RxSun,
  RxMoon,
  RxHamburgerMenu,
  RxCross1,
  RxPerson,
} from 'react-icons/rx';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: RxDashboard },
    { name: 'Directory CRUD', path: '/directory', icon: RxLayers },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#0b0f19]">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#0e1422] border-r border-slate-200/60 dark:border-slate-800/60">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-lg shadow-md shadow-indigo-500/20">
            S
          </div>
          <span className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">
            SaaSify CRM
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-6 rounded-r bg-indigo-600 dark:bg-indigo-500"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon
                  className={`w-5 h-5 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Footer info */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-[#0c101c]/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
              <RxPerson className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                {user?.name}
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-600 dark:bg-slate-800 dark:text-slate-400 uppercase tracking-wider">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 hover:bg-slate-105 dark:hover:bg-slate-800/50 hover:text-rose-600 dark:hover:text-rose-450 hover:border-rose-100 dark:hover:border-rose-950/30 transition-all duration-200"
          >
            <RxExit className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white dark:bg-[#0e1422] border-r border-slate-200 dark:border-slate-800 md:hidden"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-lg">
                    S
                  </div>
                  <span className="font-bold text-lg text-slate-800 dark:text-slate-100">
                    SaaSify CRM
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-105 dark:hover:bg-slate-800"
                >
                  <RxCross1 className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-1.5">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-55 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-100 text-indigo-600">
                    <RxPerson className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {user?.name}
                    </h4>
                    <span className="text-xs text-slate-400">{user?.role}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl text-sm border border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <RxExit className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 h-16 bg-white dark:bg-[#0e1422] border-b border-slate-200/60 dark:border-slate-800/60 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            >
              <RxHamburgerMenu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {location.pathname === '/'
                ? 'Dashboard'
                : 'Workspace Directory'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-200 shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <RxSun className="w-4 h-4 text-amber-400" />
              ) : (
                <RxMoon className="w-4 h-4 text-indigo-650" />
              )}
            </button>
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-semibold text-slate-500 dark:text-slate-400">
                Status:
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                LIVE
              </span>
            </div>
          </div>
        </header>

        {/* Viewport for inner routes */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50 dark:bg-[#0b0f19]/40">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
