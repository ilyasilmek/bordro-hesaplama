import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  RotateCcw,
  Gift,
  HelpCircle,
  Percent,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { BordroData } from '../types';

interface IkramiyeModalProps {
  isOpen: boolean;
  onClose: () => void;
  bordro: BordroData;
}

export type IkramiyeType = 'TAM' | 'YARIM';

export const IkramiyeModal: React.FC<IkramiyeModalProps> = ({
  isOpen,
  onClose,
  bordro
}) => {
  const [ikramiyeType, setIkramiyeType] = useState<IkramiyeType>('TAM');

  // Form Değerleri (Kullanıcının paylaştığı TAM.jpg ve YARIM.jpg şablonu)
  const [saatUcreti, setSaatUcreti] = useState<number>(bordro.saatUcr || 385.97);
  const [emekZammi, setEmekZammi] = useState<number>(bordro.emkZam || 19.05);
  const [brutAylik, setBrutAylik] = useState<number>(0);
  const [kidemZammi, setKidemZammi] = useState<number>(0);

  // Saat ve Gün (TAM: 225 saat, 184 gün | YARIM: 97.5 saat, 92 gün)
  const [ikrSaati, setIkrSaati] = useState<number>(225);
  const [ikrGunu, setIkrGunu] = useState<number>(184);

  // Vergi Dilimi (%15, %20, %27, %35, %40) - TAM görselinde %27, YARIM'da %20
  const [vergiOrani, setVergiOrani] = useState<number>(27);

  // Ekstra Kesinti ve Ödemeler
  const [icraTutari, setIcraTutari] = useState<number>(0);
  const [inikas, setInikas] = useState<number>(0);
  const [dengeOdenege, setDengeOdenege] = useState<number>(0);

  const [copied, setCopied] = useState(false);

  // Bordro güncellendiğinde saat ücreti ve emek zammını eşitle
  useEffect(() => {
    if (bordro.saatUcr) setSaatUcreti(bordro.saatUcr);
    if (bordro.emkZam) setEmekZammi(bordro.emkZam);
  }, [bordro.saatUcr, bordro.emkZam]);

  // TAM / YARIM butonlarına tıklandığında varsayılan değerleri yükle
  const handleSelectType = (type: IkramiyeType) => {
    setIkramiyeType(type);
    if (type === 'TAM') {
      setIkrSaati(225);
      setIkrGunu(184);
      setVergiOrani(27);
    } else {
      setIkrSaati(97.5);
      setIkrGunu(92);
      setVergiOrani(20);
    }
  };

  // Hesaplamalar (Birebir kullanıcının görsellerindeki matematik)
  // Toplam Saatlik = Saat Ücreti + Emek Zammı
  const toplamSaatUcreti = (Number(saatUcreti) || 0) + (Number(emekZammi) || 0);

  // İkr. Tutarı = (Toplam Saatlik * İkr. Saati) + Brüt Aylık + Kıdem Zammı
  const ikrTutari =
    Math.round(
      (toplamSaatUcreti * (Number(ikrSaati) || 0) +
        (Number(brutAylik) || 0) +
        (Number(kidemZammi) || 0)) *
        100
    ) / 100;

  // Gelir Vergisi Matrahı = İkr. Tutarı
  const gelirVM = ikrTutari;

  // Gelir Vergisi = Gelir V.M. * (Vergi Oranı / 100)
  const gelirVergisi = Math.round(gelirVM * (Number(vergiOrani) / 100) * 100) / 100;

  // Damga Vergisi = İkr. Tutarı * 0.00759
  const damgaVergisi = Math.round(ikrTutari * 0.00759 * 100) / 100;

  // Kesinti Toplamı = Gelir Vergisi + Damga Vergisi + İcra Tutarı
  const kesintiToplami =
    Math.round(
      (gelirVergisi + damgaVergisi + (Number(icraTutari) || 0)) * 100
    ) / 100;

  // Ödeme Tutarı (Net İkramiye) = İkr. Tutarı + İnikas + Denge Öd. - Kesinti Toplamı
  const odemeTutari =
    Math.round(
      (ikrTutari +
        (Number(inikas) || 0) +
        (Number(dengeOdenege) || 0) -
        kesintiToplami) *
        100
    ) / 100;

  const formatTL = (val: number, decimals = 2) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(val);
  };

  const handleCopySummary = () => {
    const text = `TCDD TAŞIMACILIK A.Ş. ${ikramiyeType} İKRAMİYE BORDROSU
Saat Ücreti: ${formatTL(saatUcreti, 6)} ₺
Emek Zammı: ${formatTL(emekZammi, 6)} ₺
İkr. Saati: ${ikrSaati} Saat
İkr. Günü: ${ikrGunu} Gün
-----------------------------
İkramiye Tutarı: ${formatTL(ikrTutari)} ₺
Gelir V.M.: ${formatTL(gelirVM)} ₺
Gelir Vergisi (%${vergiOrani}): ${formatTL(gelirVergisi)} ₺
Damga Vergisi: ${formatTL(damgaVergisi)} ₺
Kesinti Toplamı: ${formatTL(kesintiToplami)} ₺
-----------------------------
NET ÖDEME TUTARI: ${formatTL(odemeTutari)} ₺`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div
      id="ikramiye-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto no-print font-dotmatrix"
    >
      <div className="bg-slate-900 border-2 border-amber-500/80 rounded-2xl shadow-2xl w-full max-w-4xl text-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Başlık Çubuğu */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 px-4 sm:px-6 py-3.5 flex items-center justify-between text-white shadow-md">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-amber-800/60 rounded-lg shadow-inner">
              <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-amber-100" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide flex items-center gap-2">
                TCDD İŞÇİ İKRAMİYE BORDROSU
                <span className="bg-white text-amber-900 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full uppercase shadow-xs">
                  {ikramiyeType} İKRAMİYE
                </span>
              </h2>
              <p className="text-amber-100 text-[11px] sm:text-xs">
                TCDD Taşımacılık A.Ş. 31. Dönem TİS İkramiye Hesaplama Modülü
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-amber-100 hover:text-white hover:bg-amber-800/40 rounded-lg transition cursor-pointer"
            title="Kapat"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Seçim Butonları: TAM ve YARIM */}
        <div className="bg-slate-800/90 p-3 sm:p-4 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-300 mr-1 uppercase">
              İKRAMİYE TÜRÜ:
            </span>
            <button
              type="button"
              onClick={() => handleSelectType('TAM')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                ikramiyeType === 'TAM'
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-amber-500/20'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600'
              }`}
            >
              {ikramiyeType === 'TAM' && <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[2.5]" />}
              <span>TAM İKRAMİYE (225 Saat)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectType('YARIM')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                ikramiyeType === 'YARIM'
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-amber-500/20'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600'
              }`}
            >
              {ikramiyeType === 'YARIM' && <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[2.5]" />}
              <span>YARIM İKRAMİYE (97.5 Saat)</span>
            </button>
          </div>

          {/* Vergi Dilimi Seçici */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs">
            <Percent className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 font-semibold">G. Vergisi Dilimi:</span>
            <select
              value={vergiOrani}
              onChange={e => setVergiOrani(Number(e.target.value))}
              className="bg-slate-800 text-amber-300 font-bold border border-slate-600 rounded px-2 py-0.5 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value={15}>%15 (1. Dilim)</option>
              <option value={20}>%20 (2. Dilim - Yarım Örneği)</option>
              <option value={27}>%27 (3. Dilim - Tam Örneği)</option>
              <option value={35}>%35 (4. Dilim)</option>
              <option value={40}>%40 (5. Dilim)</option>
            </select>
          </div>
        </div>

        {/* ANA İKRAMİYE TABLOSU (Kullanıcının Excel Görseli Formatında) */}
        <div className="p-3 sm:p-6 bg-slate-950 overflow-x-auto">
          <div className="min-w-[680px] border-2 border-black rounded-lg overflow-hidden shadow-2xl bg-white font-sans text-slate-900">
            {/* 3 Sütunlu Grid Izgara (Kullanıcının paylaştığı TAM.jpg ve YARIM.jpg tablosu) */}
            <div className="grid grid-cols-3 divide-x-2 divide-black border-b-2 border-black text-xs sm:text-sm">
              {/* 1. SÜTUN: SAAT VE ÜCRET BİLGİLERİ */}
              <div className="divide-y-2 divide-black">
                {/* Saat Ücreti */}
                <div className="grid grid-cols-2 divide-x-2 divide-black">
                  <div className="bg-[#fef3c7] p-2 sm:p-2.5 font-bold flex items-center">
                    Saat Ücreti
                  </div>
                  <div className="bg-[#bfdbfe] p-1 sm:p-1.5 flex items-center">
                    <span className="text-slate-800 font-semibold mr-1">₺</span>
                    <input
                      type="number"
                      step="0.000001"
                      value={saatUcreti}
                      onChange={e => setSaatUcreti(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent font-bold text-slate-950 focus:bg-white focus:outline-none px-1 py-0.5 rounded font-mono"
                    />
                  </div>
                </div>

                {/* Emek Zammı */}
                <div className="grid grid-cols-2 divide-x-2 divide-black">
                  <div className="bg-[#fef3c7] p-2 sm:p-2.5 font-bold flex items-center">
                    Emek Zammı
                  </div>
                  <div className="bg-[#bfdbfe] p-1 sm:p-1.5 flex items-center">
                    <span className="text-slate-800 font-semibold mr-1">₺</span>
                    <input
                      type="number"
                      step="0.000001"
                      value={emekZammi}
                      onChange={e => setEmekZammi(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent font-bold text-slate-950 focus:bg-white focus:outline-none px-1 py-0.5 rounded font-mono"
                    />
                  </div>
                </div>

                {/* Brüt Aylık */}
                <div className="grid grid-cols-2 divide-x-2 divide-black">
                  <div className="bg-[#fef3c7] p-2 sm:p-2.5 font-bold flex items-center">
                    Brüt Aylık
                  </div>
                  <div className="bg-[#bfdbfe] p-1 sm:p-1.5 flex items-center font-mono">
                    <span className="text-slate-800 font-semibold mr-1">₺</span>
                    <input
                      type="number"
                      value={brutAylik === 0 ? '' : brutAylik}
                      placeholder="-"
                      onChange={e => setBrutAylik(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent font-bold text-slate-950 focus:bg-white focus:outline-none px-1 py-0.5 rounded"
                    />
                  </div>
                </div>

                {/* Kıdem Zam. */}
                <div className="grid grid-cols-2 divide-x-2 divide-black">
                  <div className="bg-[#fef3c7] p-2 sm:p-2.5 font-bold flex items-center">
                    Kıdem Zam.
                  </div>
                  <div className="bg-[#bfdbfe] p-1 sm:p-1.5 flex items-center font-mono">
                    <span className="text-slate-800 font-semibold mr-1">₺</span>
                    <input
                      type="number"
                      value={kidemZammi === 0 ? '' : kidemZammi}
                      placeholder="-"
                      onChange={e => setKidemZammi(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent font-bold text-slate-950 focus:bg-white focus:outline-none px-1 py-0.5 rounded"
                    />
                  </div>
                </div>

                {/* İkr. Saati */}
                <div className="grid grid-cols-2 divide-x-2 divide-black">
                  <div className="bg-[#fef3c7] p-2 sm:p-2.5 font-bold flex items-center">
                    İkr.Saati
                  </div>
                  <div className="bg-[#bfdbfe] p-1 sm:p-1.5 flex items-center">
                    <input
                      type="number"
                      step="0.5"
                      value={ikrSaati}
                      onChange={e => setIkrSaati(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent font-bold text-slate-950 focus:bg-white focus:outline-none px-1 py-0.5 rounded font-mono text-right"
                    />
                    <span className="ml-1 text-[11px] text-slate-700 font-bold">Saat</span>
                  </div>
                </div>

                {/* İkr. Günü */}
                <div className="grid grid-cols-2 divide-x-2 divide-black">
                  <div className="bg-[#fef3c7] p-2 sm:p-2.5 font-bold flex items-center">
                    İkr.Günü
                  </div>
                  <div className="bg-[#bfdbfe] p-1 sm:p-1.5 flex items-center">
                    <input
                      type="number"
                      value={ikrGunu}
                      onChange={e => setIkrGunu(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent font-bold text-slate-950 focus:bg-white focus:outline-none px-1 py-0.5 rounded font-mono text-right"
                    />
                    <span className="ml-1 text-[11px] text-slate-700 font-bold">Gün</span>
                  </div>
                </div>
              </div>

              {/* 2. SÜTUN: VERGİ VE YASAL KESİNTİ MATRAHLARI */}
              <div className="divide-y-2 divide-black flex flex-col justify-between">
                <div className="divide-y-2 divide-black">
                  {/* Gelir V.M. */}
                  <div className="grid grid-cols-2 divide-x-2 divide-black">
                    <div className="bg-[#fef3c7] p-2 sm:p-2.5 font-bold flex items-center">
                      Gelir V.M.
                    </div>
                    <div className="bg-[#bfdbfe] p-2 sm:p-2.5 font-bold font-mono text-right">
                      ₺{formatTL(gelirVM)}
                    </div>
                  </div>

                  {/* Gelir Vergisi */}
                  <div className="grid grid-cols-2 divide-x-2 divide-black">
                    <div className="bg-[#fef3c7] p-2 sm:p-2.5 font-bold flex items-center justify-between">
                      <span>Gelir Vergisi</span>
                      <span className="text-[10px] bg-amber-200/80 px-1 rounded font-normal">
                        %{vergiOrani}
                      </span>
                    </div>
                    <div className="bg-[#bfdbfe] p-2 sm:p-2.5 font-bold font-mono text-right text-rose-900">
                      ₺{formatTL(gelirVergisi)}
                    </div>
                  </div>

                  {/* Damga Vergisi */}
                  <div className="grid grid-cols-2 divide-x-2 divide-black">
                    <div className="bg-[#fef3c7] p-2 sm:p-2.5 font-bold flex items-center justify-between">
                      <span>Damga Vergisi</span>
                      <span className="text-[10px] bg-amber-200/80 px-1 rounded font-normal">
                        ‰7.59
                      </span>
                    </div>
                    <div className="bg-[#bfdbfe] p-2 sm:p-2.5 font-bold font-mono text-right text-rose-900">
                      ₺{formatTL(damgaVergisi)}
                    </div>
                  </div>

                  {/* İcra Tutarı */}
                  <div className="grid grid-cols-2 divide-x-2 divide-black">
                    <div className="bg-[#fef3c7] p-2 sm:p-2.5 font-bold flex items-center">
                      İcra Tutarı
                    </div>
                    <div className="bg-[#bfdbfe] p-1 sm:p-1.5 flex items-center">
                      <span className="text-slate-800 font-semibold mr-1">₺</span>
                      <input
                        type="number"
                        value={icraTutari === 0 ? '0,00' : icraTutari}
                        onChange={e => setIcraTutari(parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent font-bold text-slate-950 focus:bg-white focus:outline-none px-1 py-0.5 rounded font-mono text-right"
                      />
                    </div>
                  </div>
                </div>

                {/* Alt Boşluk / TİS İpucu */}
                <div className="bg-slate-100 p-2.5 text-[11px] text-slate-600 italic border-t-2 border-black">
                  TİS Md. İkramiye hakedişi doğrudan vergi matrahına dahil edilir.
                </div>
              </div>

              {/* 3. SÜTUN: HAKEDİŞ, KESİNTİLER VE ÖDEME */}
              <div className="divide-y-2 divide-black flex flex-col justify-between">
                <div className="divide-y-2 divide-black">
                  {/* İkr. Tutarı */}
                  <div className="grid grid-cols-2 divide-x-2 divide-black">
                    <div className="bg-[#fef3c7] p-2 sm:p-2.5 font-bold flex items-center">
                      İkr.Tutarı
                    </div>
                    <div className="bg-[#bfdbfe] p-2 sm:p-2.5 font-bold font-mono text-right text-emerald-950">
                      ₺{formatTL(ikrTutari)}
                    </div>
                  </div>

                  {/* İnikas */}
                  <div className="grid grid-cols-2 divide-x-2 divide-black">
                    <div className="bg-[#fef3c7] p-2 sm:p-2.5 font-bold flex items-center">
                      İnikas
                    </div>
                    <div className="bg-[#bfdbfe] p-1 sm:p-1.5 flex items-center">
                      <span className="text-slate-800 font-semibold mr-1">₺</span>
                      <input
                        type="number"
                        value={inikas === 0 ? '0,00' : inikas}
                        onChange={e => setInikas(parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent font-bold text-slate-950 focus:bg-white focus:outline-none px-1 py-0.5 rounded font-mono text-right"
                      />
                    </div>
                  </div>

                  {/* Denge Öd. */}
                  <div className="grid grid-cols-2 divide-x-2 divide-black">
                    <div className="bg-[#fef3c7] p-2 sm:p-2.5 font-bold flex items-center">
                      Denge Öd.
                    </div>
                    <div className="bg-[#bfdbfe] p-1 sm:p-1.5 flex items-center">
                      <span className="text-slate-800 font-semibold mr-1">₺</span>
                      <input
                        type="number"
                        value={dengeOdenege === 0 ? '0,00' : dengeOdenege}
                        onChange={e => setDengeOdenege(parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent font-bold text-slate-950 focus:bg-white focus:outline-none px-1 py-0.5 rounded font-mono text-right"
                      />
                    </div>
                  </div>

                  {/* Kes. Toplamı */}
                  <div className="grid grid-cols-2 divide-x-2 divide-black">
                    <div className="bg-[#fef3c7] p-2 sm:p-2.5 font-bold flex items-center">
                      Kes.Toplamı
                    </div>
                    <div className="bg-[#bfdbfe] p-2 sm:p-2.5 font-bold font-mono text-right text-rose-950">
                      ₺{formatTL(kesintiToplami)}
                    </div>
                  </div>
                </div>

                {/* ÖDEME TUTARI (KIRMIZI ALAN - BİREBİR GÖRSELLERDEKİ GİBİ) */}
                <div className="bg-red-600 text-white p-3 sm:p-4 flex items-center justify-between border-t-2 border-black shadow-inner">
                  <span className="text-sm sm:text-base font-black tracking-wide">
                    Ödeme Tutarı
                  </span>
                  <span className="text-lg sm:text-2xl font-black font-mono tracking-tight text-white drop-shadow-md">
                    ₺{formatTL(odemeTutari)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Alt Kontrol Çubuğu */}
        <div className="bg-slate-900 px-4 sm:px-6 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSelectType(ikramiyeType)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
              title="Varsayılan değerlere döndür"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sıfırla</span>
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
              title="Hesaplama özetini kopyala"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Özeti Kopyala</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Kapat
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>Yazdır / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
