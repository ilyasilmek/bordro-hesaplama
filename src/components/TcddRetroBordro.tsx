import React, { useState, useMemo } from 'react';
import { TcddMonthlySlip } from '../types';
import { TCDD_ACTUAL_SLIPS, TIS_31_ARTICLES_INFO } from '../constants/tcddData';
import { formatTRY } from '../utils/payrollCalculator';
import {
  Printer,
  Calendar,
  Sparkles,
  Info,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  FileCheck2,
  Sliders,
  Award,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface TcddRetroBordroProps {
  onNavigateToReport: () => void;
}

export const TcddRetroBordro: React.FC<TcddRetroBordroProps> = ({ onNavigateToReport }) => {
  const [selectedPeriodIdx, setSelectedPeriodIdx] = useState<number>(0);
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<'retro_paper' | 'dark_terminal'>('retro_paper');
  const [activeTooltip, setActiveTooltip] = useState<{
    title: string;
    tisCode: string;
    text: string;
    calcDetails?: string;
  } | null>(null);

  // Status Simulation Toggles
  const [isGaziStatus, setIsGaziStatus] = useState<boolean>(true);
  const [disabilityTier, setDisabilityTier] = useState<number>(3); // 3. derece = 3.000 TL

  // Active slip data (base)
  const currentSlip = TCDD_ACTUAL_SLIPS[selectedPeriodIdx];

  // Editable simulation states
  const [simNormalHours, setSimNormalHours] = useState<number>(currentSlip.normalCalisHours);
  const [simHourlyWage, setSimHourlyWage] = useState<number>(currentSlip.saatUcr);
  const [simEmkZam, setSimEmkZam] = useState<number>(currentSlip.emkZam);
  const [simIaseDays, setSimIaseDays] = useState<number>(currentSlip.iaseGunuDays);

  // Sync simulation when period changes
  const handleSelectPeriod = (idx: number) => {
    setSelectedPeriodIdx(idx);
    const slip = TCDD_ACTUAL_SLIPS[idx];
    setSimNormalHours(slip.normalCalisHours);
    setSimHourlyWage(slip.saatUcr);
    setSimEmkZam(slip.emkZam);
    setSimIaseDays(slip.iaseGunuDays);
    setActiveTooltip(null);
  };

  // Helper formatting for exact dot-matrix alignment
  const fmtMoney = (val?: number) => {
    if (val === undefined || val === null) return '        ';
    return val.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const fmtHours = (val?: number) => {
    if (val === undefined || val === null) return '      ';
    return val.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full flex-1 p-4 md:p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Top Banner with Period Switcher and Controls */}
      <div className="bg-slate-900 border border-slate-800 p-4 md:p-5 rounded-xl shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-emerald-950/80 text-emerald-400 rounded-lg border border-emerald-800">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base md:text-lg font-bold text-white tracking-tight">
                  TCDD TAŞIMACILIK A.Ş. İŞÇİ AYLIK MAAŞ BORDROSU
                </h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  31. Dönem TİS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Vagon İmal ve Tamirci İlyas İlmek (Sicil: 084857) - Gerçek Bordro Verileri & Nokta Vuruşlu (Dot-Matrix) Tasarım
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex flex-wrap items-center gap-2 self-start xl:self-auto">
          {/* Theme selector */}
          <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setThemeMode('retro_paper')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                themeMode === 'retro_paper'
                  ? 'bg-amber-100 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Nostaljik Kağıt (Bordro)
            </button>
            <button
              onClick={() => setThemeMode('dark_terminal')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                themeMode === 'dark_terminal'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Terminal / Koyu
            </button>
          </div>

          {/* Report Link */}
          <button
            onClick={onNavigateToReport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>İnceleme Raporunu Oku</span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Bordroyu Yazdır</span>
          </button>
        </div>
      </div>

      {/* 8-Month Period Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 print:hidden">
        <span className="text-xs font-bold text-slate-400 mr-2 shrink-0">Bordro Dönemi Seçin:</span>
        {TCDD_ACTUAL_SLIPS.map((slip, idx) => {
          const isSelected = idx === selectedPeriodIdx;
          return (
            <button
              key={slip.periodCode}
              onClick={() => handleSelectPeriod(idx)}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all shrink-0 cursor-pointer flex flex-col items-start border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>{slip.periodCode}</span>
                <span className="text-[10px] opacity-80">{slip.monthName.split(' ')[0]}</span>
              </div>
              <span className={`text-[10px] font-semibold mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-emerald-400'}`}>
                Net: {formatTRY(slip.netOdeme)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Gazi / Terör Mağduru & Engellilik Statü Bilgilendirme Çubuğu */}
      <div className="bg-emerald-950/40 border border-emerald-500/50 p-4 rounded-xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs print:hidden">
        <div className="flex items-center gap-3">
          <span className="p-1.5 bg-emerald-900/80 text-emerald-300 rounded-md border border-emerald-700">
            <ShieldAlert className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Bu Bordrodaki Özel Mali Statü:</span>
              <span className="font-bold text-emerald-300">Gazi / Şehit Yakını / Terör Mağduru (3713 & 5510 SK)</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                3. Derece Engellilik İndirimi
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              GSS Primi Kesilmez • SSK İşçi Primi <strong>tam %9,000</strong> • İşsizlik Sigortası <strong>0,00 ₺</strong> • Aylık <strong>GST %10</strong> Ek Prim • Gelir Vergisi Matrahından <strong>3.000,00 ₺</strong> İndirim.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
          <span className="text-slate-400 text-[11px]">Bordro üzerinde herhangi bir kaleme tıklayarak TİS maddesini ve formülünü inceleyebilirsiniz.</span>
        </div>
      </div>

      {/* THE ACTUAL AUTHENTIC TCDD PAYROLL SLIP CONTAINER */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Main Monospace Dot-Matrix Frame */}
        <div
          id="official-payroll-slip"
          className={`flex-1 w-full rounded-xl overflow-hidden shadow-2xl transition-all border ${
            themeMode === 'retro_paper'
              ? 'bg-[#fdfbf7] text-[#1e293b] border-[#cbd5e1] font-mono'
              : 'bg-[#0a0f18] text-[#38bdf8] border-cyan-900/60 font-mono'
          }`}
          style={{
            fontFamily: "'Courier New', Courier, 'Lucida Console', Monaco, monospace",
          }}
        >
          {/* Slip Header Box */}
          <div className="p-3 md:p-4 border-b border-dashed border-current/40 leading-tight">
            <div className="flex items-center justify-between text-xs md:text-sm font-bold tracking-tight">
              <span>|TCDD TAŞIMACILIK A.Ş. İŞÇİ AYLIK MAAŞ BORDROSU ---------------------------------------------|</span>
            </div>
            <div className="grid grid-cols-12 text-[11px] md:text-xs font-bold mt-1 pt-1 border-t border-dashed border-current/40">
              <div className="col-span-4 border-r border-dashed border-current/40 pr-2">
                |{currentSlip.periodCode} {currentSlip.periodDates}
              </div>
              <div className="col-span-5 text-center border-r border-dashed border-current/40 px-2">
                HAKEDİŞLER VE ÖZEL KESİNTİLER
              </div>
              <div className="col-span-3 text-right pl-2">
                |YASAL KESİNTİ VE SONUÇLAR|
              </div>
            </div>
          </div>

          {/* Slip 3-Column Body */}
          <div className="grid grid-cols-12 text-[11px] md:text-xs leading-5 p-3 md:p-4 gap-0 divide-x divide-dashed divide-current/30">
            {/* COLUMN 1: Personel / İşyeri / Ücret Bilgileri (4 cols) */}
            <div className="col-span-12 lg:col-span-4 pr-3 space-y-0.5">
              <div className="flex justify-between">
                <span>|İşl/Y/S</span>
                <span className="font-bold">:{currentSlip.islYs}</span>
              </div>
              <div className="flex justify-between">
                <span>|Adı</span>
                <span className="font-bold">:{currentSlip.adi}</span>
              </div>
              <div className="flex justify-between">
                <span>|Soyadı</span>
                <span className="font-bold">:{currentSlip.soyadi}</span>
              </div>
              <div className="flex justify-between">
                <span>|Sicil No</span>
                <span className="font-bold">:{currentSlip.sicilNo}</span>
              </div>
              <div className="flex justify-between">
                <span>|Pers.No</span>
                <span className="font-bold">:{currentSlip.persNo}</span>
              </div>
              <div className="flex justify-between">
                <span>|SSK No</span>
                <span className="font-bold">:{currentSlip.sskNo}</span>
              </div>
              <div
                onClick={() =>
                  setActiveTooltip({
                    title: 'Ünvan: Vagon İmal ve Tamirci',
                    tisCode: 'TİS Madde 51 & Ek:1',
                    text: 'Vagon İmal ve Tamirci kadrosu, TİS Ek:1 listesinde sanatkâr işçi sınıfında yer alır. Bu ünvan TİS Madde 51 uyarınca %24 oranında Ağır ve Tehlikeli İşler Tazminatına [GMŞ %(17+7) 24] hak kazanır.',
                    calcDetails: 'Saatlik kök ücret: ' + currentSlip.saatUcr.toFixed(6) + ' TL',
                  })
                }
                className="flex justify-between hover:bg-current/10 cursor-pointer px-0.5 rounded transition-colors"
              >
                <span>|Ünvanı</span>
                <span className="font-bold">:{currentSlip.unvani}</span>
              </div>
              <div className="flex justify-between">
                <span>|Der/Kad.</span>
                <span className="font-bold">:{currentSlip.derKad}</span>
              </div>
              <div className="flex justify-between">
                <span>|Kıdem Yılı:{currentSlip.kidemYili}</span>
                <span>Hzm.Zammı Yıl: {currentSlip.hzmZammiYil}</span>
              </div>
              <div
                onClick={() =>
                  setActiveTooltip({
                    title: 'Saatlik Kök Ücreti',
                    tisCode: 'TİS Madde 39 (Skala IV)',
                    text: 'TİS Madde 39 uyarınca işçinin hak kazandığı saatlik çıplak ücretidir. 01/2026 ve 02/2026 döneminde 330,37 TL iken, TİS zamlarıyla 03/2026\'da 380,88 TL\'ye ve 04/2026 itibariyle 385,98 TL\'ye yükselmiştir.',
                    calcDetails: 'Günlük brüt çıplak (7,5 saat): ' + (currentSlip.saatUcr * 7.5).toFixed(2) + ' TL',
                  })
                }
                className="flex justify-between hover:bg-current/10 cursor-pointer px-0.5 rounded transition-colors"
              >
                <span>|Saat Ücr</span>
                <span className="font-bold">:{currentSlip.saatUcr.toFixed(6)}</span>
              </div>
              <div
                onClick={() =>
                  setActiveTooltip({
                    title: 'Emek Zammı (Saat Başına İlave)',
                    tisCode: 'TİS Madde 44',
                    text: 'İşverene ait işyerlerinde geçen her hizmet yılı için saat ücretine ilave edilen emek zammıdır. (14 yıl x 1,10 TL = 15,40 TL / saat; 07/2026\'da 15 yıla çıkınca 19,05 TL olmuştur).',
                    calcDetails: 'Tüm fazla mesai, tatil ve tazminat hesaplarında saat ücretine eklenir.',
                  })
                }
                className="flex justify-between hover:bg-current/10 cursor-pointer px-0.5 rounded transition-colors"
              >
                <span>|Emk. Zam</span>
                <span className="font-bold">:{currentSlip.emkZam.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span>|Brt Aylk</span>
                <span>:{fmtMoney(currentSlip.brtAylk)}</span>
              </div>
              <div className="flex justify-between">
                <span>|Kdm. Zam</span>
                <span>:{fmtMoney(currentSlip.kdmZam)}</span>
              </div>
              <div className="flex justify-between">
                <span>|Hast.Gün</span>
                <span className={currentSlip.hastGun > 0 ? 'font-bold text-rose-500' : ''}>
                  :{currentSlip.hastGun.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>|İşy.SSK</span>
                <span>:{currentSlip.isySsk}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>|İMZA</span>
                <span>: _______________</span>
              </div>
            </div>

            {/* COLUMN 2: HAKEDİŞLER VE ÖZEL KESİNTİLER (5 cols) */}
            <div className="col-span-12 lg:col-span-5 px-3 space-y-0.5">
              {/* Normal Çalışma */}
              <div
                onClick={() =>
                  setActiveTooltip({
                    title: 'Normal Çalışma Ücreti',
                    tisCode: 'TİS Madde 31 & 39',
                    text: 'Aya ait normal çalışma karşılığı temel ücrettir.',
                    calcDetails: `${fmtHours(currentSlip.normalCalisHours)} saat x (${currentSlip.saatUcr.toFixed(2)} + ${currentSlip.emkZam.toFixed(2)} TL) = ${fmtMoney(currentSlip.normalCalisAmount)} TL`,
                  })
                }
                className="flex justify-between hover:bg-current/10 cursor-pointer px-0.5 rounded transition-colors"
              >
                <span>|Normal Çalış: {fmtHours(currentSlip.normalCalisHours)}</span>
                <span className="font-bold">{fmtMoney(currentSlip.normalCalisAmount)}</span>
                <span className="border-l border-dashed border-current/30 pl-2">
                  |Birleştirilm: {fmtMoney(currentSlip.birlestirilmAmount)}
                </span>
              </div>

              {/* Hafta Tatili / Pazar Bayram */}
              <div
                onClick={() =>
                  setActiveTooltip({
                    title: 'Pazar Bayram / Hafta Tatili Ücreti',
                    tisCode: 'TİS Madde 35 & 36',
                    text: 'Haftalık iş süresine uygun çalışmış işçiye hafta tatili günü için iş karşılığı olmaksızın 7,5 saatlik ücreti tam ödenir.',
                    calcDetails: `${fmtHours(currentSlip.pazarBayramHours || currentSlip.haftaTatiliHours)} saat = ${fmtMoney(currentSlip.pazarBayramAmount || currentSlip.haftaTatiliAmount)} TL`,
                  })
                }
                className="flex justify-between hover:bg-current/10 cursor-pointer px-0.5 rounded transition-colors"
              >
                <span>
                  |{currentSlip.pazarBayramHours ? 'Pazar Bayram:' : 'Hafta Tatili:'}{' '}
                  {fmtHours(currentSlip.pazarBayramHours || currentSlip.haftaTatiliHours)}
                </span>
                <span className="font-bold">{fmtMoney(currentSlip.pazarBayramAmount || currentSlip.haftaTatiliAmount)}</span>
                <span
                  className="border-l border-dashed border-current/30 pl-2 hover:bg-amber-400/20 cursor-pointer rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTooltip({
                      title: 'Sendika Aidatı (TİS Madde 18 & GVK 63/4)',
                      tisCode: '31. Dönem TİS Madde 18',
                      text: 'Sendika üyesi personelden aylık 1 günlük yevmiye çıplak ücreti tutarında kesilir. TCDD uygulamasında 6,20 saat x (Saat Ücreti + Emek Zammı) olarak hesaplanır ve GVK 63/4 uyarınca Gelir Vergisi matrahından tenzil edilir.',
                      calcDetails: `6,20 saat x (${currentSlip.saatUcr.toFixed(2)} + ${currentSlip.emkZam.toFixed(2)} TL) = ${fmtMoney(currentSlip.sendikaAidaAmount)} TL`,
                    });
                  }}
                  title="31. Dönem TİS Md. 18: 6,20 x (Saat Ücr + Emek Zam)"
                >
                  |Sendika Aida: {fmtMoney(currentSlip.sendikaAidaAmount)}
                </span>
              </div>

              {/* UBGT / Ücretli İzin */}
              <div
                onClick={() =>
                  setActiveTooltip({
                    title: 'Ücretli İzin & UBGT',
                    tisCode: 'TİS Madde 35, 36 & 70',
                    text: 'Yıllık ücretli izin ile ulusal bayram ve genel tatil günleri karşılığı ödenen ücrettir.',
                    calcDetails: `İzin Saati: ${fmtHours(currentSlip.ucretliIzinHours)} | Tutar: ${fmtMoney(currentSlip.ucretliIzinAmount)} TL`,
                  })
                }
                className="flex justify-between hover:bg-current/10 cursor-pointer px-0.5 rounded transition-colors"
              >
                <span>|Ücretli İzin: {fmtHours(currentSlip.ucretliIzinHours)}</span>
                <span className="font-bold">{fmtMoney(currentSlip.ucretliIzinAmount)}</span>
                <span className="border-l border-dashed border-current/30 pl-2">
                  |Spor Aidatı : {fmtMoney(currentSlip.sporAidatiAmount)}
                </span>
              </div>

              {/* Ücretli Rapor / UBGT (if exists) */}
              {(currentSlip.ucretliRapoHours || currentSlip.ubgtHours) && (
                <div
                  onClick={() =>
                    setActiveTooltip({
                      title: currentSlip.ucretliRapoHours ? 'Ücretli Rapor' : 'UBGT',
                      tisCode: 'TİS Madde 62 & 35',
                      text: 'İstirahat raporu veya Ulusal Bayram Genel Tatil günleri karşılığı hakediş.',
                      calcDetails: `Saat: ${fmtHours(currentSlip.ucretliRapoHours || currentSlip.ubgtHours)} = ${fmtMoney(currentSlip.ucretliRapoAmount || currentSlip.ubgtAmount)} TL`,
                    })
                  }
                  className="flex justify-between hover:bg-current/10 cursor-pointer px-0.5 rounded transition-colors"
                >
                  <span>
                    |{currentSlip.ucretliRapoHours ? 'Ücretli Rapo:' : 'UBGT        :'}{' '}
                    {fmtHours(currentSlip.ucretliRapoHours || currentSlip.ubgtHours)}
                  </span>
                  <span className="font-bold">{fmtMoney(currentSlip.ucretliRapoAmount || currentSlip.ubgtAmount)}</span>
                  <span className="border-l border-dashed border-current/30 pl-2">
                    |Vergiden Mua: {fmtMoney(currentSlip.vergidenMuaAmount)}
                  </span>
                </div>
              )}

              {/* Fazla Mesai %100 (if exists) */}
              {currentSlip.fzlMes100Hours && (
                <div
                  onClick={() =>
                    setActiveTooltip({
                      title: 'Fazla Mesai %100 Zamlı',
                      tisCode: 'TİS Madde 37/5',
                      text: 'Günlük 3 saati aşan veya tatil günlerinde yapılan fazla çalışmalar %100 zamlı (2 kat) olarak ödenir.',
                      calcDetails: `${fmtHours(currentSlip.fzlMes100Hours)} saat x (${currentSlip.saatUcr.toFixed(2)} x 2) = ${fmtMoney(currentSlip.fzlMes100Amount)} TL`,
                    })
                  }
                  className="flex justify-between hover:bg-current/10 cursor-pointer px-0.5 rounded transition-colors"
                >
                  <span>|Fzl Mes %100: {fmtHours(currentSlip.fzlMes100Hours)}</span>
                  <span className="font-bold text-amber-600 dark:text-amber-300">{fmtMoney(currentSlip.fzlMes100Amount)}</span>
                  <span className="border-l border-dashed border-current/30 pl-2">
                    |SSK Matrah D: {fmtMoney(currentSlip.sskMatrahDAmount)}
                  </span>
                </div>
              )}

              {/* Vardiya Primi */}
              <div
                onClick={() =>
                  setActiveTooltip({
                    title: 'Vardiya Primi (%10)',
                    tisCode: 'TİS Madde 35/2',
                    text: 'İkili veya üçlü vardiya ile çalışan işçilere fiilen çalıştıkları süreyle sınırlı olmak üzere emek zammı dahil saat ücretinin %10\'u oranında ödenir.',
                    calcDetails: `${fmtHours(currentSlip.vardiyaPrimHours)} saat x (${(currentSlip.saatUcr + currentSlip.emkZam).toFixed(2)} x %10) = ${fmtMoney(currentSlip.vardiyaPrimAmount)} TL`,
                  })
                }
                className="flex justify-between hover:bg-current/10 cursor-pointer px-0.5 rounded transition-colors"
              >
                <span>|Vardiya Prim: {fmtHours(currentSlip.vardiyaPrimHours)}</span>
                <span className="font-bold">{fmtMoney(currentSlip.vardiyaPrimAmount)}</span>
                <span className="border-l border-dashed border-current/30 pl-2">
                  {!currentSlip.ucretliRapoHours && !currentSlip.ubgtHours
                    ? `|Vergiden Mua: ${fmtMoney(currentSlip.vergidenMuaAmount)}`
                    : currentSlip.mahsupKsntAmount
                    ? `|Mahsup Ksnt.: ${fmtMoney(currentSlip.mahsupKsntAmount)}`
                    : currentSlip.terfiFarkAmount
                    ? `|Terfi Fark-İ: ${fmtMoney(currentSlip.terfiFarkAmount)}`
                    : '|                       '}
                </span>
              </div>

              {/* Gece Çalışma */}
              <div
                onClick={() =>
                  setActiveTooltip({
                    title: 'Gece Çalışma Tazminatı (%15)',
                    tisCode: 'TİS Madde 45',
                    text: 'Saat 20.00 ile 07.00 arasında yapılan her çalışma saati için emek zammı dahil saat ücretinin %15\'i tutarında gece çalışma tazminatı ödenir.',
                    calcDetails: `${fmtHours(currentSlip.geceCalismaHours)} saat x (${(currentSlip.saatUcr + currentSlip.emkZam).toFixed(2)} x %15) = ${fmtMoney(currentSlip.geceCalismaAmount)} TL`,
                  })
                }
                className="flex justify-between hover:bg-current/10 cursor-pointer px-0.5 rounded transition-colors"
              >
                <span>|Gece Çalışma: {fmtHours(currentSlip.geceCalismaHours)}</span>
                <span className="font-bold">{fmtMoney(currentSlip.geceCalismaAmount)}</span>
                <span className="border-l border-dashed border-current/30 pl-2">
                  {currentSlip.mahsupKsntAmount && (currentSlip.ucretliRapoHours || currentSlip.ubgtHours)
                    ? `|Mahsup Ksnt.: ${fmtMoney(currentSlip.mahsupKsntAmount)}`
                    : currentSlip.sskMatrahDAmount && !currentSlip.fzlMes100Hours
                    ? `|SSK Matrah D: ${fmtMoney(currentSlip.sskMatrahDAmount)}`
                    : '|                       '}
                </span>
              </div>

              {/* İaşe Günü */}
              <div
                onClick={() =>
                  setActiveTooltip({
                    title: 'İaşe Günü (Yemek Yardımı)',
                    tisCode: 'TİS Madde 78/2',
                    text: 'İaşe merkezi bulunmayan veya yemek pişirilmeyen günlerde fiilen çalışılan her gün için nakdi yemek bedeli ödenir.',
                    calcDetails: `${currentSlip.iaseGunuDays} gün = ${fmtMoney(currentSlip.iaseGunuAmount)} TL (Günlük ~${(currentSlip.iaseGunuAmount / currentSlip.iaseGunuDays).toFixed(2)} TL)`,
                  })
                }
                className="flex justify-between hover:bg-current/10 cursor-pointer px-0.5 rounded transition-colors"
              >
                <span>|İaşe Günü   : {fmtHours(currentSlip.iaseGunuDays)}</span>
                <span className="font-bold">{fmtMoney(currentSlip.iaseGunuAmount)}</span>
                <span className="border-l border-dashed border-current/30 pl-2">|                       </span>
              </div>

              {/* GŞT %10 (Gazi / Şehit Yakını / Terör Mağduru Ek Primi) */}
              <div
                onClick={() =>
                  setActiveTooltip({
                    title: 'GŞT %10 (Gazi/Şehit Yakını/Terör Mağduru Ek Prim)',
                    tisCode: 'TİS Madde 130',
                    text: 'Gazi, terör mağduru ve şehit yakınlarına, günlük çıplak ücretinin %10\'u tutarında Ek Prim ödenir. Bordroda aylık toplam çalışma saati üzerinden tahakkuk ettirilir.',
                    calcDetails: `${fmtHours(currentSlip.gst10Hours)} saat x (%10 ek prim) = ${fmtMoney(currentSlip.gst10Amount)} TL`,
                  })
                }
                className="flex justify-between hover:bg-emerald-500/20 cursor-pointer px-0.5 rounded transition-colors bg-emerald-500/10"
              >
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  |GŞT %10     : {fmtHours(currentSlip.gst10Hours)}
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{fmtMoney(currentSlip.gst10Amount)}</span>
                <span className="border-l border-dashed border-current/30 pl-2">|                       </span>
              </div>

              {/* Hizmet Zammı */}
              <div
                onClick={() =>
                  setActiveTooltip({
                    title: 'Hizmet Zammı (Kıdem Zammı)',
                    tisCode: 'TİS Madde 129',
                    text: 'Taraf sendika üyesi işçilere çalıştıkları Kamu Kurum ve Kuruluşunda geçirdikleri her tam hizmet yılı için saat ücretine ilave edilen brüt zammı ifade eder. (01.09.2025\'ten itibaren saat başına brüt 21,40 TL).',
                    calcDetails: `${currentSlip.hizmetZammiYear} yıl = ${fmtMoney(currentSlip.hizmetZammiAmount)} TL`,
                  })
                }
                className="flex justify-between hover:bg-current/10 cursor-pointer px-0.5 rounded transition-colors"
              >
                <span>|Hizmet Zammı: {fmtHours(currentSlip.hizmetZammiYear)}</span>
                <span className="font-bold">{fmtMoney(currentSlip.hizmetZammiAmount)}</span>
                <span className="border-l border-dashed border-current/30 pl-2">|                       </span>
              </div>

              {/* GMŞ %(17+7) 24 (Ağır/Tehlikeli İşler Tazminatı) */}
              <div
                onClick={() =>
                  setActiveTooltip({
                    title: 'GMŞ %(17+7) 24 - Tehlikeli, Ağır ve Yıpratıcı İşler Tazminatı',
                    tisCode: 'TİS Madde 51',
                    text: 'Raporun 8. Bölümünde detaylandırıldığı üzere: Vagon İmal ve Tamirci sanat kolundaki işçilere, emek zammı dahil saat ücretinin %24\'ü tutarında brüt ödenen tazminattır. Bordrodaki en yüksek ek hakediş kalemidir.',
                    calcDetails: `${fmtHours(currentSlip.gms17Plus7Hours)} saat x (${(currentSlip.saatUcr + currentSlip.emkZam).toFixed(2)} x %24) = ${fmtMoney(currentSlip.gms17Plus7Amount)} TL`,
                  })
                }
                className="flex justify-between hover:bg-amber-500/20 cursor-pointer px-0.5 rounded transition-colors bg-amber-500/10"
              >
                <span className="font-bold text-amber-700 dark:text-amber-300">
                  |GMŞ%(17+7)24: {fmtHours(currentSlip.gms17Plus7Hours)}
                </span>
                <span className="font-bold text-amber-700 dark:text-amber-300">{fmtMoney(currentSlip.gms17Plus7Amount)}</span>
                <span className="border-l border-dashed border-current/30 pl-2">|                       </span>
              </div>
            </div>

            {/* COLUMN 3: YASAL KESİNTİ VE SONUÇLAR (3 cols) */}
            <div className="col-span-12 lg:col-span-3 pl-3 space-y-0.5">
              <div className="flex justify-between">
                <span>|Çalıştığı Gün:</span>
                <span className="font-bold">{currentSlip.calistigiGun.toFixed(2)}|</span>
              </div>
              <div className="flex justify-between">
                <span>|SSK Günü      :</span>
                <span className="font-bold">{currentSlip.sskGunu.toFixed(2)}|</span>
              </div>
              <div
                onClick={() =>
                  setActiveTooltip({
                    title: 'SSK Matrahı (Prime Esas Kazanç - PEK)',
                    tisCode: '5510 Sayılı Kanun Madde 80',
                    text: 'Ay içinde prime esas tutulan brüt kazançlar toplamıdır (TİS geriye dönük fark bordroları olduğunda SSK Matrah Düzeltmesi eklenir).',
                    calcDetails: 'Toplam SGK Matrahı: ' + fmtMoney(currentSlip.sskMatrahi) + ' TL',
                  })
                }
                className="flex justify-between hover:bg-current/10 cursor-pointer px-0.5 rounded transition-colors"
              >
                <span>|SSK Matrahı   :</span>
                <span className="font-bold">{fmtMoney(currentSlip.sskMatrahi)}|</span>
              </div>

              {/* SSK Prim İşçi: %9.000 Vurgusu */}
              <div
                onClick={() =>
                  setActiveTooltip({
                    title: 'SSK Prim İşçi - %9,000 Kesinti (GSS Muafiyeti)',
                    tisCode: '5510 SK Madde 5/1-c & Rapor Bölüm 5.1',
                    text: 'Standart işçilerde SGK İşçi primi %14 (%9 emeklilik + %5 GSS) iken, 3713 / 2330 sayılı kanunlara tabi gazi/vazife malullerinde GSS kesilmez! Kuruşu kuruşuna tam %9,000 oranında kesilmiştir.',
                    calcDetails: `${fmtMoney(currentSlip.sskMatrahi)} x %9,000 = ${fmtMoney(currentSlip.sskPrimIsci)} TL`,
                  })
                }
                className="flex justify-between hover:bg-emerald-500/20 cursor-pointer px-0.5 rounded transition-colors bg-emerald-500/10"
              >
                <span className="font-bold text-emerald-700 dark:text-emerald-400">|SSK Prim İşçi :</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{fmtMoney(currentSlip.sskPrimIsci)}|</span>
              </div>

              {/* SSK Prim İşveren */}
              <div
                onClick={() =>
                  setActiveTooltip({
                    title: 'SSK Prim İşveren Payı',
                    tisCode: '5510 SK Madde 81 & Rapor Bölüm 5.1',
                    text: 'İşveren hissesi %11 uzun vadeli sigorta kolları + kısa vadeli sigorta kolu (iş kazası/meslek hastalığı) primlerini içerir. GSS işveren payı (%7,5) bu personel için uygulanmaz.',
                    calcDetails: `${fmtMoney(currentSlip.sskMatrahi)} üzerinden %13,25 - %14,25 = ${fmtMoney(currentSlip.sskPrimIsv)} TL`,
                  })
                }
                className="flex justify-between hover:bg-current/10 cursor-pointer px-0.5 rounded transition-colors"
              >
                <span>|SSK Prim(İşv) :</span>
                <span className="font-bold">{fmtMoney(currentSlip.sskPrimIsv)}|</span>
              </div>

              {/* Yıllık Glr.VM */}
              <div
                onClick={() =>
                  setActiveTooltip({
                    title: 'Yıllık Kümülatif Gelir Vergisi Matrahı',
                    tisCode: '193 sayılı GVK Madde 103',
                    text: 'Yıl başından itibaren biriken kümülatif vergi matrahıdır. 190.000 TL aşılınca %20 dilimine, 400.000 TL aşılınca %27 dilimine geçilir.',
                    calcDetails: 'Kümülatif Toplam: ' + fmtMoney(currentSlip.yillikGlrVm) + ' TL',
                  })
                }
                className="flex justify-between hover:bg-current/10 cursor-pointer px-0.5 rounded transition-colors"
              >
                <span>|Yıllık Glr.VM :</span>
                <span className="font-bold font-mono">{fmtMoney(currentSlip.yillikGlrVm)}|</span>
              </div>

              {/* Aylık Glr.VM */}
              <div className="flex justify-between">
                <span>|Aylık Glr.VM  :</span>
                <span className="font-bold">{fmtMoney(currentSlip.aylikGlrVm)}|</span>
              </div>

              {/* Gelir Vergisi */}
              <div
                onClick={() =>
                  setActiveTooltip({
                    title: 'Aylık Kesilen Gelir Vergisi',
                    tisCode: 'GVK Md. 103 & 7349 Sayılı Kanun İstisnası',
                    text: 'Raporun 6.2 Bölümündeki Ocak ayı sağlaması: (Aylık Glr.VM 99.628,26 x %15 = 14.944,24 TL) - Asgari Ücret GV İstisnası (4.211,33 TL) = 10.732,91 TL! Kuruşu kuruşuna tam olarak tutmaktadır.',
                    calcDetails: 'Ödenecek Net Gelir Vergisi: ' + fmtMoney(currentSlip.gelirVergisi) + ' TL',
                  })
                }
                className="flex justify-between hover:bg-current/10 cursor-pointer px-0.5 rounded transition-colors"
              >
                <span>|Gelir Vergisi :</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">{fmtMoney(currentSlip.gelirVergisi)}|</span>
              </div>

              {/* Damga Vergisi */}
              <div
                onClick={() =>
                  setActiveTooltip({
                    title: 'Damga Vergisi (Binde 7,59)',
                    tisCode: '488 sayılı Kanun & 7349 SK İstisnası',
                    text: 'Damga vergisi matrahı üzerinden binde 7,59 oranında hesaplanır; 2026 yılı aylık 250,70 TL asgari ücret istisnası düşülerek kesilir.',
                    calcDetails: 'Ödenecek Damga Vergisi: ' + fmtMoney(currentSlip.damgaVergisi) + ' TL',
                  })
                }
                className="flex justify-between hover:bg-current/10 cursor-pointer px-0.5 rounded transition-colors"
              >
                <span>|Damga Vergisi :</span>
                <span className="font-bold">{fmtMoney(currentSlip.damgaVergisi)}|</span>
              </div>

              {/* İşsizlik Sigortası: 0.00 TL Vurgusu */}
              <div
                onClick={() =>
                  setActiveTooltip({
                    title: 'İşsizlik Sigortası Primi: 0,00 TL (Muafiyet)',
                    tisCode: '4447 Sayılı Kanun & Rapor Bölüm 5.2',
                    text: '4447 sayılı Kanun uyarınca vazife/harp malullüğü aylığı alan personel için işsizlik sigortası primi kesilmez. 8 ayın tamamında 0,00 TL olarak doğrulanmıştır.',
                    calcDetails: 'İşçi: 0,00 TL | İşveren: 0,00 TL',
                  })
                }
                className="flex justify-between hover:bg-blue-500/20 cursor-pointer px-0.5 rounded transition-colors bg-blue-500/10"
              >
                <span className="font-bold text-blue-700 dark:text-blue-400">|İşs.Sig.(İşç) :</span>
                <span className="font-bold text-blue-700 dark:text-blue-400">{fmtMoney(currentSlip.issSigIsci)}|</span>
              </div>

              <div className="flex justify-between text-blue-700 dark:text-blue-400">
                <span>|İşs.Sig.(İşv) :</span>
                <span className="font-bold">{fmtMoney(currentSlip.issSigIsv)}|</span>
              </div>

              <div className="flex justify-between">
                <span>|Mahsup Fark   :</span>
                <span>{fmtMoney(currentSlip.mahsupFark)}|</span>
              </div>

              {/* Gelir Toplamı */}
              <div className="flex justify-between border-t border-dashed border-current/40 pt-1 font-bold">
                <span>|Gelir Toplamı:</span>
                <span>{fmtMoney(currentSlip.gelirToplami)}|</span>
              </div>

              {/* Kesinti Toplamı */}
              <div className="flex justify-between font-bold text-rose-600 dark:text-rose-400">
                <span>|Kesinti Topl.:</span>
                <span>{fmtMoney(currentSlip.kesintiTopl)}|</span>
              </div>

              {/* NET ÖDEME (HIGHLIGHT) */}
              <div className="flex justify-between text-xs md:text-sm font-black border-y-2 border-double border-current py-1 my-0.5 bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                <span>|Net Ödeme     :</span>
                <span className="tracking-wider">{fmtMoney(currentSlip.netOdeme)}|</span>
              </div>

              <div className="flex justify-between text-[10px]">
                <span>|Asgari Geç.İn:</span>
                <span>{fmtMoney(currentSlip.asgariGecIn)}|</span>
              </div>
            </div>
          </div>

          {/* Bottom Dashed Border */}
          <div className="p-2 border-t border-dashed border-current/40 text-[10px] flex items-center justify-between text-current/60">
            <span>|TCDD TAŞIMACILIK A.Ş. İNSAN KAYNAKLARI DAİRESİ BAŞKANLIĞI BORDRO SERVİSİ|</span>
            <span>4857 SK MD.37 RESMİ ÜCRET HESAP PUSULASI FORMATIDIR</span>
          </div>
        </div>

        {/* Right Inspection / Educational Drawer */}
        <div className="w-full xl:w-[420px] shrink-0 space-y-4 print:hidden">
          {/* Active Item Inspector */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Kalem / Formül Detay Rehberi
                </h3>
              </div>
              {activeTooltip && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {activeTooltip.tisCode}
                </span>
              )}
            </div>

            {activeTooltip ? (
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-white text-sm">{activeTooltip.title}</h4>
                  <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
                    Hukuki Dayanak: {activeTooltip.tisCode}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                  {activeTooltip.text}
                </p>
                {activeTooltip.calcDetails && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-emerald-200 text-[11px] font-mono">
                    <span className="font-bold block text-emerald-400 mb-1">Hesaplama Formülü / Değer:</span>
                    {activeTooltip.calcDetails}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 space-y-2">
                <Info className="w-6 h-6 text-slate-600 mx-auto" />
                <p className="text-xs">
                  Bordro üzerindeki herhangi bir satıra tıklayarak <strong>TİS sözleşme maddesini</strong>, <strong>yasal kanun dayanağını</strong> ve <strong>hesaplama formülünü</strong> anında görebilirsiniz.
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5 justify-center">
                  <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-300">GST %10</span>
                  <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-300">GMŞ %24</span>
                  <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-300">Vergiden Muaf 3.000 TL</span>
                  <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-300">SSK %9 İşçi</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Key TİS Articles Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
              <span>Bordroyu Şekillendiren TİS Hükümleri</span>
              <span className="text-[10px] text-slate-400">31. Dönem</span>
            </h3>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {TIS_31_ARTICLES_INFO.slice(0, 6).map((art) => (
                <div
                  key={art.code}
                  onClick={() =>
                    setActiveTooltip({
                      title: art.title,
                      tisCode: art.code,
                      text: art.content,
                    })
                  }
                  className="p-2.5 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 rounded-lg cursor-pointer transition-colors text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{art.code}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">İncele →</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{art.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
