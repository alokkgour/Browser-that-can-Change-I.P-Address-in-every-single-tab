
import React, { useState } from 'react';
import { BrowserTab, TabGroup, ProxyBookmark } from './types';
import { generateRandomProxy, PRESET_PROXIES } from './constants';
import TabContent from './components/TabContent';
import { 
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Search,
  LayoutGrid,
  Settings,
  ShieldAlert,
  FolderPlus,
  Bookmark,
  Star,
  Globe,
  Zap
} from 'lucide-react';

const App: React.FC = () => {
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: 'tab-1',
      title: 'Global Hub 1',
      url: 'https://cyberproxy.internal/home',
      proxy: generateRandomProxy(),
      videos: [],
      isActive: true,
    }
  ]);

  const [groups, setGroups] = useState<TabGroup[]>([
    { id: 'group-1', name: 'Work', color: '#3b82f6' },
    { id: 'group-2', name: 'Media', color: '#10b981' }
  ]);

  const [bookmarks, setBookmarks] = useState<ProxyBookmark[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);

  const activeTab = tabs.find(t => t.isActive) || tabs[0];

  const addTab = (groupId?: string) => {
    const newTab: BrowserTab = {
      id: `tab-${Date.now()}`,
      title: `Proxy Node ${tabs.length + 1}`,
      url: 'https://cyberproxy.internal/node',
      proxy: generateRandomProxy(),
      videos: [],
      isActive: true,
      groupId
    };
    setTabs(prev => prev.map(t => ({ ...t, isActive: false })).concat(newTab));
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(t => t.id !== id);
    if (tabs.find(t => t.id === id)?.isActive) {
      newTabs[newTabs.length - 1].isActive = true;
    }
    setTabs(newTabs);
  };

  const switchTab = (id: string) => {
    setTabs(prev => prev.map(t => ({ ...t, isActive: t.id === id })));
  };

  const moveTab = (index: number, direction: 'left' | 'right') => {
    const newTabs = [...tabs];
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < tabs.length) {
      [newTabs[index], newTabs[newIndex]] = [newTabs[newIndex], newTabs[index]];
      setTabs(newTabs);
    }
  };

  const updateTabData = (updatedTab: BrowserTab) => {
    setTabs(prev => prev.map(t => t.id === updatedTab.id ? updatedTab : t));
  };

  const saveBookmark = () => {
    const newBookmark: ProxyBookmark = {
      id: `bm-${Date.now()}`,
      name: `${activeTab.proxy.city} (Custom)`,
      proxy: { ...activeTab.proxy }
    };
    setBookmarks([...bookmarks, newBookmark]);
    setShowBookmarks(true);
  };

  const applyBookmark = (proxy: any) => {
    updateTabData({ ...activeTab, proxy: { ...proxy } });
  };

  return (
    <div className="flex flex-col h-screen select-none relative bg-slate-950">
      <header className="bg-slate-900 border-b border-slate-800 flex flex-col pt-2 shadow-2xl relative z-50">
        <div className="flex items-end px-4 gap-1 overflow-x-auto scrollbar-none pb-0.5">
          {tabs.map((tab, idx) => {
            const group = groups.find(g => g.id === tab.groupId);
            return (
              <div 
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`
                  group flex items-center gap-2 px-3 py-2 min-w-[150px] max-w-[220px] rounded-t-lg text-[11px] font-semibold cursor-pointer transition-all border-t-2
                  ${tab.isActive 
                    ? 'bg-slate-950 text-slate-100 border-x border-slate-800' 
                    : 'bg-slate-900 text-slate-500 hover:bg-slate-800 hover:text-slate-300 border-x border-transparent'
                  }
                `}
                style={{ borderTopColor: group ? group.color : (tab.isActive ? '#3b82f6' : 'transparent') }}
              >
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); moveTab(idx, 'left'); }} className="opacity-0 group-hover:opacity-100 hover:text-blue-400" disabled={idx === 0}><ChevronLeft size={10} /></button>
                  <div className={`w-2 h-2 rounded-full ${tab.isActive ? 'bg-blue-400 animate-pulse' : 'bg-slate-700'}`} />
                </div>
                <span className="truncate flex-1 text-center uppercase tracking-tighter">{tab.title}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); moveTab(idx, 'right'); }} className="opacity-0 group-hover:opacity-100 hover:text-blue-400" disabled={idx === tabs.length - 1}><ChevronRight size={10} /></button>
                  <X size={10} className="opacity-0 group-hover:opacity-100 hover:text-red-400 ml-1" onClick={(e) => closeTab(tab.id, e)} />
                </div>
              </div>
            );
          })}
          <div className="flex items-center gap-1 ml-2 mb-1">
            <button onClick={() => addTab()} className="p-1.5 hover:bg-slate-800 rounded-md text-slate-500"><Plus size={16} /></button>
            <button className="p-1.5 hover:bg-slate-800 rounded-md text-slate-500"><FolderPlus size={16} /></button>
          </div>
        </div>

        <div className="flex items-center gap-4 px-4 py-2 bg-slate-950 border-t border-slate-800">
          <div className="flex-1 flex items-center bg-slate-900 border border-slate-700 rounded-lg px-4 py-1.5 gap-3">
             <ShieldAlert size={14} className="text-blue-500" />
             <div className="text-[10px] mono text-slate-500 flex-1 truncate">{activeTab.proxy.isp} // {activeTab.proxy.ip}</div>
             <button onClick={saveBookmark} className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-amber-400"><Star size={14} /></button>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <button onClick={() => setShowBookmarks(!showBookmarks)} className={`p-1.5 rounded transition-colors ${showBookmarks ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}><Bookmark size={18} /></button>
            <button className="p-1.5 hover:bg-slate-800 rounded"><Settings size={18} /></button>
          </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        {tabs.map(tab => (
          <div key={tab.id} className={`absolute inset-0 transition-all duration-500 ${tab.isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <TabContent tab={tab} onUpdateTab={updateTabData} />
          </div>
        ))}

        {/* Presets Sidebar */}
        {showBookmarks && (
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 z-[60] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-black text-xs tracking-widest text-blue-500 uppercase">Preset Terminal</h3>
              <X size={18} className="cursor-pointer hover:text-white" onClick={() => setShowBookmarks(false)} />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <section>
                <h4 className="text-[10px] font-black text-slate-500 uppercase mb-3 flex items-center gap-2"><Zap size={10} /> System Optimized</h4>
                <div className="space-y-2">
                  {PRESET_PROXIES.map((p, i) => (
                    <div key={i} onClick={() => applyBookmark(p.proxy)} className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg hover:bg-blue-500/10 cursor-pointer transition-all">
                      <div className="text-[11px] font-black text-blue-400 mb-1">{p.name}</div>
                      <div className="text-[9px] text-slate-500 mono">{p.proxy.ip} - {p.proxy.city}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-black text-slate-500 uppercase mb-3 flex items-center gap-2"><Star size={10} /> User Registry</h4>
                {bookmarks.length === 0 ? (
                  <div className="text-[10px] text-slate-600 italic px-2">No custom profiles stored.</div>
                ) : (
                  <div className="space-y-2">
                    {bookmarks.map(bm => (
                      <div key={bm.id} onClick={() => applyBookmark(bm.proxy)} className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-blue-500/50 cursor-pointer">
                        <div className="text-[11px] font-bold text-slate-200">{bm.name}</div>
                        <div className="text-[9px] text-slate-500 mono">{bm.proxy.ip}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-950 border-t border-slate-900 px-6 py-1.5 flex items-center justify-between text-[10px] text-slate-600 font-bold uppercase">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />SECURE</div>
          <div className="mono">ID: {activeTab.id}</div>
        </div>
        <div className="mono text-blue-500">
          NODE: {activeTab.proxy.city} // PING: {activeTab.proxy.latency}MS
        </div>
      </footer>
    </div>
  );
};

export default App;
