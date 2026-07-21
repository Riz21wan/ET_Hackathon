import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingDown, AlertTriangle, Clock, CheckCircle, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, BarChart, Bar } from 'recharts';
import { forecastData, modelMetrics, generateTimeSeriesData } from '../data/mockData';

const MetricCard = ({ name, value, unit, status, description, isMobile }) => {
  const statusColors = {
    good: { bg: 'bg-emerald-500/20', ring: 'ring-emerald-500/30', text: 'text-emerald-400' },
    excellent: { bg: 'bg-cyan-500/20', ring: 'ring-cyan-500/30', text: 'text-cyan-400' },
    warning: { bg: 'bg-amber-500/20', ring: 'ring-amber-500/30', text: 'text-amber-400' },
  };
  const config = statusColors[status] || statusColors.good;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card ${isMobile ? 'p-2.5' : 'p-4'} ring-2 ${config.ring} hover:ring-4 transition-all`}>
      <div className="flex items-center justify-between mb-1.5 md:mb-2">
        <p className={`${isMobile ? 'text-[9px]' : 'text-xs'} text-slate-400 uppercase tracking-wider`}>{name}</p>
        {status === 'excellent' ? <CheckCircle className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-cyan-400`} /> : <Target className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} ${config.text}`} />}
      </div>
      <div className="flex items-baseline gap-0.5">
        <span className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold ${config.text}`}>{value}</span>
        <span className={`${isMobile ? 'text-[10px]' : 'text-sm'} text-slate-400`}>{unit}</span>
      </div>
      {!isMobile && <p className="text-xs text-slate-500 mt-2">{description}</p>}
    </motion.div>
  );
};

function AIForecast() {
  const [activeTimeline, setActiveTimeline] = useState('24h');
  const [forecastDataState, setForecastDataState] = useState(forecastData());
  const [actualVsPredicted, setActualVsPredicted] = useState(generateTimeSeriesData(24));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const interval = setInterval(() => {
      setForecastDataState(forecastData());
      setActualVsPredicted(generateTimeSeriesData(24));
    }, 10000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const timelineData = { '24h': forecastDataState.slice(0, 4), '48h': forecastDataState.slice(0, 8), '7d': forecastDataState };

  const accuracyData = [
    { day: 'Today', accuracy: 96, precision: 94 }, { day: 'Yesterday', accuracy: 94, precision: 92 },
    { day: '3 days ago', accuracy: 92, precision: 90 }, { day: '4 days ago', accuracy: 95, precision: 93 },
    { day: '5 days ago', accuracy: 93, precision: 91 }, { day: '6 days ago', accuracy: 94, precision: 92 },
    { day: '7 days ago', accuracy: 91, precision: 89 },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-3">
        <div>
          <h2 className={`font-bold text-white ${isMobile ? 'text-xl' : 'text-2xl'}`}>AI Forecast & Performance</h2>
          <p className="text-slate-400 text-xs md:text-sm">Machine learning predictions and model validation</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="px-2 md:px-4 py-1.5 md:py-2 glass-card flex items-center gap-1 md:gap-2">
            <Brain className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-cyan-400`} />
            <span className={`font-medium text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>v3.2.1</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['24h', '48h', '7d'].map((timeline) => (
          <button key={timeline} onClick={() => setActiveTimeline(timeline)} className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${activeTimeline === timeline ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white' : 'glass-card text-slate-400 hover:text-white'}`}>
            {timeline === '24h' ? '24 Hours' : timeline === '48h' ? '48 Hours' : '7 Days'}
          </button>
        ))}
      </div>

      <div className="glass-card p-3 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 gap-2">
          <div>
            <h3 className={`font-semibold text-white ${isMobile ? 'text-base' : 'text-lg'}`}>AI Forecast Timeline</h3>
            <p className="text-xs md:text-sm text-slate-400">Predicted AQI with confidence intervals</p>
          </div>
          <div className="flex items-center gap-3 md:gap-4 text-xs">
            <div className="flex items-center gap-1 md:gap-2"><div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-cyan-400" /><span className="text-slate-400">Predicted</span></div>
            <div className="flex items-center gap-1 md:gap-2"><div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-slate-500" /><span className="text-slate-400">Confidence</span></div>
          </div>
        </div>
        <div className={`${isMobile ? 'h-40' : 'h-64'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData[activeTimeline]}>
              <defs><linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} /><stop offset="95%" stopColor="#22d3ee" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={isMobile ? 8 : 10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={isMobile ? 8 : 10} width={isMobile ? 30 : 40} domain={[0, 250]} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(100, 116, 139, 0.3)', borderRadius: '8px', color: '#fff', fontSize: isMobile ? '11px' : '12px' }} />
              <Area type="monotone" dataKey="aqi" stroke="#22d3ee" fillOpacity={1} fill="url(#colorForecast)" strokeWidth={2} name="Predicted AQI" />
              <Line type="monotone" dataKey="confidence" stroke="#64748b" strokeDasharray="5 5" strokeWidth={1} name="Confidence %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <Brain className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-cyan-400`} />
          <h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>Model Validation Metrics</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {modelMetrics.map((metric, idx) => (
            <MetricCard key={metric.name} name={metric.name} value={metric.value} unit={metric.unit} status={metric.status} description={metric.description} isMobile={isMobile} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        <div className="glass-card p-3 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div><h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>Actual vs Predicted</h3><p className="text-xs text-slate-400">Last 24 hours comparison</p></div>
          </div>
          <div className={`${isMobile ? 'h-36' : 'h-56'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={actualVsPredicted}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={isMobile ? 8 : 10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={isMobile ? 8 : 10} width={isMobile ? 30 : 40} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(100, 116, 139, 0.3)', borderRadius: '8px', color: '#fff', fontSize: isMobile ? '11px' : '12px' }} />
                <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
                <Line type="monotone" dataKey="actual" stroke="#f97316" strokeWidth={2} dot={false} name="Actual" />
                <Line type="monotone" dataKey="predicted" stroke="#22d3ee" strokeWidth={2} dot={false} name="Predicted" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-3 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div><h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>Model Accuracy Trend</h3><p className="text-xs text-slate-400">Last 7 days performance</p></div>
          </div>
          <div className={`${isMobile ? 'h-36' : 'h-56'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={isMobile ? 8 : 10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={isMobile ? 8 : 10} width={isMobile ? 30 : 40} domain={[80, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(100, 116, 139, 0.3)', borderRadius: '8px', color: '#fff', fontSize: isMobile ? '11px' : '12px' }} />
                <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
                <Bar dataKey="accuracy" fill="#10b981" name="Accuracy %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="precision" fill="#22d3ee" name="Precision %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
        {[
          { title: 'Trend Prediction', value: 'Declining', icon: TrendingDown, color: 'emerald', desc: 'AQI expected to decrease by 15% over next 48 hours' },
          { title: 'Peak Hours', value: '6-10 AM', icon: AlertTriangle, color: 'amber', desc: 'Highest pollution expected during morning commute' },
          { title: 'Next Update', value: 'In 5 min', icon: Clock, color: 'cyan', desc: 'Model retraining scheduled at midnight' },
        ].map((item, idx) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className={`p-2 md:p-3 rounded-xl bg-${item.color}-500/20`}>
                <item.icon className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-${item.color}-400`} />
              </div>
              <div>
                <p className="text-xs text-slate-400">{item.title}</p>
                <p className={`font-bold text-${item.color}-400 ${isMobile ? 'text-base' : 'text-lg'}`}>{item.value}</p>
              </div>
            </div>
            {!isMobile && <p className="text-xs text-slate-500 mt-3">{item.desc}</p>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default AIForecast;
