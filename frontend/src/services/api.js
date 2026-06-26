const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export const api = {
  currentAqi: () => request("/api/current-aqi"),
  forecast: () => request("/api/forecast"),
  emissions: () => request("/api/emissions"),
  advisory: () => request("/api/health-advisory"),
  recommendations: () => request("/api/recommendations"),
  heatmap: () => request("/api/heatmap"),
  pollutionSources: () => request("/api/pollution-sources"),
  scenario: (payload) => request("/api/scenario-analysis", { method: "POST", body: JSON.stringify(payload) }),
  analyzeData: (payload) => request("/api/analyze-data", { method: "POST", body: JSON.stringify(payload) }),
};
