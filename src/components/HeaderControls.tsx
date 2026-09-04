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
  User
} from 'lucide-react';
import { BordroData } from '../types';
import { MONTHS_TABLE } from '../utils/bordroEngine';

interface HeaderControlsProps {
  bordro: BordroData;
  onChange: (updates: Partial<BordroData>) => void;
  onReset: () => void;
  onZero: () => void;
  onRecalculate: () => void;
  onOpenZamModal: () => void;
  onOpenSavedModal: () => void;
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
  const handleStatusSwitch = (status: 'gazi' | 'normal') => {
    if (status === bordro.calisanStatusu) return;

    if (status === 'normal') {
      onChange({
        calisanStatusu: 'normal',
        mevzuatNotu: '31. Dönem TİS 1/1 • TCDD Taşımacılık A.Ş. Sürekli İşçi Bordrosu (Standart 4/a)',
        vergiMuafiyeti: 0
      });
    } else {
      onChange({
        calisanStatusu: 'gazi',
        mevzuatNotu: 'Terörle Mücadele Kapsamı (Gazi) • 3. Derece Engelli Vergi İndirimi (3.000 ₺) • 31. Dönem TİS 1/1',
        vergiMuafiyeti: bordro.vergiMuafiyeti > 0 ? bordro.vergiMuafiyeti : 3000
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
        className="w-full max-w-7xl 2xl:max-w-[1920px] 3xl:max-w-[2560px] mb-3 2xl:mb-4 flex flex-wrap gap-2 justify-between items-center no-print font-dotmatrix"
      >
        <div className="flex items-center flex-wrap gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-xs 2xl:text-sm font-bold text-slate-800 tracking-wide">
            TCDD TAŞIMACILIK A.Ş. BORDRO SİSTEMİ
          </span>
          <span className="text-[11px] 2xl:text-xs bg-slate-200/90 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-300">
            Canlı Düzenleme Modu
          </span>
          <span
            className="text-[11px] 2xl:text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1"
            title="Değişen tüm saat ve tutarlar anlık hesaplanır"
          >
            <Zap className="w-3 h-3 text-emerald-700" />
            Otomatik Hesaplama Açık
          </span>
          <span
            className="text-[11px] 2xl:text-xs bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded border border-sky-300 flex items-center gap-1"
            title="Saat Ücreti x Saat formülleriyle hakedişler türetilir"
          >
            <Clock className="w-3 h-3 text-sky-700" />
            Saatlik Çarpım Aktif
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Gazi / Normal Çalışan Statü Seçimi */}
          <div
            id="status-selector-group"
            className="flex items-center bg-slate-200/90 p-0.5 rounded-lg border border-slate-300 text-xs font-bold shadow-2xs"
          >
            <button
              id="btn-status-gazi"
              type="button"
              onClick={() => handleStatusSwitch('gazi')}
              className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 cursor-pointer font-bold ${
                bordro.calisanStatusu !== 'normal'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
              }`}
              title="Gazi Statüsü (Terörle Mücadele): GŞT %10, 3.000 TL Engelli Vergi İndirimi ve %9 SSK Primi Aktiftir"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Gazi Statüsü</span>
            </button>
            <button
              id="btn-status-normal"
              type="button"
              onClick={() => handleStatusSwitch('normal')}
              className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 cursor-pointer font-bold ${
                bordro.calisanStatusu === 'normal'
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
              }`}
              title="Normal Çalışan: Standart TCDD Taşımacılık A.Ş. 4/a Sürekli İşçi (%14 SSK, %1 İşsizlik, GŞT ve Muafiyetsiz)"
            >
              <User className="w-3.5 h-3.5" />
              <span>Normal Çalışan</span>
            </button>
          </div>

          <button
            id="btn-zero-all"
            type="button"
            onClick={onZero}
            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-semibold uppercase tracking-wide rounded shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            title="Tüm saat, hakediş ve kesintileri 0,00 yapar"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            Sıfırla
          </button>

          <button
            id="btn-reset-original"
            type="button"
            onClick={onReset}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold uppercase tracking-wide rounded shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            title="Orijinal resmi TCDD bordro verilerini yükler"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Orijinal Bordro
          </button>

          <button
            id="btn-open-zam-modal"
            type="button"
            onClick={onOpenZamModal}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wide rounded shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            title="31. Dönem TİS Zammı Simülatörü ve Dönem İçi Gün Hesabı"
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
            TİS Zammı Simüle Et
          </button>

          <button
            id="btn-saved-bordrolar"
            type="button"
            onClick={onOpenSavedModal}
            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold uppercase tracking-wide rounded shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            title="Kaydedilmiş bordrolar veya farklı ayları sakla"
          >
            <FolderOpen className="w-3.5 h-3.5 text-emerald-700" />
            Bordro Kayıtları
          </button>

          <button
            id="btn-export-json"
            type="button"
            onClick={onExportJSON}
            className="px-2 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs rounded shadow-xs transition flex items-center gap-1 cursor-pointer"
            title="Bordro verisini JSON olarak indir"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Yedekle
          </button>

          <button
            id="btn-import-json"
            type="button"
            onClick={onImportJSON}
            className="px-2 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs rounded shadow-xs transition flex items-center gap-1 cursor-pointer"
            title="Daha önce yedeklenen bordro JSON dosyasını yükle"
          >
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            Yükle
          </button>

          <button
            id="btn-recalc"
            type="button"
            onClick={onRecalculate}
            className="px-3 py-1.5 bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold uppercase tracking-wide rounded shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5" />
            Hesapla
          </button>

          <button
            id="btn-print-payslip"
            type="button"
            onClick={() => {
              onRecalculate();
              window.print();
            }}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold uppercase tracking-wide rounded shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Yazdır / PDF
          </button>
        </div>
      </header>

      {/* Inside-Document Header Banner */}
      <section className="w-full border-b-2 border-dashed border-slate-700 pb-2.5 mb-2.5 2xl:pb-3.5 2xl:mb-3.5">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-2 2xl:gap-4">
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

          <div className="flex items-center gap-2 self-end md:self-auto flex-wrap font-dotmatrix">
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

            <div className="flex items-center gap-1 bg-slate-100 border border-slate-300 rounded px-2 py-1 text-xs">
              <span className="text-slate-500 font-medium">Dönem:</span>
              <span className="font-bold text-slate-800">{bordro.bordroDonem}</span>
            </div>
          </div>
        </div>

        {/* Sub-banner: Legislation & Special Status */}
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1.5 text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded px-2 py-1">
          <div className="flex items-center flex-wrap gap-2">
            <span
              className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase flex items-center gap-1 border ${
                bordro.calisanStatusu === 'normal'
                  ? 'bg-sky-100 text-sky-900 border-sky-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              {bordro.calisanStatusu === 'normal' ? (
                <>
                  <User className="w-3 h-3 text-sky-700" />
                  <span>Normal Sürekli İşçi (4/a Standart)</span>
                </>
              ) : (
                <>
                  <Award className="w-3 h-3 text-amber-700" />
                  <span>Gazi Statüsü (Terörle Mücadele)</span>
                </>
              )}
            </span>
            <span className="font-medium text-slate-700">{bordro.mevzuatNotu}</span>
          </div>
          <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
            Asgari Ücret Vergi İstisnası Aktif
          </span>
        </div>
      </section>
    </div>
  );
};
