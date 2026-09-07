import React, { useState, useRef } from 'react';
import {
  BarChart3,
  FolderOpen,
  TrendingUp,
  Sparkles,
  User,
  Coins,
  Scissors,
  ShieldCheck,
  LayoutGrid,
  ChevronRight,
  ChevronLeft,
  Printer,
  Gift
} from 'lucide-react';
import { BordroData, IkramiyeData, IkramiyeType } from './types';
import {
  DEFAULT_TCDD_BORDRO,
  SAMPLE_AUGUST_2026_BORDRO,
  calculateBordro,
  formatCurrency
} from './utils/bordroEngine';
import { HeaderControls } from './components/HeaderControls';
import { EmployeeSection } from './components/EmployeeSection';
import { EarningsAndDeductionsSection } from './components/EarningsAndDeductionsSection';
import { StatutorySection } from './components/StatutorySection';
import { ZamModal, AppliedZamInfo } from './components/ZamModal';
import { SavedBordrolarModal } from './components/SavedBordrolarModal';
import { SalaryReportModal } from './components/SalaryReportModal';
import { IkramiyeBordroSection } from './components/IkramiyeBordroSection';
import { IkramiyePrintableSlip } from './components/IkramiyePrintableSlip';
import { OfflineIndicator } from './components/OfflineIndicator';
import { OfficialPrintableSlip } from './components/OfficialPrintableSlip';
import { IntroSplashAnimation } from './components/IntroSplashAnimation';
import { AnimatePresence } from 'motion/react';

type TabType = 'ozluk' | 'hakedisler' | 'kesintiler' | 'sgk-vergi' | 'tumu';
type ViewMode = 'maas' | 'ikramiye';

// 4. Madde: Normal bordrodan TAMAMEN BAĞIMSIZ İkramiye Veri Yapısı
const DEFAULT_IKRAMIYE_DATA: IkramiyeData = {
  saatUcr: 385.97,
  emkZam: 19.05,
  ikrSaati: 225,
  ikrGunu: 184,
  brutAylik: 0,
  kidemZammi: 0,
  inikas: 0,
  dengeOdenege: 0,
  icraTutari: 0,
  vergiOrani: 27, // Sabit Vergi Dilimi (TAM için %27)
  ikramiyeType: 'TAM'
};

const ZEROED_IKRAMIYE_DATA: IkramiyeData = {
  saatUcr: 0,
  emkZam: 0,
  ikrSaati: 0,
  ikrGunu: 0,
  brutAylik: 0,
  kidemZammi: 0,
  inikas: 0,
  dengeOdenege: 0,
  icraTutari: 0,
  vergiOrani: 27,
  ikramiyeType: 'TAM'
};

