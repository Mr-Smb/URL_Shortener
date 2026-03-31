import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link as LinkIcon,
  Calendar,
  Edit2,
  QrCode,
  Lock,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Settings2,
  Link2,
  Copy,
  Clock,
  Shield,
  Activity
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiry, setExpiry] = useState('');
  const [redirectType, setRedirectType] = useState('301');
  const [rateLimit, setRateLimit] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [enableQr, setEnableQr] = useState(true);
  const [enablePassword, setEnablePassword] = useState(false);
  const [enableAnalytics, setEnableAnalytics] = useState(true);
  const [enableExpiry, setEnableExpiry] = useState(false);
  const [enableLimit, setEnableLimit] = useState(false);

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!longUrl.trim()) {
      setError('Please enter a valid URL!');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const payload = { url: longUrl };
      if (customAlias) payload.customAlias = customAlias;
      if (enableExpiry && expiry) payload.expiry = '24h'; // Mocked backend format mapping
      
      // Password, Rate Limit, Redirect Settings are UI-only implementations
      // But we will send customAlias and expiry
      
      const response = await axios.post(`${API_BASE_URL}/api/shorten`, payload);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while shortening the URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!result?.shortUrl) return;
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      alert('URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="px-4 py-12 flex flex-col items-center min-h-[calc(100vh-100px)] w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-3 mb-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 to-blue-700 dark:from-indigo-400 dark:to-blue-500">
          Make every link count.
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl font-medium">
          Shorten, personalize, and track your URLs seamlessly with enterprise-grade infrastructure.
        </p>
      </div>

      <div className="w-full glass-card rounded-2xl shadow-xl dark:shadow-slate-900 overflow-hidden relative">
        {/* URL Input Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <LinkIcon className="h-5 w-5 text-indigo-500 transition-transform group-focus-within:scale-110" />
            </div>
            <input
              type="url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="Paste your long URL here..."
              className="w-full pl-12 pr-4 sm:pr-36 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-lg transition-all z-10"
              disabled={loading}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-4 sm:mt-0 sm:absolute sm:inset-y-2 sm:right-2 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed z-20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Shorten URL'}
            </button>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 text-red-700 bg-red-50 border border-red-200 rounded-lg text-sm font-medium">
              {error}
            </motion.div>
          )}

          {/* Advanced Settings Toggle */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:underline"
            >
              <Settings2 className="w-4 h-4" />
              Link Settings (Advanced Panel) {isAdvancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            <AnimatePresence>
              {isAdvancedOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
                    
                    {/* Expiry Settings */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm cursor-pointer">
                          <Calendar className="w-4 h-4 text-rose-500" /> Enable Expiry
                        </label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" id="exTog" checked={enableExpiry} onChange={() => setEnableExpiry(!enableExpiry)} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                          <label htmlFor="exTog" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 dark:bg-slate-600 cursor-pointer"></label>
                        </div>
                      </div>
                      {enableExpiry && (
                         <div className="relative animate-fade-in">
                          <input type="datetime-local" value={expiry} onChange={e => setExpiry(e.target.value)} className="w-full pl-3 pr-10 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                      )}
                    </div>

                    {/* Custom Alias */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <Edit2 className="w-4 h-4 text-amber-500" /> Custom Short Link
                      </label>
                      <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 bg-slate-50 dark:bg-slate-800">
                        <span className="inline-flex items-center px-3 text-slate-500 dark:text-slate-400 text-xs border-r border-slate-200 dark:border-slate-700 select-none hidden sm:flex">
                          mydomain.com/smartlink/
                        </span>
                        <input type="text" value={customAlias} onChange={e => setCustomAlias(e.target.value)} placeholder="mylink123" className="flex-1 min-w-0 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none" />
                      </div>
                    </div>

                    {/* Password Protection */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm cursor-pointer">
                          <Lock className="w-4 h-4 text-emerald-500" /> Protect with Password
                        </label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" id="passTog" checked={enablePassword} onChange={() => setEnablePassword(!enablePassword)} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                          <label htmlFor="passTog" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 dark:bg-slate-600 cursor-pointer"></label>
                        </div>
                      </div>
                      {enablePassword && (
                        <div className="flex gap-2 animate-fade-in relative">
                           <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Secret password" className="w-full pl-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                           <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-xs font-semibold text-slate-500">
                             {showPassword ? 'Hide' : 'Show'}
                           </button>
                        </div>
                      )}
                    </div>

                    {/* Redirect Type & Custom Domain */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <Link2 className="w-4 h-4 text-teal-500" /> Redirect Settings
                      </label>
                      <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 w-full bg-white dark:bg-slate-900 text-sm">
                        <select className="w-full pl-3 py-2 text-slate-800 dark:text-slate-200 outline-none bg-transparent appearance-none" value={redirectType} onChange={e => setRedirectType(e.target.value)}>
                          <option value="301">301 Permanent Redirect</option>
                          <option value="302">302 Temporary Redirect</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Rate Limiting */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm cursor-pointer">
                          <Shield className="w-4 h-4 text-orange-500" /> Enable Rate Limiting
                        </label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" id="rlTog" checked={enableLimit} onChange={() => setEnableLimit(!enableLimit)} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                          <label htmlFor="rlTog" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 dark:bg-slate-600 cursor-pointer"></label>
                        </div>
                      </div>
                      {enableLimit && (
                        <div className="flex gap-2 animate-fade-in relative">
                           <input type="number" min="1" max="1000" value={rateLimit} onChange={e => setRateLimit(e.target.value)} placeholder="Max clicks per minute (e.g. 10)" className="w-full pl-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                      )}
                    </div>

                    {/* QR & Analytics */}
                    <div className="space-y-4 pt-2">
                       <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                          <QrCode className="w-4 h-4 text-slate-600 dark:text-slate-400" /> Generate QR Code
                        </label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" id="qrTog" checked={enableQr} onChange={() => setEnableQr(!enableQr)} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                          <label htmlFor="qrTog" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 dark:bg-slate-600 cursor-pointer"></label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                           <BarChart2 className="w-4 h-4 text-blue-500" /> Tracking (IP, Geo, Device)
                        </label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" id="anaTog" checked={enableAnalytics} onChange={() => setEnableAnalytics(!enableAnalytics)} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                          <label htmlFor="anaTog" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 dark:bg-slate-600 cursor-pointer"></label>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>

        {/* Result Card Modal */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-indigo-100 dark:border-slate-800 bg-indigo-50/50 dark:bg-slate-800/50 relative"
            >
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
                  <div className="space-y-1.5 overflow-hidden w-full flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Your Short URL</p>
                    <a href={result.shortUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold sm:text-lg break-all hover:underline">
                      {result.shortUrl}
                    </a>
                    <div className="flex items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                      <Activity className="w-3.5 h-3.5" /> status: <span className="text-emerald-500 font-semibold">Active</span> • <Clock className="w-3.5 h-3.5 ml-1" /> {enableExpiry ? expiry : 'No expiry'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                     <button onClick={copyToClipboard} className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-slate-200 dark:border-slate-600 shadow-sm">
                       <Copy className="w-4 h-4" /> Copy
                     </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="sm:col-span-2 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 pb-2">Link Details</h3>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-sm text-slate-600 dark:text-slate-400 space-y-3">
                      <div className="flex items-start gap-3">
                         <span className="font-semibold text-slate-800 dark:text-slate-200 block w-24 shrink-0">Destination:</span>
                         <span className="truncate" title={result.originalUrl}>{result.originalUrl}</span>
                      </div>
                      <div className="flex items-start gap-3">
                         <span className="font-semibold text-slate-800 dark:text-slate-200 block w-24 shrink-0">Security:</span>
                         <span>{enablePassword ? 'Password Protected 🔒' : 'Open 🔓'}</span>
                      </div>
                      <div className="flex justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                         <span className="text-xs text-slate-500">ID: {result.shortCode}</span>
                         <LinkIcon className="w-4 h-4 text-slate-300" />
                      </div>
                    </div>
                  </div>
                  
                  {enableQr && result.qrCode && (
                    <div className="flex items-center justify-center p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl overflow-hidden aspect-square">
                      <img src={result.qrCode} alt="Generated QR" className="w-32 h-32 sm:w-full sm:max-w-[160px] sm:h-auto rounded-lg object-contain bg-white" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
