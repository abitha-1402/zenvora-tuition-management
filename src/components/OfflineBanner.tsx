import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-bounce no-print">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>Offline Mode — Stored local data remains accessible. Camera requires HTTPS connection.</span>
    </div>
  );
};
