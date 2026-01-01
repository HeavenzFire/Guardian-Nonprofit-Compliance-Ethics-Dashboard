
import React, { useState, useMemo } from 'react';
import { INITIAL_CHECKLIST, CORE_GUARANTEES, HARDWARE_REQUIREMENTS, CALIBRATION_STEPS, BOOT_CONFIG, FSTAB_CONFIG, BUILD_SCRIPT_STEPS, ICONS } from './constants';
import { ComplianceCategory, ChecklistItem } from './types';
import { ComplianceBadge } from './components/ComplianceBadge';

type ViewMode = 'audit' | 'kit' | 'ethics';

const App: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [activeCategory, setActiveCategory] = useState<ComplianceCategory | 'All'>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('kit');

  const stats = useMemo(() => {
    const total = items.length;
    const completed = items.filter(i => i.status === 'completed').length;
    const progress = Math.round((completed / total) * 100);

    const categoryStats = Object.values(ComplianceCategory).map(cat => {
      const catItems = items.filter(i => i.category === cat);
      const catCompleted = catItems.filter(i => i.status === 'completed').length;
      return {
        category: cat,
        percentage: Math.round((catCompleted / catItems.length) * 100)
      };
    });

    return { total, completed, progress, categoryStats };
  }, [items]);

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

  const filteredItems = items.filter(item => 
    activeCategory === 'All' ? true : item.category === activeCategory
  );

  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-500/30">
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-500" aria-hidden="true">
              <ICONS.Shield />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none uppercase">
                GuardianOS <span className="text-slate-500 text-sm font-normal">Field Kit</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Nonprofit Deployment Engine</p>
            </div>
          </div>
          
          <nav className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800" aria-label="Main Views">
            <button 
              onClick={() => setViewMode('kit')}
              className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'kit' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Manual
            </button>
            <button 
              onClick={() => setViewMode('audit')}
              className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'audit' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Registry
            </button>
            <button 
              onClick={() => setViewMode('ethics')}
              className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'ethics' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Statement
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {viewMode === 'audit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
            <aside className="lg:col-span-4 space-y-6">
              <section className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                  <ICONS.CheckCircle /> Compliance Integrity
                </h2>
                <div className="mb-8">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-4xl font-mono font-bold text-white leading-none tracking-tighter">{stats.progress}%</span>
                    <span className="text-xs text-slate-500 font-mono">{stats.completed} / {stats.total} VERIFIED</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(16,185,129,0.4)]" style={{ width: `${stats.progress}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {stats.categoryStats.map(cat => (
                    <button key={cat.category} onClick={() => setActiveCategory(cat.category)} className={`text-left transition-all rounded-lg ${activeCategory === cat.category ? 'ring-2 ring-emerald-500/20' : ''}`}>
                      <ComplianceBadge percentage={cat.percentage} label={cat.category.split(' ')[0]} />
                    </button>
                  ))}
                </div>
              </section>
            </aside>
            <section className="lg:col-span-8 space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
                <button onClick={() => setActiveCategory('All')} className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === 'All' ? 'bg-white text-slate-950' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>All Metrics</button>
                {Object.values(ComplianceCategory).map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>{cat}</button>
                ))}
              </div>
              <div className="space-y-4">
                {filteredItems.map(item => (
                  <article key={item.id} className={`group bg-slate-900/40 border transition-all rounded-xl p-6 flex gap-6 ${item.status === 'completed' ? 'border-emerald-500/20 bg-emerald-500/[0.02]' : 'border-slate-800'}`}>
                    <button onClick={() => toggleStatus(item.id)} className={`flex-shrink-0 w-8 h-8 rounded border-2 transition-all flex items-center justify-center ${item.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-700 bg-slate-950'}`}>
                      <ICONS.CheckCircle />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-bold transition-colors ${item.status === 'completed' ? 'text-emerald-400' : 'text-slate-200'}`}>{item.label}</h3>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded border border-slate-700 uppercase tracking-widest text-slate-500">{item.requirement}</span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed mb-4">{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {viewMode === 'kit' && (
          <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom duration-500">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-3">
                  <ICONS.Cpu /> 01. HARDWARE SPECS
                </h2>
                <div className="space-y-4">
                  {HARDWARE_REQUIREMENTS.map((req, i) => (
                    <div key={i} className="flex justify-between p-4 bg-slate-900/40 border border-slate-800 rounded-lg">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{req.item}</span>
                      <span className="text-[11px] font-mono text-slate-200">{req.detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-3">
                  <ICONS.Shield /> 02. CALIBRATION (EASY)
                </h2>
                <div className="space-y-3">
                  {CALIBRATION_STEPS.map((step, i) => (
                    <div key={i} className="p-4 bg-slate-900/20 border-l-2 border-emerald-500/20 rounded-r-lg">
                      <p className="text-xs text-slate-300 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-8 pt-8 border-t border-slate-900">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-3">
                <ICONS.Terminal /> 03. BUILD PIPELINE (IMMUTABLE IMAGE)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {BUILD_SCRIPT_STEPS.map((step, i) => (
                  <div key={i} className="space-y-3 flex flex-col h-full">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">{step.title}</label>
                      <p className="text-[10px] text-slate-500 leading-tight italic">{step.description}</p>
                    </div>
                    <pre className="flex-1 p-4 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                      {step.code}
                    </pre>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-8 pt-8 border-t border-slate-900">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-3">
                <ICONS.FileCode /> 04. SYSTEM CONFIGURATION
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest">/boot/config.txt (HARDWARE ENFORCEMENT)</label>
                  <pre className="p-6 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto">
                    {BOOT_CONFIG}
                  </pre>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest">/etc/fstab (VOLATILE RAM STORAGE)</label>
                  <pre className="p-6 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto">
                    {FSTAB_CONFIG}
                  </pre>
                </div>
              </div>
            </section>

            <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-3">
                <ICONS.Alert /> NEXT REAL DECISIONS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 border border-slate-800 rounded-xl hover:border-emerald-500/30 transition-all group cursor-default">
                  <h3 className="text-[10px] font-bold text-slate-200 uppercase mb-2">01. Thermal Tuning</h3>
                  <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400">Refine CPU caps and watchdog behavior for safe enclosed operation.</p>
                </div>
                <div className="p-5 border border-slate-800 rounded-xl hover:border-emerald-500/30 transition-all group cursor-default">
                  <h3 className="text-[10px] font-bold text-slate-200 uppercase mb-2">02. Audio Pack</h3>
                  <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400">Finalize the set of ethically reviewed, non-personal affirmations.</p>
                </div>
                <div className="p-5 border border-slate-800 rounded-xl hover:border-emerald-500/30 transition-all group cursor-default">
                  <h3 className="text-[10px] font-bold text-slate-200 uppercase mb-2">03. Deployment Sheet</h3>
                  <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400">Draft the grandmother-readable, one-page printed setup manual.</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {viewMode === 'ethics' && (
          <div className="max-w-3xl mx-auto animate-in zoom-in duration-300 pb-12">
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-10 space-y-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <ICONS.Shield />
              </div>

              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter text-white uppercase">ETHICS & SAFETY STATEMENT</h2>
                <p className="text-slate-500 text-xs font-mono uppercase tracking-[0.3em]">Version 0.1 — Immutable Core Principles</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y border-slate-800 py-10">
                <div className="space-y-4">
                  <h3 className="text-[11px] font-bold text-emerald-500 uppercase tracking-[0.2em]">What This Is</h3>
                  <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
                    <li>Offline standalone device</li>
                    <li>Listens for vocal distress</li>
                    <li>Responds with pre-recorded affirmations</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-[11px] font-bold text-orange-500 uppercase tracking-[0.2em]">What This Is Not</h3>
                  <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
                    <li>NOT a surveillance system</li>
                    <li>NOT cloud-dependent</li>
                    <li>NOT connected to authorities</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.3em] text-center">Core Guarantees</h3>
                <div className="grid grid-cols-1 gap-4">
                  {CORE_GUARANTEES.map((g, i) => (
                    <div key={i} className="p-4 border border-slate-800 bg-slate-900/20 rounded-lg group hover:border-emerald-500/30 transition-colors">
                      <h4 className="text-[10px] font-bold text-slate-200 mb-1">{g.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{g.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 space-y-6 text-center">
                <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-lg">
                  <h4 className="text-[10px] font-bold text-orange-500 uppercase mb-2">Ethical Boundary</h4>
                  <p className="text-xs text-orange-200/60 italic leading-relaxed">
                    If any component of this system violates your trust: Remove the SD card. Destroy it. This system ceases to exist. No exceptions.
                  </p>
                </div>
                <p className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">bryer_continuation_seal::v0.1::a1b2c3d4e5f6</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 py-8 border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-mono text-slate-700 uppercase tracking-[0.2em]">
            GUARDIAN FIELD KIT • v1.0.4 • © 2024
          </div>
          <div className="flex items-center gap-6 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
            <span className="text-emerald-500/50 hover:text-emerald-500 cursor-default transition-colors">NO CLOUD</span>
            <span className="text-emerald-500/50 hover:text-emerald-500 cursor-default transition-colors">NO STORAGE</span>
            <span className="text-emerald-500/50 hover:text-emerald-500 cursor-default transition-colors">NO RISK</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
