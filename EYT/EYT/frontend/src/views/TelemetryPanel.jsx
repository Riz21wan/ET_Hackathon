import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Wind, Sun, CloudRain, Thermometer, Droplets, Zap, Activity, Gauge } from 'lucide-react';

const TelemetryItem = ({ label, value, unit, icon: Icon, trend, threshold, color, isMobile }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-red-400`} />;
      case 'down': return <TrendingDown className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-emerald-400`} />;
      default: return <Minus className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-slate-400`} />;
    }
  };

  const getStatusColor = () => {
    if (value < threshold.low) return 'text-emerald-400';
    if (value > threshold.high) return 'text-red-400';
    return 'text-amber-400';
  };

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`glass-card p-2 md:p-4 group hover:border-cyan-500/30 transition-all touch-manipulation`}>
      <div className="flex items-start justify-between mb-1.5 md:mb-3">
        <div className={`p-1.5 md:p-2 rounded-lg ${color}`}>
          <Icon className={`${isMobile ? 'w-3.5 h-3.5' : 'w-5 h-5'} text-white`} />
        </div>
        <div className="flex items-center gap-0.5">{getTrendIcon()}</div>
      </div>
      <div className="space-y-0.5 md:space-y-1">
        <p className={`${isMobile ? 'text-[9px]' : 'text-xs'} text-slate-400 font-medium uppercase tracking-wider`}>{label}</p>
        <div className="flex items-baseline gap-0.5">
          <motion.span key={value} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold ${getStatusColor()}`}>
            {value.toFixed(1)}
          </motion.span>
          <span className={`${isMobile ? 'text-[9px]' : 'text-sm'} text-slate-400`}>{unit}</span>
        </div>
      </div>
    </motion.div>
  );
};

