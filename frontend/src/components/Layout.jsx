import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Link2, LayoutDashboard, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Layout({ children, darkMode, toggleTheme }) {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Shorten', icon: <Link2 className="w-4 h-4" /> },
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <header className="sticky top-0 z-50 glass-panel border-b-0 border-t-0 shadow-sm border-x-0">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg group-hover:scale-105 transition-transform">
              <Link2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300">
              LinkShrink
            </span>
          </Link>

          {/* Nav & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-6">
            <nav className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">
              {navLinks.map(link => {
                const isActive = location.pathname === link.path;
                return (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-blue-700 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                  >
                    {isActive && (
                      <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white dark:bg-slate-700 rounded-md shadow-sm border border-slate-200/50 dark:border-slate-600/50" />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {link.icon}
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 text-sm font-medium px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md transition-colors">
              <Activity className="w-4 h-4" />
              Grafana
            </a>

            <button onClick={toggleTheme} className="p-2.5 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-amber-400 transition-colors" aria-label="Toggle Theme">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="sm:hidden flex items-center justify-center p-3 gap-2 overflow-x-auto bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
           {navLinks.map(link => (
             <Link key={link.path} to={link.path} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${location.pathname === link.path ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>
               {link.icon} {link.label}
             </Link>
           ))}
           <a href="http://localhost:3000" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400">
             <Activity className="w-4 h-4" /> Grafana
           </a>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>

      <footer className="mt-12 py-6 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
        <p>© {new Date().getFullYear()} LinkShrink — Production-Grade URL Shortener</p>
      </footer>
    </div>
  );
}
