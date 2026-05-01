import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'

import Surveying from './modules/preconstruction/Surveying'
import Geotechnical from './modules/preconstruction/Geotechnical'
import GISMapping from './modules/preconstruction/GISMapping'
import ProjectFinance from './modules/preconstruction/ProjectFinance'
import Contracts from './modules/preconstruction/Contracts'
import LandApprovals from './modules/preconstruction/LandApprovals'
import Structures from './modules/design/Structures'
import Architectural from './modules/design/Architectural'
import WaterSupply from './modules/design/WaterSupply'
import Drainage from './modules/design/Drainage'
import Electrical from './modules/design/Electrical'
import Transport from './modules/design/Transport'
import Environmental from './modules/design/Environmental'
import TempWorks from './modules/design/TempWorks'
import CADViewer from './modules/design/CADViewer'
import Measurements from './modules/measurement/Measurements'
import Materials from './modules/measurement/Materials'
import QuantitySurvey from './modules/measurement/QuantitySurvey'
import Estimating from './modules/measurement/Estimating'
import ValueEngineering from './modules/measurement/ValueEngineering'
import LifeCycleCosting from './modules/measurement/LifeCycleCosting'
import ProcurementMgt from './modules/procurement/ProcurementMgt'
import ContractAward from './modules/procurement/ContractAward'
import SupplierDatabase from './modules/procurement/SupplierDatabase'
import PlantEquipment from './modules/procurement/PlantEquipment'
import HRMobilization from './modules/procurement/HRMobilization'
import ConstructionMgt from './modules/construction/ConstructionMgt'
import Programme from './modules/construction/Programme'
import BuildingWorks from './modules/construction/BuildingWorks'
import Substructure from './modules/construction/Substructure'
import MaterialsLab from './modules/construction/MaterialsLab'
import HealthSafety from './modules/construction/HealthSafety'
import QualityMgt from './modules/construction/QualityMgt'
import DocumentControl from './modules/construction/DocumentControl'
import SiteLogistics from './modules/construction/SiteLogistics'
import Stakeholder from './modules/construction/Stakeholder'
import Snagging from './modules/closeout/Snagging'
import AsBuilt from './modules/closeout/AsBuilt'
import ReportsAnalytics from './modules/closeout/ReportsAnalytics'
import ClaimsDisputes from './modules/closeout/ClaimsDisputes'

const modules = [
  { phase:'A. Pre-Construction', items:[
    {path:'/surveying', label:'📐 Surveying & Setting Out', comp:<Surveying/>},
    {path:'/geotechnical', label:'🌍 Geotechnical Investigation', comp:<Geotechnical/>},
    {path:'/gis', label:'🗺️ GIS & Site Mapping', comp:<GISMapping/>},
    {path:'/finance', label:'📊 Project Finance', comp:<ProjectFinance/>},
    {path:'/contracts', label:'⚖️ Contracts & Procurement', comp:<Contracts/>},
    {path:'/land', label:'🏛️ Land & Approvals', comp:<LandApprovals/>},
  ]},
  { phase:'B. Design', items:[
    {path:'/structures', label:'🏗️ Structures (EC/BS)', comp:<Structures/>},
    {path:'/architectural', label:'🏛️ Architectural', comp:<Architectural/>},
    {path:'/water', label:'💧 Water Supply', comp:<WaterSupply/>},
    {path:'/drainage', label:'🚿 Drainage & Sewerage', comp:<Drainage/>},
    {path:'/electrical', label:'⚡ Electrical Design', comp:<Electrical/>},
    {path:'/transport', label:'🛣️ Transport & Highway', comp:<Transport/>},
    {path:'/environmental', label:'🌱 Environmental', comp:<Environmental/>},
    {path:'/tempworks', label:'🏗️ Temporary Works', comp:<TempWorks/>},
    {path:'/cad', label:'🎨 CAD/BIM Viewer', comp:<CADViewer/>},
  ]},
  { phase:'C. Measurement & Costing', items:[
    {path:'/measurements', label:'📏 Measurements (NRM2)', comp:<Measurements/>},
    {path:'/materials', label:'🧱 Construction Materials', comp:<Materials/>},
    {path:'/quantity', label:'📊 Quantity Survey (BOQ)', comp:<QuantitySurvey/>},
    {path:'/estimating', label:'💰 Estimating & Costing', comp:<Estimating/>},
    {path:'/value', label:'💡 Value Engineering', comp:<ValueEngineering/>},
    {path:'/lifecycle', label:'📈 Life Cycle Costing', comp:<LifeCycleCosting/>},
  ]},
  { phase:'D. Procurement', items:[
    {path:'/procurement', label:'🏪 Procurement Management', comp:<ProcurementMgt/>},
    {path:'/award', label:'📜 Contract Award', comp:<ContractAward/>},
    {path:'/suppliers', label:'🤝 Supplier Database', comp:<SupplierDatabase/>},
    {path:'/plant', label:'🚜 Plant & Equipment', comp:<PlantEquipment/>},
    {path:'/hr', label:'👷 HR & Mobilization', comp:<HRMobilization/>},
  ]},
  { phase:'E. Construction', items:[
    {path:'/construction', label:'📋 Construction Management', comp:<ConstructionMgt/>},
    {path:'/programme', label:'📅 Programme & Schedule', comp:<Programme/>},
    {path:'/building', label:'🧱 Building Works', comp:<BuildingWorks/>},
    {path:'/substructure', label:'🔩 Substructure & Piling', comp:<Substructure/>},
    {path:'/lab', label:'🧪 Materials Testing Lab', comp:<MaterialsLab/>},
    {path:'/safety', label:'⛑️ Health, Safety & Welfare', comp:<HealthSafety/>},
    {path:'/quality', label:'✅ Quality Management', comp:<QualityMgt/>},
    {path:'/docs', label:'📄 Document Control', comp:<DocumentControl/>},
    {path:'/logistics', label:'🚧 Site Logistics', comp:<SiteLogistics/>},
    {path:'/stakeholder', label:'👥 Stakeholder', comp:<Stakeholder/>},
  ]},
  { phase:'F. Close-Out', items:[
    {path:'/snagging', label:'🔍 Snagging & Defects', comp:<Snagging/>},
    {path:'/asbuilt', label:'📦 As-Built & Digital Twin', comp:<AsBuilt/>},
    {path:'/reports', label:'📈 Reports & Analytics', comp:<ReportsAnalytics/>},
    {path:'/claims', label:'⚖️ Claims & Disputes', comp:<ClaimsDisputes/>},
  ]},
]

