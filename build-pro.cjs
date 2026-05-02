const fs = require('fs');

// Read current index.html
let html = fs.readFileSync('index.html', 'utf8');

// Find the makeForm function and replace it with enhanced version that includes module-specific tools
const enhancedMakeForm = `function makeForm(id,title,emoji,phase,fields,actions){
  pages[id]=function(){
    var h=emoji+'<h1>'+title+'</h1><p class="sub">'+phase+' Phase</p>';
    // Stats
    if(appData[id]&&appData[id].length){
      h+='<div class="gr2"><div class="cd" style="text-align:center"><h2 style="color:#60a5fa">'+appData[id].length+'</h2><p style="font-size:10px;color:#9ca3af">Records</p></div></div>';
    }
    // Module-specific tools (defined per module)
    if(moduleTools[id])h+=moduleTools[id]();
    // Add form
    h+='<div class="cd"><h4>+ Add New</h4><form onsubmit="submitForm(event,\\''+id+'\\')">';
    fields.forEach(function(f){
      if(f.type==='select'){
        h+='<select class="sel" id="'+id+'_'+f.id+'">';
        (f.options||[]).forEach(function(o){h+='<option>'+o+'</option>';});
        h+='</select>';
      }else if(f.type==='textarea'){
        h+='<textarea class="inp" id="'+id+'_'+f.id+'" placeholder="'+f.label+'" rows="2"></textarea>';
      }else{
        h+='<input class="inp" id="'+id+'_'+f.id+'" placeholder="'+f.label+'"'+(f.inputType?' type="'+f.inputType+'"':'')+(f.step?' step="'+f.step+'"':'')+'>';
      }
    });
    h+='<div class="btn-row"><button type="submit" class="bt2" style="background:#2563eb;color:white;flex:1">+ Add</button>';
    h+='<button type="button" class="bt2" style="background:#059669;color:white;flex:1" onclick="exportModulePDF(\\''+id+'\\',\\''+title+'\\')">📄 PDF</button></div>';
    h+='</form></div>';
    // Data table
    if(appData[id]&&appData[id].length){
      h+='<div class="cd" style="overflow-x:auto"><h3>📋 Records ('+appData[id].length+')</h3><table>';
      fields.forEach(function(f){h+='<th>'+f.label+'</th>';});
      h+='<th>📸</th><th></th>';
      appData[id].forEach(function(item,i){
        h+='<tr>';
        fields.forEach(function(f){h+='<td>'+(item[f.id]||'')+'</td>';});
        var key=id+'_'+i;
        h+='<td>'+(appData.photos[key]?'📸×'+appData.photos[key].length:'')+' <button class="bt" style="font-size:10px;padding:2px 6px" onclick="event.stopPropagation();capturePhoto(\\''+id+'\\','+i+')">📷</button></td>';
        h+='<td><button class="bt" style="background:#dc2626;color:white;font-size:10px;padding:4px 8px" onclick="event.stopPropagation();deleteItem(\\''+id+'\\','+i+')">✕</button></td>';
        h+='</tr>';
        if(appData.photos[key]&&appData.photos[key].length){
          h+='<tr><td colspan="'+(fields.length+2)+'"><div class="photo-grid">';
          appData.photos[key].forEach(function(p){h+='<img src="'+p.data+'" class="photo-thumb" onclick="showPhoto(\\''+p.data+'\\')">';});
          h+='</div></td></tr>';
        }
      });
      h+='</table></div>';
    }
    if(actions)actions.forEach(function(a){h+='<div class="cd"><h4>'+a.label+'</h4>'+a.content+'</div>';});
    return h;
  };
}`;

// Replace the old makeForm
html = html.replace(/function makeForm\(id,title,emoji,phase,fields,actions\)\{[\s\S]*?pages\[id\]=function\(\)\{[\s\S]*?return h;\s*\};?\s*\}/, enhancedMakeForm);

