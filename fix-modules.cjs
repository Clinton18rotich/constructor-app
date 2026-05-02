const fs = require('fs');
const path = require('path');

const modules = [
  // Pre-Construction
  {dir:'preconstruction', name:'Surveying', emoji:'📐', title:'Surveying & Setting Out', phase:'Pre-Construction'},
  {dir:'preconstruction', name:'Geotechnical', emoji:'🌍', title:'Geotechnical Investigation', phase:'Pre-Construction'},
  {dir:'preconstruction', name:'GISMapping', emoji:'🗺️', title:'GIS & Site Mapping', phase:'Pre-Construction'},
  {dir:'preconstruction', name:'ProjectFinance', emoji:'📊', title:'Project Finance & Appraisal', phase:'Pre-Construction'},
  {dir:'preconstruction', name:'Contracts', emoji:'⚖️', title:'Contracts & Procurement Strategy', phase:'Pre-Construction'},
  {dir:'preconstruction', name:'LandApprovals', emoji:'🏛️', title:'Land & Statutory Approvals', phase:'Pre-Construction'},
  // Design
  {dir:'design', name:'Structures', emoji:'🏗️', title:'Structures (EC2/EC3/EC5/EC6/BS)', phase:'Design'},
  {dir:'design', name:'Architectural', emoji:'🏛️', title:'Architectural Coordination', phase:'Design'},
  {dir:'design', name:'WaterSupply', emoji:'💧', title:'Water Supply Engineering', phase:'Design'},
  {dir:'design', name:'Drainage', emoji:'🚿', title:'Drainage & Sewerage', phase:'Design'},
  {dir:'design', name:'Electrical', emoji:'⚡', title:'Electrical Design', phase:'Design'},
  {dir:'design', name:'Transport', emoji:'🛣️', title:'Transport & Highway Design', phase:'Design'},
  {dir:'design', name:'Environmental', emoji:'🌱', title:'Environmental & Climate Resilience', phase:'Design'},
  {dir:'design', name:'TempWorks', emoji:'🏗️', title:'Temporary Works Design', phase:'Design'},
  {dir:'design', name:'CADViewer', emoji:'🎨', title:'CAD/BIM Viewer', phase:'Design'},
  // Measurement
  {dir:'measurement', name:'Measurements', emoji:'📏', title:'Measurements (NRM2/CESMM4)', phase:'Measurement & Costing'},
  {dir:'measurement', name:'Materials', emoji:'🧱', title:'Construction Materials', phase:'Measurement & Costing'},
  {dir:'measurement', name:'QuantitySurvey', emoji:'📊', title:'Quantity Survey (BOQ/BOMA)', phase:'Measurement & Costing'},
  {dir:'measurement', name:'Estimating', emoji:'💰', title:'Estimating & Costing', phase:'Measurement & Costing'},
  {dir:'measurement', name:'ValueEngineering', emoji:'💡', title:'Value Engineering', phase:'Measurement & Costing'},
  {dir:'measurement', name:'LifeCycleCosting', emoji:'📈', title:'Life Cycle Costing', phase:'Measurement & Costing'},
  // Procurement
  {dir:'procurement', name:'ProcurementMgt', emoji:'🏪', title:'Procurement Management', phase:'Procurement & Mobilization'},
  {dir:'procurement', name:'ContractAward', emoji:'📜', title:'Contract Award & Administration', phase:'Procurement & Mobilization'},
  {dir:'procurement', name:'SupplierDatabase', emoji:'🤝', title:'Supplier Database', phase:'Procurement & Mobilization'},
  {dir:'procurement', name:'PlantEquipment', emoji:'🚜', title:'Plant & Equipment', phase:'Procurement & Mobilization'},
  {dir:'procurement', name:'HRMobilization', emoji:'👷', title:'HR & Crew Mobilization', phase:'Procurement & Mobilization'},
  // Construction
  {dir:'construction', name:'ConstructionMgt', emoji:'📋', title:'Construction Management', phase:'Construction'},
  {dir:'construction', name:'Programme', emoji:'📅', title:'Programme & Schedule (CPM/PERT)', phase:'Construction'},
  {dir:'construction', name:'BuildingWorks', emoji:'🧱', title:'Building Construction Works', phase:'Construction'},
  {dir:'construction', name:'Substructure', emoji:'🔩', title:'Substructure & Piling', phase:'Construction'},
  {dir:'construction', name:'MaterialsLab', emoji:'🧪', title:'Materials Testing Lab', phase:'Construction'},
  {dir:'construction', name:'HealthSafety', emoji:'⛑️', title:'Health, Safety & Welfare', phase:'Construction'},
  {dir:'construction', name:'QualityMgt', emoji:'✅', title:'Quality Management (ITP/NCR)', phase:'Construction'},
  {dir:'construction', name:'DocumentControl', emoji:'📄', title:'Document Control', phase:'Construction'},
  {dir:'construction', name:'SiteLogistics', emoji:'🚧', title:'Site Logistics', phase:'Construction'},
  {dir:'construction', name:'Stakeholder', emoji:'👥', title:'Stakeholder & Communication', phase:'Construction'},
  // Close-Out
  {dir:'closeout', name:'Snagging', emoji:'🔍', title:'Snagging & Defects', phase:'Close-Out & Operations'},
  {dir:'closeout', name:'AsBuilt', emoji:'📦', title:'As-Built & Digital Twin', phase:'Close-Out & Operations'},
  {dir:'closeout', name:'ReportsAnalytics', emoji:'📈', title:'Reports & Analytics', phase:'Close-Out & Operations'},
  {dir:'closeout', name:'ClaimsDisputes', emoji:'⚖️', title:'Claims & Dispute Resolution', phase:'Close-Out & Operations'},
];

const dirs = ['preconstruction','design','measurement','procurement','construction','closeout'];
dirs.forEach(d => {
  const p = `src/modules/${d}`;
  if (!fs.existsSync(p)) fs.mkdirSync(p, {recursive:true});
});

modules.forEach(m => {
  const filePath = `src/modules/${m.dir}/${m.name}.jsx`;
  const content = `import React,{useState}from'react'
export default function ${m.name}(){const[d]=useState(true);const b=d?'#111827':'#f9fafb';const c=d?'#1f2937':'white';const t=d?'#f9fafb':'#111827';const s=d?'#9ca3af':'#6b7280'
return <div style={{background:b,minHeight:'100vh'}}><h1 style={{color:t,fontSize:24,marginBottom:4}}>${m.emoji} ${m.title}</h1><p style={{color:s,fontSize:13,marginBottom:20}}>${m.phase} Phase</p><div style={{background:c,borderRadius:14,padding:24}}><p style={{color:t}}>📋 Forms, calculators, and data tables coming soon.</p></div></div>}
`;
  fs.writeFileSync(filePath, content.trim());
});

console.log('Fixed all 40 module files!');
