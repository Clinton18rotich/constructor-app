const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add concreteMixes to defaults
html = html.replace('labTests:[]', 'concreteMixes:[],labTests:[]');

// 2. Add concrete data array init
html = html.replace('if(!appData[k])appData[k]=defaults[k];', 'if(!appData[k])appData[k]=defaults[k];if(!appData.concrete)appData.concrete=[];');

// 3. Add to Phase E items
html = html.replace("{id:'safety',emoji:'⛑️'", "{id:'concrete',emoji:'🧱',title:'Concrete Tech'},{id:'safety',emoji:'⛑️'");

// 4. Add custom concrete page
const concretePage = `
pages.concrete=function(){
  var mixes=appData.concrete||[];
  var h="<h1>🧱 Concrete Technology</h1><p class=\\"sub\\">Construction Phase</p>";
  h+="<div class=\\"gr2\\"><div class=\\"cd\\" style=\\"text-align:center\\"><h2 style=\\"color:#60a5fa\\">"+mixes.length+"</h2><p style=\\"font-size:10px;color:#9ca3af\\">Mixes</p></div></div>";
  h+="<div class=\\"cd\\"><h4>🔬 Mix Design (DOE Method)</h4><div class=\\"row\\"><div class=\\"col\\"><label class=\\"lbl\\">Target Strength (N/mm²)</label><input class=\\"inp\\" id=\\"mx_strength\\" type=\\"number\\" value=\\"30\\"></div><div class=\\"col\\"><label class=\\"lbl\\">Slump (mm)</label><input class=\\"inp\\" id=\\"mx_slump\\" type=\\"number\\" value=\\"75\\"></div></div><div class=\\"row\\"><div class=\\"col\\"><label class=\\"lbl\\">Max Aggregate (mm)</label><input class=\\"inp\\" id=\\"mx_agg\\" type=\\"number\\" value=\\"20\\"></div><div class=\\"col\\"><label class=\\"lbl\\">Cement Type</label><select class=\\"sel\\" id=\\"mx_cement\\"><option>OPC (CEM I)</option><option>Fly Ash (CEM II)</option><option>GGBS (CEM III)</option></select></div></div><button class=\\"bt2\\" style=\\"background:#f59e0b;color:#111827\\" onclick=\\"designConcreteMix()\\">Calculate Mix</button><div id=\\"mixDesignResult\\" style=\\"margin-top:8px;padding:10px;background:#111827;border-radius:8px;font-size:13px;color:#34d399\\">Enter parameters</div></div>";
  h+="<div class=\\"cd\\"><h4>💧 W/C Ratio Reference</h4><table><tr><th>W/C</th><th>MPa</th><th>Use</th></tr><tr><td>0.35</td><td>60</td><td>Prestressed</td></tr><tr><td>0.40</td><td>50</td><td>Bridges</td></tr><tr><td>0.45</td><td>42</td><td>Columns</td></tr><tr><td>0.50</td><td>35</td><td>General RC</td></tr><tr><td>0.55</td><td>28</td><td>Foundations</td></tr></table></div>";
  h+="<div class=\\"cd\\"><h4>🌦️ Exposure Classes (BS 8500)</h4><table><tr><th>Class</th><th>Grade</th><th>W/C</th><th>Cover</th></tr><tr><td>XC1 Dry</td><td>C20/25</td><td>0.65</td><td>15mm</td></tr><tr><td>XC3/4</td><td>C30/37</td><td>0.55</td><td>30mm</td></tr><tr><td>XD1 Cl</td><td>C35/45</td><td>0.50</td><td>35mm</td></tr><tr><td>XS3 Tidal</td><td>C40/50</td><td>0.45</td><td>50mm</td></tr></table></div>";
  h+="<div class=\\"cd\\"><h4>🧪 Admixtures</h4><table><tr><th>Type</th><th>Dose</th><th>Effect</th></tr><tr><td>Plasticizer</td><td>0.2-0.5%</td><td>-5-12% water</td></tr><tr><td>Superplasticizer</td><td>0.5-2%</td><td>-12-30% water</td></tr><tr><td>Retarder</td><td>0.2-0.5%</td><td>+2-6hrs set</td></tr><tr><td>Accelerator</td><td>1-2%</td><td>Early strength</td></tr></table></div>";
  h+="<div class=\\"cd\\"><h4>+ Save Mix</h4><form onsubmit=\\"saveConcreteMix(event)\\"><input class=\\"inp\\" id=\\"cm_name\\" placeholder=\\"Mix Name\\" required><div class=\\"row\\"><input class=\\"inp2\\" id=\\"cm_cement\\" placeholder=\\"Cement (kg/m³)\\" type=\\"number\\"><input class=\\"inp2\\" id=\\"cm_water\\" placeholder=\\"Water (L/m³)\\" type=\\"number\\"></div><div class=\\"row\\"><input class=\\"inp2\\" id=\\"cm_fa\\" placeholder=\\"Fine Agg (kg/m³)\\" type=\\"number\\"><input class=\\"inp2\\" id=\\"cm_ca\\" placeholder=\\"Coarse Agg (kg/m³)\\" type=\\"number\\"></div><div class=\\"row\\"><input class=\\"inp2\\" id=\\"cm_wc\\" placeholder=\\"W/C Ratio\\" type=\\"number\\" step=\\"0.01\\"><input class=\\"inp2\\" id=\\"cm_slump\\" placeholder=\\"Slump (mm)\\" type=\\"number\\"></div><input class=\\"inp\\" id=\\"cm_strength\\" placeholder=\\"28-day Strength (MPa)\\" type=\\"number\\"><button class=\\"bt2\\" style=\\"background:#2563eb;color:white\\">+ Save Mix</button></form></div>";
  if(mixes.length){h+="<div class=\\"cd\\"><h4>📋 Saved Mixes</h4><table><tr><th>Name</th><th>Cem</th><th>W</th><th>FA</th><th>CA</th><th>W/C</th><th>MPa</th></tr>";mixes.forEach(function(m){h+="<tr><td><b>"+m.name+"</b></td><td>"+m.cement+"</td><td>"+m.water+"</td><td>"+m.fa+"</td><td>"+m.ca+"</td><td>"+m.wc+"</td><td>"+m.strength+"</td></tr>";});h+="</table></div>";}
  return h;
};

function designConcreteMix(){
  var fc=+document.getElementById("mx_strength").value||30;
  var slump=+document.getElementById("mx_slump").value||75;
  var agg=+document.getElementById("mx_agg").value||20;
  var wc=fc>=50?0.38:fc>=40?0.45:fc>=30?0.50:fc>=25?0.55:0.65;
  var water=agg===10?208:agg===20?195:180;
  if(slump>100)water+=15;if(slump<50)water-=15;
  var cement=Math.round(water/wc);
  var totalAgg=2200-cement-water;
  var faPct=agg===10?55:agg===20?45:35;
  var fa=Math.round(totalAgg*faPct/100);
  var ca=totalAgg-fa;
  document.getElementById("mixDesignResult").innerHTML="W/C: <b>"+wc.toFixed(2)+"</b> | Cement: <b>"+cement+" kg</b> | Water: <b>"+water+" L</b> | FA: <b>"+fa+" kg</b> | CA: <b>"+ca+" kg</b><br><span style=\\"font-size:11px;color:#9ca3af\\">Ratio 1:"+(fa/cement).toFixed(1)+":"+(ca/cement).toFixed(1)+" | C"+fc+"/"+(fc+8)+"</span>";
}

function saveConcreteMix(e){
  e.preventDefault();
  appData.concrete.push({
    name:document.getElementById("cm_name").value,
    cement:document.getElementById("cm_cement").value,
    water:document.getElementById("cm_water").value,
    fa:document.getElementById("cm_fa").value,
    ca:document.getElementById("cm_ca").value,
    wc:document.getElementById("cm_wc").value,
    slump:document.getElementById("cm_slump").value,
    strength:document.getElementById("cm_strength").value,
    date:new Date().toISOString()
  });
  save();
  document.getElementById("cm_name").value="";
  notify("🧱 Mix design saved!","success","concrete");
}
`;

// Insert concrete page before render function
html = html.replace('function render(){', concretePage + '\nfunction render(){');

fs.writeFileSync('index.html', html);
console.log('✅ Concrete Technology module added successfully!');
