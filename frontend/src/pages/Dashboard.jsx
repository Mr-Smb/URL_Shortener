import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { MousePointerClick, Globe, Monitor, Search, ExternalLink, ShieldCheck, Activity } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';
const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const [shortCode, setShortCode] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStats = async (e) => {
    e?.preventDefault();
    if (!shortCode.trim()) return;

    // cleanup shortcode if user pasted full url
    const code = shortCode.split('/').pop();

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/analytics/${code}`);
      
      // format response
      const clickData = response.data.clicks || [];
      const totalClicks = clickData.length;

      // Group by dates
      const dailyMap = {};
      const countryMap = {};
      const deviceMap = {};

      clickData.forEach(click => {
        const date = new Date(click.clicked_at).toLocaleDateString();
        dailyMap[date] = (dailyMap[date] || 0) + 1;
        countryMap[click.country || 'Unknown'] = (countryMap[click.country || 'Unknown'] || 0) + 1;
        deviceMap[click.device || 'Desktop'] = (deviceMap[click.device || 'Desktop'] || 0) + 1;
      });

      const dailyData = Object.keys(dailyMap).map(k => ({ date: k, clicks: dailyMap[k] }));
      const countryData = Object.keys(countryMap).map(k => ({ name: k, value: countryMap[k] }));
      const deviceData = Object.keys(deviceMap).map(k => ({ name: k, value: deviceMap[k] }));

      setStats({
        urlData: response.data.url,
        clicks: clickData,
        totalClicks,
        dailyData,
        countryData,
        deviceData
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Analytics not found for this link');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <Activity className="text-indigo-500 w-8 h-8" />
            Link Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Deep dive into your audience metrics and device usage</p>
        </div>

        <form onSubmit={fetchStats} className="flex rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden min-w-[300px]">
          <div className="pl-4 flex items-center bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
            placeholder="Enter tracking ID (e.g. mb24X)"
            className="w-full px-4 py-2 bg-transparent text-slate-800 dark:text-white outline-none"
          />
          <button type="submit" disabled={loading} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-70">
            {loading ? 'Searching...' : 'Analyze'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-center shadow-sm">
          {error}
        </div>
      )}

      {!stats && !error && !loading && (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <Monitor className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300">No Link Selected</h3>
          <p className="text-sm text-slate-500 mt-2">Enter a short code in the search bar above to fetch analytics.</p>
        </div>
      )}

      {stats && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-medium pb-2 border-b border-slate-200 dark:border-slate-700/50">
                <MousePointerClick className="w-5 h-5 text-indigo-500" /> Total Clicks
              </div>
              <p className="text-4xl font-bold text-slate-800 dark:text-white pt-4">{stats.totalClicks}</p>
            </div>
            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-medium pb-2 border-b border-slate-200 dark:border-slate-700/50">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Status
              </div>
              <div className="pt-4 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">Active</p>
              </div>
            </div>
            <div className="glass-card p-6 rounded-2xl sm:col-span-2 flex flex-col justify-between overflow-hidden">
               <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-medium pb-2 border-b border-slate-200 dark:border-slate-700/50">
                <ExternalLink className="w-5 h-5 text-blue-500" /> Original Destination
              </div>
              <p className="text-sm font-mono text-slate-700 dark:text-slate-300 pt-4 truncate" title={stats.urlData.original_url}>
                {stats.urlData.original_url}
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
            {/* Timeline */}
            <div className="glass-card rounded-2xl p-6 lg:col-span-2 flex flex-col">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Traffic Over Time</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecf0f1" />
                    <XAxis dataKey="date" tick={{ fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#cbd5e1' }} />
                    <YAxis tick={{ fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}/>
                    <Line type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Device Pie Chart */}
            <div className="glass-card rounded-2xl p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Device Distribution</h3>
              <div className="flex-1 min-h-0 flex items-center justify-center">
                 <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={stats.deviceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {stats.deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {stats.deviceData.map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length]}}></span>
                    {entry.name} ({entry.value})
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="glass-card rounded-2xl overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center bg-white/40 dark:bg-slate-800/40">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Recent Interactions</h3>
             </div>
             <div className="overflow-x-auto max-h-[500px] overflow-y-auto w-full">
               <table className="w-full text-left border-collapse">
                 <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 text-sm italic sticky top-0 backdrop-blur-md">
                   <tr>
                     <th className="px-6 py-4 font-semibold border-b border-slate-200 dark:border-slate-700/50">Timestamp</th>
                     <th className="px-6 py-4 font-semibold border-b border-slate-200 dark:border-slate-700/50">Location</th>
                     <th className="px-6 py-4 font-semibold border-b border-slate-200 dark:border-slate-700/50">Device / Browser</th>
                     <th className="px-6 py-4 font-semibold border-b border-slate-200 dark:border-slate-700/50">IP Address</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white/20 dark:bg-slate-900/20">
                   {stats.clicks.slice(0, 100).map((click) => (
                     <tr key={click.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                       <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">
                         {new Date(click.clicked_at).toLocaleString()}
                       </td>
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                           <Globe className="w-4 h-4 text-slate-400" />
                           <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{click.country}</span>
                           <span className="text-xs text-slate-500">({click.city})</span>
                         </div>
                       </td>
                       <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                         {click.device} • {click.browser} on {click.os}
                       </td>
                       <td className="px-6 py-4 text-sm font-mono text-slate-500">
                         {click.ip}
                       </td>
                     </tr>
                   ))}
                   {stats.clicks.length === 0 && (
                     <tr>
                       <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                         No clicks recorded yet.
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>

        </motion.div>
      )}

      {/* Grafana Integration Section */}
      <div className="mt-16 text-center border-t border-slate-200 dark:border-slate-700 pt-16">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Enterprise Grafana Analytics</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
          Deep insights powered by Prometheus & PostgreSQL. View real-time traffic spikes, global heatmaps, and advanced cohort analysis through our integrated Grafana stack.
        </p>
        <a 
          href="http://localhost:3000" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:scale-105"
        >
          <Activity className="w-5 h-5" />
          Launch Advanced Dashboard
        </a>
      </div>

    </div>
  );
}
