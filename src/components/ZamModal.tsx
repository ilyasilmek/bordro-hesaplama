import React, { useState, useEffect } from 'react';
import { TrendingUp, X, AlertTriangle, CheckCircle2, RotateCcw, HelpCircle, ArrowRight } from 'lucide-react';
import { BordroData, IkramiyeData } from '../types';
import { formatCurrency, parseCurrency } from '../utils/bordroEngine';

export interface AppliedZamInfo {
  rate: number;
  isPartial: boolean;
  target: 'maas' | 'ikramiye' | 'both';
  appliedAt: string;
}

interface ZamModalProps {
  isOpen: boolean;
  onClose: () => void;
  bordro: BordroData;
  ikramiyeData?: IkramiyeData;
  activeView?: 'maas' | 'ikramiye';
  lastAppliedZam: AppliedZamInfo | null;
  onApplyZam: (
    zamRate: number,
    isPartial: boolean,
    oldDays: number,
    newDays: number,
    target: 'maas' | 'ikramiye' | 'both'
  ) => void;
  onResetZam?: () => void;
}

export const ZamModal: React.FC<ZamModalProps> = ({
  isOpen,
  onClose,
  bordro,
  ikramiyeData,
  activeView,
  lastAppliedZam,
  onApplyZam,
  onResetZam
}) => {
  // 2. Madde: Zam hanesi açılışta boş olarak gelsin. 15 seçili olmasın.
  const [rateStr, setRateStr] = useState('');
  const [isPartial, setIsPartial] = useState(false);
  const [oldDaysStr, setOldDaysStr] = useState('17');
  const [newDaysStr, setNewDaysStr] = useState('14');
  // Varsayılan hedef: TİS zammı her zaman hem Maaş hem İkramiyeyi kapsamalıdır ('both')
  const [targetScope, setTargetScope] = useState<'maas' | 'ikramiye' | 'both'>('both');
  const [showConfirmWarning, setShowConfirmWarning] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Modal her açıldığında varsayılan hedefi 'both' yapalım
  useEffect(() => {
    if (isOpen) {
      setTargetScope('both');
      setValidationError(null);
      setShowConfirmWarning(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentIkramiyeSaatUcr =
    ikramiyeData && ikramiyeData.saatUcr > 0 ? ikramiyeData.saatUcr : bordro.saatUcr;
  const currentIkramiyeEmkZam =
    ikramiyeData && ikramiyeData.emkZam > 0 ? ikramiyeData.emkZam : bordro.emkZam;

  const enteredRate = parseCurrency(rateStr) || 0;
  const oldDays = parseCurrency(oldDaysStr) || 17;
  const newDays = parseCurrency(newDaysStr) || 14;

  const rateMultiplier = 1 + enteredRate / 100;
  const effectiveMultiplier =
    isPartial && oldDays + newDays > 0
      ? (oldDays * 1.0 + newDays * rateMultiplier) / (oldDays + newDays)
      : rateMultiplier;

  const simMaasSaatUcr = bordro.saatUcr * effectiveMultiplier;
  const simMaasEmkZam = bordro.emkZam * effectiveMultiplier;
  const simIkrSaatUcr = currentIkramiyeSaatUcr * effectiveMultiplier;
  const simIkrEmkZam = currentIkramiyeEmkZam * effectiveMultiplier;

  const handleApplyClick = () => {
    setValidationError(null);
    const rate = parseCurrency(rateStr);
    if (!rate || rate <= 0) {
      setValidationError('Lütfen geçerli bir zam oranı giriniz (Örn: 15 veya 20,5).');
      return;
    }

    // 1. Madde: Bir sefer uygulandıysa uyarı yapalım
    if (lastAppliedZam && !showConfirmWarning) {
      setShowConfirmWarning(true);
      return;
    }

    // Onaylandı veya ilk kez uygulanıyor
    onApplyZam(rate, isPartial, oldDays, newDays, targetScope);
    setShowConfirmWarning(false);
    onClose();
  };

  const presetRates = ['10', '15', '20', '25', '30'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 font-dotmatrix animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-lg w-full p-5 flex flex-col gap-4 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-3 border-slate-200">
          <div className="flex items-center gap-2 text-slate-800">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm 2xl:text-base text-slate-900">
                TİS Zammı Simülasyonu & Oran Uygulama
              </h3>
              <p className="text-[11px] text-slate-500">
                Saat ücreti ve katsayıları toplu iş sözleşmesi zammına göre güncelleyin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Madde Uyarısı: Daha Önce Zam Uygulandıysa Görsel Uyarı */}
        {lastAppliedZam && (
          <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-3 text-amber-950 text-xs flex flex-col gap-1.5 shadow-2xs">
            <div className="flex items-center gap-2 font-black text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>DİKKAT: Bu bordroya daha önce TİS zammı uygulanmıştır!</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Uygulanan son zam: <strong className="font-bold font-mono">%{lastAppliedZam.rate}</strong>{' '}
              ({lastAppliedZam.target === 'both' ? 'Maaş & İkramiye' : lastAppliedZam.target === 'ikramiye' ? 'İkramiye' : 'Maaş Bordrosu'}) • {lastAppliedZam.appliedAt}
            </p>
            <p className="text-[11px] text-amber-900/90 font-medium">
              Zammı tekrar uygulamak saat ücretini kümülatif olarak katlar. Yeni bir oran denemek için önce sıfırlayabilir ya da onaylayarak devam edebilirsiniz.
            </p>
            {onResetZam && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onResetZam();
                    setShowConfirmWarning(false);
                  }}
                  className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded text-[11px] flex items-center gap-1 cursor-pointer transition border border-amber-400"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Uygulanan Zammı Geri Al / Taban Ücrete Dön</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal Content */}
        <div className="space-y-3.5 text-xs text-slate-700">
          {/* Hedef Seçimi (Maaş Bordrosu / İkramiye / Her İkisi) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-800">
                Zammın Uygulanacağı Kapsam:
              </label>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                Önerilen: Maaş & İkramiye (Tüm Bordrolar)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setTargetScope('both')}
                className={`py-2 px-1.5 rounded-md text-xs font-black transition cursor-pointer text-center flex flex-col items-center justify-center gap-0.5 ${
                  targetScope === 'both'
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>Maaş & İkramiye</span>
                <span className="text-[9px] font-medium opacity-90">(Her İkisi Birden)</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetScope('ikramiye')}
                className={`py-2 px-1.5 rounded-md text-xs font-black transition cursor-pointer text-center flex flex-col items-center justify-center gap-0.5 ${
                  targetScope === 'ikramiye'
                    ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-300'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>Sadece İkramiye</span>
                <span className="text-[9px] font-medium opacity-80">(İkramiye Bordrosu)</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetScope('maas')}
                className={`py-2 px-1.5 rounded-md text-xs font-black transition cursor-pointer text-center flex flex-col items-center justify-center gap-0.5 ${
                  targetScope === 'maas'
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>Sadece Maaş</span>
                <span className="text-[9px] font-medium opacity-80">(Aylık Bordro)</span>
              </button>
            </div>
          </div>

          {/* Zam Oranı Girişi (2. Madde: Açılışta boş!) */}
          <div>
            <label htmlFor="modal-zam-orani" className="font-bold block mb-1 text-slate-800">
              Uygulanacak Zam Oranı (%) <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 items-center flex-wrap">
              <div className="relative">
                <input
                  id="modal-zam-orani"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  value={rateStr}
                  onChange={e => {
                    setRateStr(e.target.value);
                    setValidationError(null);
                    setShowConfirmWarning(false);
                  }}
                  onFocus={e => e.target.select()}
                  placeholder="Örn: 15"
                  className={`w-32 text-sm font-black bg-slate-50 border rounded-lg px-3 py-2 text-right focus:bg-white focus:outline-none ${
                    validationError
                      ? 'border-red-500 ring-2 ring-red-200 bg-red-50/50'
                      : 'border-slate-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600'
                  }`}
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  %
                </span>
              </div>

              {/* Hızlı Seçim Butonları (Açılışta hiçbiri seçili değil) */}
              <div className="flex gap-1 flex-wrap">
                {presetRates.map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setRateStr(val);
                      setValidationError(null);
                      setShowConfirmWarning(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      rateStr === val
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    %{val}
                  </button>
                ))}
              </div>
            </div>
            {validationError && (
              <p className="text-red-600 text-[11px] font-semibold mt-1">
                {validationError}
              </p>
            )}
          </div>

          {/* CANLI ÖNİZLEME: Yeni Zamlı Saat Ücretleri Kartları */}
          {enteredRate > 0 && (
            <div className="bg-gradient-to-br from-slate-50 to-amber-50/50 border-2 border-amber-300 rounded-xl p-3 space-y-2">
              <div className="flex justify-between items-center border-b border-amber-200 pb-1.5">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  Uygulanacak Yeni Saat Ücretleri Önizlemesi:
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-950 font-bold px-1.5 py-0.5 rounded">
                  %{enteredRate} {isPartial ? '(Kısmi)' : 'Zam'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {/* İkramiye Saat Ücreti Önizleme */}
                {(targetScope === 'ikramiye' || targetScope === 'both') && (
                  <div className="bg-white border-2 border-amber-400 p-2.5 rounded-lg shadow-2xs">
                    <div className="font-black text-amber-900 text-xs mb-1 flex items-center justify-between">
                      <span>İkramiye Saat Ücreti:</span>
                      <span className="text-[9px] bg-amber-100 text-amber-900 px-1 rounded font-bold">İkramiye</span>
                    </div>
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-slate-400 line-through">
                        {formatCurrency(currentIkramiyeSaatUcr, 4)} ₺
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-600 mx-1 shrink-0" />
                      <span className="font-black text-amber-600 text-xs">
                        {formatCurrency(simIkrSaatUcr, 6)} ₺
                      </span>
                    </div>
                    <div className="text-[10.5px] text-slate-600 mt-1 flex justify-between">
                      <span>Emek Zammı:</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {formatCurrency(simIkrEmkZam, 6)} ₺
                      </span>
                    </div>
                  </div>
                )}

                {/* Aylık Maaş Saat Ücreti Önizleme */}
                {(targetScope === 'maas' || targetScope === 'both') && (
                  <div className="bg-white border-2 border-blue-400 p-2.5 rounded-lg shadow-2xs">
                    <div className="font-black text-blue-900 text-xs mb-1 flex items-center justify-between">
                      <span>Maaş Saat Ücreti:</span>
                      <span className="text-[9px] bg-blue-100 text-blue-900 px-1 rounded font-bold">Maaş</span>
                    </div>
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-slate-400 line-through">
                        {formatCurrency(bordro.saatUcr, 4)} ₺
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-600 mx-1 shrink-0" />
                      <span className="font-black text-blue-600 text-xs">
                        {formatCurrency(simMaasSaatUcr, 6)} ₺
                      </span>
                    </div>
                    <div className="text-[10.5px] text-slate-600 mt-1 flex justify-between">
                      <span>Emek Zammı:</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {formatCurrency(simMaasEmkZam, 6)} ₺
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dönem İçi Kısmi Zam Seçeneği */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 space-y-2">
            <label className="flex items-center gap-2 font-semibold text-amber-950 cursor-pointer">
              <input
                type="checkbox"
                checked={isPartial}
                onChange={e => setIsPartial(e.target.checked)}
                className="rounded border-amber-400 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              Dönem İçi Kısmi Zam Uygula (Gün Sayısına Göre Ağırlıklı Ortalama)
            </label>

            {isPartial && (
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-amber-200/60">
                <div>
                  <label htmlFor="modal-eski-gun" className="block text-[11px] text-slate-600 mb-0.5">
                    Eski Oran Gün Sayısı
                  </label>
                  <input
                    id="modal-eski-gun"
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    value={oldDaysStr}
                    onChange={e => setOldDaysStr(e.target.value)}
                    onFocus={e => e.target.select()}
                    className="w-full text-xs bg-white border border-slate-300 rounded px-2 py-1 text-right font-bold"
                  />
                </div>
                <div>
                  <label htmlFor="modal-yeni-gun" className="block text-[11px] text-slate-600 mb-0.5">
                    Yeni Zamlı Gün Sayısı
                  </label>
                  <input
                    id="modal-yeni-gun"
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    value={newDaysStr}
                    onChange={e => setNewDaysStr(e.target.value)}
                    onFocus={e => e.target.select()}
                    className="w-full text-xs bg-white border border-slate-300 rounded px-2 py-1 text-right font-bold"
                  />
                </div>
                <p className="col-span-2 text-[10px] text-amber-800 italic">
                  * TCDD 15-14 dönemi için örneğin 1 Eylül yürürlükte: 17 gün eski, 14 gün yeni oran uygulanır.
                </p>
              </div>
            )}
          </div>

          {/* İkinci Kez Uygulama Onay Uyarısı */}
          {showConfirmWarning && (
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-3 text-red-950 text-xs flex flex-col gap-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 font-black text-red-900">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <span>Tekrar Zam Uygulama Onayı</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Bu bordroya daha önce zaten zam uygulanmıştır. Tekrar basarsanız saat ücreti bir kez daha{' '}
                <strong className="font-bold">%{rateStr}</strong> artırılarak kümülatif katlanacaktır.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleApplyClick}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs cursor-pointer shadow-xs"
                >
                  Evet, Tekrar Zam Uygula
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmWarning(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold rounded text-xs cursor-pointer"
                >
                  İptal
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex justify-between items-center border-t pt-3 border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 cursor-pointer"
          >
            Kapat
          </button>
          {!showConfirmWarning && (
            <button
              type="button"
              onClick={handleApplyClick}
              className="px-4 py-2 rounded-lg text-xs font-black text-white bg-amber-600 hover:bg-amber-700 shadow-md cursor-pointer transition flex items-center gap-1.5"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Zammı Uygula</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
