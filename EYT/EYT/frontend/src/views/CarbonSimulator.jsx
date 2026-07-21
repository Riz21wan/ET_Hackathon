import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Car, Factory, Leaf, Battery, TrendingUp, TrendingDown, Heart, Activity, Wind } from 'lucide-react';
import { scenarioPresets } from '../data/mockData';

const GaugeMeter = ({ value, max, label, color, size = 100, isMobile }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const angle = (percentage / 100) * 180 - 90;
  const actualSize = isMobile ? size * 0.75 : size;

  return (
    <div className="flex flex-col items-center">
      <svg width={actualSize} height={actualSize * 0.67} viewBox={`0 0 ${actualSize} ${actualSize * 0.67}`}>
        <defs><linearGradient id={`gaugeGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#10b981" /><stop offset="50%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#ef4444" /></linearGradient></defs>
        <path d={`M ${actualSize * 0.17} ${actualSize * 0.58} A ${actualSize * 0.33} ${actualSize * 0.33} 0 0 1 ${actualSize * 0.83} ${actualSize * 0.58}`} fill="none" stroke="#334155" strokeWidth={isMobile ? 6 : 8} strokeLinecap="round" />
        <motion.path d={`M ${actualSize * 0.17} ${actualSize * 0.58} A ${actualSize * 0.33} ${actualSize * 0.33} 0 0 1 ${actualSize * 0.83} ${actualSize * 0.58}`} fill="none" stroke={`url(#gaugeGrad-${color})`} strokeWidth={isMobile ? 6 : 8} strokeLinecap="round" strokeDasharray={`${percentage * 1.26 * (actualSize / 100)} 200`} initial={{ strokeDasharray: '0 200' }} animate={{ strokeDasharray: `${percentage * 1.26 * (actualSize / 100)} 200` }} transition={{ duration: 1, ease: 'easeOut' }} />
        <motion.text x="50%" y="45%" textAnchor="middle" fill="white" fontSize={isMobile ? 12 : 16} fontWeight="bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>{value.toFixed(0)}</motion.text>
        <motion.g initial={{ rotate: -90 }} animate={{ rotate: angle }} transition={{ duration: 1, ease: 'easeOut' }} style={{ transformOrigin: `${actualSize / 2}px ${actualSize * 0.58}px` }}>
          <line x1={actualSize / 2} y1={actualSize * 0.58} x2={actualSize / 2} y2={actualSize * 0.33} stroke="white" strokeWidth={isMobile ? 1.5 : 2} strokeLinecap="round" />
          <circle cx={actualSize / 2} cy={actualSize * 0.58} r={isMobile ? 2 : 4} fill="white" />
        </motion.g>
      </svg>
      <div className="text-center mt-1"><p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-slate-400`}>{label}</p></div>
    </div>
  );
};

const SliderControl = ({ label, value, min, max, unit, icon: Icon, color, onChange, isMobile }) => (
  <div className="glass-card p-2.5 md:p-4">
    <div className="flex items-center gap-2 md:gap-3 mb-2.5 md:mb-4">
      <div className={`p-1.5 md:p-2 rounded-lg ${color}`}><Icon className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-white`} /></div>
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>{label}</p>
        <p className={`text-slate-400 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>Target: {value} {unit}</p>
      </div>
      <div className="text-right">
        <motion.span key={value} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`font-bold text-white ${isMobile ? 'text-lg' : 'text-xl'}`}>{value}</motion.span>
        <span className={`${isMobile ? 'text-[10px]' : 'text-sm'} text-slate-400 ml-0.5`}>{unit}</span>
      </div>
    </div>
    <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb touch-manipulation" style={{ background: `linear-gradient(to right, ${color.includes('cyan') ? '#22d3ee' : color.includes('orange') ? '#f97316' : color.includes('emerald') ? '#10b981' : '#a855f7'} 0%, ${color.includes('cyan') ? '#22d3ee' : color.includes('orange') ? '#f97316' : color.includes('emerald') ? '#10b981' : '#a855f7'} ${((value - min) / (max - min)) * 100}%, #334155 ${((value - min) / (max - min)) * 100}%, #334155 100%)` }} />
    <div className="flex justify-between text-[10px] md:text-xs text-slate-500 mt-1"><span>{min}</span><span>{max}</span></div>
  </div>
);

function CarbonSimulator() {
  const [trafficReduction, setTrafficReduction] = useState(scenarioPresets.traffic.default);
  const [industryReduction, setIndustryReduction] = useState(scenarioPresets.industry.default);
  const [evAdoption, setEvAdoption] = useState(scenarioPresets.evAdoption.default);
  const [greenCover, setGreenCover] = useState(scenarioPresets.greenCover.default);
  const [projectedAQI, setProjectedAQI] = useState(156);
  const [carbonSaved, setCarbonSaved] = useState(0);
  const [healthImpact, setHealthImpact] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const baseAQI = 156;
    const reduction = trafficReduction * 0.8 + industryReduction * 0.6 + evAdoption * 0.3 + (greenCover - 22) * 1.5;
    setProjectedAQI(Math.max(50, Math.round(baseAQI - reduction)));
    const totalReduction = (trafficReduction * 0.35 + industryReduction * 0.28 + evAdoption * 0.05) * 12.5;
    setCarbonSaved(Math.round(totalReduction * 100) / 100);
    setHealthImpact(Math.round(((baseAQI - Math.max(50, baseAQI - reduction)) / baseAQI) * 100 * 10) / 10);
  }, [trafficReduction, industryReduction, evAdoption, greenCover]);

  const getAQIStatus = (aqi) => {
    if (aqi <= 50) return { label: 'Good', color: 'text-emerald-400' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-400' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'text-orange-400' };
    if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-400' };
    return { label: 'Very Unhealthy', color: 'text-purple-400' };
  };

  const aqiStatus = getAQIStatus(projectedAQI);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-3">
        <div>
          <h2 className={`font-bold text-white ${isMobile ? 'text-xl' : 'text-2xl'}`}>Carbon & Scenario Simulator</h2>
          <p className="text-slate-400 text-xs md:text-sm">Model intervention impact on air quality</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="px-2 md:px-4 py-1.5 md:py-2 glass-card flex items-center gap-1 md:gap-2">
            <Calculator className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-cyan-400`} />
            <span className={`font-medium text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>Interactive Model</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
        <SliderControl label="Traffic Reduction" value={trafficReduction} min={scenarioPresets.traffic.min} max={scenarioPresets.traffic.max} unit="%" icon={Car} color="bg-gradient-to-br from-cyan-500 to-blue-600" onChange={setTrafficReduction} isMobile={isMobile} />
        <SliderControl label="Industry Emission Cut" value={industryReduction} min={scenarioPresets.industry.min} max={scenarioPresets.industry.max} unit="%" icon={Factory} color="bg-gradient-to-br from-orange-500 to-red-600" onChange={setIndustryReduction} isMobile={isMobile} />
        <SliderControl label="EV Adoption Rate" value={evAdoption} min={scenarioPresets.evAdoption.min} max={scenarioPresets.evAdoption.max} unit="%" icon={Battery} color="bg-gradient-to-br from-emerald-500 to-teal-600" onChange={setEvAdoption} isMobile={isMobile} />
        <SliderControl label="Green Cover" value={greenCover} min={scenarioPresets.greenCover.min} max={scenarioPresets.greenCover.max} unit="%" icon={Leaf} color="bg-gradient-to-br from-emerald-500 to-green-600" onChange={setGreenCover} isMobile={isMobile} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        <div className="glass-card p-3 md:p-6 flex flex-col items-center justify-center">
          <h3 className={`font-semibold text-white mb-3 md:mb-6 ${isMobile ? 'text-sm' : 'text-lg'}`}>Projected AQI</h3>
          <GaugeMeter value={projectedAQI} max={300} label="Air Quality Index" color={aqiStatus.color} size={isMobile ? 100 : 120} isMobile={isMobile} />
          <div className="mt-3 md:mt-4 flex items-center gap-2 flex-wrap justify-center">
            <div className={`px-2 md:px-3 py-1 rounded-lg ${aqiStatus.color} bg-slate-800/50 text-[10px] md:text-xs`}>{aqiStatus.label}</div>
            {projectedAQI < 156 ? (
              <div className="flex items-center gap-1 text-emerald-400">
                <TrendingDown className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                <span className="text-[10px] md:text-sm">{Math.round((1 - projectedAQI / 156) * 100)}% Better</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-400">
                <TrendingUp className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                <span className="text-[10px] md:text-xs">Worse</span>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-3 md:p-6">
          <h3 className={`font-semibold text-white mb-3 md:mb-4 ${isMobile ? 'text-sm' : 'text-lg'}`}>Carbon Impact</h3>
          <div className="flex flex-col items-center justify-center py-3 md:py-4">
            <motion.div key={carbonSaved} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400`}>{carbonSaved}</motion.div>
            <p className="text-slate-400 mt-1 text-xs md:text-sm">Million Tonnes CO2/year</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4 md:mt-6 pt-3 md:pt-4 border-t border-slate-700">
            <div className="text-center"><p className={`font-bold text-white ${isMobile ? 'text-lg' : 'text-2xl'}`}>{(carbonSaved * 2.4).toFixed(1)}</p><p className="text-[10px] md:text-xs text-slate-400">Trees Equivalent (M)</p></div>
            <div className="text-center"><p className={`font-bold text-white ${isMobile ? 'text-lg' : 'text-2xl'}`}>{(carbonSaved * 0.5).toFixed(1)}</p><p className="text-[10px] md:text-xs text-slate-400">Cars Off Road (M)</p></div>
          </div>
        </div>

        <div className="glass-card p-3 md:p-6">
          <h3 className={`font-semibold text-white mb-3 md:mb-4 ${isMobile ? 'text-sm' : 'text-lg'}`}>Public Health Impact</h3>
          <div className="flex flex-col items-center justify-center py-2 md:py-4">
            <div className="relative">
              <svg width={isMobile ? 100 : 140} height={isMobile ? 100 : 140} viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="60" fill="none" stroke="#334155" strokeWidth="12" />
                <motion.circle cx="70" cy="70" r="60" fill="none" stroke="url(#healthGrad)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${healthImpact * 3.77} 377`} initial={{ strokeDasharray: '0 377' }} animate={{ strokeDasharray: `${healthImpact * 3.77} 377` }} transition={{ duration: 1, ease: 'easeOut' }} style={{ transform: 'rotate(-90deg)', transformOrigin: '70px 70px' }} />
                <defs><linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#10b981" /></linearGradient></defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-white`}>{healthImpact}%</p>
                  <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-slate-400`}>Improvement</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 md:gap-4 mt-2 md:mt-4">
            <div className="p-2 md:p-3 bg-slate-800/50 rounded-lg text-center">
              <Heart className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-red-400 mx-auto mb-1`} />
              <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-slate-400`}>Respiratory</p>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-emerald-400`}>-{Math.round(healthImpact * 1.2)}%</p>
            </div>
            <div className="p-2 md:p-3 bg-slate-800/50 rounded-lg text-center">
              <Activity className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-cyan-400 mx-auto mb-1`} />
              <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-slate-400`}>Hospital Visits</p>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-emerald-400`}>-{Math.round(healthImpact * 0.8)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-3 md:p-6">
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <Wind className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-cyan-400`} />
          <h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>Impact Breakdown</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {[{ label: 'Traffic', value: (trafficReduction * 0.8).toFixed(1), icon: Car, color: 'cyan' },
            { label: 'Industry', value: (industryReduction * 0.6).toFixed(1), icon: Factory, color: 'orange' },
            { label: 'EV', value: (evAdoption * 0.3).toFixed(1), icon: Battery, color: 'emerald' },
            { label: 'Green Cover', value: ((greenCover - 22) * 1.5).toFixed(1), icon: Leaf, color: 'green' },
          ].map((item, idx) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="p-2.5 md:p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                <item.icon className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-${item.color}-400`} />
                <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-slate-400`}>{item.label}</span>
              </div>
              <p className={`font-bold text-white ${isMobile ? 'text-base' : 'text-xl'}`}>-{item.value}</p>
              <p className={`${isMobile ? 'text-[9px]' : 'text-xs'} text-slate-500`}>AQI Points</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CarbonSimulator;
