import React, { useState, useEffect, useRef } from 'react';
import {
  FolderOpen,
  X,
  Sparkles,
  Trash2,
  ArrowDownToLine,
  Upload,
  FileCode,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { BordroData, SavedBordroRecord } from '../types';
import {
  DEFAULT_TCDD_BORDRO,
  SAMPLE_AUGUST_2026_BORDRO,
  formatCurrency,
  calculateBordro
} from '../utils/bordroEngine';

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
  const [jsonText, setJsonText] = useState('');
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const showMsg = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 3500);
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
    showMsg('success', `"${title}" başarıyla kaydedildi.`);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateRecords(savedRecords.filter(r => r.id !== id));
    showMsg('success', 'Kayıtlı bordro silindi.');
  };

  const handleSelectRecord = (record: SavedBordroRecord) => {
    onLoadBordro(record.data);
    onClose();
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
          const merged = calculateBordro({ ...DEFAULT_TCDD_BORDRO, ...parsed });
          onLoadBordro(merged);
          onClose();
        } else {
          showMsg('error', 'Dosya içeriği geçerli bir bordro nesnesi içermiyor.');
        }
      } catch {
        showMsg('error', 'Geçersiz veya bozuk JSON dosyası! Lütfen bordro yedeğinizi seçtiğinizden emin olun.');
      }
    };
    reader.onerror = () => {
      showMsg('error', 'Dosya okunurken bir hata oluştu.');
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleApplyPasteJson = () => {
    if (!jsonText.trim()) {
      showMsg('error', 'Lütfen JSON verisini yapıştırın.');
      return;
    }
    try {
      const parsed = JSON.parse(jsonText.trim());
      if (parsed && typeof parsed === 'object') {
        const merged = calculateBordro({ ...DEFAULT_TCDD_BORDRO, ...parsed });
        onLoadBordro(merged);
        onClose();
      } else {
        showMsg('error', 'Geçersiz bordro formatı.');
      }
    } catch {
      showMsg('error', 'Girilen metin geçerli bir JSON formatında değil!');
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 font-dotmatrix animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-xl w-full p-4 sm:p-5 flex flex-col gap-3.5 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        {/* Gizli Dosya Seçici - Mobil & Masaüstü için tüm MIME ve uzantı filtreleri açık */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json,application/json,text/plain,text/json,application/octet-stream,*/*"
          className="hidden"
        />

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2.5 border-slate-200">
          <div className="flex items-center gap-2 text-slate-800">
            <FolderOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm 2xl:text-base">Kayıtlı Formlar & Bordro Yükle</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Geri Bildirim Mesajı (Varsa) */}
        {feedback && (
          <div
            className={`p-2.5 rounded text-xs flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                : 'bg-rose-50 text-rose-900 border border-rose-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* 1. Cihazdan / Dosyadan Yükle (Doğrudan Seçilebilir) */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <span className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
              Cihazdan Kayıtlı Bordro Dosyası Yükle (.json):
            </span>
            <button
              type="button"
              onClick={() => setShowPasteArea(!showPasteArea)}
              className="text-[11px] text-emerald-700 hover:text-emerald-900 underline font-semibold cursor-pointer"
            >
              {showPasteArea ? 'Metin Alanını Gizle' : 'JSON Metni Yapıştır'}
            </button>
          </span>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                  fileInputRef.current.click();
                }
              }}
              className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-md text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Dosya Seç ve Hemen Yükle</span>
            </button>
          </div>
          <p className="text-[10.5px] text-slate-500 mt-1.5 leading-snug">
            Telefonunuzda veya bilgisayarınızda daha önce yedeklediğiniz bordro dosyasını seçebilirsiniz. Dosyaların tümü aktif ve seçilebilir durumdadır.
          </p>

          {/* İsteğe Bağlı JSON Metin Yapıştırma Alanı */}
          {showPasteArea && (
            <div className="mt-2.5 pt-2.5 border-t border-slate-200 flex flex-col gap-2">
              <label htmlFor="paste-json-field" className="text-[11px] font-semibold text-slate-600">
                Bordro JSON Kodunu Buraya Yapıştırın:
              </label>
              <textarea
                id="paste-json-field"
                rows={3}
                value={jsonText}
                onChange={e => setJsonText(e.target.value)}
                placeholder='{"saatUcr": 353.47, ...}'
                className="w-full text-xs font-mono p-2 bg-white border border-slate-300 rounded focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
              <button
                type="button"
                onClick={handleApplyPasteJson}
                className="self-end px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                Yapıştırılanı Yükle
              </button>
            </div>
          )}
        </div>

        {/* 2. Kullanıcının Tarayıcıya Kaydettiği Özel Bordrolar */}
        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700">
              Kayıtlı Özel Bordrolarınız ({savedRecords.length}):
            </span>
            <span className="text-[10.5px] text-slate-500">Seçmek için satıra dokunun</span>
          </div>

          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {savedRecords.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                Henüz tarayıcı hafızasına kaydedilmiş özel bordro bulunmuyor. Aşağıdaki formdan kaydedebilirsiniz.
              </p>
            ) : (
              savedRecords.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSelectRecord(item)}
                  className="group flex items-center justify-between p-2 bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-400 rounded-lg text-xs transition cursor-pointer shadow-2xs"
                  title="Bu bordroyu ekrana yüklemek için tıklayın"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="font-bold text-slate-800 group-hover:text-emerald-950 block truncate">
                      {item.title}
                    </span>
                    <span className="text-[10.5px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span className="font-semibold text-emerald-700">Net: {formatCurrency(item.netOdeme)} ₺</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectRecord(item);
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer transition shadow-2xs"
                      title="Seç ve Yükle"
                    >
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                      Yükle
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition cursor-pointer"
                      title="Bu kaydı sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Şu Anki Bordroyu Tarayıcıya Kaydet Formu */}
          <div className="mt-2.5 pt-2.5 border-t border-slate-200">
            <label htmlFor="kayit-adi" className="text-[11px] font-semibold text-slate-600 block mb-1">
              Şu Anki Bordroyu Tarayıcıya Kaydet:
            </label>
            <div className="flex gap-2">
              <input
                id="kayit-adi"
                type="text"
                placeholder="Kayıt başlığı (Örn: 2026 Eylül Taslağı)"
                value={recordTitle}
                onChange={e => setRecordTitle(e.target.value)}
                className="flex-1 text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
              <button
                type="button"
                onClick={handleSaveCurrent}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold shadow-xs cursor-pointer transition"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>

        {/* 3. Hızlı Hazır Senaryolar */}
        <div>
          <span className="text-xs font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Veya Hazır Senaryo Yükle:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => handleLoadScenario('original')}
              className="p-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded text-left transition flex flex-col cursor-pointer"
            >
              <span className="font-bold text-slate-800">Orijinal Ağustos Bordrosu</span>
              <span className="text-[10.5px] text-slate-500">
                İzin/Raporlu gerçek bordro (87.386,02 ₺ Net)
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleLoadScenario('standardFull')}
              className="p-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded text-left transition flex flex-col cursor-pointer"
            >
              <span className="font-bold text-slate-800">Tam Çalışma (İzinsiz Ay)</span>
              <span className="text-[10.5px] text-slate-500">
                160 saat normal çalışma, 22 gün iaşe
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleLoadScenario('shiftNight')}
              className="p-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded text-left transition flex flex-col cursor-pointer"
            >
              <span className="font-bold text-slate-800">Vardiya & Gece & Mesai</span>
              <span className="text-[10.5px] text-slate-500">
                80s vardiya, 48s gece ve 16s mesai
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleLoadScenario('normalCalisan')}
              className="p-2 bg-sky-50/70 hover:bg-sky-100/70 border border-sky-200 rounded text-left transition flex flex-col cursor-pointer"
            >
              <span className="font-bold text-sky-950 flex items-center gap-1">
                <span>Normal Çalışan (4/a Kamu)</span>
                <span className="text-[9px] bg-sky-200 text-sky-900 px-1 py-0.2 rounded font-semibold">STANDART</span>
              </span>
              <span className="text-[10.5px] text-sky-800">
                %14 SSK ve %1 işsizlik primli
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t pt-2.5 border-slate-200">
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

