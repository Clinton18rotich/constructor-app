const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Add chart CSS
const chartCSS = `
.chart-bar{display:flex;align-items:flex-end;gap:4px;height:120px;padding:4px}
.chart-bar-item{flex:1;background:linear-gradient(180deg,#2563eb,#7c3aed);border-radius:6px 6px 0 0;min-height:4px;position:relative;transition:height 0.5s}
.chart-bar-item span{position:absolute;bottom:-18px;left:0;right:0;text-align:center;font-size:9px;color:#9ca3af}
.chart-bar-label{text-align:center;font-size:10px;color:#9ca3af;margin-top:20px}
.pie-chart{width:100px;height:100px;border-radius:50%;margin:10px auto;position:relative}
.gauge{width:120px;height:60px;margin:10px auto;position:relative;overflow:hidden}
.gauge-fill{width:120px;height:120px;border-radius:50%;position:absolute;bottom:0;left:0}
.stat-card{text-align:center;padding:12px 8px}
.stat-card h2{margin:4px 0}
`;

html = html.replace('</style>', chartCSS + '\n</style>');

// Enhanced dashboard page
const newDashboard = `
pages.dashboard = function(){
  var totalRecords = 0;
  Object.keys(appData).forEach(function(k){if(Array.isArray(appData[k])) totalRecords += appData[k].length;});
  
  var snagsOpen = (appData.snags||[]).filter(function(s){return s.status!=='Closed'}).length;
  var snagsTotal = (appData.snags||[]).length;
  var ncrOpen = (appData.ncrRecords||[]).filter(function(n){return n.status==='Open'}).length;
  var safetyIncidents = (appData.safetyIncidents||[]).length;
  var poValue = (appData.purchaseOrders||[]).reduce(function(s,p){return s+(+p.value||0)},0);
  var boqValue = (appData.boqItems||[]).reduce(function(s,i){return s+(+i.qty||0)*(+i.rate||0)},0);
  var dailyLogs = (appData.dailyLogs||[]).length;
  var photos = Object.keys(appData.photos||{}).length;
  var tasksComplete = (appData.programmeTasks||[]).filter(function(t){return t.status==='Complete'}).length;
  var tasksTotal = (appData.programmeTasks||[]).length;
  
  var h = "<h1>📊 Project Dashboard</h1><p class=\\"sub\\">"+totalRecords+" records · "+dailyLogs+" site days · "+photos+" photos</p>";
  
  // KPI Cards Row
  h += "<div class=\\"gr2\\">";
  h += "<div class=\\"cd stat-card\\"><h2 style=\\"color:#60a5fa\\">"+totalRecords+"</h2><p style=\\"font-size:10px;color:#9ca3af\\">Total Records</p></div>";
  h += "<div class=\\"cd stat-card\\"><h2 style=\\"color:"+(snagsOpen===0?'#34d399':'#f87171')+"\\">"+snagsOpen+"</h2><p style=\\"font-size:10px;color:#9ca3af\\">Open Snags</p></div>";
  h += "<div class=\\"cd stat-card\\"><h2 style=\\"color:#fbbf24\\">$"+fmt(poValue+boqValue)+"</h2><p style=\\"font-size:10px;color:#9ca3af\\">Project Value</p></div>";
  h += "<div class=\\"cd stat-card\\"><h2 style=\\"color:#34d399\\">"+dailyLogs+"</h2><p style=\\"font-size:10px;color:#9ca3af\\">Site Days</p></div>";
  h += "</div>";
  
  // Progress Bars
  h += "<div class=\\"cd\\"><h3>📈 Project Progress</h3>";
  
  // Snags progress
  var snagPct = snagsTotal > 0 ? Math.round((snagsTotal-snagsOpen)/snagsTotal*100) : 0;
  h += "<div style=\\"margin-bottom:12px\\"><div style=\\"display:flex;justify-content:space-between;font-size:11px\\"><span>🔍 Snags Closed</span><span>"+snagPct+"%</span></div><div class=\\"progress-bar\\" style=\\"height:10px\\"><div class=\\"progress-fill\\" style=\\"width:"+snagPct+"%;background:#34d399\\"></div></div></div>";
  
  // Tasks progress
  var taskPct = tasksTotal > 0 ? Math.round(tasksComplete/tasksTotal*100) : 0;
  h += "<div style=\\"margin-bottom:12px\\"><div style=\\"display:flex;justify-content:space-between;font-size:11px\\"><span>📅 Tasks Complete</span><span>"+taskPct+"% ("+tasksComplete+"/"+tasksTotal+")</span></div><div class=\\"progress-bar\\" style=\\"height:10px\\"><div class=\\"progress-fill\\" style=\\"width:"+taskPct+"%;background:#7c3aed\\"></div></div></div>";
  
  // NCR status
  var ncrTotal = (appData.ncrRecords||[]).length;
  var ncrClosed = ncrTotal - ncrOpen;
  var ncrPct = ncrTotal > 0 ? Math.round(ncrClosed/ncrTotal*100) : 0;
  h += "<div style=\\"margin-bottom:12px\\"><div style=\\"display:flex;justify-content:space-between;font-size:11px\\"><span>✅ NCRs Closed</span><span>"+ncrPct+"%</span></div><div class=\\"progress-bar\\" style=\\"height:10px\\"><div class=\\"progress-fill\\" style=\\"width:"+ncrPct+"%;background:#059669\\"></div></div></div>";
  h += "</div>";
  
  // Activity Summary
  h += "<div class=\\"cd\\"><h3>📋 Module Activity</h3><div class=\\"gr2\\">";
  var modules = [
    {name:"📐 Surveying", count:(appData.surveys||[]).length, color:"#60a5fa"},
    {name:"🌍 Geotechnical", count:(appData.soilTests||[]).length, color:"#34d399"},
    {name:"📊 Finance", count:(appData.finances||[]).length, color:"#fbbf24"},
    {name:"🏗️ Structures", count:(appData.designBeams||[]).length+(appData.designColumns||[]).length, color:"#a78bfa"},
    {name:"📊 BOQ", count:(appData.boqItems||[]).length, color:"#f472b6"},
    {name:"🏪 Procurement", count:(appData.purchaseOrders||[]).length, color:"#38bdf8"},
    {name:"📋 Daily Logs", count:dailyLogs, color:"#fb923c"},
    {name:"⛑️ Safety", count:safetyIncidents, color:"#ef4444"}
  ];
  var maxCount = Math.max.apply(null, modules.map(function(m){return m.count;})) || 1;
  modules.forEach(function(m){
    var barH = Math.max(4, (m.count/maxCount)*100);
    h += "<div style=\\"text-align:center\\"><div style=\\"font-size:16px;font-weight:bold;color:"+m.color+"\\">"+m.count+"</div><div style=\\"font-size:10px;color:#9ca3af;margin-top:2px\\">"+m.name+"</div></div>";
  });
  h += "</div></div>";
  
  // Quick Actions
  h += "<div class=\\"cd\\"><h3>⚡ Quick Actions</h3><div class=\\"gr2\\">";
  h += "<button class=\\"bt2\\" style=\\"background:#2563eb;color:white\\" onclick=\\"nav('/snagging')\\">🔍 Add Snag</button>";
  h += "<button class=\\"bt2\\" style=\\"background:#059669;color:white\\" onclick=\\"nav('/construction')\\">📋 Daily Log</button>";
  h += "<button class=\\"bt2\\" style=\\"background:#7c3aed;color:white\\" onclick=\\"nav('/safety')\\">⛑️ Report Incident</button>";
  h += "<button class=\\"bt2\\" style=\\"background:#f59e0b;color:#111827\\" onclick=\\"nav('/lab')\\">🧪 Log Test</button>";
  h += "<button class=\\"bt2\\" style=\\"background:#dc2626;color:white\\" onclick=\\"nav('/quality')\\">✅ Raise NCR</button>";
  h += "<button class=\\"bt2\\" style=\\"background:#0891b2;color:white\\" onclick=\\"nav('/concrete')\\">🧱 Concrete Mix</button>";
  h += "</div></div>";
  
  // Phase cards
  h += "<div class=\\"gr\\">";
  phases.forEach(function(ph){
    var count = 0;
    ph.items.forEach(function(it){
      if(appData[it.id]) count += appData[it.id].length;
      else if(it.id === 'lab' && appData.labTests) count += appData.labTests.length;
    });
    h += "<div class=\\"cd\\" style=\\"cursor:pointer\\" onclick=\\"togglePhase("+phases.indexOf(ph)+")\\"><h3>"+ph.name+"</h3><p style=\\"font-size:11px;color:#9ca3af\\">"+ph.items.length+" modules · "+count+" records</p></div>";
  });
  h += "</div>";
  
  return h;
};
`;

// Replace the home page route '/' to use dashboard instead of module list
html = html.replace("if(p==='/'){", "if(p==='/'){h+=pages.dashboard();}else if(false && p==='/'){");
html = html.replace("var t=phases.reduce(function(s,ph){return s+ph.items.length},0);", "");

// Insert dashboard page before render
html = html.replace('function render(){', newDashboard + '\nfunction render(){');

fs.writeFileSync('index.html', html);
console.log('✅ Dashboard added!');
