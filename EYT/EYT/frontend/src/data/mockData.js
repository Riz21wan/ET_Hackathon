export const cities = [
  { id: '1', name: 'Delhi', state: 'NCT', aqi: 312, pm25: 185, pm10: 245, no2: 78, o3: 45, co: 2.8, so2: 22, temperature: 32, humidity: 65, windSpeed: 12, weather: 'Hazy', healthIndex: 'Very Unhealthy', x: 48, y: 28 },
  { id: '2', name: 'Mumbai', state: 'Maharashtra', aqi: 156, pm25: 68, pm10: 95, no2: 42, o3: 62, co: 1.2, so2: 12, temperature: 30, humidity: 78, windSpeed: 18, weather: 'Humid', healthIndex: 'Unhealthy for Sensitive', x: 22, y: 58 },
  { id: '3', name: 'Bangalore', state: 'Karnataka', aqi: 89, pm25: 35, pm10: 52, no2: 28, o3: 48, co: 0.8, so2: 8, temperature: 26, humidity: 62, windSpeed: 15, weather: 'Pleasant', healthIndex: 'Moderate', x: 35, y: 72 },
  { id: '4', name: 'Chennai', state: 'Tamil Nadu', aqi: 134, pm25: 52, pm10: 78, no2: 38, o3: 55, co: 1.1, so2: 14, temperature: 34, humidity: 82, windSpeed: 22, weather: 'Hot & Humid', healthIndex: 'Unhealthy for Sensitive', x: 42, y: 82 },
  { id: '5', name: 'Kolkata', state: 'West Bengal', aqi: 198, pm25: 95, pm10: 128, no2: 55, o3: 42, co: 1.8, so2: 18, temperature: 33, humidity: 75, windSpeed: 10, weather: 'Warm', healthIndex: 'Unhealthy', x: 62, y: 42 },
  { id: '6', name: 'Hyderabad', state: 'Telangana', aqi: 112, pm25: 42, pm10: 65, no2: 32, o3: 58, co: 0.9, so2: 10, temperature: 35, humidity: 45, windSpeed: 14, weather: 'Hot', healthIndex: 'Moderate', x: 32, y: 58 },
  { id: '7', name: 'Pune', state: 'Maharashtra', aqi: 98, pm25: 38, pm10: 58, no2: 30, o3: 52, co: 0.7, so2: 9, temperature: 28, humidity: 55, windSpeed: 12, weather: 'Pleasant', healthIndex: 'Moderate', x: 24, y: 52 },
  { id: '8', name: 'Ahmedabad', state: 'Gujarat', aqi: 175, pm25: 82, pm10: 112, no2: 48, o3: 40, co: 1.5, so2: 16, temperature: 38, humidity: 35, windSpeed: 16, weather: 'Hot & Dry', healthIndex: 'Unhealthy', x: 12, y: 38 },
  { id: '9', name: 'Jaipur', state: 'Rajasthan', aqi: 145, pm25: 62, pm10: 88, no2: 40, o3: 48, co: 1.0, so2: 13, temperature: 36, humidity: 28, windSpeed: 20, weather: 'Hot', healthIndex: 'Unhealthy for Sensitive', x: 36, y: 32 },
  { id: '10', name: 'Lucknow', state: 'Uttar Pradesh', aqi: 225, pm25: 108, pm10: 145, no2: 62, o3: 38, co: 2.0, so2: 20, temperature: 34, humidity: 55, windSpeed: 8, weather: 'Warm', healthIndex: 'Very Unhealthy', x: 50, y: 35 },
  { id: '11', name: 'Chandigarh', state: 'Punjab', aqi: 128, pm25: 48, pm10: 72, no2: 35, o3: 55, co: 0.9, so2: 11, temperature: 30, humidity: 48, windSpeed: 14, weather: 'Clear', healthIndex: 'Unhealthy for Sensitive', x: 42, y: 18 },
  { id: '12', name: 'Bhopal', state: 'Madhya Pradesh', aqi: 102, pm25: 40, pm10: 62, no2: 28, o3: 50, co: 0.8, so2: 9, temperature: 32, humidity: 42, windSpeed: 12, weather: 'Clear', healthIndex: 'Moderate', x: 38, y: 45 },
];

export const generateTimeSeriesData = (hours = 24) => {
  const data = [];
  const now = new Date();
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      date: time.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      actual: Math.round(150 + Math.sin(i / 4) * 50 + Math.random() * 30),
      predicted: Math.round(145 + Math.sin(i / 4) * 48 + Math.random() * 25),
    });
  }
  return data;
};

