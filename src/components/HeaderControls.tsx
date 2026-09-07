import React from 'react';
import {
  RotateCcw,
  Download,
  Upload,
  FileDown,
  Calendar,
  Award,
  User,
  Accessibility,
  Check
} from 'lucide-react';
import { BordroData } from '../types';
import { MONTHS_TABLE } from '../utils/bordroEngine';
import { generateMaasBordroPDF } from '../utils/pdfGenerator';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderControlsProps {
  bordro: BordroData;
  onChange: (updates: Partial<BordroData>) => void;
  onReset?: () => void;
  onZero: () => void;
  onRecalculate?: () => void;
  onOpenZamModal: () => void;
  onOpenReportModal?: () => void;
  onOpenSavedModal?: () => void;
  onExportJSON: () => void;
  onImportJSON: () => void;
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({
  bordro,
  onChange,
  onReset,
  onZero,
  onRecalculate,
  onOpenZamModal,
  onOpenSavedModal,
  onExportJSON,
  onImportJSON
}) => {
  const handleStatusSwitch = (status: 'normal' | 'gazi' | 'engelli') => {
    if (status === bordro.calisanStatusu) return;

    if (status === 'normal') {
      const updatedEarnings = bordro.earnings.map(e => {
        if (e.id === 'gst') return { ...e, hours: 0, amount: 0 };
        if (e.id === 'fm') return { ...e, rule: 'mesai175' as const, label: 'FM %75 Pntr', badge: '%75' };
        if (e.id === 'gms') return { ...e, rule: 'gms24' as const, label: 'GMŞ%(17+7)24', badge: 'OTO' };
        return e;
      });
      onChange({
        calisanStatusu: 'normal',
        mevzuatNotu: '31. Dönem TİS 1/1 • TCDD Taşımacılık A.Ş. Sürekli İşçi Bordrosu (Standart 4/a)',
        vergiMuafiyeti: 0,
        earnings: updatedEarnings
      });
    } else if (status === 'gazi') {
      const updatedEarnings = bordro.earnings.map(e => {
        if (e.id === 'postabasi') return { ...e, hours: 0, amount: 0 };
        if (e.id === 'fm' || e.rule === 'mesai175') return { ...e, rule: 'mesai200' as const, label: 'Fzl Mes %100', badge: 'OTO' };
        if (e.id === 'gms') return { ...e, rule: 'gms24' as const, label: 'GMŞ%(17+7)24', badge: 'OTO' };
        return e;
      });
      onChange({
        calisanStatusu: 'gazi',
        mevzuatNotu: 'Terörle Mücadele Kapsamı (Gazi) • 3. Derece Engelli Vergi İndirimi (3.000 ₺) • 31. Dönem TİS 1/1',
        vergiMuafiyeti: bordro.vergiMuafiyeti > 0 ? bordro.vergiMuafiyeti : 3000,
        earnings: updatedEarnings
      });
    } else {
      const updatedEarnings = bordro.earnings.map(e => {
        if (e.id === 'gst') return { ...e, hours: 0, amount: 0 };
        if (e.id === 'fm') return { ...e, rule: 'mesai175' as const, label: 'FM %75 Pntr', badge: '%75' };
        if (e.id === 'gms') return { ...e, rule: 'gms22' as const, label: 'GMŞ%(15+7)22', badge: 'OTO' };
        return e;
      });
      onChange({
        calisanStatusu: 'engelli',
        mevzuatNotu: '31. Dönem TİS 1/1 • TCDD Taşımacılık A.Ş. Engelli Sürekli İşçi Bordrosu (GMŞ %(15+7)22, GVK 31 Engellilik İndirimi)',
        vergiMuafiyeti: bordro.vergiMuafiyeti > 0 ? bordro.vergiMuafiyeti : 7000,
        earnings: updatedEarnings
      });
    }
  };

  const handleMonthSelect = (monthNum: number) => {
    const month = MONTHS_TABLE[monthNum];
    if (!month) return;
    const periodStr = `${monthNum < 10 ? `0${monthNum}` : `${monthNum}`}/2026 (${month.range})`;
    onChange({
      aySecim: monthNum,
      ayNo: monthNum,
      bordroDonem: periodStr,
      yillikGlrVM: month.prevCumul
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top action controls bar */}
      <header
        id="action-controls"
        className="w-full max-w-7xl 2xl:max-w-[1920px] 3xl:max-w-[2560px] mb-2 sm:mb-3 flex flex-col md:flex-row gap-2 justify-between items-stretch md:items-center no-print font-dotmatrix"
      >
        {/* Normal / Gazi / Engelli Çalışan Statü Seçimi - Çok Belirgin ve Canlı Renkler */}
        <div
          id="status-selector-group"
          className="flex flex-col xs:flex-row items-stretch xs:items-center bg-slate-100 p-1 sm:p-1.5 rounded-xl border-2 border-slate-300 shadow-sm gap-1 w-full md:w-auto"
        >
          <span className="text-[10px] sm:text-[11px] font-black uppercase text-slate-800 tracking-wider hidden sm:flex items-center gap-1 pl-1 shrink-0 select-none">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            STATÜ:
          </span>

          <div className="grid grid-cols-3 gap-1 w-full xs:w-auto">
            {/* NORMAL ÇALIŞAN */}
            <button
              id="btn-status-normal"
              type="button"
              onClick={() => handleStatusSwitch('normal')}
              className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer text-xs font-black shadow-xs ${
                bordro.calisanStatusu === 'normal'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white ring-2 ring-blue-400 border border-blue-700 shadow-sm'
                  : 'bg-white hover:bg-blue-50 text-blue-900 border-2 border-blue-200/90 hover:border-blue-400'
              }`}
              title="Normal Çalışan: Standart TCDD Taşımacılık A.Ş. 4/a Sürekli İşçi"
            >
              {bordro.calisanStatusu === 'normal' ? (
                <Check className="w-3.5 h-3.5 text-white stroke-[3] shrink-0" />
              ) : (
                <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              )}
              <span className="truncate">NORMAL</span>
            </button>

            {/* GAZİ STATÜSÜ */}
            <button
              id="btn-status-gazi"
              type="button"
              onClick={() => handleStatusSwitch('gazi')}
              className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer text-xs font-black shadow-xs ${
                bordro.calisanStatusu === 'gazi'
                  ? 'bg-amber-600 hover:bg-amber-700 text-white ring-2 ring-amber-400 border border-amber-700 shadow-sm'
                  : 'bg-white hover:bg-amber-50 text-amber-900 border-2 border-amber-200/90 hover:border-amber-400'
              }`}
              title="Gazi Statüsü: Terörle Mücadele Kapsamı"
            >
              {bordro.calisanStatusu === 'gazi' ? (
                <Check className="w-3.5 h-3.5 text-white stroke-[3] shrink-0" />
              ) : (
                <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              )}
              <span className="truncate">GAZİ</span>
            </button>

            {/* ENGELLİ ÇALIŞAN */}
            <button
              id="btn-status-engelli"
              type="button"
              onClick={() => handleStatusSwitch('engelli')}
              className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer text-xs font-black shadow-xs ${
                bordro.calisanStatusu === 'engelli'
                  ? 'bg-purple-700 hover:bg-purple-800 text-white ring-2 ring-purple-400 border border-purple-800 shadow-sm'
                  : 'bg-white hover:bg-purple-50 text-purple-900 border-2 border-purple-200/90 hover:border-purple-400'
              }`}
              title="Engelli Çalışan: GVK 31 Engellilik İndirimi"
            >
              {bordro.calisanStatusu === 'engelli' ? (
                <Check className="w-3.5 h-3.5 text-white stroke-[3] shrink-0" />
              ) : (
                <Accessibility className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              )}
              <span className="truncate">ENGELLİ</span>
            </button>
          </div>
        </div>

        {/* Sağ Taraf: Dönem Seçici ve Aksiyon Butonları */}
        <div className="flex items-center flex-wrap gap-1.5 justify-between sm:justify-end">
          {/* Dönem Seçimi Dropdown */}
          <div className="flex items-center gap-1 bg-white border-2 border-sky-300 px-2 py-1.5 rounded-lg shadow-2xs text-xs">
            <Calendar className="w-3.5 h-3.5 text-sky-700 shrink-0" />
            <label
              htmlFor="bordroAySecim"
              className="text-sky-950 font-bold uppercase text-[11px] shrink-0"
            >
              Dönem:
            </label>
            <select
              id="bordroAySecim"
              value={bordro.aySecim}
              onChange={e => handleMonthSelect(parseInt(e.target.value, 10))}
              className="font-bold text-xs bg-transparent text-sky-950 focus:outline-none cursor-pointer"
              title="Maaş Dönemi ve Kümülatif Vergi Matrahını Belirler"
            >
              <option value="1">01 - Ocak (15.12-14.01)</option>
              <option value="2">02 - Şubat (15.01-14.02)</option>
              <option value="3">03 - Mart (15.02-14.03)</option>
              <option value="4">04 - Nisan (15.03-14.04)</option>
              <option value="5">05 - Mayıs (15.04-14.05)</option>
              <option value="6">06 - Haziran (15.05-14.06)</option>
              <option value="7">07 - Temmuz (15.06-14.07)</option>
              <option value="8">08 - Ağustos (15.07-14.08)</option>
              <option value="9">09 - Eylül (15.08-14.09)</option>
              <option value="10">10 - Ekim (15.09-14.10)</option>
              <option value="11">11 - Kasım (15.10-14.11)</option>
              <option value="12">12 - Aralık (15.11-14.12)</option>
            </select>
          </div>

          <button
            id="btn-download-pdf"
            type="button"
            onClick={() => {
              if (onRecalculate) onRecalculate();
              generateMaasBordroPDF(bordro);
            }}
            className="px-2.5 sm:px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-wide rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer border border-blue-600"
            title="Resmi TCDD antetli bordroyu PDF olarak indir"
          >
            <FileDown className="w-4 h-4 text-blue-200 shrink-0" />
            <span>PDF Olarak İndir</span>
          </button>

          <button
            id="btn-import-json"
            type="button"
            onClick={onImportJSON}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer"
            title="Daha önce kaydedilen bordro dosyasını (.json) yükle"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Yükle</span>
          </button>

          <button
            id="btn-export-json"
            type="button"
            onClick={onExportJSON}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer"
            title="Bordro verisini JSON olarak indir / yedekle"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Yedekle</span>
          </button>

          <button
            id="btn-zero-all"
            type="button"
            onClick={onZero}
            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold uppercase rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer"
            title="Tüm saat ve hakedişleri sıfırlar"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span>Sıfırla</span>
          </button>

          <PWAInstallButton />
        </div>
      </header>
    </div>
  );
};
