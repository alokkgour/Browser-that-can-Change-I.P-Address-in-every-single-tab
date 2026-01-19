
import React, { useState, useEffect } from 'react';
import { BrowserTab, VideoInstance } from '../types';
import { Plus, RotateCcw, Globe, Shield, Activity, Sparkles, AlertCircle, Link as LinkIcon, Search, Loader2, Globe2 } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import { generateRandomIP, SAMPLE_VIDEOS } from '../constants';
import { getProxyAdvice, searchVideos } from '../services/geminiService';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface TabContentProps {
  tab: BrowserTab;
  onUpdateTab: (tab: BrowserTab) => void;
}

const TabContent: React.FC<TabContentProps> = ({ tab, onUpdateTab }) => {
  const [aiAdvice, setAiAdvice] = useState<string>('Analyzing network environment...');
  const [isRotating, setIsRotating] = useState(false);
  const [networkData, setNetworkData] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{title: string, url: string}[]>([]);
  const [titleInput, setTitleInput] = useState(tab.title);

  useEffect(() => {
    const fetchAdvice = async () => {
      const advice = await getProxyAdvice(`${tab.proxy.city}, ${tab.proxy.country}`, tab.proxy.ip);
      setAiAdvice(advice);
    };
    fetchAdvice();

    const interval = setInterval(() => {
      setNetworkData(prev => {
        const newData = [...prev, {
          time: new Date().toLocaleTimeString(),
          traffic: Math.floor(Math.random() * 100)
        }].slice(-20);
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [tab.proxy.ip, tab.proxy.city, tab.proxy.country]);

  const rotateIP = () => {
    setIsRotating(true);
    setTimeout(() => {
      const newTab = { ...tab };
      newTab.proxy = {
        ...newTab.proxy,
        ip: generateRandomIP()
      };
      onUpdateTab(newTab);
      setIsRotating(false);
    }, 800);
  };

  const addVideo = (url: string, title?: string) => {
    const newVideo: VideoInstance = {
      id: Math.random().toString(36).substr(2, 9),
      url: url,
      title: title || `Stream Source ${tab.videos.length + 1}`,
      status: 'playing',
      ip: generateRandomIP()
    };
    onUpdateTab({
      ...tab,
      videos: [...tab.videos, newVideo]
    });
    setSearchResults([]);
    setSearchInput('');
  };

  const removeVideo = (id: string) => {
    onUpdateTab({
      ...tab,
      videos: tab.videos.filter(v => v.id !== id)
    });
  };

  const updateVideo = (id: string, updates: Partial<VideoInstance>) => {
    onUpdateTab({
      ...tab,
      videos: tab.videos.map(v => v.id === id ? { ...v, ...updates } : v)
    });
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) return;

    if (query.startsWith('http://') || query.startsWith('https://')) {
      addVideo(query, 'Direct Link Stream');
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    try {
      const { results } = await searchVideos(query);
      setSearchResults(results);
    } catch (err: any) {
      console.warn("Search Error:", err?.message || "Internal Search Failure");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-950">
      <div className="flex flex-wrap items-center gap-4 px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest leading-none mb-1">Node Title</span>
            <input 
              type="text" 
              value={titleInput}
              onChange={(e) => {
                setTitleInput(e.target.value);
                onUpdateTab({ ...tab, title: e.target.value });
              }}
              className="bg-transparent border-none outline-none text-sm font-bold text-slate-100 p-0 focus:text-blue-400 w-32"
            />
          </div>
        </div>

        <div className="h-10 w-px bg-slate-800 hidden lg:block" />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 py-1.5 px-3 bg-slate-950 border border-slate-800 rounded-lg">
            <Globe size={18} className="text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase font-bold leading-none mb-0.5">Location</span>
              <span className="text-xs font-semibold text-slate-200">{tab.proxy.city}, {tab.proxy.country}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 py-1.5 px-3 bg-slate-950 border border-slate-800 rounded-lg">
            <Shield size={18} className="text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase font-bold leading-none mb-0.5">Proxy IP</span>
              <span className="text-xs font-semibold text-slate-200 mono">{tab.proxy.ip}</span>
            </div>
            <button 
              onClick={rotateIP}
              className={`p-1 hover:bg-slate-800 rounded-md transition-all ml-1 ${isRotating ? 'animate-spin' : ''}`}
              title="Cycle Virtual Identity"
            >
              <RotateCcw size={14} className="text-slate-400" />
            </button>
          </div>
        </div>

        <form 
          onSubmit={handleSearchSubmit}
          className="flex-1 min-w-[250px] h-10 bg-black border border-slate-800 rounded-lg flex items-center px-4 gap-3 focus-within:border-blue-500/50 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] relative"
        >
          <Search size={14} className="text-slate-600 shrink-0" />
          <input 
            type="text"
            placeholder="Search Google for videos or paste URL..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-transparent border-none outline-none text-[11px] text-slate-300 w-full placeholder:text-slate-700 mono"
          />
          {isSearching ? (
            <Loader2 size={14} className="text-blue-500 animate-spin" />
          ) : searchInput && (
            <button type="submit" className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest">
              Execute
            </button>
          )}

          {searchResults.length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-[100] p-2 max-h-60 overflow-y-auto overflow-x-hidden">
               <div className="px-2 py-1 text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 mb-1 flex justify-between">
                  <span>Search Grounding Results</span>
                  <button onClick={() => setSearchResults([])} className="hover:text-white text-[10px] lowercase">clear</button>
               </div>
               {searchResults.map((res, i) => (
                 <div 
                   key={i} 
                   onClick={() => addVideo(res.url, res.title)}
                   className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer flex items-center gap-3 group"
                 >
                   <Globe2 size={12} className="text-blue-500 shrink-0" />
                   <div className="flex flex-col min-w-0">
                     <span className="text-[11px] text-slate-200 font-bold truncate">{res.title}</span>
                     <span className="text-[9px] text-slate-500 truncate mono">{res.url}</span>
                   </div>
                 </div>
               ))}
            </div>
          )}
        </form>

        <button 
          onClick={() => addVideo(SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)])}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg text-white text-xs font-black transition-all uppercase tracking-wider"
        >
          <Plus size={16} />
          <span>Quick Launch</span>
        </button>
      </div>

      <div className="bg-slate-950 px-6 py-2 border-b border-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles size={12} className="text-amber-500 animate-pulse" />
          <p className="text-[10px] text-slate-500 italic mono uppercase tracking-tighter text-ellipsis overflow-hidden whitespace-nowrap max-w-2xl">
            AI MESH: {aiAdvice}
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 bg-[radial-gradient(circle_at_50%_0%,_#0f172a_0%,_#020617_100%)]">
          {tab.videos.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <Activity size={80} className="text-slate-800 animate-pulse mb-8" />
              <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest mb-2">Workspace Idle</h2>
              <p className="text-xs text-slate-600 text-center max-w-xs">
                Enter a search query like "Nature 4K" or paste a direct video URL to start streaming with virtual identities.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tab.videos.map(video => (
                <VideoPlayer 
                  key={video.id} 
                  video={video} 
                  onRemove={removeVideo}
                  onUpdateVideo={updateVideo}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabContent;
