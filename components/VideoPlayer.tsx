
import React, { useState } from 'react';
import { VideoInstance } from '../types';
import { Play, Pause, X, Monitor, ShieldCheck, RefreshCw } from 'lucide-react';

interface VideoPlayerProps {
  video: VideoInstance;
  onRemove: (id: string) => void;
  onTogglePlay: (id: string) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onRemove, onTogglePlay }) => {
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="relative bg-slate-900 border border-slate-700 rounded-lg overflow-hidden group shadow-xl transition-all duration-300 hover:border-blue-500/50">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2 overflow-hidden">
          <Monitor size={14} className="text-blue-400 shrink-0" />
          <span className="text-xs font-medium truncate text-slate-300">{video.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowStats(!showStats)}
            className="p-1 hover:bg-slate-700 rounded text-slate-400"
            title="Video Stats"
          >
            <ShieldCheck size={14} />
          </button>
          <button 
            onClick={() => onRemove(video.id)}
            className="p-1 hover:bg-red-900/30 hover:text-red-400 rounded text-slate-400"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="relative aspect-video bg-black flex items-center justify-center">
        <video 
          src={video.url} 
          className="w-full h-full object-cover"
          autoPlay 
          muted 
          loop
        />
        
        {showStats && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm p-4 flex flex-col justify-center gap-2 animate-in fade-in zoom-in duration-200">
            <h4 className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">Stream Identity</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Virtual IP</span>
                <span className="text-slate-200 mono">{video.ip}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Status</span>
                <span className="text-green-400 uppercase">Encrypted</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Bitrate</span>
                <span className="text-slate-200">4.8 Mbps</span>
              </div>
            </div>
            <button 
               className="mt-2 w-full py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-medium flex items-center justify-center gap-1"
               onClick={() => setShowStats(false)}
            >
              Close Stats
            </button>
          </div>
        )}
      </div>

      <div className="px-3 py-2 flex items-center gap-4 text-[10px] text-slate-500 bg-slate-900/50">
        <div className="flex items-center gap-1">
          <RefreshCw size={10} className="animate-spin duration-[3000ms]" />
          <span>Active Tunnel</span>
        </div>
        <div className="ml-auto mono text-blue-400/80">
          ID: {video.id.slice(0,8)}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
