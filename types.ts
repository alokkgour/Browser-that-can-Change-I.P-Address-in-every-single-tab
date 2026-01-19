
export interface VirtualProxy {
  ip: string;
  country: string;
  city: string;
  isp: string;
  latency: number;
}

export interface VideoInstance {
  id: string;
  url: string;
  title: string;
  status: 'playing' | 'paused' | 'buffering';
  ip: string; // Specific IP if overridden
}

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  proxy: VirtualProxy;
  videos: VideoInstance[];
  isActive: boolean;
}

export interface NetworkStats {
  timestamp: string;
  inbound: number;
  outbound: number;
}
