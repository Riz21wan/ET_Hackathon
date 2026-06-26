import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bus,
  CloudSun,
  Database,
  Factory,
  FileDown,
  FileSpreadsheet,
  HeartPulse,
  Leaf,
  MapPinned,
  Plus,
  RefreshCw,
  Send,
  Trees,
  Upload,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { api } from "./services/api";

const sourceColors = ["#0f766e", "#b45309", "#2563eb", "#7c3aed"];
const requiredColumns = [
  "ward",
  "pm25",
  "pm10",
  "no2",
  "so2",
  "co",
  "temperature",
  "humidity",
  "wind_speed",
  "rainfall",
  "traffic_count",
  "vehicle_type",
  "distance_km",
  "lat",
  "lng",
];

const emptyRecord = {
  ward: "",
  pm25: 55,
  pm10: 95,
  no2: 35,
  so2: 12,
  co: 0.8,
  temperature: 30,
  humidity: 58,
  wind_speed: 7,
  rainfall: 0,
  traffic_count: 18000,
  vehicle_type: "car",
  distance_km: 12,
  lat: 28.6139,
  lng: 77.209,
};

function categoryTone(category) {
  if (category === "Good") return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (category === "Moderate") return "text-amber-700 bg-amber-50 border-amber-200";
  if (category === "Poor") return "text-orange-700 bg-orange-50 border-orange-200";
  if (category === "Very Poor") return "text-red-700 bg-red-50 border-red-200";
  return "text-rose-800 bg-rose-50 border-rose-200";
}

function StatCard({ icon: Icon, label, value, detail, tone = "text-civic" }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 break-words text-3xl font-semibold text-ink">{value}</p>
        </div>
        <Icon className={`h-6 w-6 shrink-0 ${tone}`} aria-hidden="true" />
      </div>
      <p className="mt-3 min-h-5 text-sm text-slate-600">{detail}</p>
    </section>
  );
}

function ScenarioSlider({ label, value, min, max, step = 1, unit, onChange }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 font-semibold text-ink">
          {value.toLocaleString()}
          {unit}
        </span>
      </div>
      <input
        className="range w-full"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function Field({ label, name, value, type = "number", min, max, step = "any", onChange, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children ?? (
        <input
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-civic focus:ring-2 focus:ring-civic/20"
          name={name}
          type={type}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
        />
      )}
    </label>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-soft">
        <RefreshCw className="mx-auto h-8 w-8 animate-spin text-civic" />
        <p className="mt-3 font-medium text-slate-700">Loading city intelligence layers...</p>
      </div>
    </div>
  );
}

function parseCsv(text) {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((header) => header.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((value) => value.trim());
    return headers.reduce((record, header, index) => {
      const raw = values[index] ?? "";
      record[header] = ["ward", "vehicle_type"].includes(header) ? raw : Number(raw);
      return record;
    }, {});
  });
}

