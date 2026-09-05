import React, { useState, useRef } from 'react';
import { BordroData } from './types';
import {
  DEFAULT_TCDD_BORDRO,
  SAMPLE_AUGUST_2026_BORDRO,
  calculateBordro
} from './utils/bordroEngine';
import { HeaderControls } from './components/HeaderControls';
import { EmployeeSection } from './components/EmployeeSection';
import { EarningsAndDeductionsSection } from './components/EarningsAndDeductionsSection';
import { StatutorySection } from './components/StatutorySection';
import { ZamModal } from './components/ZamModal';
import { SavedBordrolarModal } from './components/SavedBordrolarModal';
import { OfflineIndicator } from './components/OfflineIndicator';

export function App() {
  const [bordro, setBordro] = useState<BordroData>(() => calculateBordro(DEFAULT_TCDD_BORDRO));
  const [isZamModalOpen, setIsZamModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleReset = () => {
    setBordro(prev => {
      const isNormal = prev.calisanStatusu === 'normal';
      if (isNormal) {
        return calculateBordro({
          ...SAMPLE_AUGUST_2026_BORDRO,
          calisanStatusu: 'normal',
          mevzuatNotu: '31. Dönem TİS 1/1 • TCDD Taşımacılık A.Ş. Sürekli İşçi Bordrosu (Standart 4/a)',
          vergiMuafiyeti: 0,
          earnings: SAMPLE_AUGUST_2026_BORDRO.earnings.map(e => {
            if (e.id === 'gst') return { ...e, hours: 0, amount: 0 };
            if (e.id === 'fm') return { ...e, rule: 'mesai175', label: 'FM %75 Pntr', badge: '%75' };
            return e;
          })
        });
      }
      return calculateBordro(SAMPLE_AUGUST_2026_BORDRO);
    });
  };

  const handleZero = () => {
    setBordro(prev => {
      const isNormal = prev.calisanStatusu === 'normal';
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
        vergiMuafiyeti: isNormal ? 0 : (prev.vergiMuafiyeti || 3000),
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
    newDays: number
  ) => {
    setBordro(prev => {
      const rateMultiplier = 1 + zamRate / 100;
      let effectiveMultiplier = rateMultiplier;

      if (isPartial && oldDays + newDays > 0) {
        effectiveMultiplier = (oldDays * 1.0 + newDays * rateMultiplier) / (oldDays + newDays);
      }

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
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bordro, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tcdd-bordro-${bordro.aySecim}-2026.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
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
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          setBordro(calculateBordro({ ...DEFAULT_TCDD_BORDRO, ...parsed }));
        }
      } catch (err) {
        alert('Geçersiz bordro JSON dosyası!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-100/80 p-2 sm:p-4 2xl:p-6 flex flex-col items-center font-dotmatrix text-slate-900">
      {/* Hidden File Input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

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
        className="payslip-container w-full max-w-7xl 2xl:max-w-[1920px] 3xl:max-w-[2560px] bg-white border border-slate-300 rounded-lg p-3 sm:p-4 2xl:p-6 shadow-xs"
      >
        {/* The 12-column grid corresponding exactly to ilyas-bordro.netlify.app */}
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
          />

          {/* Right Column: Yasal Kesintiler & Sonuçlar (col-span-3) */}
          <StatutorySection
            bordro={bordro}
            onChange={handleChange}
          />
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

      {/* TİS Zammı Simülatörü Modal */}
      <ZamModal
        isOpen={isZamModalOpen}
        onClose={() => setIsZamModalOpen(false)}
        bordro={bordro}
        onApplyZam={handleApplyZam}
      />

      {/* Kaydedilmiş Bordrolar & Senaryolar Modal */}
      <SavedBordrolarModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        currentBordro={bordro}
        onLoadBordro={loaded => setBordro(calculateBordro(loaded))}
      />

      {/* PWA Offline Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}

export default App;
