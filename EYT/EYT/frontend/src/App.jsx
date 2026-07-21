import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  Activity,
  Brain,
  BarChart3,
  Calculator,
  HeartPulse,
  Settings,
  Bell,
  Search,
  User,
  Menu,
  X,
  ChevronRight,
  Shield,
  Database,
  FileText,
  AlertTriangle,
  ChevronLeft,
} from 'lucide-react';
import CommandDashboard from './views/CommandDashboard';
import GISMapVector from './views/GISMapVector';
import TelemetryPanel from './views/TelemetryPanel';
import AIForecast from './views/AIForecast';
import AIAnalytics from './views/AIAnalytics';
import CarbonSimulator from './views/CarbonSimulator';
import HealthAdvisory from './views/HealthAdvisory';
import AdminReports from './views/AdminReports';

const tabs = [
  { id: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard, shortLabel: 'Dashboard' },
  { id: 'gis', label: 'GIS Map Vector', icon: Map, shortLabel: 'GIS Map' },
  { id: 'telemetry', label: 'Live Telemetry', icon: Activity, shortLabel: 'Telemetry' },
  { id: 'forecast', label: 'AI Forecast', icon: Brain, shortLabel: 'Forecast' },
  { id: 'analytics', label: 'AI Analytics', icon: BarChart3, shortLabel: 'Analytics' },
  { id: 'simulator', label: 'Carbon Simulator', icon: Calculator, shortLabel: 'Simulator' },
  { id: 'health', label: 'Health Advisory', icon: HeartPulse, shortLabel: 'Health' },
  { id: 'admin', label: 'Admin & Reports', icon: Settings, shortLabel: 'Admin' },
];

const notifications = [
  { id: 1, message: 'AQI Alert: Delhi crosses 300 threshold', time: '5m ago', type: 'critical' },
  { id: 2, message: 'New sensor deployed in Bangalore', time: '1h ago', type: 'info' },
  { id: 3, message: 'Weekly report generated', time: '2h ago', type: 'success' },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [activeTab]);

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <CommandDashboard />;
      case 'gis':
        return <GISMapVector />;
      case 'telemetry':
        return <TelemetryPanel />;
      case 'forecast':
        return <AIForecast />;
      case 'analytics':
        return <AIAnalytics />;
      case 'simulator':
        return <CarbonSimulator />;
      case 'health':
        return <HealthAdvisory />;
      case 'admin':
        return <AdminReports />;
      default:
        return <CommandDashboard />;
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <motion.div
          initial={false}
          animate={{ opacity: sidebarOpen || isMobile ? 1 : 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {(sidebarOpen || isMobile) && (
            <div>
              <h1 className="font-bold text-white text-sm">NAQIC</h1>
              <p className="text-xs text-slate-400">National Air Quality Command</p>
            </div>
          )}
        </motion.div>
        {!isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>
        )}
        {isMobile && (
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 text-white'
                : 'hover:bg-slate-700/50 text-slate-400'
            }`}
          >
            <tab.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === tab.id ? 'text-cyan-400' : ''}`} />
            {(sidebarOpen || isMobile) && (
              <span className="text-sm font-medium">{isMobile ? tab.label : tab.shortLabel}</span>
            )}
            {activeTab === tab.id && (sidebarOpen || isMobile) && (
              <ChevronRight className="w-4 h-4 ml-auto text-cyan-400" />
            )}
          </motion.button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700/50">
        {(sidebarOpen || isMobile) && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Database className="w-3 h-3" />
            <span>CPCB | ISRO | Smart Cities</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      {!isMobile && (
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? 280 : 80 }}
          className="glass-sidebar h-screen sticky top-0 flex flex-col z-40 hidden md:flex"
        >
          <SidebarContent />
        </motion.aside>
      )}

      <AnimatePresence>
        {isMobile && mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-72 glass-sidebar z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 glass-card border-b border-slate-700/50 px-3 md:px-6 py-3 flex items-center justify-between gap-2">
          {isMobile && (
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-400" />
            </button>
          )}

          {isMobile && (
            <div className="flex-1 flex items-center justify-center">
              <h1 className="text-sm font-semibold text-white truncate">
                {tabs.find(t => t.id === activeTab)?.shortLabel}
              </h1>
            </div>
          )}

          {!isMobile && (
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search cities, sensors, or metrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 md:gap-4">
            {!isMobile && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">LIVE</span>
              </div>
            )}

            {isMobile && (
              <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-slate-400" />
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfile(false);
                }}
                className="relative p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <Bell className={`${isMobile ? 'w-5 h-5' : 'w-5 h-5'} text-slate-400`} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute ${isMobile ? 'right-0' : 'right-0'} top-12 w-72 md:w-80 glass-card p-2 shadow-2xl`}
                  >
                    <div className="px-3 py-2 border-b border-slate-700/50">
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="px-3 py-2 hover:bg-slate-700/50 rounded-lg cursor-pointer"
                        >
                          <div className="flex items-start gap-2">
                            {n.type === 'critical' && <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />}
                            {n.type === 'info' && <Bell className="w-4 h-4 text-cyan-400 mt-0.5" />}
                            {n.type === 'success' && <FileText className="w-4 h-4 text-emerald-400 mt-0.5" />}
                            <div>
                              <p className="text-xs text-white">{n.message}</p>
                              <p className="text-xs text-slate-500">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setShowProfile(!showProfile);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 px-2 md:px-3 py-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                {!isMobile && (
                  <div className="text-left">
                    <p className="text-xs font-medium text-white">Dr. A. Sharma</p>
                    <p className="text-xs text-slate-400">Admin Officer</p>
                  </div>
                )}
              </button>
              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute ${isMobile ? 'right-0' : 'right-0'} top-12 w-40 md:w-48 glass-card p-2 shadow-2xl`}
                  >
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 rounded-lg">
                      Profile Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 rounded-lg">
                      Preferences
                    </button>
                    <hr className="my-2 border-slate-700/50" />
                    <button className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-700/50 rounded-lg">
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {isMobile && (
          <nav className="fixed bottom-0 left-0 right-0 z-30 glass-card border-t border-slate-700/50 px-2 py-2 safe-area-inset-bottom">
            <div className="flex items-center justify-around">
              {tabs.slice(0, 5).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                    activeTab === tab.id ? 'bg-cyan-500/20' : ''
                  }`}
                >
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className={`text-[10px] ${activeTab === tab.id ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {tab.shortLabel}
                  </span>
                </button>
              ))}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg"
              >
                <Menu className="w-5 h-5 text-slate-400" />
                <span className="text-[10px] text-slate-500">More</span>
              </button>
            </div>
          </nav>
        )}

        <main className={`flex-1 ${isMobile ? 'p-3 pb-20' : 'p-6'} overflow-y-auto`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
