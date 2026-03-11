const TOOL_KEY = "shipping-route-visualizer";
const toolConfigs = {
  "manufacturing-complexity-estimator": { fields:[["Part Count","a",180],["Tolerance Microns","b",12],["Variant Count","c",6]], compute:v=>Math.min(100,Math.round(v.a*0.2+(30-v.b)*2+v.c*5)), text:s=>`Complexity score: ${s}/100` },
  "automation-roi-calculator": { fields:[["Current Labor Cost ($k)","a",900],["Automation Investment ($k)","b",450],["Uptime Gain (%)","c",18]], compute:v=>Math.round(((v.a*(v.c/100))/v.b)*100), text:s=>`Estimated ROI: ${s}%` },
  "satellite-orbit-visualizer": { fields:[["Orbit Altitude (km)","a",550],["Velocity (km/s)","b",7.6],["Payload Mass (kg)","c",320]], compute:v=>Math.min(100,Math.round((v.b/8)*60+(1000-Math.abs(700-v.a))/40)), text:s=>`Orbit stability index: ${s}/100` },
  "drone-mission-simulator": { fields:[["Mission Distance (km)","a",42],["Payload (kg)","b",12],["Wind Speed (km/h)","c",20]], compute:v=>Math.max(0,Math.round(95-v.a*0.7-v.b*1.1-v.c*0.6)), text:s=>`Mission success probability: ${s}%` },
  "factory-dashboard-simulator": { fields:[["Line Utilization (%)","a",82],["Defect Rate (%)","b",2.4],["Downtime (hrs/week)","c",5]], compute:v=>Math.max(0,Math.round(v.a-v.b*8-v.c*1.4)), text:s=>`Simulated OEE score: ${s}/100` },
  "sensor-network-visualizer": { fields:[["Sensor Nodes","a",220],["Signal Noise (%)","b",8],["Gateway Count","c",12]], compute:v=>Math.max(0,Math.round(100-v.b*2+(v.c*1.8)-(v.a/80))), text:s=>`Network reliability index: ${s}/100` },
  "equipment-configurator": { fields:[["Engine Power (hp)","a",640],["Attachment Count","b",3],["Duty Cycle (%)","c",75]], compute:v=>Math.round(v.a*0.08+v.b*7+v.c*0.4), text:s=>`Configuration performance score: ${s}` },
  "construction-cost-estimator": { fields:[["Build Area (sq ft)","a",120000],["Steel Intensity (lb/sq ft)","b",42],["Schedule Pressure (%)","c",20]], compute:v=>Math.round((v.a*145+v.b*21000+v.c*200000)/1000000), text:s=>`Estimated project cost: $${s}M` },
  "energy-savings-calculator": { fields:[["Current Energy Use (MWh/yr)","a",38000],["Efficiency Gain (%)","b",17],["Power Cost ($/MWh)","c",110]], compute:v=>Math.round(v.a*(v.b/100)*v.c), text:s=>`Estimated annual savings: $${s.toLocaleString()}` },
  "shipping-route-visualizer": { fields:[["Distance (mi)","a",1480],["Port Delay (hrs)","b",9],["Fuel Cost Index","c",74]], compute:v=>Math.max(0,Math.round(100-v.b*2-v.c*0.3-v.a/90)), text:s=>`Route efficiency score: ${s}/100` },
  "threat-detection-dashboard": { fields:[["Alerts per Hour","a",42],["Patch Compliance (%)","b",86],["Network Segments","c",18]], compute:v=>Math.max(0,Math.round(v.b-v.a*0.8+v.c*0.7)), text:s=>`Security posture score: ${s}/100` },
  "chip-fabrication-visualizer": { fields:[["Wafer Starts / Day","a",1600],["Yield (%)","b",92],["Node Size (nm)","c",5]], compute:v=>Math.round((v.a*(v.b/100))/(1+(5/Math.max(1,v.c)))), text:s=>`Effective output index: ${s}` },
  "ai-anomaly-detection-demo": { fields:[["Signal Variance","a",22],["Model Sensitivity","b",68],["Batch Size","c",120]], compute:v=>Math.min(100,Math.round(v.b*0.8+v.a*0.9-v.c*0.08)), text:s=>`Anomaly confidence: ${s}%` },
  "alloy-composition-visualizer": { fields:[["Nickel (%)","a",38],["Chromium (%)","b",24],["Titanium (%)","c",8]], compute:v=>Math.min(100,Math.round(v.a*0.9+v.b*1.1+v.c*2.4)), text:s=>`Material performance index: ${s}/100` },
  "tolerance-calculator": { fields:[["Nominal Size (mm)","a",24],["Upper Tol (um)","b",18],["Lower Tol (um)","c",12]], compute:v=>Math.round((v.b+v.c)/2), text:s=>`Total tolerance window: Â±${s} um` },
  "drilling-depth-simulator": { fields:[["Bit RPM","a",180],["Formation Hardness","b",62],["Run Time (hrs)","c",14]], compute:v=>Math.max(0,Math.round((v.a*v.c*1.8)/(1+v.b/60))), text:s=>`Estimated drilled depth: ${s} m` },
  "carbon-reduction-calculator": { fields:[["Baseline Emissions (tCO2e)","a",12000],["Retrofit Gain (%)","b",26],["Renewables Share (%)","c",38]], compute:v=>Math.round(v.a*((v.b+v.c*0.6)/100)), text:s=>`Projected reduction: ${s.toLocaleString()} tCO2e` },
  "drone-flight-range-simulator": { fields:[["Battery Capacity (Wh)","a",9200],["Payload (kg)","b",9],["Cruise Speed (km/h)","c",92]], compute:v=>Math.max(0,Math.round((v.a/(120+v.b*16))*v.c*0.7)), text:s=>`Estimated flight range: ${s} km` },
  "rotating-prototype-viewer": { fields:[["Rotation Speed","a",48],["Scale (%)","b",100],["Light Intensity","c",72]], compute:v=>Math.min(100,Math.round(v.a*0.8+v.b*0.2+v.c*0.3)), text:s=>`Prototype clarity score: ${s}/100` },
  "consulting-cost-estimator": { fields:[["Team Size","a",8],["Duration (weeks)","b",14],["Complexity Level","c",7]], compute:v=>Math.round((v.a*v.b*(14000+v.c*900))/1000), text:s=>`Estimated consulting cost: $${s.toLocaleString()}k` }
};
const revealElements = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("show"); observer.unobserve(entry.target); } }), { threshold: 0.2 });
revealElements.forEach((el) => observer.observe(el));
document.querySelectorAll("[data-counter]").forEach((el) => {
  const target = Number(el.dataset.counter); let value = 0; const step = Math.max(1, Math.ceil(target / 60));
  const timer = setInterval(() => { value += step; if (value >= target) { el.textContent = target; clearInterval(timer); return; } el.textContent = value; }, 20);
});
function mountTool() {
  const form = document.getElementById("tool-form");
  if (!form) return;
  const result = document.getElementById("tool-result");
  const meter = document.getElementById("tool-meter");
  const cfg = toolConfigs[TOOL_KEY];
  if (!cfg) return;
  cfg.fields.forEach(([label, key, val]) => {
    const wrap = document.createElement("label"); wrap.textContent = label;
    const input = document.createElement("input"); input.type = "number"; input.step = "any"; input.name = key; input.value = val;
    wrap.appendChild(input); form.appendChild(wrap);
  });
  const btn = document.createElement("button"); btn.type = "submit"; btn.className = "btn btn-primary"; btn.textContent = "Run Simulation"; form.appendChild(btn);
  form.addEventListener("submit", (e) => {
    e.preventDefault(); const values = {};
    cfg.fields.forEach(([, key]) => { values[key] = Number(form.elements[key].value || 0); });
    const score = cfg.compute(values); result.textContent = cfg.text(score); meter.style.width = `${Math.max(0, Math.min(100, score))}%`;
  });
}
mountTool();
