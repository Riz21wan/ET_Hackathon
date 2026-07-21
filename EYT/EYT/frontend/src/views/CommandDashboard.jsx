import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wind, Building2, MapPin, Activity, Gauge, AlertTriangle,
  TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { generateTimeSeriesData, cities } from '../data/mockData';

const KPICard = ({ title, value, unit, icon: Icon, trend, color, delay, isMobile }) => {
  const trendColors = {
    up: 'text-red-400',
    down: 'text-emerald-400',
    stable: 'text-slate-400',
  };
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-card p-3 md:p-4 relative overflow-hidden group hover:border-cyan-500/30 transition-all"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2 md:mb-3">
          <div className={`p-1.5 md:p-2 rounded-lg ${color}`}>
            <Icon className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
          </div>
          <div className={`flex items-center gap-1 ${trendColors[trend]}`}>
            <TrendIcon className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
            <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-medium`}>{Math.floor(Math.random() * 15 + 1)}%</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-slate-400 font-medium uppercase tracking-wider`}>{title}</p>
          <div className="flex items-baseline gap-1">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.2, type: 'spring' }}
              className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-white`}
            >
              {value.toLocaleString()}
            </motion.span>
            <span className={`${isMobile ? 'text-[10px]' : 'text-sm'} text-slate-400`}>{unit}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const getAQIColor = (aqi) => {
  if (aqi <= 50) return { bg: 'bg-emerald-500', text: 'text-emerald-400', label: 'Good' };
  if (aqi <= 100) return { bg: 'bg-yellow-500', text: 'text-yellow-400', label: 'Moderate' };
  if (aqi <= 150) return { bg: 'bg-orange-500', text: 'text-orange-400', label: 'Unhealthy for Sensitive' };
  if (aqi <= 200) return { bg: 'bg-red-500', text: 'text-red-400', label: 'Unhealthy' };
  if (aqi <= 300) return { bg: 'bg-purple-500', text: 'text-purple-400', label: 'Very Unhealthy' };
  return { bg: 'bg-rose-900', text: 'text-rose-400', label: 'Hazardous' };
};

const LoadingSkeleton = ({ isMobile }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="glass-card p-3 md:p-4">
          <div className="flex justify-between mb-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-slate-700/50 animate-pulse" />
            <div className="w-12 h-4 rounded bg-slate-700/50 animate-pulse" />
          </div>
          <div className="w-20 h-6 rounded bg-slate-700/50 animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

function CommandDashboard() {
  const [chartData, setChartData] = useState(generateTimeSeriesData(24));
  const [avgAQI, setAvgAQI] = useState(156);
  const [carbonMt, setCarbonMt] = useState(2847);
  const [monitoredCities, setMonitoredCities] = useState(28);
  const [activeSensors, setActiveSensors] = useState(1856);
  const [systemScore, setSystemScore] = useState(94);
  const [alertLevel, setAlertLevel] = useState('Moderate');
  const [loading, setLoading] = useState(true);
  const [showAllCities, setShowAllCities] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const loadTimer = setTimeout(() => setLoading(false), 800);

    const interval = setInterval(() => {
      setChartData(generateTimeSeriesData(24));
      setAvgAQI((prev) => prev + Math.floor(Math.random() * 10 - 5));
      setCarbonMt((prev) => prev + Math.floor(Math.random() * 20 - 10));
      setActiveSensors((prev) => prev + Math.floor(Math.random() * 6 - 3));
    }, 5000);

    return () => {
      clearTimeout(loadTimer);
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (loading) return <LoadingSkeleton isMobile={isMobile} />;

  const aqiColor = getAQIColor(avgAQI);
  const visibleCities = showAllCities ? cities : cities.slice(0, 5);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className={`text-xl md:text-2xl font-bold text-white`}>
            {isMobile ? 'Command Center' : 'National Command Dashboard'}
          </h2>
          <p className="text-slate-400 text-xs md:text-sm">Real-time air quality monitoring across India</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="px-3 md:px-4 py-2 glass-card flex items-center gap-2">
            <div className={`w-2 md:w-3 h-2 md:h-3 rounded-full ${aqiColor.bg} animate-pulse`} />
            <span className={`text-xs ${isMobile ? 'text-white font-medium' : 'text-sm'}`}>AQI: {avgAQI}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
        <KPICard title="Avg AQI" value={avgAQI} unit="" icon={Wind} trend="up" color="bg-gradient-to-br from-cyan-500 to-blue-600" delay={0} isMobile={isMobile} />
        <KPICard title="Carbon" value={carbonMt} unit="Mt" icon={Activity} trend="down" color="bg-gradient-to-br from-orange-500 to-red-600" delay={0.1} isMobile={isMobile} />
        <KPICard title="Cities" value={monitoredCities} unit="" icon={MapPin} trend="stable" color="bg-gradient-to-br from-emerald-500 to-teal-600" delay={0.2} isMobile={isMobile} />
        <KPICard title="Sensors" value={activeSensors} unit="" icon={Gauge} trend="up" color="bg-gradient-to-br from-violet-500 to-purple-600" delay={0.3} isMobile={isMobile} />
        <KPICard title="Score" value={systemScore} unit="%" icon={Building2} trend="stable" color="bg-gradient-to-br from-cyan-500 to-emerald-600" delay={0.4} isMobile={isMobile} />
        <KPICard title="Alerts" value={parseInt(alertLevel === 'Low' ? '1' : alertLevel === 'Moderate' ? '2' : '3', 10)} unit="" icon={AlertTriangle} trend="up" color="bg-gradient-to-br from-amber-500 to-orange-600" delay={0.5} isMobile={isMobile} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 glass-card p-3 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <h3 className={`font-semibold text-white ${isMobile ? 'text-base' : 'text-lg'}`}>AQI Trend Analysis</h3>
              <p className="text-xs md:text-sm text-slate-400">Actual vs Predicted (Last 24 Hours)</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-400" />
                <span className="text-slate-400">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-slate-400">Predicted</span>
              </div>
            </div>
          </div>
          <div className={`${isMobile ? 'h-48' : 'h-72'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={isMobile ? 8 : 10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={isMobile ? 8 : 10} width={isMobile ? 30 : 40} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(100, 116, 139, 0.3)', borderRadius: '8px', color: '#fff', fontSize: isMobile ? '11px' : '12px' }} />
                <Legend />
                <Area type="monotone" dataKey="actual" stroke="#22d3ee" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2} name="Actual AQI" />
                <Area type="monotone" dataKey="predicted" stroke="#10b981" fillOpacity={1} fill="url(#colorPredicted)" strokeWidth={2} name="Predicted AQI" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-3 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold text-white ${isMobile ? 'text-base' : 'text-lg'}`}>Critical Zones</h3>
            <span className="text-xs text-slate-400">Top Polluted</span>
          </div>
          <div className="space-y-2 md:space-y-3">
            {visibleCities.sort((a, b) => b.aqi - a.aqi).map((city, idx) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer"
              >
                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center ${isMobile ? 'text-xs' : 'text-sm'} font-bold ${
                  idx === 0 ? 'bg-red-500/20 text-red-400' : idx === 1 ? 'bg-orange-500/20 text-orange-400' : idx === 2 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-600/20 text-slate-400'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-white truncate ${isMobile ? 'text-xs' : 'text-sm'}`}>{city.name}</p>
                  {!isMobile && <p className="text-xs text-slate-400">{city.state}</p>}
                </div>
                <div className="text-right">
                  <p className={`font-bold ${getAQIColor(city.aqi).text} ${isMobile ? 'text-sm' : 'text-lg'}`}>{city.aqi}</p>
                  {!isMobile && <p className="text-xs text-slate-500">{city.healthIndex.split(' ')[0]}</p>}
                </div>
              </motion.div>
            ))}
          </div>
          {cities.length > 5 && (
            <button onClick={() => setShowAllCities(!showAllCities)} className="w-full mt-3 p-2 text-xs text-cyan-400 hover:bg-cyan-500/10 rounded-lg flex items-center justify-center gap-1">
              {showAllCities ? <>Show Less <ChevronUp className="w-3 h-3" /></> : <>Show All ({cities.length}) <ChevronDown className="w-3 h-3" /></>}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {[
          { label: 'PM2.5 Avg', value: Math.round(cities.reduce((a, c) => a + c.pm25, 0) / cities.length), unit: 'μg/m³', icon: Wind, color: 'cyan' },
          { label: 'PM10 Avg', value: Math.round(cities.reduce((a, c) => a + c.pm10, 0) / cities.length), unit: 'μg/m³', icon: Activity, color: 'emerald' },
          { label: 'NO₂ Avg', value: Math.round(cities.reduce((a, c) => a + c.no2, 0) / cities.length), unit: 'ppb', icon: Wind, color: 'amber' },
          { label: 'O₃ Avg', value: Math.round(cities.reduce((a, c) => a + c.o3, 0) / cities.length), unit: 'ppb', icon: Wind, color: 'violet' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-2 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-${stat.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-4 h-4 md:w-6 md:h-6 text-${stat.color}-400`} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] md:text-xs text-slate-400">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className={`${isMobile ? 'text-base' : 'text-xl'} font-bold text-white`}>{stat.value}</span>
                  <span className={`${isMobile ? 'text-[10px]' : 'text-sm'} text-slate-400`}>{stat.unit}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommandDashboard;
