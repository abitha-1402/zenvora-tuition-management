import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed as standalone PWA, hide button
  if (isInstalled) {
    return null;
  }

  // Desktop Chrome / Edge / Android install prompt available
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#7047D7] bg-[#F3EEFF] hover:bg-[#E5D9FA] rounded-lg transition-colors cursor-pointer border border-[#7047D7]/20 whitespace-nowrap shrink-0 shadow-xs"
        title="Install Zenvora as an app on your phone or desktop"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#7047D7] bg-[#F3EEFF] hover:bg-[#E5D9FA] rounded-lg transition-colors cursor-pointer border border-[#7047D7]/20 whitespace-nowrap shrink-0"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install PWA</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900">Install on iPhone / iPad</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed space-y-2 mb-4">
                <span>1. In Safari, tap the <strong>Share</strong> icon (box with upward arrow) at bottom of screen.</span><br />
                <span>2. Scroll down and tap <strong>Add to Home Screen</strong>.</span><br />
                <span>3. Tap <strong>Add</strong> in the top right to install Zenvora with camera scanner support.</span>
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-[#7047D7] py-2 text-xs font-semibold text-white hover:bg-[#45258D] transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Generic fallback: when browser has not fired beforeinstallprompt yet or standard browser, provide an install info trigger
  return (
    <button
      onClick={() => {
        alert(
          'To install Zenvora as an app:\n\n• On Chrome/Edge: Click the install icon in the address bar or menu (⋮) -> "Install Zenvora".\n• On Mobile: Tap browser menu -> "Add to Home Screen".'
        );
      }}
      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border border-slate-200 whitespace-nowrap shrink-0"
      title="Install Zenvora Progressive Web App"
    >
      <Download className="w-3.5 h-3.5 text-[#7047D7]" />
      <span>Install PWA</span>
    </button>
  );
};