function downloadTemplate() {
  const sample = [
    requiredColumns.join(","),
    "Central Ward,55,92,34,12,0.8,30,58,7,0,18000,car,12,28.6139,77.209",
    "Industrial Zone,78,130,52,18,1.1,32,50,5,0,26000,truck,18,28.67,77.23",
  ].join("\n");
  const blob = new Blob([sample], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "air-quality-import-template.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function LiveDashboard({ data, scenarioInputs, setScenarioInputs, scenario }) {
  const forecastBars = useMemo(
    () => data.forecast.forecast.map((item) => ({ name: `${item.horizon_hours}h`, AQI: item.aqi })),
    [data],
  );

  return (
    <div className="grid gap-5">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Activity} label="Current AQI" value={data.current.aqi} detail={data.current.category} />
        <StatCard icon={CloudSun} label="Predicted AQI" value={data.forecast.forecast[2].aqi} detail="72 hour forecast" tone="text-signal" />
        <StatCard icon={Factory} label="Carbon Emissions" value={`${data.emissions.daily_co2_tons} t`} detail="Daily road transport CO2" tone="text-blue-700" />
        <StatCard icon={HeartPulse} label="Risk Level" value={data.advisory.category} detail={data.advisory.mask_recommendation} tone="text-alert" />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-ink">AQI, traffic, and forecast trend</h2>
              <p className="text-sm text-slate-500">MAE {data.forecast.metrics.mae}, RMSE {data.forecast.metrics.rmse}, R2 {data.forecast.metrics.r2}</p>
            </div>
            <MapPinned className="h-5 w-5 text-civic" />
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={data.forecast.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="timestamp" minTickGap={26} stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="aqi" stroke="#0f766e" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="traffic_count" stroke="#b45309" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <h2 className="text-lg font-semibold text-ink">72 hour AQI forecast</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={forecastBars}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="AQI" radius={[6, 6, 0, 0]} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <HeatmapPanel heatmap={data.heatmap} title="GIS heatmap and risk zones" />
        <div className="grid gap-5">
          <SourcePanel sources={data.sources.sources} />
          <CarbonPanel breakdown={data.emissions.breakdown} />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <Bus className="h-5 w-5 text-civic" />
            <h2 className="text-lg font-semibold text-ink">Scenario simulation engine</h2>
          </div>
          <div className="space-y-5">
            <ScenarioSlider label="Traffic reduction" value={scenarioInputs.traffic_reduction} min={0} max={50} unit="%" onChange={(value) => setScenarioInputs((current) => ({ ...current, traffic_reduction: value }))} />
            <ScenarioSlider label="EV adoption" value={scenarioInputs.ev_adoption} min={0} max={100} unit="%" onChange={(value) => setScenarioInputs((current) => ({ ...current, ev_adoption: value }))} />
            <ScenarioSlider label="Tree plantation" value={scenarioInputs.tree_plantation} min={0} max={100000} step={1000} unit="" onChange={(value) => setScenarioInputs((current) => ({ ...current, tree_plantation: value }))} />
          </div>
          {scenario && (
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <StatCard icon={Leaf} label="AQI gain" value={`${scenario.impact.aqi_improvement_percent}%`} detail={`AQI ${scenario.projected.aqi}`} />
              <StatCard icon={Factory} label="CO2 cut" value={`${scenario.impact.co2_reduction_tons_day} t`} detail={`${scenario.impact.co2_reduction_percent}% daily`} tone="text-blue-700" />
              <StatCard icon={Trees} label="Pollution cut" value={`${scenario.impact.pollution_reduction_percent}%`} detail={scenario.projected.category} tone="text-emerald-700" />
            </div>
          )}
        </div>
        <AdvisoryPanel advisory={data.advisory} recommendations={data.recommendations.recommendations} />
      </section>
    </div>
  );
}

function HeatmapPanel({ heatmap, title }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <h2 className="mb-4 text-lg font-semibold text-ink">{title}</h2>
      <MapContainer center={[heatmap.center.lat, heatmap.center.lng]} zoom={11} scrollWheelZoom={false}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {heatmap.wards.map((ward) => (
          <CircleMarker
            key={`${ward.ward}-${ward.lat}-${ward.lng}`}
            center={[ward.lat, ward.lng]}
            radius={Math.max(9, ward.risk_score / 4)}
            pathOptions={{
              color: ward.aqi > 200 ? "#b91c1c" : ward.aqi > 150 ? "#b45309" : "#0f766e",
              fillOpacity: 0.45,
            }}
          >
            <Popup>
              <strong>{ward.ward}</strong>
              <br />
              AQI {ward.aqi} - {ward.category}
              <br />
              CO2 {ward.co2_tons_day} tons/day
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

function SourcePanel({ sources }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <h2 className="text-lg font-semibold text-ink">Pollution source attribution</h2>
      <div className="grid items-center gap-4 md:grid-cols-[220px_1fr]">
        <div className="h-56">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={sources} dataKey="percentage" nameKey="name" innerRadius={52} outerRadius={86}>
                {sources.map((entry, index) => (
                  <Cell key={entry.name} fill={sourceColors[index % sourceColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {sources.map((source, index) => (
            <div key={source.name}>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">{source.name}</span>
                <span>{source.percentage}%</span>
              </div>
              <div className="mt-1 h-2 rounded bg-slate-100">
                <div className="h-2 rounded" style={{ width: `${source.percentage}%`, backgroundColor: sourceColors[index] }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CarbonPanel({ breakdown }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <h2 className="text-lg font-semibold text-ink">Traffic carbon trend</h2>
      <div className="mt-4 h-56">
        <ResponsiveContainer>
          <AreaChart data={breakdown}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="vehicle_type" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Area dataKey="daily_co2_tons" fill="#0f766e" stroke="#0f766e" fillOpacity={0.25} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AdvisoryPanel({ advisory, recommendations }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <h2 className="text-lg font-semibold text-ink">Health advisory and AI recommendations</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className={`rounded-lg border p-4 ${categoryTone(advisory.category)}`}>
          <p className="text-sm font-semibold uppercase tracking-wide">Health advisory</p>
          <p className="mt-3 font-medium">{advisory.outdoor_activity_advice}</p>
          <p className="mt-2 text-sm">{advisory.health_warning}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">AI recommendation panel</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {recommendations.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-civic" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function DataWorkspace() {
  const [manual, setManual] = useState(emptyRecord);
  const [records, setRecords] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function updateManual(event) {
    const { name, value, type } = event.target;
    setManual((current) => ({ ...current, [name]: type === "number" ? Number(value) : value }));
  }

  function addManualRecord() {
    const ward = manual.ward.trim() || `Ward ${records.length + 1}`;
    setRecords((current) => [...current, { ...manual, ward }]);
    setManual({ ...emptyRecord, ward: "" });
    setMessage("Manual record added.");
  }

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const imported = parseCsv(text).filter((row) => row.ward);
    if (!imported.length) {
      setMessage("No valid rows found. Use the CSV template columns.");
      return;
    }
    setRecords((current) => [...current, ...imported]);
    setMessage(`${imported.length} rows imported from ${file.name}.`);
    event.target.value = "";
  }

  async function analyze() {
    if (!records.length) {
      setMessage("Add one manual row or import a CSV file first.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const result = await api.analyzeData({ records });
      setAnalysis(result);
      setMessage("Analysis updated from your data.");
    } catch (analysisError) {
      setMessage(analysisError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-5">
      <section className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">Fill air quality data manually</h2>
              <p className="mt-1 text-sm text-slate-500">Enter pollutant, weather, traffic, vehicle, and location values for any ward.</p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-civic px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800" type="button" onClick={addManualRecord}>
              <Plus className="h-4 w-4" />
              Add row
            </button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Ward" name="ward" value={manual.ward} type="text" onChange={updateManual} />
            <Field label="PM2.5" name="pm25" value={manual.pm25} onChange={updateManual} />
            <Field label="PM10" name="pm10" value={manual.pm10} onChange={updateManual} />
            <Field label="NO2" name="no2" value={manual.no2} onChange={updateManual} />
            <Field label="SO2" name="so2" value={manual.so2} onChange={updateManual} />
            <Field label="CO" name="co" value={manual.co} onChange={updateManual} />
            <Field label="Temperature" name="temperature" value={manual.temperature} onChange={updateManual} />
            <Field label="Humidity" name="humidity" value={manual.humidity} min={0} max={100} onChange={updateManual} />
            <Field label="Wind speed" name="wind_speed" value={manual.wind_speed} onChange={updateManual} />
            <Field label="Rainfall" name="rainfall" value={manual.rainfall} onChange={updateManual} />
            <Field label="Traffic count" name="traffic_count" value={manual.traffic_count} onChange={updateManual} />
            <Field label="Vehicle type" name="vehicle_type" value={manual.vehicle_type} onChange={updateManual}>
              <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-civic focus:ring-2 focus:ring-civic/20" name="vehicle_type" value={manual.vehicle_type} onChange={updateManual}>
                <option value="two_wheeler">Two wheeler</option>
                <option value="car">Car</option>
                <option value="bus">Bus</option>
                <option value="truck">Truck</option>
              </select>
            </Field>
            <Field label="Distance km" name="distance_km" value={manual.distance_km} onChange={updateManual} />
            <Field label="Latitude" name="lat" value={manual.lat} onChange={updateManual} />
            <Field label="Longitude" name="lng" value={manual.lng} onChange={updateManual} />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-civic" />
            <h2 className="text-lg font-semibold text-ink">Upload data from file</h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">Import CSV rows with the same columns as the template. The file is parsed in the browser and sent to the API for analysis.</p>
          <div className="mt-4 grid gap-3">
            <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-center hover:border-civic hover:bg-teal-50">
              <Upload className="h-7 w-7 text-civic" />
              <span className="mt-2 text-sm font-semibold text-slate-700">Choose CSV file</span>
              <input className="sr-only" type="file" accept=".csv,text/csv" onChange={handleFile} />
            </label>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" type="button" onClick={downloadTemplate}>
              <FileDown className="h-4 w-4" />
              Download CSV template
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700" type="button" onClick={analyze} disabled={busy}>
              {busy ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Analyze data
            </button>
            {message && <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{message}</p>}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">Your data preview</h2>
            <p className="text-sm text-slate-500">{records.length} rows ready for analysis</p>
          </div>
          <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" type="button" onClick={() => { setRecords([]); setAnalysis(null); }}>
            Clear rows
          </button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[980px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {["Ward", "PM2.5", "PM10", "NO2", "SO2", "CO", "Traffic", "Vehicle", "Distance", "Lat", "Lng"].map((heading) => (
                  <th className="px-3 py-2" key={heading}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.slice(0, 8).map((row, index) => (
                <tr key={`${row.ward}-${index}`}>
                  <td className="px-3 py-2 font-medium text-slate-800">{row.ward}</td>
                  <td className="px-3 py-2">{row.pm25}</td>
                  <td className="px-3 py-2">{row.pm10}</td>
                  <td className="px-3 py-2">{row.no2}</td>
                  <td className="px-3 py-2">{row.so2}</td>
                  <td className="px-3 py-2">{row.co}</td>
                  <td className="px-3 py-2">{row.traffic_count}</td>
                  <td className="px-3 py-2">{row.vehicle_type}</td>
                  <td className="px-3 py-2">{row.distance_km}</td>
                  <td className="px-3 py-2">{row.lat}</td>
                  <td className="px-3 py-2">{row.lng}</td>
                </tr>
              ))}
              {!records.length && (
                <tr>
                  <td className="px-3 py-6 text-center text-slate-500" colSpan={11}>No rows yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {analysis && <UserAnalysis analysis={analysis} />}
    </div>
  );
}

function UserAnalysis({ analysis }) {
  const forecastBars = analysis.forecast.map((item) => ({ name: `${item.horizon_hours}h`, AQI: item.aqi }));
  return (
    <section className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Database} label="Imported rows" value={analysis.summary.records} detail="User supplied records" />
        <StatCard icon={Activity} label="Average AQI" value={analysis.summary.average_aqi} detail={analysis.summary.category} tone="text-signal" />
        <StatCard icon={Factory} label="Total CO2" value={`${analysis.summary.total_co2_tons} t`} detail="From supplied vehicle data" tone="text-blue-700" />
        <StatCard icon={AlertTriangle} label="Worst ward" value={analysis.summary.worst_ward} detail={`AQI ${analysis.summary.worst_aqi}`} tone="text-alert" />
      </div>
      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-civic" />
            <h2 className="text-lg font-semibold text-ink">Forecast from your data</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={forecastBars}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="AQI" radius={[6, 6, 0, 0]} fill="#0f766e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <HeatmapPanel heatmap={analysis.heatmap} title="Your data map" />
      </section>
      <AdvisoryPanel advisory={analysis.advisory} recommendations={analysis.recommendations.recommendations} />
    </section>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [view, setView] = useState("live");
  const [scenarioInputs, setScenarioInputs] = useState({ traffic_reduction: 15, ev_adoption: 25, tree_plantation: 10000 });
  const [scenario, setScenario] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [current, forecast, emissions, advisory, recommendations, heatmap, sources] = await Promise.all([
          api.currentAqi(),
          api.forecast(),
          api.emissions(),
          api.advisory(),
          api.recommendations(),
          api.heatmap(),
          api.pollutionSources(),
        ]);
        if (mounted) setData({ current, forecast, emissions, advisory, recommendations, heatmap, sources });
      } catch (loadError) {
        setError(loadError.message);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function simulate() {
      try {
        const result = await api.scenario(scenarioInputs);
        if (mounted) setScenario(result);
      } catch (scenarioError) {
        setError(scenarioError.message);
      }
    }
    simulate();
    return () => {
      mounted = false;
    };
  }, [scenarioInputs]);

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-3xl rounded-lg border border-red-200 bg-white p-6 shadow-soft">
          <AlertTriangle className="h-7 w-7 text-alert" />
          <h1 className="mt-3 text-xl font-semibold">Dashboard API unavailable</h1>
          <p className="mt-2 text-slate-600">{error}. Start the FastAPI server on port 8000 and refresh.</p>
        </div>
      </main>
    );
  }

  if (!data) return <DashboardSkeleton />;

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-civic">Smart city command dashboard</p>
            <h1 className="mt-1 text-2xl font-semibold text-ink md:text-3xl">AI Urban Air Quality Intelligence Platform</h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button className={`rounded-md px-4 py-2 text-sm font-semibold ${view === "live" ? "bg-white text-civic shadow-sm" : "text-slate-600"}`} type="button" onClick={() => setView("live")}>
                Live dashboard
              </button>
              <button className={`rounded-md px-4 py-2 text-sm font-semibold ${view === "data" ? "bg-white text-civic shadow-sm" : "text-slate-600"}`} type="button" onClick={() => setView("data")}>
                Data workspace
              </button>
            </div>
            <div className={`rounded-lg border px-4 py-3 ${categoryTone(data.current.category)}`}>
              <div className="flex items-center gap-3">
                <span className="status-dot h-3 w-3 rounded-full bg-current" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide">Current AQI</p>
                  <p className="text-xl font-bold">{data.current.aqi} - {data.current.category}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-5">
        {view === "live" ? (
          <LiveDashboard data={data} scenarioInputs={scenarioInputs} setScenarioInputs={setScenarioInputs} scenario={scenario} />
        ) : (
          <DataWorkspace />
        )}
      </div>
    </main>
  );
}
