import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Train, Sparkles, ShieldCheck, ChevronRight, Zap } from 'lucide-react';

interface IntroSplashAnimationProps {
  onComplete: () => void;
}

export function IntroSplashAnimation({ onComplete }: IntroSplashAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Demiryolu Bordro Motoru Başlatılıyor...');

  useEffect(() => {
    // 2.6 saniyelik gerçekçi kademeli yükleme simülasyonu
    const intervals: NodeJS.Timeout[] = [];

    const t1 = setTimeout(() => {
      setProgress(28);
      setStatusText('31. Dönem TİS ve Kıdem Katsayıları Doğrulanıyor...');
    }, 450);

    const t2 = setTimeout(() => {
      setProgress(64);
      setStatusText('2026 GİB Gelir Vergisi Dilimleri & SGK Matrahları Yükleniyor...');
    }, 1100);

    const t3 = setTimeout(() => {
      setProgress(88);
      setStatusText('Personel Hakediş & Kesinti Modülleri Hazırlanıyor...');
    }, 1750);

    const t4 = setTimeout(() => {
      setProgress(100);
      setStatusText('Sistem Hazır! İyi Çalışmalar Dileriz...');
    }, 2300);

    const t5 = setTimeout(() => {
      onComplete();
    }, 2900);

    intervals.push(t1, t2, t3, t4, t5);

    return () => {
      intervals.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      id="tcdd-intro-splash"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.04,
        filter: 'blur(8px)',
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
      }}
      onClick={onComplete}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-950 text-white select-none overflow-hidden cursor-pointer"
      title="Atlamak için tıklayın veya dokunun"
    >
      {/* Arka Plan Atmosferik Işıklar & Izgara Efekti */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Üstte ve Altta Ambient Renk Parıltıları */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-teal-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-3xl" />

        {/* Perspektif Ray ve Hız Çizgileri Animasyonu */}
        <svg
          className="absolute inset-0 w-full h-full opacity-35"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1000 600"
        >
          <defs>
            <linearGradient id="railGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="60%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="beamGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Tren Farı Işık Konisi (Horizon'dan aşağıya doğru) */}
          <polygon points="500,220 300,600 700,600" fill="url(#beamGrad)" opacity="0.15" />

          {/* Ufuk Çizgisinden Bize Doğru Genişleyen Ray Hatları */}
          <line x1="500" y1="230" x2="150" y2="600" stroke="url(#railGrad)" strokeWidth="3" />
          <line x1="500" y1="230" x2="850" y2="600" stroke="url(#railGrad)" strokeWidth="3" />

          {/* İç Ray Çizgileri */}
          <line x1="500" y1="230" x2="320" y2="600" stroke="#059669" strokeWidth="2" strokeDasharray="12 8" />
          <line x1="500" y1="230" x2="680" y2="600" stroke="#059669" strokeWidth="2" strokeDasharray="12 8" />

          {/* Hızlı akan traversler (Demiryolu travers çizgileri) */}
          {[260, 300, 350, 410, 480, 560].map((y, idx) => {
            const width = ((y - 230) / (600 - 230)) * 700;
            return (
              <line
                key={idx}
                x1={500 - width / 2}
                y1={y}
                x2={500 + width / 2}
                y2={y}
                stroke="#10b981"
                strokeWidth="2.5"
                strokeOpacity={0.25 + idx * 0.12}
              />
            );
          })}
        </svg>

        {/* Hafif Yıldız / Toz Partikül Parıltıları */}
        <div className="absolute inset-0 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
      </div>

      {/* Sağ Üstte Atla / Girişi Geç Butonu */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:border-emerald-500/60 text-xs font-medium backdrop-blur-md transition-all shadow-lg cursor-pointer"
        >
          <span>Girişi Geç</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Merkez İçerik: Tren Logosu & Kurumsal Başlıklar */}
      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        {/* Dönen / Nabız Alan Dış Halka & Tren İkon Rozeti */}
        <div className="relative mb-6">
          {/* Arka plan ışık halkası */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 blur-xl"
          />

          {/* Dış Dönüş Çemberi */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-2 rounded-full border border-emerald-500/30 border-dashed"
          />

          {/* Ana Rozet Konteyneri */}
          <motion.div
            initial={{ scale: 0, rotate: -25 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border-2 border-emerald-500/70 shadow-2xl shadow-emerald-500/30 overflow-hidden"
          >
            {/* Şık parıltı sweep efekti */}
            <motion.div
              initial={{ x: '-100%', y: '-100%' }}
              animate={{ x: '200%', y: '200%' }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut', repeatDelay: 1 }}
              className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />

            <div className="flex flex-col items-center justify-center">
              <Train className="w-12 h-12 sm:w-14 sm:h-14 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[9px] font-mono tracking-widest text-emerald-300 font-bold uppercase">
                  TCDD
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Üst Rozet Etiketi */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 text-[11px] font-semibold tracking-wider uppercase mb-3 shadow-inner"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>TÜRKİYE CUMHURİYETİ DEVLET DEMİRYOLLARI</span>
        </motion.div>

        {/* Ana Başlık */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white font-sans"
        >
          TCDD TAŞIMACILIK A.Ş.
        </motion.h1>

        {/* Alt Başlık & Mevzuat */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-1.5 text-sm sm:text-base text-slate-300 font-medium font-sans"
        >
          31. Dönem TİS • Sürekli İşçi Bordro & Maaş Robotu
        </motion.p>

        {/* Mevzuat & Versiyon Etiketi */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-400"
        >
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            2026 Mevzuatı Tam Uyumlu
          </span>
          <span>•</span>
          <span className="text-slate-400">4/a İşçi Statüsü</span>
        </motion.div>

        {/* Canlı İlerleme Çubuğu & Durum Bilgisi */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="w-full mt-8 bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 backdrop-blur-md shadow-xl"
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium truncate pr-2">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
              <span className="truncate">{statusText}</span>
            </div>
            <span className="font-mono font-bold text-emerald-400 shrink-0">
              %{progress}
            </span>
          </div>

          {/* İlerleme Barı */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.7)]"
            />
          </div>
        </motion.div>

        {/* Altta Dokunma / Hızlı Geçiş İpucu */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 text-[11px] text-slate-500 flex items-center gap-1"
        >
          Devam etmek için ekrana dokunun veya tıklayın
        </motion.p>
      </div>
    </motion.div>
  );
}
