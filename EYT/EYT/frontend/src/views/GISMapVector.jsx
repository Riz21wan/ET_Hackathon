import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Wind, Thermometer, Droplets, Cloud, AlertCircle, ChevronRight, Search } from 'lucide-react';
import { cities } from '../data/mockData';

const getAQIColor = (aqi) => {
  if (aqi <= 50) return { bg: '#10b981', ring: 'ring-emerald-500', label: 'Good', hex: '10b981' };
  if (aqi <= 100) return { bg: '#eab308', ring: 'ring-yellow-500', label: 'Moderate', hex: 'eab308' };
  if (aqi <= 150) return { bg: '#f97316', ring: 'ring-orange-500', label: 'Unhealthy for Sensitive', hex: 'f97316' };
  if (aqi <= 200) return { bg: '#ef4444', ring: 'ring-red-500', label: 'Unhealthy', hex: 'ef4444' };
  if (aqi <= 300) return { bg: '#a855f7', ring: 'ring-purple-500', label: 'Very Unhealthy', hex: 'a855f7' };
  return { bg: '#7f1d1d', ring: 'ring-rose-900', label: 'Hazardous', hex: '7f1d1d' };
};

const MobileCitySlidePanel = ({ city, onClose }) => {
  if (!city) return null;
  const aqiColor = getAQIColor(city.aqi);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-80 glass-sidebar z-50 p-4 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-lg">
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>
        <h3 className="text-lg font-bold text-white">{city.name}</h3>
        <div className="w-10" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center p-4 rounded-lg" style={{ backgroundColor: `${aqiColor.bg}20` }}>
          <div className="text-center">
            <p className="text-5xl font-bold" style={{ color: aqiColor.bg }}>{city.aqi}</p>
            <p className="text-sm text-slate-400">Air Quality Index</p>
            <p className="text-xs mt-1" style={{ color: aqiColor.bg }}>{aqiColor.label}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[{ label: 'PM2.5', value: city.pm25, unit: 'μg/m³' }, { label: 'PM10', value: city.pm10, unit: 'μg/m³' },
            { label: 'NO₂', value: city.no2, unit: 'ppb' }, { label: 'O₃', value: city.o3, unit: 'ppb' },
            { label: 'CO', value: city.co, unit: 'ppm' }, { label: 'SO₂', value: city.so2, unit: 'ppb' },
          ].map((item) => (
            <div key={item.label} className="p-3 bg-slate-800/50 rounded-lg">
              <p className="text-xs text-slate-400">{item.label}</p>
              <p className="text-lg font-bold text-white">{item.value} <span className="text-xs text-slate-400">{item.unit}</span></p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-800/50 rounded-lg">
          <p className="text-xs text-slate-400 mb-3">Weather Conditions</p>
          <div className="grid grid-cols-2 gap-3">
            <div><p className="text-xs text-slate-500">Temperature</p><p className="text-white font-medium">{city.temperature}°C</p></div>
            <div><p className="text-xs text-slate-500">Humidity</p><p className="text-white font-medium">{city.humidity}%</p></div>
            <div><p className="text-xs text-slate-500">Wind</p><p className="text-white font-medium">{city.windSpeed} km/h</p></div>
            <div><p className="text-xs text-slate-500">Condition</p><p className="text-white font-medium">{city.weather}</p></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

function GISMapVector() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const timer = setTimeout(() => setMapLoaded(true), 800);
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        const gridSize = isMobile ? 30 : 50;
        for (let i = 0; i < canvas.width; i += gridSize) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.3, canvas.height * 0.08);
        ctx.bezierCurveTo(canvas.width * 0.37, canvas.height * 0.05, canvas.width * 0.53, canvas.height * 0.05, canvas.width * 0.63, canvas.height * 0.12);
        ctx.bezierCurveTo(canvas.width * 0.7, canvas.height * 0.16, canvas.width * 0.75, canvas.height * 0.2, canvas.width * 0.77, canvas.height * 0.27);
        ctx.bezierCurveTo(canvas.width * 0.78, canvas.height * 0.33, canvas.width * 0.73, canvas.height * 0.47, canvas.width * 0.7, canvas.height * 0.57);
        ctx.bezierCurveTo(canvas.width * 0.67, canvas.height * 0.67, canvas.width * 0.63, canvas.height * 0.75, canvas.width * 0.57, canvas.height * 0.83);
        ctx.bezierCurveTo(canvas.width * 0.5, canvas.height * 0.9, canvas.width * 0.42, canvas.height * 0.92, canvas.width * 0.33, canvas.height * 0.87);
        ctx.bezierCurveTo(canvas.width * 0.25, canvas.height * 0.83, canvas.width * 0.17, canvas.height * 0.75, canvas.width * 0.13, canvas.height * 0.63);
        ctx.bezierCurveTo(canvas.width * 0.1, canvas.height * 0.53, canvas.width * 0.07, canvas.height * 0.43, canvas.width * 0.1, canvas.height * 0.33);
        ctx.bezierCurveTo(canvas.width * 0.13, canvas.height * 0.25, canvas.width * 0.23, canvas.height * 0.13, canvas.width * 0.3, canvas.height * 0.08);
        ctx.stroke();

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.05)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  const filteredCities = searchQuery ? cities.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())) : cities;

  const aqiLegend = [
    { label: 'Good', color: '#10b981', range: '0-50' },
    { label: 'Moderate', color: '#eab308', range: '51-100' },
    { label: 'Unhealthy for Sensitive', color: '#f97316', range: '101-150' },
    { label: 'Unhealthy', color: '#ef4444', range: '151-200' },
    { label: 'Very Unhealthy', color: '#a855f7', range: '201-300' },
    { label: 'Hazardous', color: '#7f1d1d', range: '301+' },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className={`font-bold text-white ${isMobile ? 'text-xl' : 'text-2xl'}`}>GIS Map Vector</h2>
          <p className="text-slate-400 text-xs md:text-sm">Interactive air quality monitoring map</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search cities..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
        </div>
        {!isMobile && (
          <div className="flex items-center flex-wrap gap-3 md:gap-4 text-xs">
            {aqiLegend.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-400">{item.range}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative glass-card overflow-hidden" style={{ height: isMobile ? '350px' : '500px' }}>
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400 text-sm">Loading map data...</p>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {filteredCities.map((city) => {
          const aqiColor = getAQIColor(city.aqi);
          return (
            <motion.button
              key={city.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.05 * parseInt(city.id), type: 'spring' }}
              onClick={() => setSelectedCity(city)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group touch-manipulation"
              style={{ left: `${city.x}%`, top: `${city.y}%` }}
            >
              <div className={`relative ${isMobile ? 'w-7 h-7' : 'w-8 h-8'} rounded-full flex items-center justify-center ring-2 transition-all duration-300 ${aqiColor.ring}/50 group-hover:ring-4 active:ring-4`} style={{ backgroundColor: aqiColor.bg }}>
                <MapPin className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-white`} />
              </div>
            </motion.button>
          );
        })}

        <div className={`absolute bottom-3 ${isMobile ? 'left-3 right-3' : 'left-4'} glass-card p-2 md:p-4 ${isMobile ? '' : 'w-64'}`}>
          <h4 className={`font-semibold text-white mb-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>Real-time Summary</h4>
          <div className={`${isMobile ? 'grid grid-cols-4 gap-1' : 'grid grid-cols-2 gap-2'} text-xs`}>
            <div className="p-1.5 md:p-2 bg-slate-800/50 rounded">
              <p className="text-slate-400 text-[10px] md:text-xs">Highest AQI</p>
              <p className={`text-white font-medium ${isMobile ? 'text-xs' : 'text-base'}`}>{Math.max(...cities.map(c => c.aqi))}</p>
            </div>
            <div className="p-1.5 md:p-2 bg-slate-800/50 rounded">
              <p className="text-slate-400 text-[10px] md:text-xs">Lowest AQI</p>
              <p className={`text-white font-medium ${isMobile ? 'text-xs' : 'text-base'}`}>{Math.min(...cities.map(c => c.aqi))}</p>
            </div>
            <div className="p-1.5 md:p-2 bg-slate-800/50 rounded">
              <p className="text-slate-400 text-[10px] md:text-xs">Avg PM2.5</p>
              <p className={`text-white font-medium ${isMobile ? 'text-xs' : 'text-base'}`}>{Math.round(cities.reduce((a, c) => a + c.pm25, 0) / cities.length)}</p>
            </div>
            <div className="p-1.5 md:p-2 bg-slate-800/50 rounded">
              <p className="text-slate-400 text-[10px] md:text-xs">Cities</p>
              <p className={`text-white font-medium ${isMobile ? 'text-xs' : 'text-base'}`}>{cities.length}</p>
            </div>
          </div>
        </div>

        {isMobile && (
          <div className="absolute top-3 right-3 glass-card p-2">
            <div className="flex gap-1">
              {aqiLegend.slice(0, 4).map((item) => (
                <div key={item.label} className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {isMobile && (
        <AnimatePresence>
          {selectedCity && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCity(null)} className="fixed inset-0 bg-black/60 z-40" />
              <MobileCitySlidePanel city={selectedCity} onClose={() => setSelectedCity(null)} />
            </>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export default GISMapVector;
