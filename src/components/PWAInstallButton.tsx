import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X, Smartphone } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showGenericGuide, setShowGenericGuide] = useState(false);

  // If already running as an installed PWA in standalone mode, hide
  if (isInstalled) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 rounded-md px-2 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        PWA Yüklü
      </span>
    );
  }

  // Chromium / Android / Desktop flow when prompt event captured
  if (isInstallable) {
    return (
      <button
        id="btn-pwa-install"
        type="button"
        onClick={install}
        className="flex items-center gap-1.5 rounded-md bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-semibold px-2.5 py-1.5 shadow-sm transition border border-red-500 cursor-pointer"
        title="Uygulamayı Cihazınıza Yükleyin (PWA)"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Uygulamayı Yükle</span>
        <span className="sm:hidden">Yükle</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="btn-pwa-install-ios"
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-medium px-2.5 py-1.5 transition cursor-pointer"
          title="iPhone / iPad'e Yükle"
        >
          <Smartphone className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">iOS'a Ekle</span>
          <span className="sm:hidden">Yükle</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                  <Smartphone className="w-4 h-4 text-red-500" />
                  iPhone / iPad'e Yükleme
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-white rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-red-400 font-bold">1</div>
                  <p>Safari tarayıcısının alt menüsündeki <strong className="text-white inline-flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Paylaş</strong> butonuna dokunun.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-red-400 font-bold">2</div>
                  <p>Menüyü aşağı kaydırıp <strong className="text-white inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5" /> Ana Ekrana Ekle</strong> seçeneğine dokunun.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-red-400 font-bold">3</div>
                  <p>Sağ üstteki <strong>Ekle</strong> butonuna basarak internetsiz de çalışan masaüstü uygulamasını başlatın.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-lg bg-red-600 hover:bg-red-700 py-2 text-xs font-semibold text-white transition cursor-pointer"
              >
                Anladım
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for desktop browser or environments where beforeinstallprompt hasn't fired yet
  return (
    <>
      <button
        id="btn-pwa-info"
        type="button"
        onClick={() => setShowGenericGuide(true)}
        className="flex items-center gap-1.5 rounded-md bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium px-2.5 py-1.5 transition cursor-pointer"
        title="Uygulamayı Masaüstüne veya Telefona Yükle (PWA)"
      >
        <Download className="w-3.5 h-3.5 text-red-400" />
        <span className="hidden sm:inline">PWA Olarak Yükle</span>
        <span className="sm:hidden">PWA</span>
      </button>

      {showGenericGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                <Download className="w-4 h-4 text-red-500" />
                Uygulama Olarak Yükleme (PWA)
              </h3>
              <button
                type="button"
                onClick={() => setShowGenericGuide(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-slate-300">
              <p>
                Bu uygulama Progressive Web App (PWA) standartlarındadır. Tarayıcınız üzerinden cihazınıza bağımsız bir uygulama gibi yükleyebilir ve internetsiz (çevrimdışı) kullanabilirsiniz:
              </p>
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 space-y-2">
                <div>
                  <strong className="text-white block mb-0.5">💻 Chrome / Edge (Bilgisayar):</strong>
                  Adres çubuğunun sağ tarafındaki <strong className="text-red-400">Yükle (İndir simgesi)</strong> butonuna tıklayarak doğrudan masaüstü uygulaması yapabilirsiniz.
                </div>
                <div>
                  <strong className="text-white block mb-0.5">📱 Android (Chrome):</strong>
                  Sağ üstteki üç nokta menüsüne dokunup <strong className="text-red-400">"Uygulamayı Yükle"</strong> veya <strong className="text-red-400">"Ana Ekrana Ekle"</strong> seçeneğini seçin.
                </div>
                <div>
                  <strong className="text-white block mb-0.5">🍏 iPhone / iPad (Safari):</strong>
                  Alt menüdeki <strong className="text-red-400">Paylaş</strong> butonuna dokunup <strong className="text-red-400">"Ana Ekrana Ekle"</strong> seçeneğini seçin.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowGenericGuide(false)}
              className="mt-5 w-full rounded-lg bg-red-600 hover:bg-red-700 py-2 text-xs font-semibold text-white transition cursor-pointer"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </>
  );
};
