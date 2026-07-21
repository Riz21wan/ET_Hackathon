import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, Baby, Users, Building2, AlertTriangle, Bell, Mail, MessageSquare, Send, Clock, CheckCircle } from 'lucide-react';
import { healthAdvisories, alerts } from '../data/mockData';

const groupIcons = { 'Children': Baby, 'Senior Citizens': Users, 'People with Respiratory Issues': HeartPulse, 'General Public': Users };
const severityColors = { critical: { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400' }, high: { bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-400' }, moderate: { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400' }, low: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400' } };
const alertTypeIcons = { SMS: MessageSquare, Email: Mail, Push: Bell };

function HealthAdvisory() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [alertLog, setAlertLog] = useState(alerts);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => { clearInterval(interval); window.removeEventListener('resize', checkMobile); };
  }, []);

  const addRandomAlert = () => {
    const types = ['SMS', 'Email', 'Push'];
    const messages = ['AQI Alert: Sudden spike in PM2.5 levels', 'Weather Update: Unfavorable conditions expected', 'Health Alert: Reduce outdoor activities today', 'System Update: New sensor calibration complete'];
    const newAlert = { id: Date.now(), type: types[Math.floor(Math.random() * types.length)], message: messages[Math.floor(Math.random() * messages.length)], time: 'Just now', status: Math.random() > 0.3 ? 'delivered' : 'pending', recipients: Math.floor(Math.random() * 100000) + 10000 };
    setAlertLog((prev) => [newAlert, ...prev].slice(0, 10));
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-3">
        <div>
          <h2 className={`font-bold text-white ${isMobile ? 'text-xl' : 'text-2xl'}`}>Health Advisory & Alerts</h2>
          <p className="text-slate-400 text-xs md:text-sm">Targeted health guidance and government alerts</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="px-2 md:px-4 py-1.5 md:py-2 glass-card flex items-center gap-1 md:gap-2">
            <Clock className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-cyan-400`} />
            <span className={`font-medium text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 border border-red-500/30 rounded-xl p-3 md:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
          <div className="p-2 md:p-3 bg-red-500/30 rounded-lg"><AlertTriangle className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-red-400`} /></div>
          <div className="flex-1">
            <h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>Active Health Alert</h3>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-slate-300`}>Air quality in Delhi NCR is currently Very Unhealthy. Sensitive groups are advised to stay indoors.</p>
          </div>
          <div className="flex items-center gap-2"><span className={`px-2 md:px-3 py-1 bg-red-500/30 text-red-400 rounded-lg text-[10px] md:text-sm font-medium`}>Severity: High</span></div>
        </div>
      </motion.div>

      <div>
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <HeartPulse className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-cyan-400`} />
          <h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>Targeted Health Advisories</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {healthAdvisories.map((advisory, idx) => {
            const colors = severityColors[advisory.severity];
            return (
              <motion.div key={advisory.group} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} onClick={() => setSelectedGroup(selectedGroup === advisory.group ? null : advisory.group)} className={`glass-card ${isMobile ? 'p-2.5' : 'p-4'} cursor-pointer transition-all hover:border-cyan-500/30 touch-manipulation ${selectedGroup === advisory.group ? 'ring-2 ring-cyan-500/50' : ''}`}>
                <div className="flex flex-col items-center text-center">
                  <div className={`${colors.bg} p-1.5 md:p-2 rounded-lg mb-1.5 md:mb-2`}><span className={`${isMobile ? 'text-lg' : 'text-xl'}`}>{advisory.icon}</span></div>
                  <h4 className={`font-semibold text-white ${isMobile ? 'text-[10px]' : 'text-sm'}`}>{advisory.group}</h4>
                  <span className={`${colors.text} ${isMobile ? 'text-[9px]' : 'text-xs'} mt-0.5`}>Risk: {advisory.severity.charAt(0).toUpperCase() + advisory.severity.slice(1)}</span>
                </div>
                <AnimatePresence>
                  {selectedGroup === advisory.group && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className={`${isMobile ? 'text-[9px]' : 'text-xs'} text-slate-400 pt-2 mt-2 border-t border-slate-700/50 leading-tight`}>{advisory.advisory}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
        <div className="lg:col-span-2 glass-card p-3 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Bell className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-cyan-400`} />
              <h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>Active Alert Log</h3>
            </div>
            <button onClick={addRandomAlert} className={`px-2 md:px-3 py-1 md:py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors flex items-center gap-1 ${isMobile ? 'text-[10px]' : 'text-sm'}`}>
              <Send className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} /><span>Test</span>
            </button>
          </div>
          <div className="space-y-2 max-h-64 md:max-h-96 overflow-y-auto">
            {alertLog.map((alert) => {
              const AlertIcon = alertTypeIcons[alert.type] || Bell;
              return (
                <motion.div key={alert.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors">
                  <div className={`p-1.5 md:p-2 rounded-lg ${alert.type === 'SMS' ? 'bg-green-500/20' : alert.type === 'Email' ? 'bg-blue-500/20' : 'bg-purple-500/20'}`}>
                    <AlertIcon className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${alert.type === 'SMS' ? 'text-green-400' : alert.type === 'Email' ? 'text-blue-400' : 'text-purple-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-white font-medium truncate ${isMobile ? 'text-xs' : 'text-sm'}`}>{alert.message}</p>
                    <div className="flex items-center gap-1 md:gap-2 mt-0.5 md:mt-1">
                      <span className={`text-slate-500 ${isMobile ? 'text-[9px]' : 'text-xs'}`}>{alert.time}</span>
                      <span className="text-slate-600 hidden md:inline">•</span>
                      <span className={`text-slate-400 ${isMobile ? 'text-[9px]' : 'text-xs'}`}>{alert.recipients.toLocaleString()} recipients</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg ${alert.status === 'delivered' ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                    {alert.status === 'delivered' ? <CheckCircle className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-emerald-400`} /> : <Clock className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-amber-400`} />}
                    <span className={`${isMobile ? 'text-[9px]' : 'text-xs'} ${alert.status === 'delivered' ? 'text-emerald-400' : 'text-amber-400'}`}>{alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-3 md:p-6">
          <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4">
            <Building2 className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-cyan-400`} />
            <h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>Sync Status</h3>
          </div>
          <div className="space-y-2 md:space-y-4">
            {[{ name: 'SMS Gateway', status: 'connected', latency: '120ms' }, { name: 'Email Service', status: 'connected', latency: '85ms' }, { name: 'Push Notifications', status: 'connected', latency: '45ms' }, { name: 'CPCB API', status: 'connected', latency: '200ms' }, { name: 'Media Channels', status: 'syncing', latency: '-' }].map((service) => (
              <div key={service.name} className="flex items-center justify-between p-2 md:p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full ${service.status === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span className={`text-white ${isMobile ? 'text-[10px]' : 'text-sm'}`}>{service.name}</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <span className={`text-slate-400 ${isMobile ? 'text-[9px]' : 'text-xs'}`}>{service.latency}</span>
                  {service.status === 'connected' ? <CheckCircle className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-emerald-400`} /> : <Clock className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-amber-400 animate-spin`} />}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-xs md:text-sm"><span className="text-slate-400">Total Alerts Today</span><span className="font-bold text-white">1,248</span></div>
            <div className="flex items-center justify-between text-xs md:text-sm mt-1.5 md:mt-2"><span className="text-slate-400">Delivery Rate</span><span className="font-bold text-emerald-400">98.7%</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
        {[
          { title: 'Advisory System Online', desc: 'All health channels active', icon: CheckCircle, color: 'emerald' },
          { title: '24.5M Citizens Subscribed', desc: 'Across all alert channels', icon: Users, color: 'cyan' },
          { title: '3 Active Health Warnings', desc: 'Delhi NCR, Lucknow, Kolkata', icon: AlertTriangle, color: 'amber' },
        ].map((item, idx) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-2.5 md:p-4 flex items-center gap-3 md:gap-4">
            <div className={`p-2 md:p-3 bg-${item.color}-500/20 rounded-lg`}><item.icon className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-${item.color}-400`} /></div>
            <div><p className={`font-medium text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>{item.title}</p><p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-slate-400`}>{item.desc}</p></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default HealthAdvisory;