function TelemetryPanel() {
  const [pollutants, setPollutants] = useState({
    pm25: { value: 78.4, trend: 'up' },
    pm10: { value: 112.6, trend: 'down' },
    o3: { value: 45.8, trend: 'stable' },
    co: { value: 1.2, trend: 'up' },
    no2: { value: 52.3, trend: 'up' },
    so2: { value: 18.7, trend: 'down' },
  });

  const [weather, setWeather] = useState({
    uv: { value: 6.5, trend: 'up' },
    wind: { value: 14.2, trend: 'stable' },
    rain: { value: 23.5, trend: 'down' },
    temperature: { value: 32.8, trend: 'up' },
    humidity: { value: 68.4, trend: 'down' },
    pressure: { value: 1013.2, trend: 'stable' },
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const interval = setInterval(() => {
      setPollutants((prev) => ({
        pm25: { value: Math.max(20, Math.min(200, prev.pm25.value + (Math.random() - 0.5) * 5)), trend: Math.random() > 0.5 ? 'up' : 'down' },
        pm10: { value: Math.max(30, Math.min(250, prev.pm10.value + (Math.random() - 0.5) * 8)), trend: Math.random() > 0.5 ? 'up' : 'down' },
        o3: { value: Math.max(20, Math.min(80, prev.o3.value + (Math.random() - 0.5) * 3)), trend: Math.random() > 0.6 ? 'stable' : 'up' },
        co: { value: Math.max(0.5, Math.min(3, prev.co.value + (Math.random() - 0.5) * 0.2)), trend: Math.random() > 0.6 ? 'stable' : 'down' },
        no2: { value: Math.max(20, Math.min(100, prev.no2.value + (Math.random() - 0.5) * 4)), trend: Math.random() > 0.5 ? 'up' : 'down' },
        so2: { value: Math.max(5, Math.min(50, prev.so2.value + (Math.random() - 0.5) * 2)), trend: Math.random() > 0.6 ? 'down' : 'stable' },
      }));
      setWeather((prev) => ({
        uv: { value: Math.max(1, Math.min(11, prev.uv.value + (Math.random() - 0.5) * 0.5)), trend: Math.random() > 0.7 ? 'up' : 'stable' },
        wind: { value: Math.max(2, Math.min(30, prev.wind.value + (Math.random() - 0.5) * 2)), trend: Math.random() > 0.6 ? 'stable' : 'up' },
        rain: { value: Math.max(0, Math.min(100, prev.rain.value + (Math.random() - 0.5) * 5)), trend: Math.random() > 0.5 ? 'down' : 'up' },
        temperature: { value: Math.max(15, Math.min(45, prev.temperature.value + (Math.random() - 0.5) * 0.3)), trend: Math.random() > 0.7 ? 'up' : 'stable' },
        humidity: { value: Math.max(20, Math.min(95, prev.humidity.value + (Math.random() - 0.5) * 2)), trend: Math.random() > 0.6 ? 'down' : 'stable' },
        pressure: { value: Math.max(1000, Math.min(1025, prev.pressure.value + (Math.random() - 0.5) * 0.3)), trend: Math.random() > 0.8 ? 'stable' : 'up' },
      }));
    }, 3000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const pollutantItems = [
    { key: 'pm25', label: 'PM2.5', value: pollutants.pm25.value, unit: 'μg/m³', icon: Wind, trend: pollutants.pm25.trend, threshold: { low: 35, high: 60 }, color: 'bg-gradient-to-br from-cyan-500 to-blue-600' },
    { key: 'pm10', label: 'PM10', value: pollutants.pm10.value, unit: 'μg/m³', icon: Wind, trend: pollutants.pm10.trend, threshold: { low: 50, high: 100 }, color: 'bg-gradient-to-br from-amber-500 to-orange-600' },
    { key: 'o3', label: 'O₃', value: pollutants.o3.value, unit: 'ppb', icon: Sun, trend: pollutants.o3.trend, threshold: { low: 40, high: 70 }, color: 'bg-gradient-to-br from-violet-500 to-purple-600' },
    { key: 'co', label: 'CO', value: pollutants.co.value, unit: 'ppm', icon: Gauge, trend: pollutants.co.trend, threshold: { low: 1, high: 2 }, color: 'bg-gradient-to-br from-red-500 to-rose-600' },
    { key: 'no2', label: 'NO₂', value: pollutants.no2.value, unit: 'ppb', icon: Activity, trend: pollutants.no2.trend, threshold: { low: 40, high: 80 }, color: 'bg-gradient-to-br from-orange-500 to-amber-600' },
    { key: 'so2', label: 'SO₂', value: pollutants.so2.value, unit: 'ppb', icon: Wind, trend: pollutants.so2.trend, threshold: { low: 10, high: 30 }, color: 'bg-gradient-to-br from-emerald-500 to-teal-600' },
  ];

  const weatherItems = [
    { key: 'uv', label: 'UV Index', value: weather.uv.value, unit: '', icon: Sun, trend: weather.uv.trend, threshold: { low: 3, high: 8 }, color: 'bg-gradient-to-br from-yellow-500 to-amber-600' },
    { key: 'wind', label: 'Wind', value: weather.wind.value, unit: 'km/h', icon: Wind, trend: weather.wind.trend, threshold: { low: 5, high: 25 }, color: 'bg-gradient-to-br from-teal-500 to-cyan-600' },
    { key: 'rain', label: 'Rain', value: weather.rain.value, unit: 'mm', icon: CloudRain, trend: weather.rain.trend, threshold: { low: 10, high: 50 }, color: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
    { key: 'temp', label: 'Temp', value: weather.temperature.value, unit: '°C', icon: Thermometer, trend: weather.temperature.trend, threshold: { low: 20, high: 35 }, color: 'bg-gradient-to-br from-red-500 to-orange-600' },
    { key: 'humidity', label: 'Humidity', value: weather.humidity.value, unit: '%', icon: Droplets, trend: weather.humidity.trend, threshold: { low: 40, high: 80 }, color: 'bg-gradient-to-br from-blue-500 to-cyan-600' },
    { key: 'pressure', label: 'Pressure', value: weather.pressure.value, unit: 'hPa', icon: Gauge, trend: weather.pressure.trend, threshold: { low: 1005, high: 1020 }, color: 'bg-gradient-to-br from-slate-500 to-slate-600' },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-3">
        <div>
          <h2 className={`font-bold text-white ${isMobile ? 'text-xl' : 'text-2xl'}`}>Live Telemetry Panel</h2>
          <p className="text-slate-400 text-xs md:text-sm">Real-time pollutant and weather monitoring</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="px-2 md:px-4 py-1.5 md:py-2 glass-card flex items-center gap-1 md:gap-2">
            <Zap className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-cyan-400`} />
            <span className={`font-medium text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>1Hz</span>
          </div>
          <div className="px-2 md:px-4 py-1.5 md:py-2 glass-card flex items-center gap-1 md:gap-2">
            <Activity className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-emerald-400 animate-pulse`} />
            <span className={`font-medium text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>Streaming</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <Wind className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-cyan-400`} />
          <h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>Core Pollutants</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-4">
          {pollutantItems.map((item) => (
            <TelemetryItem key={item.key} label={item.label} value={item.value} unit={item.unit} icon={item.icon} trend={item.trend} threshold={item.threshold} color={item.color} isMobile={isMobile} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <CloudRain className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-cyan-400`} />
          <h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>Meteorological Variables</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-4">
          {weatherItems.map((item) => (
            <TelemetryItem key={item.key} label={item.label} value={item.value} unit={item.unit} icon={item.icon} trend={item.trend} threshold={item.threshold} color={item.color} isMobile={isMobile} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        <div className="glass-card p-3 md:p-6">
          <h3 className={`font-semibold text-white mb-3 md:mb-4 ${isMobile ? 'text-sm' : 'text-lg'}`}>Pollutant Mix Distribution</h3>
          <div className="space-y-3 md:space-y-4">
            {[{ name: 'PM2.5', value: pollutants.pm25.value, max: 200, color: '#22d3ee' },
              { name: 'PM10', value: pollutants.pm10.value, max: 250, color: '#f59e0b' },
              { name: 'O₃', value: pollutants.o3.value, max: 100, color: '#a855f7' },
              { name: 'NO₂', value: pollutants.no2.value, max: 100, color: '#f97316' },
            ].map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span className="text-slate-400">{item.name}</span>
                  <span className="text-white font-medium">{item.value.toFixed(1)} / {item.max}</span>
                </div>
                <div className="h-1.5 md:h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ backgroundColor: item.color }} initial={{ width: 0 }} animate={{ width: `${(item.value / item.max) * 100}%` }} transition={{ duration: 0.5 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-3 md:p-6">
          <h3 className={`font-semibold text-white mb-3 md:mb-4 ${isMobile ? 'text-sm' : 'text-lg'}`}>System Health</h3>
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            {[{ label: 'Sensors', value: 1856, total: 2000, status: 'healthy' },
              { label: 'Data Centers', value: 24, total: 24, status: 'healthy' },
              { label: 'API Endpoints', value: 48, total: 50, status: 'warning' },
              { label: 'ML Models', value: 12, total: 12, status: 'healthy' },
            ].map((item) => (
              <div key={item.label} className="p-2 md:p-3 bg-slate-800/50 rounded-lg">
                <p className={`text-slate-400 ${isMobile ? 'text-[10px]' : 'text-xs'} mb-1`}>{item.label}</p>
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>{item.value}/{item.total}</span>
                  <div className={`w-2 md:w-3 h-2 md:h-3 rounded-full ${item.status === 'healthy' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-xs md:text-sm">
              <span className="text-slate-400">System Uptime</span>
              <span className="text-emerald-400 font-bold">99.97%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TelemetryPanel;