// Add module tools object before the makeForm function
const moduleToolsCode = `
// ===================== MODULE-SPECIFIC TOOLS =====================
var moduleTools={};

// A1: Surveying - Distance & Bearing Calculator
moduleTools.surveying=function(){
  return '<div class="cd"><h4>📐 Distance & Bearing Calculator</h4><div class="row"><div class="col"><label class="lbl">Point 1 Easting</label><input class="inp" id="sv_p1e" type="number" step="0.001" placeholder="E1"></div><div class="col"><label class="lbl">Point 1 Northing</label><input class="inp" id="sv_p1n" type="number" step="0.001" placeholder="N1"></div></div><div class="row"><div class="col"><label class="lbl">Point 2 Easting</label><input class="inp" id="sv_p2e" type="number" step="0.001" placeholder="E2"></div><div class="col"><label class="lbl">Point 2 Northing</label><input class="inp" id="sv_p2n" type="number" step="0.001" placeholder="N2"></div></div><button class="bt2" style="background:#7c3aed;color:white" onclick="calcDistance()">Calculate Distance & Bearing</button><div id="sv_distResult" style="margin-top:8px;padding:10px;background:#111827;border-radius:8px;font-size:12px;color:#9ca3af">Enter coordinates</div></div>';
};

// A2: Geotechnical - Foundation Recommendation
moduleTools.geotechnical=function(){
  return '<div class="cd"><h4>🏗️ Foundation Recommendation Engine</h4><div class="row"><div class="col"><label class="lbl">Bearing Capacity (kPa)</label><input class="inp" id="gt_bc" type="number" value="150"></div><div class="col"><label class="lbl">Building Load (kN)</label><input class="inp" id="gt_load" type="number" value="500"></div></div><select class="sel" id="gt_soil"><option>Clay</option><option>Silt</option><option>Sand</option><option>Gravel</option><option>Rock</option></select><button class="bt2" style="background:#059669;color:white" onclick="recommendFoundation()">Get Recommendation</button><div id="gt_result" style="margin-top:8px;padding:10px;background:#111827;border-radius:8px;font-size:12px;color:#9ca3af">Enter parameters</div></div>';
};

// A4: Finance - Cashflow & NPV
moduleTools.finance=function(){
  return '<div class="cd"><h4>📈 Cashflow Forecast</h4><div class="row"><div class="col"><label class="lbl">Project Duration (months)</label><input class="inp" id="fin_months" type="number" value="12"></div><div class="col"><label class="lbl">Total Budget ($)</label><input class="inp" id="fin_budget" type="number" value="1000000"></div></div><button class="bt2" style="background:#7c3aed;color:white" onclick="calcCashflow()">Generate Cashflow</button><div id="fin_cfResult" style="margin-top:8px;padding:10px;background:#111827;border-radius:8px;font-size:11px;color:#9ca3af;max-height:150px;overflow-y:auto">Enter values</div></div><div class="cd"><h4>💵 NPV Calculator</h4><div class="row"><div class="col"><label class="lbl">Investment ($)</label><input class="inp" id="fin_inv" type="number" value="100000"></div><div class="col"><label class="lbl">Annual Return ($)</label><input class="inp" id="fin_ret" type="number" value="25000"></div></div><div class="row"><div class="col"><label class="lbl">Years</label><input class="inp" id="fin_years" type="number" value="5"></div><div class="col"><label class="lbl">Discount Rate %</label><input class="inp" id="fin_rate" type="number" value="8"></div></div><button class="bt2" style="background:#059669;color:white" onclick="calcNPV()">Calculate NPV & IRR</button><div id="fin_npvResult" style="margin-top:8px;padding:10px;background:#111827;border-radius:8px;font-size:12px;color:#9ca3af">Enter values</div></div>';
};

// B7: Structures - Quick Design Checks
moduleTools.structures=function(){
  return '<div class="cd"><h4>🔩 Quick Beam Check (EC2)</h4><div class="row"><div class="col"><label class="lbl">Span (m)</label><input class="inp" id="st_span" type="number" value="5"></div><div class="col"><label class="lbl">UDL (kN/m)</label><input class="inp" id="st_udl" type="number" value="25"></div></div><div class="row"><div class="col"><label class="lbl">Width (mm)</label><input class="inp" id="st_b" type="number" value="300"></div><div class="col"><label class="lbl">Depth (mm)</label><input class="inp" id="st_d" type="number" value="600"></div></div><button class="bt2" style="background:#2563eb;color:white" onclick="checkBeam()">Check Beam</button><div id="st_beamResult" style="margin-top:8px;padding:10px;background:#111827;border-radius:8px;font-size:12px;color:#9ca3af">Enter dimensions</div></div><div class="cd"><h4>🏛️ Column Capacity Check</h4><div class="row"><div class="col"><label class="lbl">Axial Load (kN)</label><input class="inp" id="st_colN" type="number" value="800"></div><div class="col"><label class="lbl">Width×Depth (mm)</label><input class="inp" id="st_colB" type="number" value="300"><input class="inp" id="st_colD" type="number" value="300" style="margin-top:4px"></div></div><button class="bt2" style="background:#7c3aed;color:white" onclick="checkColumn()">Check Column</button><div id="st_colResult" style="margin-top:8px;padding:10px;background:#111827;border-radius:8px;font-size:12px;color:#9ca3af">Enter values</div></div>';
};

// B9: Water Supply - Pipe Sizing
moduleTools.water=function(){
  return '<div class="cd"><h4>💧 Pipe Sizing Calculator (BS 6700)</h4><div class="row"><div class="col"><label class="lbl">Flow Rate (L/s)</label><input class="inp" id="ws_flow" type="number" value="0.5" step="0.1"></div><div class="col"><label class="lbl">Pipe Material</label><select class="sel" id="ws_mat"><option>Copper</option><option>HDPE</option><option>Steel</option></select></div></div><button class="bt2" style="background:#059669;color:white" onclick="sizePipe()">Calculate Pipe Size</button><div id="ws_pipeResult" style="margin-top:8px;padding:10px;background:#111827;border-radius:8px;font-size:12px;color:#9ca3af">Enter flow rate</div></div><div class="cd"><h4>🚰 Storage Tank Sizing</h4><div class="row"><div class="col"><label class="lbl">Occupants</label><input class="inp" id="ws_occ" type="number" value="10"></div><div class="col"><label class="lbl">Liters/person/day</label><input class="inp" id="ws_lpd" type="number" value="150"></div></div><button class="bt2" style="background:#2563eb;color:white" onclick="sizeTank()">Calculate Tank Size</button><div id="ws_tankResult" style="margin-top:8px;padding:10px;background:#111827;border-radius:8px;font-size:12px;color:#9ca3af">Enter values</div></div>';
};

// B11: Electrical - Cable Sizing
moduleTools.electrical=function(){
  return '<div class="cd"><h4>⚡ Cable Sizing (BS 7671 Simplified)</h4><div class="row"><div class="col"><label class="lbl">Power (kW)</label><input class="inp" id="el_power" type="number" value="5"></div><div class="col"><label class="lbl">Voltage (V)</label><input class="inp" id="el_volt" type="number" value="230"></div></div><div class="row"><div class="col"><label class="lbl">Cable Length (m)</label><input class="inp" id="el_len" type="number" value="30"></div><div class="col"><label class="lbl">Installation Method</label><select class="sel" id="el_method"><option>Clipped Direct</option><option>In Conduit</option><option>Buried</option></select></div></div><button class="bt2" style="background:#f59e0b;color:#111827" onclick="sizeCable()">Calculate Cable Size</button><div id="el_cableResult" style="margin-top:8px;padding:10px;background:#111827;border-radius:8px;font-size:12px;color:#9ca3af">Enter parameters</div></div>';
};

// C18: Quantity Survey - BOQ Builder
moduleTools.quantity=function(){
  return '<div class="cd"><h4>📊 BOQ Summary</h4><div id="boq_summary" style="padding:10px;background:#111827;border-radius:8px;font-size:12px;color:#9ca3af">'+(function(){var items=appData.quantity||[];var total=items.reduce(function(s,i){return s+(+i.qty||0)*(+i.rate||0)},0);var sections={};items.forEach(function(i){var s=i.section||\'Other\';if(!sections[s])sections[s]=0;sections[s]+=(+i.qty||0)*(+i.rate||0);});var html='<b>Total: $'+fmt(total)+'</b><br>';Object.keys(sections).forEach(function(s){html+=s+': $'+fmt(sections[s])+'<br>';});return html;})()+'</div></div>';
};

// E28: Programme - Gantt-style view
moduleTools.programme=function(){
  var tasks=appData.programme||[];
  return '<div class="cd"><h4>📅 Programme Overview</h4><div style="overflow-x:auto">'+(tasks.length?tasks.map(function(t){var pctDone=t.status===\'Complete\'?100:t.status===\'In Progress\'?50:0;return '<div style="margin-bottom:4px"><div style="display:flex;justify-content:space-between;font-size:11px"><span>'+t.name+'</span><span style="color:#9ca3af">'+t.start+' - '+t.end+'</span></div><div class="progress-bar" style="height:6px"><div class="progress-fill" style="width:'+pctDone+'%;background:'+(pctDone===100?\'#34d399\':pctDone>0?\'#fbbf24\':\'#374151\')+'"></div></div></div>';}).join(''):'<p style="color:#9ca3af;font-size:12px">No tasks added</p>')+'</div></div>';
};

// E31: Materials Lab - Statistical Analysis
moduleTools.lab=function(){
  var tests=appData.lab||[];
  var passed=tests.filter(function(t){return t.result==='Pass'}).length;
  var cubes=tests.filter(function(t){return t.type&&t.type.includes('Cube')});
  var avgStrength=cubes.length?cubes.reduce(function(s,t){return s+(parseFloat(t.value)||0)},0)/cubes.length:0;
  return '<div class="cd"><h4>📊 Lab Statistics</h4><div class="gr3"><div class="cd" style="text-align:center;padding:8px"><h3 style="font-size:18px;color:#60a5fa">'+tests.length+'</h3><p style="font-size:9px;color:#9ca3af">Tests</p></div><div class="cd" style="text-align:center;padding:8px"><h3 style="font-size:18px;color:#34d399">'+pct(passed,tests.length)+'%</h3><p style="font-size:9px;color:#9ca3af">Pass Rate</p></div><div class="cd" style="text-align:center;padding:8px"><h3 style="font-size:18px;color:#fbbf24">'+avgStrength.toFixed(1)+'</h3><p style="font-size:9px;color:#9ca3af">Avg N/mm²</p></div></div></div><div class="cd"><h4>🧪 Quick Concrete Mix</h4><div class="row"><div class="col"><label class="lbl">Target Strength (N/mm²)</label><input class="inp" id="lab_target" type="number" value="30"></div><div class="col"><label class="lbl">W/C Ratio</label><input class="inp" id="lab_wc" type="number" value="0.5" step="0.01"></div></div><button class="bt2" style="background:#7c3aed;color:white" onclick="estimateMix()">Estimate Mix Proportions</button><div id="lab_mixResult" style="margin-top:8px;padding:10px;background:#111827;border-radius:8px;font-size:12px;color:#9ca3af">Enter target strength</div></div>';
};

// E37: Snagging - Room Inspector
moduleTools.snagging=function(){
  var snags=appData.snagging||[];
  var open=snags.filter(function(s){return s.status!=='Closed'}).length;
  var byRoom={};snags.forEach(function(s){var r=s.location||'Unknown';if(!byRoom[r])byRoom[r]=[];byRoom[r].push(s);});
  var html='<div class="cd"><h4>🏠 Room-by-Room Inspection</h4><div class="gr2"><div class="cd" style="text-align:center;padding:8px"><h3 style="color:#f87171">'+open+'</h3><p style="font-size:10px;color:#9ca3af">Open Snags</p></div><div class="cd" style="text-align:center;padding:8px"><h3 style="color:#34d399">'+pct(snags.length-open,snags.length)+'%</h3><p style="font-size:10px;color:#9ca3af">Complete</p></div></div>';
  Object.keys(byRoom).forEach(function(room){html+='<div style="margin-bottom:4px;font-size:11px"><b>'+room+':</b> '+byRoom[room].length+' snags ('+byRoom[room].filter(function(s){return s.status==='Closed'}).length+' closed)</div>';});
  html+='</div>';
  return html+(snags.length?'<div class="cd"><h4>📋 Snag by Priority</h4><div class="gr2">'+['Critical','High','Medium','Low'].map(function(p){var c=snags.filter(function(s){return s.priority===p}).length;return '<div class="cd" style="text-align:center;padding:8px"><h3 style="color:'+(p==='Critical'||p==='High'?'#f87171':'#fbbf24')+'">'+c+'</h3><p style="font-size:9px;color:#9ca3af">'+p+'</p></div>';}).join('')+'</div></div>':'');
};

// F39: Reports - Enhanced Dashboard
moduleTools.reports=function(){
  return ''; // Already handled in pages.reports
};
`;

