import React, { useState } from 'react';
import { TrendingUp, X } from 'lucide-react';
import { BordroData } from '../types';
import { parseCurrency } from '../utils/bordroEngine';

interface ZamModalProps {
  isOpen: boolean;
  onClose: () => void;
  bordro: BordroData;
  onApplyZam: (
    zamRate: number,
    isPartial: boolean,
    oldDays: number,
    newDays: number
  ) => void;
}

export const ZamModal: React.FC<ZamModalProps> = ({
  isOpen,
  onClose,
  onApplyZam
}) => {
  const [rateStr, setRateStr] = useState('15');
  const [isPartial, setIsPartial] = useState(false);
  const [oldDaysStr, setOldDaysStr] = useState('17');
  const [newDaysStr, setNewDaysStr] = useState('14');

  if (!isOpen) return null;

  const handleApply = () => {
    const rate = parseCurrency(rateStr);
    const oldDays = parseCurrency(oldDaysStr);
    const newDays = parseCurrency(newDaysStr);
    onApplyZam(rate, isPartial, oldDays, newDays);
    onClose();
  };

  const presetRates = ['10', '15', '20', '25', '30'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 font-dotmatrix animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-md w-full p-5 flex flex-col gap-4 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-3 border-slate-200">
          <div className="flex items-center gap-2 text-slate-800">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-sm 2xl:text-base">
              TİS Zammı Simülasyonu & Kısmi Gün Hesabı
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-3.5 text-xs text-slate-700">
          <div>
            <label htmlFor="modal-zam-orani" className="font-semibold block mb-1">
              Uygulanacak Zam Oranı (%)
            </label>
            <div className="flex gap-2 items-center">
              <input
                id="modal-zam-orani"
                type="text"
                value={rateStr}
                onChange={e => setRateStr(e.target.value)}
                placeholder="Örn: 15,5"
                className="w-28 text-sm font-bold bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              />
              <div className="flex gap-1">
                {presetRates.map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRateStr(val)}
                    className={`px-2 py-1 rounded text-xs font-semibold border cursor-pointer ${
                      rateStr === val
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    %{val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded p-3 space-y-2">
            <label className="flex items-center gap-2 font-semibold text-amber-950 cursor-pointer">
              <input
                type="checkbox"
                checked={isPartial}
                onChange={e => setIsPartial(e.target.checked)}
                className="rounded border-amber-400 text-amber-600 focus:ring-amber-500"
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
                    value={oldDaysStr}
                    onChange={e => setOldDaysStr(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded px-2 py-1 text-right"
                  />
                </div>
                <div>
                  <label htmlFor="modal-yeni-gun" className="block text-[11px] text-slate-600 mb-0.5">
                    Yeni Zamlı Gün Sayısı
                  </label>
                  <input
                    id="modal-yeni-gun"
                    type="text"
                    value={newDaysStr}
                    onChange={e => setNewDaysStr(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded px-2 py-1 text-right"
                  />
                </div>
                <p className="col-span-2 text-[10px] text-amber-800 italic">
                  * TCDD 15-14 dönemi için örneğin 1 Eylül yürürlükte: 17 gün eski, 14 gün yeni oran uygulanır.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-2 border-t pt-3 border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 cursor-pointer"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-1.5 rounded text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-xs cursor-pointer"
          >
            Zammı Bordroya Uygula
          </button>
        </div>
      </div>
    </div>
  );
};
