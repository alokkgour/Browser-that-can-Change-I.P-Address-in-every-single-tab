
import React, { useState } from 'react';
import { VideoInstance } from '../types';
import { Play, Pause, X, Monitor, ShieldCheck, RefreshCw, Hash } from 'lucide-react';
import { generateRandomIP } from '../constants';

interface VideoPlayerProps {
  video: VideoInstance;
  onRemove: (id: string) => void;
  onUpdateVideo: (id: string, updates: Partial<VideoInstance>) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onRemove, onUpdateVideo }) => {
  const [showStats, setShowStats] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const rotateVideoIP = () => {
    setIsRotating(true);
    setTimeout(() => {
      onUpdateVideo(video.id, { ip: generateRandomIP() });
      setIsRotating(false);
    }, 600);
  };

  return (
    <div className="relative bg-slate-900 border border-slate-700 rounded-lg overflow-hidden group shadow-xl transition-all duration-300 hover:border-blue-500/50">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2 overflow-hidden">
          <Monitor size={14} className="text-blue-400 shrink-0" />
          <span className="text-xs font-medium truncate text-slate-300">{video.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={rotateVideoIP}
            className={`p-1 hover:bg-slate-700 rounded text-emerald-400 transition-transform ${isRotating ? 'rotate-180 duration-500' : ''}`}
            title="Rotate Stream IP"
          >
            <RefreshCw size={14} />
          </button>
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
          onError={(e) => {
            // Safe logging to avoid circular reference issues in some environments
            console.warn(`Video load error for: ${video.title}`);
          }}
        />
        
        {showStats && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm p-4 flex flex-col justify-center gap-2 animate-in fade-in zoom-in duration-200">
            <h4 className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">Stream Identity</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Virtual IP</span>
                <span className="text-emerald-400 mono font-bold">{video.ip}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Status</span>
                <span className="text-green-400 uppercase">Dedicated Tunnel</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Protocol</span>
                <span className="text-slate-200">UDP/QUIC</span>
              </div>
            </div>
            <button 
               className="mt-2 w-full py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-medium flex items-center justify-center gap-1"
               onClick={() => setShowStats(false)}
            >
              Close Info
            </button>
          </div>
        )}
      </div>

      <div className="px-3 py-2 flex items-center gap-4 text-[10px] text-slate-500 bg-slate-900/50">
        <div className="flex items-center gap-1">
          <Hash size={10} className="text-emerald-500" />
          <span className="mono text-emerald-500/80">{video.ip}</span>
        </div>
        <div className="ml-auto mono text-blue-400/80">
          SID: {video.id.slice(0,8)}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
