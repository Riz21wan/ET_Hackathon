import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertCircle, Lightbulb, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { sourceAttribution, weeklyTrend, cities } from '../data/mockData';

const aiInsights = [
  { title: 'Traffic Impact Analysis', content: 'Traffic contributes 35% to overall pollution levels. Peak hour emissions (6-10 AM) account for 42% of daily PM2.5 concentration. Implementing odd-even scheme could reduce peak hour emissions by 18-22%.', type: 'analysis' },
  { title: 'Industrial Cluster Effect', content: 'Northern industrial belt (Delhi NCR, Lucknow corridor) shows consistent SO2 and NO2 elevation. Correlation coefficient: 0.87 between industrial activity and regional AQI.', type: 'warning' },
  { title: 'Biomass Burning Pattern', content: 'Seasonal stubble burning detected in Punjab-Haryana region. Estimated contribution: 25% of October-November pollution spikes.', type: 'insight' },
  { title: 'Dust Storm Correlation', content: 'Trans-boundary dust from Thar Desert affects western cities during March-May. PM10 levels surge 150% during storm events.', type: 'insight' },
];

const cityPollutantBreakdown = cities.slice(0, 6).map((city) => ({ name: city.name, pm25: city.pm25, pm10: city.pm10, no2: city.no2, o3: city.o3 }));

const radarData = [
  { metric: 'Traffic', value: 85, fullMark: 100 }, { metric: 'Industry', value: 72, fullMark: 100 },
  { metric: 'Biomass', value: 45, fullMark: 100 }, { metric: 'Dust', value: 60, fullMark: 100 },
  { metric: 'Construction', value: 38, fullMark: 100 }, { metric: 'Domestic', value: 25, fullMark: 100 },
];

function AIAnalytics() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-3">
        <div>
          <h2 className={`font-bold text-white ${isMobile ? 'text-xl' : 'text-2xl'}`}>AI Analytics</h2>
          <p className="text-slate-400 text-xs md:text-sm">Source attribution and AI-generated insights</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="px-2 md:px-4 py-1.5 md:py-2 glass-card flex items-center gap-1 md:gap-2">
            <Brain className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-cyan-400`} />
            <span className={`font-medium text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>Auto-Generated</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
        <div className="glass-card p-3 md:p-6">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <BarChart3 className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-cyan-400`} />
            <h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>Source Attribution</h3>
          </div>
          <div className={`${isMobile ? 'h-48' : 'h-64'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceAttribution} cx="50%" cy="50%" innerRadius={isMobile ? 35 : 50} outerRadius={isMobile ? 55 : 80} fill="#8884d8" paddingAngle={3} dataKey="value">
                  {sourceAttribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(100, 116, 139, 0.3)', borderRadius: '8px', color: '#fff', fontSize: isMobile ? '11px' : '12px' }} formatter={(value) => [`${value}%`, 'Contribution']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3 md:mt-4">
            {sourceAttribution.map((source) => (
              <div key={source.name} className="flex items-center gap-1.5 text-[10px] md:text-xs">
                <div className="w-2 md:w-3 h-2 md:h-3 rounded-full flex-shrink-0" style={{ backgroundColor: source.color }} />
                <span className="text-slate-400 truncate">{source.name}</span>
                <span className="text-white font-medium ml-auto">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-3 md:p-6">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <TrendingUp className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-cyan-400`} />
            <h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>Activity Metrics</h3>
          </div>
          <div className={`${isMobile ? 'h-48' : 'h-64'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius={isMobile ? '60%' : '80%'} data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: isMobile ? 8 : 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                <Radar name="Current" dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-3 md:p-6">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <BarChart3 className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-cyan-400`} />
            <h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>Weekly Pattern</h3>
          </div>
          <div className={`${isMobile ? 'h-48' : 'h-64'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={isMobile ? 8 : 10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={isMobile ? 8 : 10} width={isMobile ? 25 : 40} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(100, 116, 139, 0.3)', borderRadius: '8px', color: '#fff', fontSize: isMobile ? '11px' : '12px' }} />
                <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
                <Bar dataKey="pm25" fill="#22d3ee" name="PM2.5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pm10" fill="#f59e0b" name="PM10" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card p-3 md:p-6">
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <BarChart3 className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-cyan-400`} />
          <h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>City-wise Pollutant Distribution</h3>
        </div>
        <div className={`${isMobile ? 'h-56' : 'h-72'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cityPollutantBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#64748b" fontSize={isMobile ? 8 : 10} />
              <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={isMobile ? 8 : 10} width={isMobile ? 50 : 80} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(100, 116, 139, 0.3)', borderRadius: '8px', color: '#fff', fontSize: isMobile ? '11px' : '12px' }} />
              <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
              <Bar dataKey="pm25" fill="#22d3ee" name="PM2.5" stackId="a" />
              <Bar dataKey="pm10" fill="#f59e0b" name="PM10" stackId="a" />
              <Bar dataKey="no2" fill="#ef4444" name="NO2" stackId="a" />
              <Bar dataKey="o3" fill="#a855f7" name="O3" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <Brain className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-cyan-400`} />
          <h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>AI-Generated Narratives</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          {aiInsights.map((insight, idx) => (
            <motion.div key={insight.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-3 md:p-4 hover:border-cyan-500/30 transition-all">
              <div className="flex items-start gap-2 md:gap-3">
                <div className={`p-1.5 md:p-2 rounded-lg ${insight.type === 'warning' ? 'bg-red-500/20' : insight.type === 'insight' ? 'bg-emerald-500/20' : 'bg-cyan-500/20'}`}>
                  {insight.type === 'warning' ? <AlertCircle className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-red-400`} /> : insight.type === 'insight' ? <Lightbulb className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-emerald-400`} /> : <Brain className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-cyan-400`} />}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 ${isMobile ? 'text-xs' : 'text-sm'} ${insight.type === 'warning' ? 'text-red-400' : insight.type === 'insight' ? 'text-emerald-400' : 'text-cyan-400'}`}>{insight.title}</h4>
                  <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-slate-400 leading-relaxed`}>{insight.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIAnalytics;
