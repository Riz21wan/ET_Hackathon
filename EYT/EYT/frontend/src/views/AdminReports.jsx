import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Shield, FileText, Download, Database, Server, Brain, Activity, CheckCircle, RefreshCw } from 'lucide-react';
import { apiHealth } from '../data/mockData';

const roleConfig = {
  Admin: { color: 'text-cyan-400', bg: 'bg-cyan-500/20', permissions: ['Full Access', 'User Management', 'System Config', 'Data Export', 'API Keys'] },
  Officer: { color: 'text-amber-400', bg: 'bg-amber-500/20', permissions: ['View Dashboard', 'Generate Reports', 'Set Alerts', 'View Analytics'] },
  Public: { color: 'text-slate-400', bg: 'bg-slate-500/20', permissions: ['View Dashboard', 'View Alerts', 'Download Public Reports'] },
};

const reports = [
  { name: 'Daily Air Quality Report', format: 'PDF', size: '2.4 MB', lastGenerated: '2 hours ago' },
  { name: 'Weekly Compliance Summary', format: 'PDF', size: '5.8 MB', lastGenerated: '1 day ago' },
  { name: 'Monthly Analytics Report', format: 'Excel', size: '12.2 MB', lastGenerated: '3 days ago' },
  { name: 'City-wise Comparison', format: 'Excel', size: '8.5 MB', lastGenerated: '1 day ago' },
  { name: 'Health Impact Assessment', format: 'PDF', size: '3.1 MB', lastGenerated: '5 hours ago' },
  { name: 'Sensor Calibration Log', format: 'CSV', size: '1.2 MB', lastGenerated: '12 hours ago' },
];

