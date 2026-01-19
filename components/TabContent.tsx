
import React, { useState, useEffect } from 'react';
import { BrowserTab, VideoInstance } from '../types';
import { Plus, RotateCcw, Globe, Shield, Activity, Sparkles, AlertCircle } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import { generateRandomIP, SAMPLE_VIDEOS } from '../constants';
import { getProxyAdvice } from '../services/geminiService';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TabContentProps {
  tab: BrowserTab;
  onUpdateTab: (tab: BrowserTab) => void;
}

const TabContent: React.FC<TabContentProps> = ({ tab, onUpdateTab }) => {
  const [aiAdvice, setAiAdvice] = useState<string>('Analyzing network environment...');
  const [isRotating, setIsRotating] = useState(false);
  const [networkData, setNetworkData] = useState<any[]>([]);

  useEffect(() => {
    // Initial advice
    const fetchAdvice = async () => {
      const advice = await getProxyAdvice(`${tab.proxy.city}, ${tab.proxy.country}`, tab.proxy.ip);
      setAiAdvice(advice);
    };
    fetchAdvice();

    // Mock network data
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

  const addVideo = () => {
    const videoUrl = SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)];
    const newVideo: VideoInstance = {
      id: Math.random().toString(36).substr(2, 9),
      url: videoUrl,
      title: `Stream Source ${tab.videos.length + 1}`,
      status: 'playing',
      ip: tab.proxy.ip
    };
    onUpdateTab({
      ...tab,
      videos: [...tab.videos, newVideo]
    });
  };

  const removeVideo = (id: string) => {
    onUpdateTab({
      ...tab,
      videos: tab.videos.filter(v => v.id !== id)
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-950">
      {/* Proxy Control Bar */}
      <div className="flex flex-wrap items-center gap-4 px-6 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3 py-1 px-3 bg-slate-800 rounded-lg border border-slate-700">
          <Globe size={18} className="text-blue-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold leading-none">Virtual Location</span>
            <span className="text-sm font-semibold">{tab.proxy.city}, {tab.proxy.country}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 py-1 px-3 bg-slate-800 rounded-lg border border-slate-700">
          <Shield size={18} className="text-emerald-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold leading-none">Status</span>
            <span className="text-sm font-semibold mono">{tab.proxy.ip}</span>
          </div>
          <button 
            onClick={rotateIP}
            className={`p-1.5 ml-2 hover:bg-slate-700 rounded-md transition-all ${isRotating ? 'animate-spin' : ''}`}
            title="Rotate IP Address"
          >
            <RotateCcw size={16} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 min-w-[300px] h-10 bg-slate-900 border border-slate-700 rounded-lg flex items-center px-4 gap-3">
          <Sparkles size={16} className="text-amber-400 shrink-0" />
          <p className="text-xs text-slate-400 italic truncate">
            {aiAdvice}
          </p>
        </div>

        <button 
          onClick={addVideo}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus size={18} />
          <span>New Stream</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Grid */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {tab.videos.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40">
              <Activity size={64} className="mb-4 text-slate-600" />
              <p className="text-lg">No active streams in this tab</p>
              <p className="text-sm">Click "New Stream" to launch a proxied video container</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tab.videos.map(video => (
                <VideoPlayer 
                  key={video.id} 
                  video={video} 
                  onRemove={removeVideo}
                  onTogglePlay={() => {}}
                />
              ))}
            </div>
          )}
        </div>

        {/* Side Metrics */}
        <div className="w-80 border-l border-slate-800 bg-slate-900/50 p-6 flex flex-col gap-6 hidden xl:flex">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <Activity size={14} /> Network Throughput
            </h3>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={networkData}>
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="traffic" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTraffic)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <AlertCircle size={14} /> Intelligence Log
            </h3>
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="text-[10px] p-2 bg-slate-800/50 rounded border border-slate-700/50 mono">
                  <span className="text-blue-400">[02:{i * 15}:44]</span> Peer handshake established via {tab.proxy.isp}. Latency: {tab.proxy.latency + i}ms.
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl">
             <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-blue-400" />
                <span className="text-xs font-bold text-blue-100">CyberProxy Active</span>
             </div>
             <p className="text-[10px] text-slate-400 leading-relaxed">
               All traffic in this tab is routed through 256-bit AES encrypted tunnels. Each video instance maintains its own virtual identity within the global mesh.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabContent;
