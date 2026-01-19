
import React from 'react';

export const COUNTRIES = [
  { name: 'United States', code: 'US', cities: ['New York', 'Los Angeles', 'Chicago'] },
  { name: 'Germany', code: 'DE', cities: ['Berlin', 'Frankfurt', 'Munich'] },
  { name: 'Japan', code: 'JP', cities: ['Tokyo', 'Osaka', 'Kyoto'] },
  { name: 'United Kingdom', code: 'GB', cities: ['London', 'Manchester', 'Birmingham'] },
  { name: 'Singapore', code: 'SG', cities: ['Singapore City'] },
];

export const ISPS = ['CloudNet Pro', 'GlobalConnect', 'Titan Backbone', 'OmniFiber', 'CyberGuard ISP'];

export const SAMPLE_VIDEOS = [
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://vjs.zencdn.net/v/oceans.mp4"
];

export const generateRandomIP = () => {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
};

export const generateRandomProxy = () => {
  const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  return {
    ip: generateRandomIP(),
    country: country.name,
    city: country.cities[Math.floor(Math.random() * country.cities.length)],
    isp: ISPS[Math.floor(Math.random() * ISPS.length)],
    latency: Math.floor(Math.random() * 150) + 10,
  };
};
