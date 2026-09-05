import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X, Smartphone, ExternalLink, Laptop, Check } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isInIframe, install, openInNewTab } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [copied, setCopied] = useState(false);

  // If already running as an installed standalone PWA, show installed badge
  if (isInstalled) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 rounded-md px-2.5 py-1.5 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        PWA Yüklü
      </span>
    );
  }

  // Native Chromium install prompt ready (Outside iframe)
  if (isInstallable) {
    return (
      <button
        id="btn-pwa-install"
        type="button"
        onClick={install}
        className="flex items-center gap-1.5 rounded-md bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-semibold px-2.5 py-1.5 shadow-sm transition border border-red-500 cursor-pointer animate-pulse hover:animate-none"
        title="Uygulamayı Cihazınıza Yükleyin (PWA)"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Uygulamayı Yükle</span>
        <span className="sm:hidden">Yükle</span>
      </button>
    );
  }

  // Inside iframe (AI Studio preview environment)
  if (isInIframe) {
    return (
      <>
        <button
          id="btn-pwa-iframe"
          type="button"
          onClick={() => setShowGuide(true)}
          className="flex items-center gap-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 text-xs font-medium px-2.5 py-1.5 transition cursor-pointer shadow-xs"
          title="Uygulamayı İndir / Yükle (PWA)"
        >
          <Download className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">PWA Yükle</span>
          <span className="sm:hidden">PWA</span>
        </button>

        {showGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                  <Download className="w-4 h-4 text-red-500" />
                  PWA Olarak Yükleme
                </h3>
                <button
                  type="button"
                  onClick={() => setShowGuide(false)}
                  className="p-1 text-slate-400 hover:text-white rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-xs text-slate-300">
                <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-lg text-amber-200">
                  <p className="font-medium">
                    ⚠️ Tarayıcı Güvenlik Kuralı:
                  </p>
                  <p className="mt-1 text-[11px] text-amber-300/90 leading-relaxed">
                    Google Chrome, Safari ve Edge; siteler önizleme penceresi (iframe) içerisindeyken adres çubuğundaki indirme simgesini kasıtlı olarak gizler. Yükleme seçeneğinin görünmesi için uygulamanın doğrudan kendi sekmesinde açılması gerekir.
                  </p>
                </div>

                <div className="space-y-2 bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                  <div className="flex items-start gap-2">
                    <Laptop className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Bilgisayarda (Chrome / Edge):</strong>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Aşağıdaki butonla yeni sekmede açtığınızda adres çubuğunun sağında <strong>"Yükle" (küçük monitör simgesi)</strong> belirecektir.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 pt-1 border-t border-slate-700/60">
                    <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Telefonda (Android / iOS):</strong>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Chrome'da sağ üst menüden <em>"Uygulamayı Yükle"</em>; iPhone Safari'de ise Paylaş menüsünden <em>"Ana Ekrana Ekle"</em> diyerek internetsiz kullanabilirsiniz.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      openInNewTab();
                      setShowGuide(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 py-2.5 text-xs font-semibold text-white transition shadow cursor-pointer"
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
                    className="flex items-center justify-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2.5 text-xs font-medium text-slate-300 transition cursor-pointer"
                    title="Uygulama Bağlantısını Kopyala"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : 'Linki Kopyala'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
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

  // Top-level desktop browser beforeinstallprompt fallback
  return (
    <>
      <button
        id="btn-pwa-info"
        type="button"
        onClick={() => setShowGuide(true)}
        className="flex items-center gap-1.5 rounded-md bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium px-2.5 py-1.5 transition cursor-pointer"
        title="Uygulamayı Masaüstüne veya Telefona Yükle (PWA)"
      >
        <Download className="w-3.5 h-3.5 text-red-400" />
        <span className="hidden sm:inline">PWA Yükle</span>
        <span className="sm:hidden">PWA</span>
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                <Download className="w-4 h-4 text-red-500" />
                Uygulama Olarak Yükleme (PWA)
              </h3>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-slate-300">
              <div className="p-2.5 bg-sky-950/40 border border-sky-500/30 rounded-lg text-sky-200 text-[11px] leading-relaxed">
                <span className="font-semibold block text-sky-100 mb-0.5">ℹ️ Tarayıcı Yükleme Yolu:</span>
                Google Chrome ve Edge'de adres çubuğunun en sağındaki simge gecikirse aşağıdaki adımlarla 1 saniyede doğrudan yükleyebilirsiniz.
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 space-y-2.5">
                <div>
                  <strong className="text-white block mb-1 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-sky-400" />
                    Chrome (Bilgisayar):
                  </strong>
                  <p className="text-[11px] text-slate-300">
                    Sağ üstteki <strong>üç nokta (⋮)</strong> menüsüne tıklayın $\rightarrow$ <strong>"Kaydet ve Paylaş"</strong> $\rightarrow$ <strong>"TCDD Bordro Uygulamasını Yükle..."</strong> seçeneğine basın.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-700/60">
                  <strong className="text-white block mb-1 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-indigo-400" />
                    Microsoft Edge (Bilgisayar):
                  </strong>
                  <p className="text-[11px] text-slate-300">
                    Sağ üstteki <strong>üç nokta (...)</strong> menüsüne tıklayın $\rightarrow$ <strong>"Uygulamalar"</strong> $\rightarrow$ <strong>"Bu siteyi bir uygulama olarak yükle"</strong> seçeneğini seçin.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-700/60">
                  <strong className="text-white block mb-1 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    Android (Chrome):
                  </strong>
                  <p className="text-[11px] text-slate-300">
                    Sağ üstteki <strong>üç nokta (⋮)</strong> menüsünden <strong className="text-emerald-400">"Uygulamayı Yükle"</strong> veya <strong className="text-emerald-400">"Ana Ekrana Ekle"</strong> butonuna dokunun.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-700/60">
                  <strong className="text-white block mb-1 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                    iPhone / iPad (Safari):
                  </strong>
                  <p className="text-[11px] text-slate-300">
                    Alt kısımdaki <strong className="text-amber-400">Paylaş (kare ve yukarı ok)</strong> simgesine dokunun $\rightarrow$ aşağı kaydırıp <strong className="text-amber-400">"Ana Ekrana Ekle"</strong> seçeneğini seçin.
                  </p>
                </div>
              </div>

              {/* Status indicators */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Service Worker: Aktif
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Manifest: Hazır
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Çevrimdışı Mod: Destekleniyor
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowGuide(false)}
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