// Insert moduleTools before makeForm
html = html.replace('// ===================== MODULE-SPECIFIC TOOLS =====================', '');
html = html.replace('function makeForm(id,title,emoji,phase,fields,actions){', moduleToolsCode + '\nfunction makeForm(id,title,emoji,phase,fields,actions){');

// Add calculator functions
const calcFunctions = `
// ===================== CALCULATOR FUNCTIONS =====================
function calcDistance(){
  var e1=+document.getElementById('sv_p1e').value||0,n1=+document.getElementById('sv_p1n').value||0;
  var e2=+document.getElementById('sv_p2e').value||0,n2=+document.getElementById('sv_p2n').value||0;
  var dE=e2-e1,dN=n2-n1;
  var dist=Math.sqrt(dE*dE+dN*dN);
  var bearing=Math.atan2(dE,dN)*180/Math.PI;
  if(bearing<0)bearing+=360;
  document.getElementById('sv_distResult').innerHTML='<b>Distance: '+dist.toFixed(3)+'m</b> | <b>Bearing: '+bearing.toFixed(2)+'°</b> | ΔE: '+dE.toFixed(3)+' ΔN: '+dN.toFixed(3);
}
function recommendFoundation(){
  var bc=+document.getElementById('gt_bc').value||150,load=+document.getElementById('gt_load').value||500,soil=document.getElementById('gt_soil').value;
  var area=load/bc,width=Math.sqrt(area);
  var types={Clay:'Pad foundation with reinforcement cage',Silt:'Raft foundation recommended',Sand:'Strip foundation suitable',Gravel:'Pad foundation - good ground',Rock:'Pad foundation - excellent ground'};
  document.getElementById('gt_result').innerHTML='<b>Required Area: '+area.toFixed(1)+'m²</b> | Width: ~'+width.toFixed(2)+'m | <b>Recommendation:</b> '+(types[soil]||'Ground investigation recommended')+' | Allowable bearing: '+bc+' kPa';
}
function calcCashflow(){
  var months=+document.getElementById('fin_months').value||12,budget=+document.getElementById('fin_budget').value||1000000;
  var html='<b>Monthly: ~$'+fmt(Math.round(budget/months))+'</b><br>';
  var sCurve=[];for(var i=1;i<=months;i++){var pct=Math.sin((i/months)*Math.PI/2);sCurve.push('<span style="color:#60a5fa">M'+i+': $'+fmt(Math.round(budget*pct/months))+'</span>');}
  html+=sCurve.slice(0,6).join(' | ')+'...';
  document.getElementById('fin_cfResult').innerHTML=html;
}
function calcNPV(){
  var inv=+document.getElementById('fin_inv').value||0,ret=+document.getElementById('fin_ret').value||0,y=+document.getElementById('fin_years').value||5,r=(+document.getElementById('fin_rate').value||8)/100;
  var npv=-inv;for(var i=1;i<=y;i++)npv+=ret/Math.pow(1+r,i);
  var roi=inv>0?((ret*y-inv)/inv*100):0,irr=ret/inv*100;
  document.getElementById('fin_npvResult').innerHTML='<b style="color:'+(npv>=0?'#34d399':'#f87171')+'">NPV: $'+fmt(Math.round(npv))+'</b> | <b>ROI: '+roi.toFixed(1)+'%</b> | <b>Simple IRR: ~'+irr.toFixed(1)+'%</b> | Payback: '+(inv>0?(inv/ret).toFixed(1)+'yrs':'N/A');
}
function checkBeam(){
  var L=+document.getElementById('st_span').value||5,w=+document.getElementById('st_udl').value||25,b=+document.getElementById('st_b').value||300,d=+document.getElementById('st_d').value||600;
  var M=w*L*L/8,V=w*L/2;
  var z=0.9*d/1000,I=b*d*d*d/12e6,sigma=M*1e6/(z*1000),tau=3*V*1000/(2*b*d);
  document.getElementById('st_beamResult').innerHTML='<b>Mmax: '+M.toFixed(1)+' kNm</b> | <b>σ: '+sigma.toFixed(1)+' MPa</b> | <b>τ: '+tau.toFixed(2)+' MPa</b> | L/d: '+(L*1000/d).toFixed(0)+' | '+(sigma<20?'<span class="tag g">OK</span>':'<span class="tag r">CHECK</span>');
}
function checkColumn(){
  var N=+document.getElementById('st_colN').value||800,b=+document.getElementById('st_colB').value||300,d=+document.getElementById('st_colD').value||300;
  var stress=N*1000/(b*d);
  document.getElementById('st_colResult').innerHTML='<b>Stress: '+stress.toFixed(2)+' MPa</b> | Area: '+(b*d)+'mm² | '+(stress<20?'<span class="tag g">OK (C30/37)</span>':'<span class="tag r">CHECK - Increase section</span>');
}
function sizePipe(){
  var Q=+document.getElementById('ws_flow').value||0.5,mat=document.getElementById('ws_mat').value;
  var dia=Math.sqrt(4*Q/(Math.PI*1.5))*1000;
  var sizes=[15,22,28,35,42,54,67,76,108];var sel=sizes.find(function(s){return s>=dia;})||sizes[sizes.length-1];
  document.getElementById('ws_pipeResult').innerHTML='<b>Required Ø: '+dia.toFixed(0)+'mm</b> | <b>Select: '+sel+'mm '+mat+'</b> | Velocity: ~'+Math.min(Q/(Math.PI*(sel/2000)*(sel/2000)),3).toFixed(1)+' m/s';
}
function sizeTank(){
  var occ=+document.getElementById('ws_occ').value||10,lpd=+document.getElementById('ws_lpd').value||150;
  var daily=occ*lpd,tank=daily*0.5;
  document.getElementById('ws_tankResult').innerHTML='<b>Daily Demand: '+daily+' L</b> | <b>Storage Tank: '+Math.round(tank)+' L</b> | <b>Fire Reserve: '+Math.round(daily*0.25)+' L</b>';
}
function sizeCable(){
  var kW=+document.getElementById('el_power').value||5,V=+document.getElementById('el_volt').value||230,L=+document.getElementById('el_len').value||30;
  var I=kW*1000/V;
  var sizes=[{mm:1.5,A:16},{mm:2.5,A:27},{mm:4,A:37},{mm:6,A:47},{mm:10,A:65},{mm:16,A:87},{mm:25,A:114}];
  var sel=sizes.find(function(s){return s.A>=I*1.1;})||sizes[sizes.length-1];
  var vDrop=I*L*(sel.mm===1.5?29:sel.mm===2.5?18:sel.mm===4?11:sel.mm===6?7.3:sel.mm===10?4.4:sel.mm===16?2.8:1.7)/1000;
  document.getElementById('el_cableResult').innerHTML='<b>Current: '+I.toFixed(1)+'A</b> | <b>Cable: '+sel.mm+'mm² ('+sel.A+'A)</b> | <b>VDrop: '+vDrop.toFixed(1)+'V ('+(vDrop/V*100).toFixed(1)+'%)</b> | '+(vDrop/V*100<3?'<span class="tag g">OK</span>':'<span class="tag r">Increase size</span>');
}
function estimateMix(){
  var f=+document.getElementById('lab_target').value||30,wc=+document.getElementById('lab_wc').value||0.5;
  var cement=Math.round(250+f*3),water=Math.round(cement*wc),fa=Math.round(700-f*2),ca=Math.round(1100-f*3);
  document.getElementById('lab_mixResult').innerHTML='<b>Cement: '+cement+' kg/m³</b> | <b>Water: '+water+' L</b> | <b>Fine Agg: '+fa+' kg</b> | <b>Coarse Agg: '+ca+' kg</b> | W/C: '+wc;
}
`;

// Add calculator functions before render
html = html.replace('// ===================== RENDER =====================', calcFunctions + '\n// ===================== RENDER =====================');

fs.writeFileSync('index.html', html);
console.log('✅ Enhanced modules built!');
console.log('Added: Distance/Bearing calculator, Foundation recommendation, Cashflow/NPV, Beam/Column checks, Pipe sizing, Cable sizing, Concrete mix design, Room inspector, Programme Gantt, BOQ summary');
