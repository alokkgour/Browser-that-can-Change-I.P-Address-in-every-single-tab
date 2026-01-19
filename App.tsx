
import React, { useState } from 'react';
import { BrowserTab } from './types';
import { generateRandomProxy } from './constants';
import TabContent from './components/TabContent';
import { 
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Menu, 
  Search,
  LayoutGrid,
  Settings,
  ShieldAlert
} from 'lucide-react';

const App: React.FC = () => {
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: 'tab-1',
      title: 'Global Hub 1',
      url: 'https://cyberproxy.internal',
      proxy: generateRandomProxy(),
      videos: [],
      isActive: true,
    }
  ]);

  const activeTab = tabs.find(t => t.isActive) || tabs[0];

  const addTab = () => {
    const newTab: BrowserTab = {
      id: `tab-${Date.now()}`,
      title: `Proxy Node ${tabs.length + 1}`,
      url: 'https://cyberproxy.internal',
      proxy: generateRandomProxy(),
      videos: [],
      isActive: true,
    };
    setTabs(prev => prev.map(t => ({ ...t, isActive: false })).concat(newTab));
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(t => t.id !== id);
    if (tabs.find(t => t.id === id)?.isActive) {
      newTabs[0].isActive = true;
    }
    setTabs(newTabs);
  };

  const switchTab = (id: string) => {
    setTabs(prev => prev.map(t => ({ ...t, isActive: t.id === id })));
  };

  const updateTabData = (updatedTab: BrowserTab) => {
    setTabs(prev => prev.map(t => t.id === updatedTab.id ? updatedTab : t));
  };

  return (
    <div className="flex flex-col h-screen select-none">
      {/* Browser Chrome Header */}
      <header className="bg-slate-900 border-b border-slate-800 flex flex-col pt-2">
        {/* Tab Bar */}
        <div className="flex items-end px-2 gap-1 overflow-x-auto scrollbar-none">
          {tabs.map(tab => (
            <div 
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`
                group flex items-center gap-3 px-4 py-2 min-w-[140px] max-w-[200px] rounded-t-lg text-xs font-medium cursor-pointer transition-all
                ${tab.isActive 
                  ? 'bg-slate-950 text-slate-100 border-x border-t border-slate-800' 
                  : 'bg-slate-900 text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                }
              `}
            >
              <div className="w-3 h-3 rounded-full bg-blue-500/50 flex-shrink-0" />
              <span className="truncate flex-1">{tab.title}</span>
              <X 
                size={12} 
                className="opacity-0 group-hover:opacity-100 hover:text-white"
                onClick={(e) => closeTab(tab.id, e)}
              />
            </div>
          ))}
          <button 
            onClick={addTab}
            className="p-2 mb-1 hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-4 px-4 py-2 bg-slate-950 border-t border-slate-800">
          <div className="flex items-center gap-1 text-slate-400">
            <button className="p-1.5 hover:bg-slate-800 rounded disabled:opacity-30"><ChevronLeft size={18} /></button>
            <button className="p-1.5 hover:bg-slate-800 rounded disabled:opacity-30"><ChevronRight size={18} /></button>
            <button className="p-1.5 hover:bg-slate-800 rounded"><RotateCw size={16} /></button>
          </div>

          <div className="flex-1 flex items-center bg-slate-900 border border-slate-700 rounded-full px-4 py-1.5 gap-3 group focus-within:border-blue-500/50">
             <ShieldAlert size={14} className="text-blue-500" />
             <input 
               type="text" 
               readOnly 
               value={activeTab.url}
               className="bg-transparent border-none outline-none text-xs text-slate-300 w-full"
             />
             <Search size={14} className="text-slate-600" />
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <button className="p-1.5 hover:bg-slate-800 rounded"><LayoutGrid size={18} /></button>
            <button className="p-1.5 hover:bg-slate-800 rounded"><Settings size={18} /></button>
            <div className="w-px h-6 bg-slate-800 mx-1" />
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-900/20 rounded-full border border-blue-500/30">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
               <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">VPN ACTIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`absolute inset-0 transition-opacity duration-300 ${tab.isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            <TabContent tab={tab} onUpdateTab={updateTabData} />
          </div>
        ))}
      </main>

      {/* Status Bar */}
      <footer className="bg-slate-950 border-t border-slate-900 px-4 py-1 flex items-center justify-between text-[10px] text-slate-600 font-medium tracking-tight uppercase">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            System Secure
          </div>
          <div className="mono">Enc: AES-256-GCM</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="mono">ACTIVE NODES: {tabs.length}</div>
          <div className="mono">VIRTUAL STREAMS: {tabs.reduce((acc, t) => acc + t.videos.length, 0)}</div>
          <div className="mono text-blue-500">PROXY: {activeTab.proxy.isp}</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
