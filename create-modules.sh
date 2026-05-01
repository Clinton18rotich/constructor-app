#!/bin/bash
MODULES=(
  "design/Structures:🏗️ Structures (EC2/EC3/EC5/EC6/BS):Design"
  "design/Architectural:🏛️ Architectural Coordination:Design"
  "design/WaterSupply:💧 Water Supply Engineering:Design"
  "design/Drainage:🚿 Drainage & Sewerage:Design"
  "design/Electrical:⚡ Electrical Design:Design"
  "design/Transport:🛣️ Transport & Highway Design:Design"
  "design/Environmental:🌱 Environmental & Climate Resilience:Design"
  "design/TempWorks:🏗️ Temporary Works Design:Design"
  "design/CADViewer:🎨 CAD/BIM Viewer:Design"
  "measurement/Measurements:📏 Measurements (NRM2/CESMM4):Measurement & Costing"
  "measurement/Materials:🧱 Construction Materials:Measurement & Costing"
  "measurement/QuantitySurvey:📊 Quantity Survey (BOQ/BOMA):Measurement & Costing"
  "measurement/Estimating:💰 Estimating & Costing:Measurement & Costing"
  "measurement/ValueEngineering:💡 Value Engineering:Measurement & Costing"
  "measurement/LifeCycleCosting:📈 Life Cycle Costing:Measurement & Costing"
  "procurement/ProcurementMgt:🏪 Procurement Management:Procurement & Mobilization"
  "procurement/ContractAward:📜 Contract Award & Administration:Procurement & Mobilization"
  "procurement/SupplierDatabase:🤝 Supplier Database:Procurement & Mobilization"
  "procurement/PlantEquipment:🚜 Plant & Equipment:Procurement & Mobilization"
  "procurement/HRMobilization:👷 HR & Crew Mobilization:Procurement & Mobilization"
  "construction/ConstructionMgt:📋 Construction Management:Construction"
  "construction/Programme:📅 Programme & Schedule (CPM/PERT):Construction"
  "construction/BuildingWorks:🧱 Building Construction Works:Construction"
  "construction/Substructure:🔩 Substructure & Piling:Construction"
  "construction/MaterialsLab:🧪 Materials Testing Lab:Construction"
  "construction/HealthSafety:⛑️ Health Safety & Welfare:Construction"
  "construction/QualityMgt:✅ Quality Management (ITP/NCR):Construction"
  "construction/DocumentControl:📄 Document Control:Construction"
  "construction/SiteLogistics:🚧 Site Logistics:Construction"
  "construction/Stakeholder:👥 Stakeholder & Communication:Construction"
  "closeout/Snagging:🔍 Snagging & Defects:Close-Out & Operations"
  "closeout/AsBuilt:📦 As-Built & Digital Twin:Close-Out & Operations"
  "closeout/ReportsAnalytics:📈 Reports & Analytics:Close-Out & Operations"
  "closeout/ClaimsDisputes:⚖️ Claims & Dispute Resolution:Close-Out & Operations"
)

for m in "${MODULES[@]}"; do
  IFS=':' read -r path title phase <<< "$m"
  cat > "src/modules/$path.jsx" << MOD
import React,{useState}from'react'
export default function $(basename $path)(){const[d]=useState(true);const b=d?'#111827':'#f9fafb';const c=d?'#1f2937':'white';const t=d?'#f9fafb':'#111827';const s=d?'#9ca3af':'#6b7280'
return<div style={{background:b,minHeight:'100vh'}}><h1 style={{color:t,fontSize:24,marginBottom:4}}>$title</h1><p style={{color:s,fontSize:13,marginBottom:20}}>$phase Phase</p><div style={{background:c,borderRadius:14,padding:24}}><p style={{color:t}}>📋 Module content coming soon.</p></div></div>}
MOD
done
echo "All 34 modules created!"
