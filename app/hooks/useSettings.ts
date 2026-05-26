import { useState, useEffect } from 'react';

export function useSettings() {
  const [settings, setSettings] = useState({
    theme: 'dark',
    unit: 'metric',
    exportSize: 'square',
    watermark: 'on'
  });

  useEffect(() => {
    setTimeout(() => {
      setSettings({
        theme: localStorage.getItem('runcard-theme') || 'dark',
        unit: localStorage.getItem('runcard-unit') || 'metric',
        exportSize: localStorage.getItem('runcard-default-export-size') || 'square',
        watermark: localStorage.getItem('runcard-watermark') || 'on'
      });
    }, 0);

    const handleStorageChange = () => {
      setSettings({
        theme: localStorage.getItem('runcard-theme') || 'dark',
        unit: localStorage.getItem('runcard-unit') || 'metric',
        exportSize: localStorage.getItem('runcard-default-export-size') || 'square',
        watermark: localStorage.getItem('runcard-watermark') || 'on'
      });
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return settings;
}