export function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [bordro, setBordro] = useState<BordroData>(() => calculateBordro(DEFAULT_TCDD_BORDRO));
  // 4. Madde: Bağımsız İkramiye State'i
  const [ikramiyeData, setIkramiyeData] = useState<IkramiyeData>(DEFAULT_IKRAMIYE_DATA);
  // 1. Madde: Uygulanan Zam Bilgisi ve Kontrolü
  const [lastAppliedZam, setLastAppliedZam] = useState<AppliedZamInfo | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('maas');
  const [activeTab, setActiveTab] = useState<TabType>('ozluk');
  const [isZamModalOpen, setIsZamModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleChange = (updates: Partial<BordroData>) => {
    setBordro(prev => calculateBordro({ ...prev, ...updates }));
  };

  const handleBaseRateChange = (saatUcr: number, emkZam: number) => {
    setBordro(prev => calculateBordro({ ...prev, saatUcr, emkZam }));
  };

  const handleHourChange = (id: string, hours: number) => {
    setBordro(prev => {
      const updatedEarnings = prev.earnings.map(item =>
        item.id === id ? { ...item, hours, manualAmount: undefined } : item
      );
      return calculateBordro({ ...prev, earnings: updatedEarnings });
    });
  };

  const handleAmountChange = (id: string, amount: number) => {
    setBordro(prev => {
      const updatedEarnings = prev.earnings.map(item =>
        item.id === id ? { ...item, amount, manualAmount: amount } : item
      );
      return calculateBordro({ ...prev, earnings: updatedEarnings });
    });
  };

  const handleResetIkramiye = () => {
    setIkramiyeData(ZEROED_IKRAMIYE_DATA);
    showNotification('İkramiye formu başarıyla sıfırlandı ve tüm alanlar temizlendi.');
  };

  const handleRestoreDefaultIkramiye = (type: IkramiyeType = 'TAM') => {
    if (type === 'TAM') {
      setIkramiyeData({
        saatUcr: 385.97,
        emkZam: 19.05,
        ikrSaati: 225,
        ikrGunu: 184,
        brutAylik: 0,
        kidemZammi: 0,
        inikas: 0,
        dengeOdenege: 0,
        icraTutari: 0,
        vergiOrani: 27,
        ikramiyeType: 'TAM'
      });
    } else {
      setIkramiyeData({
        saatUcr: 385.97,
        emkZam: 19.05,
        ikrSaati: 97.5,
        ikrGunu: 92,
        brutAylik: 0,
        kidemZammi: 0,
        inikas: 0,
        dengeOdenege: 0,
        icraTutari: 0,
        vergiOrani: 20,
        ikramiyeType: 'YARIM'
      });
    }
    showNotification(`Varsayılan TCDD ${type} İkramiye değerleri yüklendi.`);
  };

  const handleReset = () => {
    if (viewMode === 'ikramiye') {
      handleResetIkramiye();
      return;
    }

    setBordro(prev => {
      if (prev.calisanStatusu === 'normal') {
        return calculateBordro({
          ...SAMPLE_AUGUST_2026_BORDRO,
          calisanStatusu: 'normal',
          mevzuatNotu: '31. Dönem TİS 1/1 • TCDD Taşımacılık A.Ş. Sürekli İşçi Bordrosu (Standart 4/a)',
          vergiMuafiyeti: 0,
          earnings: SAMPLE_AUGUST_2026_BORDRO.earnings.map(e => {
            if (e.id === 'gst') return { ...e, hours: 0, amount: 0 };
            if (e.id === 'fm') return { ...e, rule: 'mesai175', label: 'FM %75 Pntr', badge: '%75' };
            if (e.id === 'gms') return { ...e, rule: 'gms24', label: 'GMŞ%(17+7)24', badge: 'OTO' };
            return e;
          })
        });
      } else if (prev.calisanStatusu === 'engelli') {
        return calculateBordro({
          ...SAMPLE_AUGUST_2026_BORDRO,
          calisanStatusu: 'engelli',
          mevzuatNotu: '31. Dönem TİS 1/1 • TCDD Taşımacılık A.Ş. Engelli Sürekli İşçi Bordrosu (GMŞ %(15+7)22, GVK 31 Engellilik İndirimi)',
          vergiMuafiyeti: 7000,
          earnings: SAMPLE_AUGUST_2026_BORDRO.earnings.map(e => {
            if (e.id === 'gst') return { ...e, hours: 0, amount: 0 };
            if (e.id === 'fm') return { ...e, rule: 'mesai175', label: 'FM %75 Pntr', badge: '%75' };
            if (e.id === 'gms') return { ...e, rule: 'gms22', label: 'GMŞ%(15+7)22', badge: 'OTO' };
            return e;
          })
        });
      }
      return calculateBordro(SAMPLE_AUGUST_2026_BORDRO);
    });
  };

  const handleZero = () => {
    if (viewMode === 'ikramiye') {
      handleResetIkramiye();
      return;
    }

    setBordro(prev => {
      const isNormal = prev.calisanStatusu === 'normal';
      const isEngelli = prev.calisanStatusu === 'engelli';
      const zeroedEarnings = prev.earnings.map(item => {
        // Hizmet Zammı girilen saate göre değişmeyen, hizmet yılına bağlı maktu hakediştir
        if (item.id === 'hzm') {
          return item;
        }
        return { ...item, hours: 0, amount: 0 };
      });
      return calculateBordro({
        ...prev,
        earnings: zeroedEarnings,
        birlestirilmSosyalYardim: prev.birlestirilmSosyalYardim || 5089.70,
        sporAidati: prev.sporAidati || 10,
        calistigiGun: prev.calistigiGun || 31,
        sskGunu: prev.sskGunu || 30,
        vergiMuafiyeti: isNormal ? 0 : (prev.vergiMuafiyeti || (isEngelli ? 7000 : 3000)),
        terfiFarki: 0,
        mahsupKesintisi: 0,
        sskMatrahD: 0,
        customDeductions: [],
        hastGun: 0
      });
    });
  };

  const handleRecalculate = () => {
    setBordro(prev => calculateBordro({ ...prev }));
  };

  const handleApplyZam = (
    zamRate: number,
    isPartial: boolean,
    oldDays: number,
    newDays: number,
    target: 'maas' | 'ikramiye' | 'both' = 'both'
  ) => {
    const rateMultiplier = 1 + zamRate / 100;
    let effectiveMultiplier = rateMultiplier;

    if (isPartial && oldDays + newDays > 0) {
      effectiveMultiplier = (oldDays * 1.0 + newDays * rateMultiplier) / (oldDays + newDays);
    }

    // 4. Madde: Maaş bordrosuna uygula
    if (target === 'maas' || target === 'both') {
      setBordro(prev => {
        const newSaatUcr = prev.saatUcr * effectiveMultiplier;
        const newEmkZam = prev.emkZam * effectiveMultiplier;
        const newIase = prev.iaseGunlukKatsayi * effectiveMultiplier;
        const newHizmet = prev.hizmetYillikKatsayi * effectiveMultiplier;
        const newSosyal = prev.birlestirilmSosyalYardim * effectiveMultiplier;
        const newPostabasi = (prev.postabasiSaatUcreti ?? 4.84) * effectiveMultiplier;
        const newSendika = prev.sendikaAidati * effectiveMultiplier;

        return calculateBordro({
          ...prev,
          saatUcr: newSaatUcr,
          emkZam: newEmkZam,
          iaseGunlukKatsayi: newIase,
          hizmetYillikKatsayi: newHizmet,
          birlestirilmSosyalYardim: newSosyal,
          postabasiSaatUcreti: newPostabasi,
          sendikaAidati: newSendika
        });
      });
    }

    // 4. Madde: İkramiyeye bağımsız olarak uygula
    if (target === 'ikramiye' || target === 'both') {
      setIkramiyeData(prev => {
        const baseSaatUcr = prev.saatUcr > 0 ? prev.saatUcr : bordro.saatUcr;
        const baseEmkZam = prev.emkZam > 0 ? prev.emkZam : bordro.emkZam;
        return {
          ...prev,
          saatUcr: Math.round(baseSaatUcr * effectiveMultiplier * 1000000) / 1000000,
          emkZam: Math.round(baseEmkZam * effectiveMultiplier * 1000000) / 1000000
        };
      });
    }

    // 1. Madde: Uygulanan zam kaydını tut
    const timeStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    setLastAppliedZam({
      rate: zamRate,
      isPartial,
      target,
      appliedAt: timeStr
    });

    const targetLabel =
      target === 'both'
        ? 'Maaş ve İkramiyeye (Tüm Bordrolara)'
        : target === 'ikramiye'
        ? 'İkramiye Bordrosuna'
        : 'Maaş Bordrosuna';
    showNotification(`%${zamRate} oranında TİS zammı ${targetLabel} başarıyla uygulandı.`);
  };

  const handleSyncSaatUcretiToIkramiye = () => {
    setIkramiyeData(prev => ({
      ...prev,
      saatUcr: bordro.saatUcr,
      emkZam: bordro.emkZam
    }));
    showNotification(`Maaş bordrosundaki Saat Ücreti (${bordro.saatUcr.toFixed(4)} ₺) ve Emek Zammı ikramiyeye aktarıldı.`);
  };

  const handleResetZam = () => {
    setLastAppliedZam(null);
    showNotification('Zam kaydı sıfırlandı. Yeni oran uygulayabilirsiniz.');
  };

  const handleExportJSON = () => {
    try {
      const jsonStr = JSON.stringify(bordro, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = url;
      downloadAnchor.download = `tcdd-bordro-${bordro.aySecim}-2026.json`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      showNotification('Bordro yedeği JSON dosyası olarak indirildi.');
    } catch {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bordro, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `tcdd-bordro-${bordro.aySecim}-2026.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const rawContent = event.target?.result as string;
        const parsed = JSON.parse(rawContent);
        if (parsed && typeof parsed === 'object') {
          setBordro(calculateBordro({ ...DEFAULT_TCDD_BORDRO, ...parsed }));
          showNotification(`"${file.name}" bordro dosyası başarıyla yüklendi.`);
        } else {
          alert('Dosya geçerli bir bordro nesnesi içermiyor!');
        }
      } catch {
        alert('Seçilen dosya geçerli bir JSON formatında değil! Lütfen doğru bordro dosyasını seçiniz.');
      }
    };
    reader.onerror = () => {
      alert('Dosya okunurken bir hata oluştu.');
    };
    reader.readAsText(file, 'UTF-8');
  };

  return (
    <div className="min-h-screen bg-slate-100/80 p-2 sm:p-4 2xl:p-6 flex flex-col items-center font-dotmatrix text-slate-900">
      {/* Toast Bildirimi */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-emerald-400 border border-emerald-500/50 px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Input for JSON import - Mobil ve tüm platformlarda tüm dosyaları aktif kılan accept filtresi */}
      <input
        id="file-input-global-import"
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,application/json,text/plain,text/json,application/octet-stream,*/*"
        className="hidden"
      />

      {/* Üst Kurumsal Navigasyon ve Birincil Rapor Başlığı (Her Ekranda Sabit ve Belirgin) */}
      <div className="w-full max-w-7xl 2xl:max-w-[1920px] 3xl:max-w-[2560px] mb-2.5 sm:mb-3 no-print">
        <div className="bg-slate-900 text-white rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto">
            <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-600 text-white font-bold text-lg sm:text-xl shadow-inner shrink-0">
              ₺
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="font-bold text-xs sm:text-sm md:text-base tracking-tight text-white truncate">
                  TCDD TAŞIMACILIK A.Ş. BORDRO SİSTEMİ
                </span>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 text-[9.5px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0">
                  2026 Mevzuatı
                </span>
              </div>
              <p className="text-slate-400 text-[11px] sm:text-xs mt-0.5 truncate hidden sm:block">
                31. Dönem TİS • 4/a Sürekli İşçi Aylık Maaş ve Kesinti Robotu
              </p>
            </div>
          </div>

          {/* Mobilde 6 buton tam genişlikte, masaüstünde flex */}
          <div className="grid grid-cols-6 sm:flex items-center gap-1 sm:gap-1.5 w-full md:w-auto">
            <button
              id="top-nav-btn-open-report"
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="px-1.5 sm:px-3 py-1.5 sm:py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer shadow-xs border border-emerald-500/50"
              title="Geçmiş Maaşlar, Toplam Gelir-Gider ve Vergi Raporu (Şifreli: 1510)"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
              <span className="truncate">Rapor</span>
            </button>

            <button
              id="top-nav-btn-saved"
              type="button"
              onClick={() => setIsSavedModalOpen(true)}
              className="px-1.5 sm:px-3 py-1.5 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer shadow-xs"
              title="Kaydedilmiş bordrolar"
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Kayıtlılar</span>
            </button>

            <button
              id="top-nav-btn-zam"
              type="button"
              onClick={() => setIsZamModalOpen(true)}
              className="px-1.5 sm:px-3 py-1.5 sm:py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer shadow-xs"
              title="TİS Zammı Simülatörü"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">TİS Zammı</span>
            </button>

            <button
              id="top-nav-btn-replay-intro"
              type="button"
              onClick={() => setShowIntro(true)}
              className="px-1.5 sm:px-3 py-1.5 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer shadow-xs"
              title="Giriş animasyonunu tekrar oynat"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">Giriş</span>
            </button>

            {/* MAAŞ BORDROSU MOD BUTONU */}
            <button
              id="top-nav-btn-maas"
              type="button"
              onClick={() => setViewMode('maas')}
              className={`px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer shadow-xs border ${
                viewMode === 'maas'
                  ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-300 font-extrabold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Aylık Maaş Bordrosu Görünümüne Geç"
            >
              <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Maaş</span>
            </button>

            {/* İKRAMİYE BORDROSU BUTONU - Canlı Altın/Kehribar Tasarım */}
            <button
              id="top-nav-btn-ikramiye"
              type="button"
              onClick={() => setViewMode(prev => (prev === 'ikramiye' ? 'maas' : 'ikramiye'))}
              className={`px-1.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md border-2 ${
                viewMode === 'ikramiye'
                  ? 'bg-amber-400 text-slate-950 border-amber-100 ring-4 ring-amber-300/90 shadow-amber-500/40 scale-105'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border-amber-300 ring-1 ring-amber-400/50'
              }`}
              title="TCDD İşçi Tam / Yarım İkramiye Bordrosu Görünümüne Geç"
            >
              <Gift className="w-3.5 h-3.5 text-slate-950 shrink-0 stroke-[2.5]" />
              <span className="truncate uppercase font-black">İkramiye</span>
              {viewMode === 'ikramiye' && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping ml-0.5 shrink-0" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Ekrandaki Canlı Bordro Düzenleyici (Yazdırma sırasında gizlenir) */}
      <div id="interactive-editor-view" className="w-full flex flex-col items-center">
        {viewMode === 'ikramiye' ? (
          <IkramiyeBordroSection
            bordro={bordro}
            ikramiyeData={ikramiyeData}
            onChangeIkramiye={setIkramiyeData}
            onResetIkramiye={handleResetIkramiye}
            onRestoreDefaultIkramiye={handleRestoreDefaultIkramiye}
            onSyncSaatUcretiFromBordro={handleSyncSaatUcretiToIkramiye}
            onOpenZamModal={() => setIsZamModalOpen(true)}
            onSwitchToMaas={() => setViewMode('maas')}
          />
        ) : (
          <>
            {/* Action Bar & Document Top Controls */}
            <HeaderControls
              bordro={bordro}
              onChange={handleChange}
              onReset={handleReset}
              onZero={handleZero}
              onRecalculate={handleRecalculate}
              onOpenZamModal={() => setIsZamModalOpen(true)}
              onOpenSavedModal={() => setIsSavedModalOpen(true)}
              onExportJSON={handleExportJSON}
              onImportJSON={handleImportClick}
            />

            {/* Main Single-View Payslip Card */}
            <main
              id="official-payroll-slip"
              className="payslip-container w-full max-w-7xl 2xl:max-w-[1920px] 3xl:max-w-[2560px] bg-white border border-slate-300 rounded-lg p-2.5 sm:p-4 2xl:p-6 shadow-xs"
            >
              {/* TAB ÇUBUĞU (Özlük Bilgileri, Hakedişler, Kesintiler, SGK-Vergi, Tüm Bordro) - Canlı ve Yüksek Görünürlük */}
          <div className="mb-3.5 border-b border-slate-200 pb-3 no-print">
            {/* Hızlı Net Maaş ve Durum Bilgi Şeridi */}
            <div className="mb-2.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white px-3 sm:px-4 py-2 rounded-xl flex items-center justify-between gap-2 shadow-sm text-xs font-dotmatrix border border-slate-800">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 px-2 sm:px-2.5 py-1 rounded-lg">
                  <span className="text-emerald-300 text-[10px] sm:text-[11px] font-bold uppercase">Gelir:</span>
                  <span className="font-extrabold text-emerald-400 font-mono text-xs sm:text-sm">
                    {formatCurrency(bordro.toplamGelir)} ₺
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-950/80 border border-amber-500/40 px-2 sm:px-2.5 py-1 rounded-lg">
                  <span className="text-amber-300 text-[10px] sm:text-[11px] font-bold uppercase">Kesinti:</span>
                  <span className="font-extrabold text-amber-400 font-mono text-xs sm:text-sm">
                    {formatCurrency(bordro.toplamKesinti)} ₺
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-600 border-2 border-emerald-300 px-3 py-1 rounded-lg shrink-0 shadow-md animate-none">
                <span className="text-[10px] sm:text-xs text-white font-black uppercase tracking-wider">
                  NET:
                </span>
                <span className="font-black text-xs sm:text-base text-white font-mono drop-shadow-xs">
                  {formatCurrency(bordro.netUcret)} ₺
                </span>
              </div>
            </div>

            {/* Renkli ve Belirgin Tab Butonları */}
            <div className="bg-slate-100/90 p-1.5 rounded-xl border-2 border-slate-200/90 shadow-2xs flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none font-dotmatrix">
              {/* Tab 1: Özlük Bilgileri (Mavi Tema) */}
              <button
                id="tab-btn-ozluk"
                type="button"
                onClick={() => setActiveTab('ozluk')}
                className={`px-3 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'ozluk'
                    ? 'bg-sky-600 hover:bg-sky-700 text-white ring-2 ring-sky-300 border-2 border-sky-700 shadow-md'
                    : 'bg-sky-50 hover:bg-sky-100 text-sky-950 border-2 border-sky-300/80 shadow-2xs'
                }`}
              >
                <User className={`w-4 h-4 shrink-0 ${activeTab === 'ozluk' ? 'text-white' : 'text-sky-700'}`} />
                <span>ÖZLÜK BİLGİLERİ</span>
              </button>

              {/* Tab 2: Hakedişler (Yeşil Tema) */}
              <button
                id="tab-btn-hakedisler"
                type="button"
                onClick={() => setActiveTab('hakedisler')}
                className={`px-3 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'hakedisler'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-300 border-2 border-emerald-700 shadow-md'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-2 border-emerald-300/80 shadow-2xs'
                }`}
              >
                <Coins className={`w-4 h-4 shrink-0 ${activeTab === 'hakedisler' ? 'text-white' : 'text-emerald-700'}`} />
                <span>HAKEDİŞLER</span>
                <span
                  className={`text-[10.5px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    activeTab === 'hakedisler'
                      ? 'bg-emerald-800 text-emerald-100'
                      : 'bg-emerald-200/90 text-emerald-900'
                  }`}
                >
                  {formatCurrency(bordro.toplamGelir)} ₺
                </span>
              </button>

              {/* Tab 3: Kesintiler (Amber/Turuncu Tema) */}
              <button
                id="tab-btn-kesintiler"
                type="button"
                onClick={() => setActiveTab('kesintiler')}
                className={`px-3 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'kesintiler'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white ring-2 ring-amber-300 border-2 border-amber-700 shadow-md'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-2 border-amber-300/80 shadow-2xs'
                }`}
              >
                <Scissors className={`w-4 h-4 shrink-0 ${activeTab === 'kesintiler' ? 'text-white' : 'text-amber-700'}`} />
                <span>KESİNTİLER</span>
                <span
                  className={`text-[10.5px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    activeTab === 'kesintiler'
                      ? 'bg-amber-800 text-amber-100'
                      : 'bg-amber-200/90 text-amber-900'
                  }`}
                >
                  {formatCurrency(bordro.toplamKesinti)} ₺
                </span>
              </button>

              {/* Tab 4: SGK - Vergi (Mor/İndigo Tema) */}
              <button
                id="tab-btn-sgk-vergi"
                type="button"
                onClick={() => setActiveTab('sgk-vergi')}
                className={`px-3 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'sgk-vergi'
                    ? 'bg-purple-700 hover:bg-purple-800 text-white ring-2 ring-purple-300 border-2 border-purple-800 shadow-md'
                    : 'bg-purple-50 hover:bg-purple-100 text-purple-950 border-2 border-purple-300/80 shadow-2xs'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 shrink-0 ${activeTab === 'sgk-vergi' ? 'text-white' : 'text-purple-700'}`} />
                <span>SGK & VERGİ</span>
              </button>

              {/* Tab 5: Tüm Bordro (Koyu Grafit Tema) */}
              <button
                id="tab-btn-tumu"
                type="button"
                onClick={() => setActiveTab('tumu')}
                className={`px-3 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'tumu'
                    ? 'bg-slate-900 hover:bg-black text-white ring-2 ring-slate-400 border-2 border-slate-950 shadow-md'
                    : 'bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-300 shadow-2xs'
                }`}
                title="Tüm bölümleri yan yana klasik bordro görünümünde göster"
              >
                <LayoutGrid className={`w-4 h-4 shrink-0 ${activeTab === 'tumu' ? 'text-white' : 'text-slate-700'}`} />
                <span className="hidden sm:inline">TÜM BORDRO</span>
                <span className="sm:hidden">TÜMÜ</span>
              </button>
            </div>
          </div>

          {/* TAB İÇERİKLERİ */}
          <div className="w-full">
            {/* SEÇİLEN TEK SEKME: ÖZLÜK BİLGİLERİ */}
            {activeTab === 'ozluk' && (
              <div className="space-y-3">
                <EmployeeSection
                  bordro={bordro}
                  onChange={handleChange}
                  onBaseRateChange={handleBaseRateChange}
                  className="w-full flex flex-col justify-between p-3 sm:p-4 rounded-lg bg-sky-50/45 border border-sky-200/90 space-y-2 text-slate-900 font-dotmatrix shadow-xs"
                />
                {/* Adım Yönlendirme */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('hakedisler')}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <span>Sonraki: Hakediş Kalemleri</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SEÇİLEN TEK SEKME: HAKEDİŞLER */}
            {activeTab === 'hakedisler' && (
              <div className="space-y-3">
                <EarningsAndDeductionsSection
                  bordro={bordro}
                  onChange={handleChange}
                  onHourChange={handleHourChange}
                  onAmountChange={handleAmountChange}
                  showOnly="earnings"
                  className="w-full font-dotmatrix"
                />
                {/* Adım Yönlendirme */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('ozluk')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Özlük Bilgileri</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('kesintiler')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <span>Sonraki: Kesintiler</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SEÇİLEN TEK SEKME: KESİNTİLER */}
            {activeTab === 'kesintiler' && (
              <div className="space-y-3">
                <EarningsAndDeductionsSection
                  bordro={bordro}
                  onChange={handleChange}
                  onHourChange={handleHourChange}
                  onAmountChange={handleAmountChange}
                  showOnly="deductions"
                  className="w-full font-dotmatrix"
                />
                {/* Adım Yönlendirme */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('hakedisler')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Hakedişler</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('sgk-vergi')}
                    className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <span>Sonraki: SGK ve Vergi</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SEÇİLEN TEK SEKME: SGK VE VERGİ */}
            {activeTab === 'sgk-vergi' && (
              <div className="space-y-3">
                <StatutorySection
                  bordro={bordro}
                  onChange={handleChange}
                  className="w-full p-3 sm:p-4 rounded-lg bg-indigo-50/45 border border-indigo-200/90 space-y-2 font-dotmatrix shadow-xs flex flex-col justify-between"
                />
                {/* Adım Yönlendirme */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('kesintiler')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Kesintiler</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleRecalculate();
                      window.print();
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Yazdır / PDF İndir</span>
                  </button>
                </div>
              </div>
            )}

            {/* TÜMÜ (KLASİK 12 SÜTUNLU TAM BORDRO GÖRÜNÜMÜ) */}
            {activeTab === 'tumu' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 2xl:gap-4 items-stretch">
                {/* Left Column: Özlük Bilgileri (col-span-3) */}
                <EmployeeSection
                  bordro={bordro}
                  onChange={handleChange}
                  onBaseRateChange={handleBaseRateChange}
                />

                {/* Middle Column: Hakediş Kalemleri & Özel Kesintiler (col-span-6) */}
                <EarningsAndDeductionsSection
                  bordro={bordro}
                  onChange={handleChange}
                  onHourChange={handleHourChange}
                  onAmountChange={handleAmountChange}
                  showOnly="all"
                />

                {/* Right Column: Yasal Kesintiler & Sonuçlar (col-span-3) */}
                <StatutorySection
                  bordro={bordro}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          {/* Footer Note & Signature Row inside Payslip */}
          <footer className="mt-3 pt-2.5 border-t border-dashed border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10.5px] text-slate-500">
            <div className="space-y-0.5">
              <p>
                * Bu bordro TCDD Taşımacılık A.Ş. 31. Dönem Toplu İş Sözleşmesi (TİS), 5510 sayılı Kanun ve
                GİB 2026 Gelir Vergisi mevzuatına tam uyumludur.
              </p>
              <p>
                * Terörle Mücadele Kapsamı (Gazi) personeli için SSK Primi %9 (GSS kesintisiz) ve İşsizlik
                Sigortası %0 olarak tatbik edilmiştir.
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <span className="text-slate-600 font-semibold uppercase">İşçi İmzası:</span>
              <div className="w-28 sm:w-36 h-7 border-b border-slate-400" />
            </div>
          </footer>
        </main>
      </>
    )}
  </div>

  {/* Otantik TCDD Nokta Vuruşlu Tek Sayfa Yazdırma Bordrosu (Sadece print esnasında görünür) */}
  {viewMode === 'ikramiye' ? (
    <IkramiyePrintableSlip bordro={bordro} ikramiyeData={ikramiyeData} />
  ) : (
    <OfficialPrintableSlip bordro={bordro} />
  )}

      {/* TİS Zammı Simülatörü Modal */}
      <ZamModal
        isOpen={isZamModalOpen}
        onClose={() => setIsZamModalOpen(false)}
        bordro={bordro}
        ikramiyeData={ikramiyeData}
        activeView={viewMode}
        lastAppliedZam={lastAppliedZam}
        onApplyZam={handleApplyZam}
        onResetZam={handleResetZam}
      />

      {/* Kaydedilmiş Bordrolar & Senaryolar Modal */}
      <SavedBordrolarModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        currentBordro={bordro}
        onLoadBordro={loaded => {
          setBordro(calculateBordro(loaded));
          showNotification('Kayıtlı bordro başarıyla yüklendi.');
        }}
      />

      {/* Maaş, Gelir-Gider & Vergi Analiz Raporu Modal */}
      <SalaryReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        currentBordro={bordro}
        onLoadBordro={loaded => {
          setBordro(calculateBordro(loaded));
          showNotification('Seçilen ayın bordrosu başarıyla yüklendi.');
        }}
      />

      {/* PWA Offline Connectivity Indicator */}
      <OfflineIndicator />

      {/* Etkileyici TCDD Demiryolu Giriş Animasyonu */}
      <AnimatePresence mode="wait">
        {showIntro && (
          <IntroSplashAnimation onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
