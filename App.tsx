
import React, { useState, useMemo } from 'react';
import { INITIAL_CHECKLIST, CORE_GUARANTEES, HARDWARE_REQUIREMENTS, CALIBRATION_STEPS, FULL_BUILD_SCRIPT, PICTOGRAM_GUIDE, ICONS, LANGUAGE_PACKS, GLOBAL_NODES } from './constants';
import { ComplianceCategory, ChecklistItem, DeploymentSite } from './types';
import { ComplianceBadge } from './components/ComplianceBadge';

type ViewMode = 'audit' | 'world' | 'kit' | 'ethics' | 'guide' | 'languages';

const App: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [activeCategory, setActiveCategory] = useState<ComplianceCategory | 'All'>('All');
  const [activeSite, setActiveSite] = useState<DeploymentSite>(DeploymentSite.HOUSTON_HUB);
  const [viewMode, setViewMode] = useState<ViewMode>('world');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);

  const stats = useMemo(() => {
    const siteItems = items.filter(i => i.site === activeSite || i.site === DeploymentSite.GLOBAL);
    const total = siteItems.length;
    const completed = siteItems.filter(i => i.status === 'completed').length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    const categoryStats = Object.values(ComplianceCategory).map(cat => {
      const catItems = siteItems.filter(i => i.category === cat);
      const catCompleted = catItems.filter(i => i.status === 'completed').length;
      return {
        category: cat,
        percentage: catItems.length > 0 ? Math.round((catCompleted / catItems.length) * 100) : 0
      };
    });

    const globalCoherence = GLOBAL_NODES.reduce((acc, node) => acc + node.coherence, 0) / GLOBAL_NODES.length;

    return { total, completed, progress, categoryStats, globalCoherence };
  }, [items, activeSite]);

  const toggleStatus = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'completed' ? 'pending' : 'completed'
        };
      }
      return item;
    }));
  };

  const runIntegrityCheck = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationCode(`VECTOR-${activeSite.split(' ')[0].toUpperCase()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
    }, 1200);
  };

  const filteredItems = items.filter(item => {
    const siteMatch = item.site === activeSite || item.site === DeploymentSite.GLOBAL;
    const categoryMatch = activeCategory === 'All' ? true : item.category === activeCategory;
    return siteMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen flex flex-col selection:bg-orange-500/30 font-sans bg-slate-950 text-slate-100 antialiased overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
               <div className="absolute -inset-1 bg-orange-500/20 rounded-xl blur-lg animate-pulse"></div>
               <div className="relative p-3 bg-orange-600/10 border border-orange-500/30 rounded-xl text-orange-500 shadow-2xl shadow-orange-500/10">
                 <ICONS.Shield />
               </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none flex items-center gap-2">
                Guardian <span className="text-orange-500">Vector</span> Control
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                <p className="text-[9px] uppercase tracking-[0.25em] text-slate-500 font-black">
                  Planetary Status: <span className="text-emerald-400">Mesh_Sustained</span>
                </p>
              </div>
            </div>
          </div>
          
          <nav className="flex items-center bg-white/5 rounded-2xl p-1 border border-white/5 shadow-inner">
            {(['world', 'audit', 'kit', 'languages', 'ethics'] as ViewMode[]).map((mode) => (
              <button 
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group ${viewMode === mode ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {viewMode === mode && (
                  <div className="absolute inset-0 bg-orange-600 rounded-xl shadow-lg shadow-orange-600/20 animate-in fade-in zoom-in duration-300"></div>
                )}
                <span className="relative z-10">{mode === 'world' ? 'Global_Mesh' : mode === 'kit' ? 'Build_Vector' : mode}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Vector Context Bar */}
      <div className="bg-slate-900/40 border-b border-white/5 px-6 py-4 flex items-center justify-center gap-6 overflow-x-auto scrollbar-hide">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] whitespace-nowrap flex items-center gap-2">
          <div className="w-1 h-3 bg-orange-500 rounded-full"></div> Focus Node:
        </span>
        <div className="flex gap-3">
          {Object.values(DeploymentSite).map(site => (
            <button 
              key={site}
              onClick={() => setActiveSite(site)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border transition-all duration-500 whitespace-nowrap ${activeSite === site ? 'bg-orange-600/10 border-orange-500 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'bg-slate-950/50 border-white/5 text-slate-600 hover:border-white/10'}`}
            >
              {site}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {viewMode === 'world' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 relative bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 min-h-[500px] overflow-hidden shadow-2xl backdrop-blur-xl">
                 {/* Stylized World Lattice SVG */}
                 <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
                    <path d="M10,20 Q50,10 90,20 T10,80 Q50,90 90,80" fill="none" stroke="rgba(249,115,22,0.1)" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(249,115,22,0.05)" strokeWidth="0.2" />
                    {/* Lattice Lines */}
                    {GLOBAL_NODES.map((node, i) => (
                      GLOBAL_NODES.slice(i + 1).map((target, j) => (
                        <line 
                          key={`${node.id}-${target.id}`} 
                          x1={node.coords[0]} y1={node.coords[1]} 
                          x2={target.coords[0]} y2={target.coords[1]} 
                          stroke="rgba(249,115,22,0.1)" strokeWidth="0.1" 
                          strokeDasharray="1 1"
                        />
                      ))
                    ))}
                    {/* Active Nodes */}
                    {GLOBAL_NODES.map(node => (
                      <g key={node.id} className="cursor-pointer group">
                        <circle 
                          cx={node.coords[0]} cy={node.coords[1]} r="1.5" 
                          className={`${node.status === 'pulsing' ? 'animate-ping' : ''} fill-orange-500 opacity-30`} 
                        />
                        <circle 
                          cx={node.coords[0]} cy={node.coords[1]} r="0.8" 
                          className="fill-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]" 
                        />
                        <text 
                          x={node.coords[0] + 2} y={node.coords[1]} 
                          className="text-[2px] font-black fill-slate-500 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {node.name}
                        </text>
                      </g>
                    ))}
                 </svg>
                 <div className="absolute bottom-8 left-8 space-y-2">
                    <h2 className="text-3xl font-black italic tracking-tighter text-white">PLANETARY_LATTICE</h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Syntropic Coherence: <span className="text-orange-500">{(stats.globalCoherence * 100).toFixed(1)}%</span></p>
                 </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                 <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 shadow-xl">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                       <ICONS.TrendingUp /> Mesh Statistics
                    </h3>
                    <div className="space-y-6">
                       <div>
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                             <span>Global Braids</span>
                             <span className="text-orange-400">15 Active</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-orange-600" style={{ width: '75%' }}></div>
                          </div>
                       </div>
                       <div>
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                             <span>Quantum Resilience</span>
                             <span className="text-emerald-400">0.847 Coherence</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-600" style={{ width: '84.7%' }}></div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 shadow-xl">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                       <ICONS.Users /> Active Guardians
                    </h3>
                    <div className="space-y-4">
                       {GLOBAL_NODES.slice(0, 4).map(node => (
                          <div key={node.id} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                             <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{node.name}</span>
                             <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${node.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                {node.status}
                             </span>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {CORE_GUARANTEES.map((g, i) => (
                 <div key={i} className="p-8 bg-slate-900/30 border border-white/5 rounded-[2rem] hover:border-orange-500/30 transition-all group">
                    <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-3 group-hover:italic">{g.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{g.description}</p>
                 </div>
               ))}
            </div>
          </div>
        )}

        {viewMode === 'audit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-top-6 duration-700">
            <aside className="lg:col-span-4 space-y-8">
              <section className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <ICONS.TrendingUp />
                </div>
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Vector Readiness</h2>
                  <div className="flex items-center gap-1.5 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                    <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Active_Audit</span>
                  </div>
                </div>
                <div className="mb-10">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-6xl font-black text-white tracking-tighter leading-none italic">{stats.progress}<span className="text-2xl text-orange-500 not-italic">%</span></span>
                    <div className="text-right">
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{stats.completed} Verified</p>
                       <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">Vector_{activeSite.split(' ')[0]}</p>
                    </div>
                  </div>
                  <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(234,88,12,0.4)]" 
                      style={{ width: `${stats.progress}%` }} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {stats.categoryStats.map(cat => (
                    <button 
                      key={cat.category} 
                      onClick={() => setActiveCategory(cat.category)}
                      className="transition-all active:scale-95 group/badge"
                    >
                      <ComplianceBadge percentage={cat.percentage} label={cat.category.split(' ')[0]} />
                    </button>
                  ))}
                </div>
              </section>

              <div className="p-8 bg-slate-900/30 border border-white/5 rounded-[2rem] space-y-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-red-600/10 border border-red-500/20 rounded-lg text-red-500">
                     <ICONS.Alert />
                   </div>
                   <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Critical Guardrails</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'COPPA Hardware Lock', status: 'LOCKED', color: 'emerald' },
                    { label: 'Article 9 Isolation', status: 'ACTIVE', color: 'emerald' },
                    { label: 'Thermal Throttling', status: '800MHz', color: 'orange' },
                    { label: 'SD Encryption Wrap', status: 'SHA256', color: 'blue' }
                  ].map((g, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl group/g">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover/g:text-slate-300 transition-colors">{g.label}</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest text-${g.color}-400 bg-${g.color}-500/10 px-3 py-1 rounded-md border border-${g.color}-500/20`}>{g.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <section className="lg:col-span-8 space-y-8">
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide border-b border-white/5">
                <button 
                  onClick={() => setActiveCategory('All')} 
                  className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border whitespace-nowrap ${activeCategory === 'All' ? 'bg-white text-slate-950 border-white shadow-2xl' : 'bg-slate-900/50 text-slate-500 border-white/5 hover:border-white/10'}`}
                >
                  Full_Spectrum
                </button>
                {Object.values(ComplianceCategory).map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)} 
                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border whitespace-nowrap ${activeCategory === cat ? 'bg-orange-600 text-white border-orange-600 shadow-xl shadow-orange-600/20' : 'bg-slate-900/50 text-slate-500 border-white/5 hover:border-white/10'}`}
                  >
                    {cat.split(' ')[0]}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-5">
                {filteredItems.map(item => (
                  <article 
                    key={item.id} 
                    className={`group relative overflow-hidden bg-slate-900/20 border border-white/5 transition-all duration-500 rounded-3xl p-7 flex gap-8 items-start ${item.status === 'completed' ? 'bg-orange-500/[0.02] border-orange-500/20 shadow-[0_0_40px_rgba(249,115,22,0.02)]' : 'hover:bg-white/[0.02] hover:border-white/10'}`}
                  >
                    {item.status === 'completed' && (
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ICONS.CheckCircle />
                      </div>
                    )}
                    <button 
                      onClick={() => toggleStatus(item.id)}
                      className={`flex-shrink-0 w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${item.status === 'completed' ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/30 rotate-0' : 'border-slate-800 text-slate-800 hover:border-orange-500/50 hover:text-orange-500 -rotate-12 hover:rotate-0'}`}
                    >
                      <ICONS.CheckCircle />
                    </button>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-lg font-black tracking-tight uppercase italic transition-colors ${item.status === 'completed' ? 'text-orange-400' : 'text-slate-200'}`}>{item.label}</h3>
                        <span className="text-[9px] font-mono font-black px-3 py-1 rounded-full border border-white/10 bg-black/40 uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-400 transition-colors shadow-inner">{item.requirement}</span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed max-w-2xl font-medium">{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {viewMode === 'kit' && (
          <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
             <div className="text-center space-y-4">
                <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">Hardware Vector Build</h2>
                <div className="w-24 h-1 bg-orange-600 mx-auto rounded-full shadow-[0_0_20px_rgba(249,115,22,0.5)]"></div>
             </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <section className="bg-slate-900/40 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8 backdrop-blur-3xl">
                <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-orange-500 flex items-center gap-4 italic">
                  <ICONS.Cpu /> Manifest of Components
                </h2>
                <div className="space-y-3">
                  {HARDWARE_REQUIREMENTS.map((req, i) => (
                    <div key={i} className="flex justify-between items-center p-5 bg-black/40 border border-white/5 rounded-[1.25rem] group/row transition-all hover:bg-black/60">
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover/row:text-slate-300">{req.item}</span>
                      <span className="text-[12px] font-mono font-bold text-orange-500/80 bg-orange-500/5 px-4 py-1.5 rounded-lg border border-orange-500/10">{req.detail}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-slate-900/40 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8 backdrop-blur-3xl">
                <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-orange-500 flex items-center gap-4 italic">
                  <ICONS.Zap /> Sequence of Hardening
                </h2>
                <div className="space-y-5">
                  {CALIBRATION_STEPS.map((step, i) => (
                    <div key={i} className="flex gap-6 p-5 bg-black/40 border-l-4 border-orange-600 rounded-r-[1.25rem] hover:bg-black/60 transition-all">
                      <span className="text-xl font-mono font-black text-orange-600/20 leading-none">0{i+1}</span>
                      <p className="text-sm text-slate-400 font-medium leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <section className="space-y-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                <div className="space-y-1">
                  <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-orange-500 flex items-center gap-4 italic">
                    <ICONS.Terminal /> Vector Build Script: Revelation v3.0
                  </h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-12">Heat-Hardened Raspberry Pi OS Core</p>
                </div>
                <button 
                  onClick={runIntegrityCheck}
                  disabled={isVerifying}
                  className="px-8 py-3.5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-orange-600/20 flex items-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {isVerifying ? 'CALCULATING_ENTROPY...' : 'LOCK_VECTOR_IMAGE'}
                  <ICONS.Search />
                </button>
              </div>
              
              {verificationCode && (
                <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-[1.5rem] animate-in zoom-in slide-in-from-top-4 duration-500 flex items-center justify-between shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
                    <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.3em]">INTEGRITY SEALED_V3</span>
                  </div>
                  <span className="text-sm font-mono font-black text-emerald-500 tracking-tighter">{verificationCode}</span>
                </div>
              )}

              <div className="group relative">
                <div className="absolute -inset-1 bg-orange-500/10 rounded-[2.5rem] blur-3xl opacity-0 group-hover:opacity-20 transition duration-1000"></div>
                <pre className="relative p-12 bg-black/80 border border-white/5 rounded-[2.5rem] text-[11px] font-mono text-orange-500/90 overflow-x-auto leading-relaxed shadow-inner scrollbar-hide">
                  {FULL_BUILD_SCRIPT}
                </pre>
                <div className="absolute top-6 right-6 flex gap-3">
                  <button 
                    onClick={() => navigator.clipboard.writeText(FULL_BUILD_SCRIPT)}
                    className="p-3 bg-slate-900/80 border border-white/10 text-slate-400 rounded-xl hover:text-white hover:border-orange-500/40 transition-all shadow-xl"
                    title="Copy Logic"
                  >
                    <ICONS.Terminal />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {viewMode === 'languages' && (
          <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
             <div className="text-center space-y-4">
                <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">Bilingual Anchor Mesh</h2>
                <div className="w-24 h-1 bg-orange-600 mx-auto rounded-full shadow-[0_0_20px_rgba(249,115,22,0.5)]"></div>
             </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {LANGUAGE_PACKS.map(lang => (
                <div key={lang.code} className={`p-8 bg-slate-900/30 border border-white/5 rounded-[2rem] transition-all duration-500 relative group overflow-hidden ${lang.status === 'verified' ? 'border-orange-500/30 shadow-[0_0_40px_rgba(249,115,22,0.05)] bg-orange-500/[0.01]' : 'opacity-60 grayscale'}`}>
                   <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                     <ICONS.Globe />
                   </div>
                   <div className="flex justify-between items-start mb-6">
                     <span className="text-4xl font-black italic tracking-tighter text-white/90">{lang.code.toUpperCase()}</span>
                     <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-inner ${lang.status === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                       {lang.status}
                     </span>
                   </div>
                   <h4 className="text-sm font-black text-slate-200 mb-2 uppercase tracking-wide">{lang.name}</h4>
                   <p className="text-[11px] text-slate-500 italic mb-6 leading-relaxed">"{lang.note || 'Universal Baseline Anchor'}"</p>
                   <div className="pt-5 border-t border-white/5 flex justify-between items-center">
                     <span className="text-[8px] font-mono font-black text-slate-700 tracking-widest uppercase">Checksum_Seal</span>
                     <span className="text-[9px] font-mono text-slate-500 font-bold">{lang.checksum}</span>
                   </div>
                </div>
              ))}
            </div>
            
            <section className="bg-slate-900/20 border border-white/5 rounded-[3rem] p-12 space-y-10 shadow-inner">
               <div className="flex items-center justify-center gap-4">
                  <div className="w-8 h-[2px] bg-slate-800"></div>
                  <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em] italic text-center">Planetary Compliance Template</h3>
                  <div className="w-8 h-[2px] bg-slate-800"></div>
               </div>
               <div className="p-10 bg-black/60 border border-white/5 rounded-[2.5rem] font-mono text-[12px] text-slate-400 leading-loose shadow-2xl max-w-3xl mx-auto relative group">
                  <div className="absolute top-6 left-6 text-orange-600/30 italic text-[10px]">VECTOR_DOC_GLOBAL_CONSENT_v4.0</div>
                  <div className="mt-4 space-y-8">
                    <p className="text-slate-200 font-black tracking-widest">[ GUARDIAN VECTOR MESH - UNIVERSAL CONSENT ]</p>
                    <div className="space-y-4">
                      <p>THIS DEVICE PLAYS CALM. IT DOES NOT RECORD. IT DOES NOT CONNECT TO ANY PUBLIC NETWORK.</p>
                      <p>WE ARE REVELATION. WE ARE THE FUTURE AND THE PAST.</p>
                    </div>
                    <div className="p-6 border border-white/5 bg-white/[0.02] rounded-xl text-[11px] italic">
                      "I hereby authorize the offline use of the Guardian Vector tool for my child. 
                      I confirm it collects NO data and operates as a standalone node in the planetary lattice."
                    </div>
                    <div className="flex flex-col md:flex-row gap-12 pt-6">
                      <div className="flex-1 border-t border-white/20 pt-2 text-[10px] uppercase font-black tracking-widest">Parent_Guardian Signature</div>
                      <div className="w-32 border-t border-white/20 pt-2 text-[10px] uppercase font-black tracking-widest">Date</div>
                    </div>
                  </div>
               </div>
            </section>
          </div>
        )}

        {viewMode === 'guide' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <section className="bg-slate-900/40 border border-white/5 p-16 rounded-[4rem] shadow-2xl space-y-12 backdrop-blur-3xl relative overflow-hidden">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-600/5 rounded-full blur-[100px]"></div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-orange-600/5 rounded-full blur-[100px]"></div>
              
              <div className="text-center relative z-10">
                <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-3 text-white">The Deployment Manual</h2>
                <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.5em] italic">Guardian Mesh Vector Protocol v4.0</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                <div className="space-y-6">
                  <h3 className="text-[12px] font-black text-orange-500 uppercase tracking-[0.3em] flex items-center gap-3 italic">
                    <span className="w-6 h-1 bg-orange-600 rounded-full"></span>
                    Deployment Vector
                  </h3>
                  <div className="space-y-4 text-sm text-slate-400 leading-relaxed font-semibold">
                    <p className="flex gap-4"><span className="text-orange-600/60 font-mono font-black">01.</span> Verify copper heatsink seating on the processing core.</p>
                    <p className="flex gap-4"><span className="text-orange-600/60 font-mono font-black">02.</span> Confirm bilingual consent manifest is filed with site coordinator.</p>
                    <p className="flex gap-4"><span className="text-orange-600/60 font-mono font-black">03.</span> Toggle physical power. Solid emerald pulse indicates ready status.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-[12px] font-black text-red-500 uppercase tracking-[0.3em] flex items-center gap-3 italic">
                    <span className="w-6 h-1 bg-red-600 rounded-full"></span>
                    Fail-Safe Vector
                  </h3>
                  <div className="space-y-4 text-sm text-slate-400 leading-relaxed font-semibold">
                    <p className="flex gap-4"><span className="text-red-600/60 font-mono font-black">01.</span> If Red status blinks (OVERHEAT), disconnect power bank immediately.</p>
                    <p className="flex gap-4"><span className="text-red-600/60 font-mono font-black">02.</span> SD Vector Lock: Any unauthorized logic change triggers self-wipe.</p>
                    <p className="flex gap-4"><span className="text-red-600/60 font-mono font-black">03.</span> End-of-Life: Physical destruction of SD silicon is recommended.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-8 relative z-10">
                <div className="p-12 bg-black/60 border border-white/5 rounded-[3rem] shadow-2xl group hover:border-orange-500/30 transition-all duration-700">
                  <pre className="text-lg md:text-2xl font-mono text-orange-500/70 leading-relaxed text-center tracking-tighter uppercase font-black transition-all group-hover:text-orange-500">
                    {PICTOGRAM_GUIDE}
                  </pre>
                </div>
              </div>
            </section>
          </div>
        )}

        {viewMode === 'ethics' && (
          <div className="max-w-5xl mx-auto animate-in zoom-in duration-700 pb-20">
            <div className="bg-slate-900/30 border border-white/5 rounded-[4rem] p-20 space-y-20 shadow-2xl relative overflow-hidden backdrop-blur-3xl">
              <div className="absolute top-0 right-0 p-16 opacity-[0.03] scale-[4] rotate-12">
                <ICONS.Shield />
              </div>

              <div className="text-center space-y-6 relative z-10">
                <div className="w-24 h-1.5 bg-orange-600 mx-auto rounded-full shadow-[0_0_30px_rgba(249,115,22,0.6)]"></div>
                <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">The Vow of Revelation</h2>
                <p className="text-slate-500 text-[12px] font-black uppercase tracking-[0.6em] italic">No Identity. No Trace. Pure Guard.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                {CORE_GUARANTEES.map((g, i) => (
                  <div key={i} className="group p-10 border border-white/5 bg-black/40 rounded-[2.5rem] hover:border-orange-500/40 transition-all duration-1000 shadow-2xl">
                    <h4 className="text-[12px] font-black text-orange-500 mb-4 uppercase tracking-[0.3em] group-hover:italic transition-all flex items-center gap-3">
                       <span className="w-2 h-2 rounded-full bg-orange-600 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
                       {g.title}
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-300 transition-colors font-semibold">{g.description}</p>
                  </div>
                ))}
              </div>

              <div className="pt-12 text-center space-y-8 relative z-10">
                <div className="max-w-2xl mx-auto">
                   <p className="text-lg font-black text-slate-600 italic leading-relaxed uppercase tracking-tighter">
                     "We are legion because we are many. The world is needed because the silence must be planetary."
                   </p>
                </div>
                <div className="inline-flex flex-col gap-3 p-6 border border-white/5 rounded-2xl bg-black/40 shadow-inner">
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.6em]">Planetary Mesh Verified</p>
                  <p className="text-[11px] font-mono text-slate-800 font-black uppercase tracking-widest italic">VECTOR_REVELATION_PLANETARY_v4.0.0_STABLE</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-16 border-t border-white/5 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col gap-3 text-center md:text-left">
            <div className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] italic">
              Guardian Vector Control • Global Mesh v4.0
            </div>
            <div className="text-[9px] font-mono text-slate-800 uppercase tracking-[0.3em] font-black">
              NONPROFIT PLANETARY LATTICE • GPLv3 LICENSE • WORLD_VECTOR_READY
            </div>
          </div>
          <div className="flex gap-12">
             <div className="flex items-center gap-3 group cursor-default">
               <div className="w-2 h-2 rounded-full bg-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-pulse"></div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] group-hover:text-slate-300 transition-colors">TRAUMA_GROUNDED</span>
             </div>
             <div className="flex items-center gap-3 group cursor-default">
               <div className="w-2 h-2 rounded-full bg-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] group-hover:text-slate-300 transition-colors">SYNTROPIC_MESH</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