function Sidebar({ dark }) {
  const location = useLocation()
  const [openPhase, setOpenPhase] = useState(null)
  const bg = dark ? '#1f2937' : '#f3f4f6'
  const txt = dark ? '#f9fafb' : '#111827'
  return <div style={{width:280,minWidth:280,background:bg,height:'100vh',overflowY:'auto',borderRight:'1px solid '+(dark?'#374151':'#d1d5db')}}>
    <div style={{padding:'12px 16px',borderBottom:'1px solid '+(dark?'#374151':'#d1d5db'),fontWeight:'bold',fontSize:16,color:txt}}>🏗️ Constructor</div>
    {modules.map((phase,i)=><div key={i}>
      <div onClick={()=>setOpenPhase(openPhase===i?null:i)} style={{padding:'10px 16px',cursor:'pointer',fontWeight:'bold',fontSize:13,color:dark?'#93c5fd':'#1e40af',background:dark?'#111827':'#e0e7ff',borderBottom:'1px solid '+(dark?'#374151':'#d1d5db')}}>{phase.phase}</div>
      {openPhase===i && phase.items.map(item=><Link key={item.path} to={item.path} style={{display:'block',padding:'8px 16px 8px 32px',fontSize:12,color:location.pathname===item.path?'#2563eb':txt,textDecoration:'none',background:location.pathname===item.path?(dark?'#374151':'#dbeafe'):'transparent',borderBottom:'1px solid '+(dark?'#1f2937':'#e5e7eb')}}>{item.label}</Link>)}
    </div>)}
  </div>
}

export default function App() {
  const [dark, setDark] = useState(true)
  const bg = dark ? '#111827' : '#f9fafb'
  return <Router><div style={{display:'flex',background:bg,minHeight:'100vh'}}>
    <Sidebar dark={dark} />
    <div style={{flex:1,overflowY:'auto',padding:20}}>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:12}}>
        <button onClick={()=>setDark(!dark)} style={{padding:'6px 14px',borderRadius:8,border:'none',cursor:'pointer',background:dark?'#fbbf24':'#1f2937',color:dark?'#111827':'white',fontSize:12}}>{dark?'☀️ Light':'🌙 Dark'} Mode</button>
      </div>
      <Routes>
        <Route path="/" element={<Dashboard modules={modules} dark={dark} />} />
        {modules.flatMap(p=>p.items).map(m=><Route key={m.path} path={m.path} element={m.comp} />)}
      </Routes>
    </div>
  </div></Router>
}

function Dashboard({ modules, dark }) {
  const txt = dark ? '#f9fafb' : '#111827'
  const sub = dark ? '#9ca3af' : '#6b7280'
  const cb = dark ? '#1f2937' : 'white'
  const total = modules.reduce((s,p)=>s+p.items.length,0)
  return <div>
    <h1 style={{fontSize:28,fontWeight:'bold',color:txt,marginBottom:4}}>🏗️ CONSTRUCTOR SUPER APP</h1>
    <p style={{color:sub,fontSize:13,marginBottom:20}}>{total} Modules · Pre-Construction · Design · Measurement · Procurement · Construction · Close-Out</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))',gap:16}}>
      {modules.map((phase,i)=><div key={i} style={{background:cb,borderRadius:14,padding:20}}>
        <h3 style={{fontSize:15,fontWeight:'bold',color:dark?'#93c5fd':'#1e40af',marginBottom:12}}>{phase.phase}</h3>
        {phase.items.map(item=><Link key={item.path} to={item.path} style={{display:'block',padding:'8px 0',fontSize:13,color:txt,textDecoration:'none',borderBottom:'1px solid '+(dark?'#374151':'#e5e7eb')}}>{item.label}</Link>)}
      </div>)}
    </div>
  </div>
}
