import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Download,
  Share2,
  PlusSquare,
  X,
  Smartphone,
  ExternalLink,
  Laptop,
  Check
} from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isInIframe, install, openInNewTab } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'desktop' | 'android' | 'ios'>(
    isIOS ? 'ios' : 'desktop'
  );
  const [copied, setCopied] = useState(false);

  // If already installed and not in iframe, no need to show the button
  if (isInstalled && !isInIframe) {
    return null;
  }

  return (
    <>
      {/* PWA Install Button */}
      <button
        id="btn-pwa-install"
        type="button"
        onClick={() => {
          if (isInstallable && !isInIframe) {
            install();
          } else {
            setShowModal(true);
          }
        }}
        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        title="Uygulamayı bilgisayarınıza veya telefonunuza yükleyin"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Uygulamayı Yükle</span>
        <span className="sm:hidden">Yükle</span>
      </button>

      {/* PWA Installation Instructions Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">TCDD Bordro'yu Yükle</h3>
                  <p className="text-xs text-slate-400">Çevrimdışı ve tam ekran kullanım</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Platform Tabs */}
            <div className="flex items-center gap-1 mt-3 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  activeTab === 'desktop'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                Masaüstü
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  activeTab === 'android'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Android
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                iPhone / iPad
              </button>
            </div>

            {/* Tab Body */}
            <div className="mt-4 space-y-3 text-xs text-slate-300">
              {activeTab === 'desktop' && (
                <div className="space-y-2 p-3 bg-slate-800/60 rounded-lg border border-slate-700/60">
                  <strong className="text-white block">Google Chrome / Microsoft Edge:</strong>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    1. Tarayıcının adres çubuğunun sağındaki <strong>Yükle</strong> simgesine tıklayın.<br />
                    2. Veya sağ üstteki <strong>üç nokta (⋮)</strong> menüsünden <strong>"Uygulamayı Yükle"</strong> seçeneğini seçin.<br />
                    3. Uygulama masaüstünüze ve başlat menünüze bağımsız pencere olarak yüklenir.
                  </p>
                </div>
              )}

              {activeTab === 'android' && (
                <div className="space-y-2 p-3 bg-slate-800/60 rounded-lg border border-slate-700/60">
                  <strong className="text-white block">Android (Chrome):</strong>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    1. Chrome tarayıcısında sağ üstteki <strong>üç nokta (⋮)</strong> simgesine dokunun.<br />
                    2. <strong>"Uygulamayı Yükle"</strong> veya <strong>"Ana Ekrana Ekle"</strong> seçeneğine dokunun.<br />
                    3. Uygulama telefonunuzun ana ekranına kurulur ve internetsiz ortamda da çalışır.
                  </p>
                </div>
              )}

              {activeTab === 'ios' && (
                <div className="space-y-2 p-3 bg-slate-800/60 rounded-lg border border-slate-700/60">
                  <strong className="text-white block">iPhone & iPad (Safari):</strong>
                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <p className="flex items-center gap-1.5">
                      1. Safari'nin alt menüsündeki <Share2 className="w-3.5 h-3.5 text-sky-400 inline" /> <strong>Paylaş</strong> butonuna dokunun.
                    </p>
                    <p className="flex items-center gap-1.5">
                      2. Menüyü aşağı kaydırıp <PlusSquare className="w-3.5 h-3.5 text-amber-400 inline" /> <strong>Ana Ekrana Ekle</strong> seçeneğini seçin.
                    </p>
                    <p>3. Sağ üstteki <strong>Ekle</strong> butonuna dokunarak kurulumu tamamlayın.</p>
                  </div>
                </div>
              )}

              {isInIframe && (
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 text-[11px]">
                  <strong>Not:</strong> Önizleme penceresinde tarayıcı güvenlik kısıtlaması nedeniyle doğrudan yükleme penceresi açılamayabilir. Aşağıdaki butona tıklayarak uygulamayı yeni sekmede açıp doğrudan yükleyebilirsiniz.
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  openInNewTab();
                  setShowModal(false);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 text-xs font-semibold text-white transition cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Yeni Sekmede Aç ve Yükle
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center justify-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition cursor-pointer"
                title="Uygulama Bağlantısını Kopyala"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : 'Linki Kopyala'}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