export const forecastData = () => {
  const data = [];
  const now = new Date();
  for (let i = 0; i < 168; i += 6) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    data.push({
      time: time.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit' }),
      aqi: Math.round(130 + Math.sin(i / 12) * 40 + Math.random() * 15),
      confidence: Math.round(85 + Math.random() * 10),
    });
  }
  return data;
};

export const sourceAttribution = [
  { name: 'Traffic', value: 35, color: '#f97316' },
  { name: 'Industry', value: 28, color: '#ef4444' },
  { name: 'Biomass Burning', value: 18, color: '#f59e0b' },
  { name: 'Dust', value: 12, color: '#a78bfa' },
  { name: 'Construction', value: 4, color: '#ec4899' },
  { name: 'Others', value: 3, color: '#6b7280' },
];

export const weeklyTrend = [
  { day: 'Mon', aqi: 142, pm25: 58, pm10: 82 },
  { day: 'Tue', aqi: 165, pm25: 72, pm10: 98 },
  { day: 'Wed', aqi: 138, pm25: 52, pm10: 75 },
  { day: 'Thu', aqi: 182, pm25: 85, pm10: 115 },
  { day: 'Fri', aqi: 158, pm25: 68, pm10: 92 },
  { day: 'Sat', aqi: 125, pm25: 45, pm10: 65 },
  { day: 'Sun', aqi: 118, pm25: 42, pm10: 58 },
];

export const modelMetrics = [
  { name: 'RMSE', value: 12.4, unit: '', status: 'good', description: 'Root Mean Square Error' },
  { name: 'MAE', value: 8.7, unit: '', status: 'good', description: 'Mean Absolute Error' },
  { name: 'R²', value: 0.94, unit: '', status: 'excellent', description: 'Coefficient of Determination' },
  { name: 'Accuracy', value: 91.2, unit: '%', status: 'excellent', description: 'Overall Prediction Accuracy' },
];

export const healthAdvisories = [
  { group: 'Children', icon: '👶', advisory: 'Limit outdoor activities. Use N95 masks if going out. Keep windows closed during peak pollution hours.', severity: 'high' },
  { group: 'Senior Citizens', icon: '👴', advisory: 'Avoid morning walks. Stay indoors between 6-10 AM. Keep rescue inhalers accessible.', severity: 'high' },
  { group: 'People with Respiratory Issues', icon: '🫁', advisory: 'Monitor air quality before outdoor activities. Use air purifiers indoors. Have emergency medication ready.', severity: 'critical' },
  { group: 'General Public', icon: '👥', advisory: 'Reduce prolonged outdoor exertion. Consider carpooling or public transport. Stay hydrated.', severity: 'moderate' },
];

export const alerts = [
  { id: 1, type: 'SMS', message: 'AQI Alert: Delhi crosses 300 - Very Unhealthy', time: '5 min ago', status: 'delivered', recipients: 125000 },
  { id: 2, type: 'Email', message: 'Weekly Air Quality Report Generated', time: '1 hour ago', status: 'sent', recipients: 4500 },
  { id: 3, type: 'Push', message: 'Real-time sensor update: PM2.5 spike detected in Kolkata', time: '2 hours ago', status: 'delivered', recipients: 85000 },
  { id: 4, type: 'SMS', message: 'Health Advisory: Sensitive groups advisory for North India', time: '3 hours ago', status: 'delivered', recipients: 250000 },
  { id: 5, type: 'Email', message: 'AI Forecast Update: Unfavorable conditions expected till Thursday', time: '4 hours ago', status: 'sent', recipients: 3200 },
];

export const apiHealth = [
  { service: 'Database', latency: 12, status: 'healthy', uptime: 99.98 },
  { service: 'ML Service', latency: 45, status: 'healthy', uptime: 99.85 },
  { service: 'Data Ingestion', latency: 8, status: 'healthy', uptime: 99.95 },
  { service: 'API Gateway', latency: 5, status: 'healthy', uptime: 99.99 },
  { service: 'Cache Layer', latency: 2, status: 'healthy', uptime: 99.97 },
];

export const scenarioPresets = {
  traffic: { min: 0, max: 50, default: 30 },
  industry: { min: 0, max: 50, default: 25 },
  evAdoption: { min: 0, max: 100, default: 15 },
  greenCover: { min: 10, max: 60, default: 22 },
};
