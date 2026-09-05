import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="pwa-offline-indicator"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-amber-400/40 backdrop-blur"
    >
      <WifiOff className="w-4 h-4 animate-pulse text-amber-100" />
      <span>Çevrimdışı Mod — Önbelleğe alınmış bordro verileri kullanılıyor.</span>
    </div>
  );
};
