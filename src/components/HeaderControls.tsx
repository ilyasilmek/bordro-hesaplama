import React from 'react';
import {
  RotateCcw,
  Sparkles,
  TrendingUp,
  FolderOpen,
  Download,
  Upload,
  Calculator,
  Printer,
  Calendar,
  Zap,
  Clock,
  Award,
  User,
  Accessibility,
  BarChart3
} from 'lucide-react';
import { BordroData } from '../types';
import { MONTHS_TABLE } from '../utils/bordroEngine';
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
        className="w-full max-w-7xl 2xl:max-w-[1920px] 3xl:max-w-[2560px] mb-2.5 2xl:mb-4 flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center no-print font-dotmatrix"
      >
        {/* Status badges - Desktop full, Mobile compact single row */}
        <div className="flex items-center flex-wrap gap-1.5 justify-between sm:justify-start">
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs 2xl:text-sm font-bold text-slate-800 tracking-wide">
              BORDRO DÜZENLEYİCİ
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="text-[10px] sm:text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1"
              title="Değişen tüm saat ve tutarlar anlık hesaplanır"
            >
              <Zap className="w-3 h-3 text-emerald-700" />
              <span>Otomatik Hesaplama</span>
            </span>
            <span
              className="hidden sm:inline-flex text-[10px] sm:text-xs bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded border border-sky-300 items-center gap-1"
              title="Saat Ücreti x Saat formülleriyle hakedişler türetilir"
            >
              <Clock className="w-3 h-3 text-sky-700" />
              <span>Saatlik Çarpım Aktif</span>
            </span>
          </div>
        </div>

        {/* Action Buttons Group */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Normal / Gazi / Engelli Çalışan Statü Seçimi - Mobilde tam genişlik 3 eşit sütun */}
          <div
            id="status-selector-group"
            className="grid grid-cols-3 sm:flex items-center bg-slate-200/90 p-0.5 rounded-lg border border-slate-300 text-xs font-bold shadow-2xs w-full sm:w-auto"
          >
            <button
              id="btn-status-normal"
              type="button"
              onClick={() => handleStatusSwitch('normal')}
              className={`px-2 sm:px-3 py-1.5 rounded-md transition flex items-center justify-center gap-1 cursor-pointer font-bold text-[11px] sm:text-xs ${
                bordro.calisanStatusu === 'normal'
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
              }`}
              title="Normal Çalışan: Standart TCDD Taşımacılık A.Ş. 4/a Sürekli İşçi"
            >
              <User className="w-3 h-3 shrink-0" />
              <span className="truncate">Normal</span>
            </button>
            <button
              id="btn-status-gazi"
              type="button"
              onClick={() => handleStatusSwitch('gazi')}
              className={`px-2 sm:px-3 py-1.5 rounded-md transition flex items-center justify-center gap-1 cursor-pointer font-bold text-[11px] sm:text-xs ${
                bordro.calisanStatusu === 'gazi'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
              }`}
              title="Gazi Statüsü: Terörle Mücadele Kapsamı"
            >
              <Award className="w-3 h-3 shrink-0" />
              <span className="truncate">Gazi</span>
            </button>
            <button
              id="btn-status-engelli"
              type="button"
              onClick={() => handleStatusSwitch('engelli')}
              className={`px-2 sm:px-3 py-1.5 rounded-md transition flex items-center justify-center gap-1 cursor-pointer font-bold text-[11px] sm:text-xs ${
                bordro.calisanStatusu === 'engelli'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
              }`}
              title="Engelli Çalışan: GVK 31 Engellilik İndirimi"
            >
              <Accessibility className="w-3 h-3 shrink-0" />
              <span className="truncate">Engelli</span>
            </button>
          </div>

          {/* Aksiyon Butonları - Kompakt ve ergonomik */}
          <div className="flex items-center flex-wrap gap-1.5 justify-between sm:justify-end">
            <button
              id="btn-print-payslip"
              type="button"
              onClick={() => {
                if (onRecalculate) onRecalculate();
                window.print();
              }}
              className="px-2.5 sm:px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wide rounded shadow-xs transition flex items-center gap-1 cursor-pointer"
              title="Resmi TCDD bordro formatında yazdır / PDF kaydet"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Yazdır / PDF</span>
            </button>

            {onOpenSavedModal && (
              <button
                id="btn-saved-bordrolar"
                type="button"
                onClick={onOpenSavedModal}
                className="px-2 sm:px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded shadow-xs transition flex items-center gap-1 cursor-pointer"
                title="Kaydedilen formları ve özel bordroları yükle"
              >
                <FolderOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Kayıtlı</span>
                <span>Formlar</span>
              </button>
            )}

            <button
              id="btn-import-json"
              type="button"
              onClick={onImportJSON}
              className="px-2 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs rounded shadow-xs transition flex items-center gap-1 cursor-pointer"
              title="Daha önce kaydedilen bordro dosyasını (.json) yükle"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
              <span>Yükle</span>
            </button>

            <button
              id="btn-export-json"
              type="button"
              onClick={onExportJSON}
              className="px-2 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs rounded shadow-xs transition flex items-center gap-1 cursor-pointer"
              title="Bordro verisini JSON olarak indir / yedekle"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Yedekle</span>
            </button>

            <button
              id="btn-zero-all"
              type="button"
              onClick={onZero}
              className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-semibold uppercase rounded shadow-xs transition flex items-center gap-1 cursor-pointer"
              title="Tüm saat ve hakedişleri sıfırlar"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>Sıfırla</span>
            </button>

            <PWAInstallButton />
          </div>
        </div>
      </header>

      {/* Inside-Document Header Banner */}
      <section className="w-full border-b-2 border-dashed border-slate-700 pb-2 mb-2 2xl:pb-3.5 2xl:mb-3.5">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 2xl:gap-4">
          <div className="flex-1">
            <label className="sr-only" htmlFor="bordroBaslik">
              Bordro Başlığı
            </label>
            <input
              id="bordroBaslik"
              name="bordroBaslik"
              type="text"
              value={bordro.bordroBaslik}
              onChange={e => onChange({ bordroBaslik: e.target.value })}
              className="w-full font-bold uppercase tracking-wide text-xs sm:text-sm 2xl:text-base bg-slate-50/70 border border-slate-300 rounded px-2.5 py-1 text-slate-900 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 font-dotmatrix"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap font-dotmatrix">
            <div className="flex items-center gap-1 no-print">
              <Calendar className="w-3.5 h-3.5 text-sky-700 shrink-0" />
              <label
                htmlFor="bordroAySecim"
                className="text-slate-600 font-semibold uppercase text-xs shrink-0"
              >
                Dönem:
              </label>
              <select
                id="bordroAySecim"
                value={bordro.aySecim}
                onChange={e => handleMonthSelect(parseInt(e.target.value, 10))}
                className="font-bold text-xs bg-sky-50 text-sky-900 border border-sky-300 rounded px-2 py-1 focus:bg-white focus:border-sky-600 focus:ring-1 focus:ring-sky-600 cursor-pointer"
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

            <div className="hidden md:flex items-center gap-1 bg-slate-100 border border-slate-300 rounded px-2 py-1 text-xs">
              <span className="text-slate-500 font-medium">Dönem:</span>
              <span className="font-bold text-slate-800">{bordro.bordroDonem}</span>
            </div>
          </div>
        </div>

        {/* Sub-banner: Legislation & Special Status */}
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1 text-[10.5px] sm:text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded px-2 py-1">
          <div className="flex items-center flex-wrap gap-1.5">
            <span
              className={`px-1.5 py-0.5 rounded font-bold text-[9.5px] sm:text-[10px] uppercase flex items-center gap-1 border ${
                bordro.calisanStatusu === 'normal'
                  ? 'bg-sky-100 text-sky-900 border-sky-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              {bordro.calisanStatusu === 'normal' ? (
                <>
                  <User className="w-3 h-3 text-sky-700" />
                  <span>Normal Sürekli İşçi</span>
                </>
              ) : (
                <>
                  <Award className="w-3 h-3 text-amber-700" />
                  <span>Gazi Statüsü</span>
                </>
              )}
            </span>
            <span className="font-medium text-slate-700 hidden sm:inline">{bordro.mevzuatNotu}</span>
          </div>
          <span className="text-[9.5px] sm:text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
            Asgari Ücret Vergi İstisnası Aktif
          </span>
        </div>
      </section>
    </div>
  );
};