const HealthRing = ({ value, max, label, color, size = 100, isMobile }) => {
  const percentage = (value / max) * 100;
  const radius = ((isMobile ? size * 0.75 : size) - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
  const actualSize = isMobile ? size * 0.75 : size;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: actualSize, height: actualSize }}>
        <svg width={actualSize} height={actualSize} viewBox={`0 0 ${actualSize} ${actualSize}`}>
          <circle cx={actualSize / 2} cy={actualSize / 2} r={radius} fill="none" stroke="#334155" strokeWidth="4" />
          <motion.circle cx={actualSize / 2} cy={actualSize / 2} r={radius} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray={strokeDasharray} initial={{ strokeDasharray: `0 ${circumference}` }} animate={{ strokeDasharray }} transition={{ duration: 1, ease: 'easeOut' }} style={{ transform: 'rotate(-90deg)', transformOrigin: `${actualSize / 2}px ${actualSize / 2}px` }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold text-white`}>{value}</span>
            <span className={`${isMobile ? 'text-[9px]' : 'text-xs'} text-slate-400 ml-0.5`}>ms</span>
          </div>
        </div>
      </div>
      <p className={`${isMobile ? 'text-[9px]' : 'text-xs'} text-slate-400 mt-1 md:mt-2 text-center truncate max-w-16 md:max-w-none`}>{label}</p>
    </div>
  );
};

function AdminReports() {
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [downloading, setDownloading] = useState(null);
  const [apiStatus, setApiStatus] = useState(apiHealth);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const refreshApiStatus = () => setApiStatus(apiHealth.map((api) => ({ ...api, latency: api.latency + Math.floor(Math.random() * 20 - 10) })));
  const handleDownload = (reportName) => { setDownloading(reportName); setTimeout(() => setDownloading(null), 2000); };
  const getHealthColor = (latency) => { if (latency < 20) return '#10b981'; if (latency < 50) return '#f59e0b'; return '#ef4444'; };
  const serviceIcons = { 'Database': Database, 'ML Service': Brain, 'Data Ingestion': Activity, 'API Gateway': Server, 'Cache Layer': RefreshCw };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-3">
        <div>
          <h2 className={`font-bold text-white ${isMobile ? 'text-xl' : 'text-2xl'}`}>Admin, Reports & API</h2>
          <p className="text-slate-400 text-xs md:text-sm">System administration and monitoring</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="px-2 md:px-4 py-1.5 md:py-2 glass-card flex items-center gap-1 md:gap-2">
            <Shield className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-cyan-400`} />
            <span className={`font-medium text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>{selectedRole} Mode</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-3 md:p-4">
        <div className="flex items-center gap-2 mb-2.5 md:mb-4">
          <User className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-cyan-400`} />
          <h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>Role Switcher</h3>
        </div>
        <div className="flex items-center gap-2">
          {['Admin', 'Officer', 'Public'].map((role) => (
            <button key={role} onClick={() => setSelectedRole(role)} className={`px-3 md:px-6 py-2 md:py-3 rounded-xl text-xs md:text-sm font-medium transition-all ${selectedRole === role ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'}`}>
              <div className="flex items-center gap-1.5 md:gap-2"><User className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} /><span>{role}</span></div>
            </button>
          ))}
        </div>
        <div className="mt-2.5 md:mt-4 p-2.5 md:p-4 bg-slate-800/30 rounded-lg">
          <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-slate-400 mb-2`}>Permissions:</p>
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {roleConfig[selectedRole].permissions.map((perm) => (
              <span key={perm} className={`px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-[10px] md:text-xs ${roleConfig[selectedRole].bg} ${roleConfig[selectedRole].color}`}>{perm}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
        <div className="glass-card p-3 md:p-6">
          <div className="flex items-center justify-between mb-2.5 md:mb-4">
            <div className="flex items-center gap-1.5 md:gap-2">
              <FileText className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-cyan-400`} />
              <h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>Report Downloader</h3>
            </div>
          </div>
          <div className="space-y-2 max-h-72 md:max-h-96 overflow-y-auto">
            {reports.map((report) => (
              <motion.div key={report.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between p-2 md:p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                  <div className={`p-1.5 md:p-2 rounded-lg flex-shrink-0 ${report.format === 'PDF' ? 'bg-red-500/20' : report.format === 'Excel' ? 'bg-emerald-500/20' : 'bg-blue-500/20'}`}>
                    <FileText className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${report.format === 'PDF' ? 'text-red-400' : report.format === 'Excel' ? 'text-emerald-400' : 'text-blue-400'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-white font-medium truncate ${isMobile ? 'text-[10px]' : 'text-sm'}`}>{report.name}</p>
                    <div className="flex items-center gap-1.5 md:gap-2 text-[9px] md:text-xs text-slate-400"><span>{report.format}</span><span>•</span><span>{report.size}</span></div>
                  </div>
                </div>
                <button onClick={() => handleDownload(report.name)} disabled={downloading === report.name} className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-sm flex items-center gap-1 transition-all flex-shrink-0 ${downloading === report.name ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'}`}>
                  {downloading === report.name ? (<><CheckCircle className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} /><span>Done</span></>) : (<><Download className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} /><span className="hidden sm:inline">Download</span></>)}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass-card p-3 md:p-6">
          <div className="flex items-center justify-between mb-2.5 md:mb-4">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Activity className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-cyan-400`} />
              <h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>API Telemetry Health</h3>
            </div>
            <button onClick={refreshApiStatus} className="p-1.5 md:p-2 hover:bg-slate-700/50 rounded-lg transition-colors"><RefreshCw className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-slate-400`} /></button>
          </div>
          <div className="grid grid-cols-5 gap-2 md:gap-4">
            {apiStatus.map((api) => {
              const Icon = serviceIcons[api.service] || Server;
              return (
                <motion.div key={api.service} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                  <HealthRing value={api.latency} max={100} label={api.service} color={getHealthColor(api.latency)} size={isMobile ? 60 : 80} isMobile={isMobile} />
                  <div className={`mt-1 w-1.5 md:w-2 h-1.5 md:h-2 rounded-full ${api.status === 'healthy' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </motion.div>
              );
            })}
          </div>
          <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-slate-700/50">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="p-2.5 md:p-3 bg-slate-800/50 rounded-lg">
                <p className={`${isMobile ? 'text-[9px]' : 'text-xs'} text-slate-400`}>Avg Latency</p>
                <p className={`font-bold text-white ${isMobile ? 'text-lg' : 'text-xl'}`}>{Math.round(apiStatus.reduce((a, b) => a + b.latency, 0) / apiStatus.length)}ms</p>
              </div>
              <div className="p-2.5 md:p-3 bg-slate-800/50 rounded-lg">
                <p className={`${isMobile ? 'text-[9px]' : 'text-xs'} text-slate-400`}>System Uptime</p>
                <p className={`font-bold text-emerald-400 ${isMobile ? 'text-lg' : 'text-xl'}`}>{(Math.min(...apiStatus.map(a => a.uptime))).toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {[
          { title: 'System Status', value: 'Operational', icon: CheckCircle, color: 'emerald' },
          { title: 'Database', value: 'PostgreSQL 15.2', icon: Database, color: 'cyan' },
          { title: 'ML Pipeline', value: 'v3.2.1', icon: Brain, color: 'amber' },
          { title: 'API Endpoints', value: '48 Active', icon: Server, color: 'violet' },
        ].map((item, idx) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-2.5 md:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <div className={`p-1.5 md:p-2 bg-${item.color}-500/20 rounded-lg`}><item.icon className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-${item.color}-400`} /></div>
                <div className="min-w-0">
                  <p className={`font-medium text-white truncate ${isMobile ? 'text-[10px]' : 'text-sm'}`}>{item.title}</p>
                  <p className={`${isMobile ? 'text-[9px]' : 'text-xs'} text-slate-400`}>{item.value}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-3 md:p-6">
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <Settings className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-cyan-400`} />
          <h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {[{ label: 'Clear Cache', icon: RefreshCw }, { label: 'Sync Sensors', icon: Database }, { label: 'Backup Data', icon: Download }, { label: 'System Logs', icon: FileText }].map((action) => (
            <button key={action.label} className="p-3 md:p-4 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors flex flex-col items-center gap-1.5 md:gap-2 touch-manipulation">
              <action.icon className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-slate-400`} />
              <span className={`font-medium text-white ${isMobile ? 'text-[10px]' : 'text-sm'}`}>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminReports;
