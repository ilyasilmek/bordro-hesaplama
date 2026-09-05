import React, { useState, useEffect } from 'react';
import { FolderOpen, X, Sparkles, Trash2, ArrowDownToLine } from 'lucide-react';
import { BordroData, SavedBordroRecord } from '../types';
import { DEFAULT_TCDD_BORDRO, SAMPLE_AUGUST_2026_BORDRO, formatCurrency } from '../utils/bordroEngine';

const STORAGE_KEY = 'tcdd_saved_bordrolar_v1';

interface SavedBordrolarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBordro: BordroData;
  onLoadBordro: (bordro: BordroData) => void;
}

export const SavedBordrolarModal: React.FC<SavedBordrolarModalProps> = ({
  isOpen,
  onClose,
  currentBordro,
  onLoadBordro
}) => {
  const [savedRecords, setSavedRecords] = useState<SavedBordroRecord[]>([]);
  const [recordTitle, setRecordTitle] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedRecords(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const updateRecords = (records: SavedBordroRecord[]) => {
    setSavedRecords(records);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      // ignore
    }
  };

  const handleSaveCurrent = () => {
    const title =
      recordTitle.trim() ||
      `${currentBordro.bordroDonem} - ${new Date().toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;

    const newRecord: SavedBordroRecord = {
      id: `record-${Date.now()}`,
      title,
      date: new Date().toLocaleDateString('tr-TR'),
      netOdeme: currentBordro.netOdeme,
      data: currentBordro
    };

    updateRecords([newRecord, ...savedRecords]);
    setRecordTitle('');
  };

  const handleDelete = (id: string) => {
    updateRecords(savedRecords.filter(r => r.id !== id));
  };

  const handleLoadScenario = (scenarioKey: string) => {
    if (scenarioKey === 'blank') {
      onLoadBordro(DEFAULT_TCDD_BORDRO);
      onClose();
      return;
    }

    if (scenarioKey === 'original') {
      onLoadBordro(SAMPLE_AUGUST_2026_BORDRO);
      onClose();
      return;
    }

    if (scenarioKey === 'standardFull') {
      const copy: BordroData = JSON.parse(JSON.stringify(SAMPLE_AUGUST_2026_BORDRO));
      copy.earnings = copy.earnings.map(item => {
        if (item.id === 'nc') return { ...item, hours: 160 };
        if (item.id === 'ht') return { ...item, hours: 32 };
        if (item.id === 'ubgt') return { ...item, hours: 0 };
        if (item.id === 'ui') return { ...item, hours: 0 };
        if (item.id === 'ur') return { ...item, hours: 0 };
        if (item.id === 'iase') return { ...item, hours: 22 };
        if (item.id === 'gst') return { ...item, hours: 160 };
        if (item.id === 'gms') return { ...item, hours: 160 };
        return item;
      });
      onLoadBordro(copy);
      onClose();
      return;
    }

    if (scenarioKey === 'shiftNight') {
      const copy: BordroData = JSON.parse(JSON.stringify(SAMPLE_AUGUST_2026_BORDRO));
      copy.earnings = copy.earnings.map(item => {
        if (item.id === 'nc') return { ...item, hours: 120 };
        if (item.id === 'ht') return { ...item, hours: 32 };
        if (item.id === 'vp') return { ...item, hours: 80 };
        if (item.id === 'gc') return { ...item, hours: 48 };
        if (item.id === 'fm') return { ...item, hours: 16 };
        if (item.id === 'iase') return { ...item, hours: 20 };
        return item;
      });
      onLoadBordro(copy);
      onClose();
      return;
    }

    if (scenarioKey === 'normalCalisan') {
      const copy: BordroData = JSON.parse(JSON.stringify(SAMPLE_AUGUST_2026_BORDRO));
      copy.calisanStatusu = 'normal';
      copy.mevzuatNotu = '31. Dönem TİS 1/1 • TCDD Taşımacılık A.Ş. Sürekli İşçi Bordrosu (Standart 4/a)';
      copy.vergiMuafiyeti = 0;
      copy.earnings = copy.earnings.map(item => {
        if (item.id === 'gst') return { ...item, hours: 0, amount: 0 };
        if (item.id === 'fm') return { ...item, rule: 'mesai175', label: 'FM %75 Pntr', badge: '%75' };
        return item;
      });
      onLoadBordro(copy);
      onClose();
      return;
    }

    if (scenarioKey === 'zam20') {
      const copy: BordroData = JSON.parse(JSON.stringify(SAMPLE_AUGUST_2026_BORDRO));
      copy.saatUcr = copy.saatUcr * 1.2;
      copy.emkZam = copy.emkZam * 1.2;
      copy.iaseGunlukKatsayi = copy.iaseGunlukKatsayi * 1.2;
      copy.hizmetYillikKatsayi = copy.hizmetYillikKatsayi * 1.2;
      copy.birlestirilmSosyalYardim = copy.birlestirilmSosyalYardim * 1.2;
      copy.postabasiSaatUcreti = (copy.postabasiSaatUcreti ?? 4.84) * 1.2;
      copy.sendikaAidati = copy.sendikaAidati * 1.2;
      onLoadBordro(copy);
      onClose();
      return;
    }

    if (scenarioKey === 'matrahDuzeltme') {
      const copy: BordroData = JSON.parse(JSON.stringify(SAMPLE_AUGUST_2026_BORDRO));
      copy.bordroDonem = "02/2026 (15.01.2026-14.02.2026)";
      copy.aySecim = 2;
      copy.ayNo = 2;
      copy.yillikGlrVM = 229244.41;
      copy.sskMatrahD = 33712.58;
      onLoadBordro(copy);
      onClose();
      return;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 font-dotmatrix animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-xl w-full p-5 flex flex-col gap-4 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 border-slate-200">
          <div className="flex items-center gap-2 text-slate-800">
            <FolderOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm 2xl:text-base">Bordro Senaryoları & Kayıtlar</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Ready Scenarios */}
        <div>
          <span className="text-xs font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Hızlı Hazır Senaryo Yükle:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleLoadScenario('original')}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded text-left transition flex flex-col cursor-pointer"
            >
              <span className="font-bold text-slate-800">Orijinal Ağustos Bordrosu</span>
              <span className="text-[11px] text-slate-500">
                İzin/Raporlu gerçek bordro (87.386,02 ₺ Net)
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleLoadScenario('standardFull')}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded text-left transition flex flex-col cursor-pointer"
            >
              <span className="font-bold text-slate-800">Tam Çalışma (İzinsiz Ay)</span>
              <span className="text-[11px] text-slate-500">
                160 saat normal çalışma, 22 gün iaşe
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleLoadScenario('shiftNight')}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded text-left transition flex flex-col cursor-pointer"
            >
              <span className="font-bold text-slate-800">Vardiya & Gece & Mesai</span>
              <span className="text-[11px] text-slate-500">
                80s vardiya, 48s gece ve 16s mesai ilaveli
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleLoadScenario('normalCalisan')}
              className="p-2.5 bg-sky-50/70 hover:bg-sky-100/70 border border-sky-300 rounded text-left transition flex flex-col cursor-pointer"
            >
              <span className="font-bold text-sky-950 flex items-center gap-1">
                <span>Normal Çalışan (4/a Kamu)</span>
                <span className="text-[9px] bg-sky-200 text-sky-900 px-1 py-0.2 rounded font-semibold">STANDART</span>
              </span>
              <span className="text-[11px] text-sky-800">
                GŞT ve vergi muafiyeti yok, %14 SSK ve %1 işsizlik primli
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleLoadScenario('zam20')}
              className="p-2.5 bg-amber-50/70 hover:bg-amber-100/70 border border-amber-300 rounded text-left transition flex flex-col cursor-pointer"
            >
              <span className="font-bold text-amber-900">%20 TİS Zamlı Ay</span>
              <span className="text-[11px] text-amber-700">
                Tüm saat ve sosyal haklar %20 artırılmış
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleLoadScenario('matrahDuzeltme')}
              className="p-2.5 bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-300 rounded text-left transition flex flex-col cursor-pointer sm:col-span-2"
            >
              <span className="font-bold text-indigo-950 flex items-center justify-between">
                <span>SSK Matrah Düzeltmeli Gerçek Ay (02/2026)</span>
                <span className="text-[10px] bg-indigo-200 text-indigo-900 px-1.5 py-0.2 rounded font-mono">+33.712,58 ₺</span>
              </span>
              <span className="text-[11px] text-indigo-700">
                Özel Kesintilerde "SSK Matrah D:" kaleminin SSK matrahı ve primlere yansıdığı gerçek bordro
              </span>
            </button>
          </div>
        </div>

        {/* Save Current to Local Storage */}
        <div className="pt-2 border-t border-slate-200">
          <label htmlFor="kayit-adi" className="text-xs font-bold text-slate-700 block mb-1">
            Şu Anki Bordroyu Tarayıcıya Kaydet:
          </label>
          <div className="flex gap-2">
            <input
              id="kayit-adi"
              type="text"
              placeholder="Kayıt başlığı (Örn: 2026 Eylül Taslağı)"
              value={recordTitle}
              onChange={e => setRecordTitle(e.target.value)}
              className="flex-1 text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
            <button
              type="button"
              onClick={handleSaveCurrent}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold shadow-xs cursor-pointer"
            >
              Kaydet
            </button>
          </div>
        </div>

        {/* User Saved Records List */}
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          <span className="text-xs font-semibold text-slate-500">
            Kayıtlı Özel Bordrolarınız ({savedRecords.length}):
          </span>
          {savedRecords.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Henüz kaydedilmiş özel bordro yok.</p>
          ) : (
            savedRecords.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded text-xs hover:border-slate-300"
              >
                <div>
                  <span className="font-bold text-slate-800 block">{item.title}</span>
                  <span className="text-[10.5px] text-slate-500">
                    {item.date} • Net: {formatCurrency(item.netOdeme)} ₺
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onLoadBordro(item.data);
                      onClose();
                    }}
                    className="px-2 py-1 bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                    title="Bu bordroyu ekrana yükle"
                  >
                    <ArrowDownToLine className="w-3 h-3" />
                    Yükle
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t pt-3 border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
