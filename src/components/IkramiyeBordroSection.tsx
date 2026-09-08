import React from 'react';
import {
  Gift,
  Coins,
  Scissors,
  Check,
  RotateCcw,
  FileDown,
  ArrowRight,
  TrendingUp,
  Percent,
  Trash2,
  HelpCircle,
  FileSpreadsheet,
  BookOpen
} from 'lucide-react';
import { BordroData, IkramiyeData, IkramiyeType } from '../types';
import { formatCurrency, calculateIkramiyeTotals } from '../utils/bordroEngine';
import { generateIkramiyeBordroPDF } from '../utils/pdfGenerator';

interface IkramiyeBordroSectionProps {
  bordro: BordroData; // Personel kimlik bilgileri (sicil, ad-soyad vb.) için
  ikramiyeData: IkramiyeData;
  onChangeIkramiye: (updater: (prev: IkramiyeData) => IkramiyeData) => void;
  onResetIkramiye: () => void;
  onRestoreDefaultIkramiye: (type?: IkramiyeType) => void;
  onSyncSaatUcretiFromBordro?: () => void;
  onOpenZamModal: () => void;
  onOpenRehberModal?: () => void;
  onSwitchToMaas: () => void;
}

export const SABIT_VERGI_DILIMLERI = [15, 20, 27, 35, 40];

export const IkramiyeBordroSection: React.FC<IkramiyeBordroSectionProps> = ({
  bordro,
  ikramiyeData,
  onChangeIkramiye,
  onResetIkramiye,
  onRestoreDefaultIkramiye,
  onSyncSaatUcretiFromBordro,
  onOpenZamModal,
  onOpenRehberModal,
  onSwitchToMaas
}) => {
  const {
    saatUcr,
    emkZam,
    ikrSaati,
    ikrGunu,
    brutAylik,
    kidemZammi,
    inikas,
    dengeOdenege,
    icraTutari,
    vergiOrani,
    ikramiyeType
  } = ikramiyeData;

  // 1. TAM / YARIM Seçimi
  const handleSelectType = (type: IkramiyeType) => {
    onChangeIkramiye(prev => ({
      ...prev,
      ikramiyeType: type,
      ikrSaati: type === 'TAM' ? 225 : 97.5,
      ikrGunu: type === 'TAM' ? 184 : 92,
      // TAM için TİS örneğindeki %27, YARIM için %20 sabit vergi dilimi
      vergiOrani: type === 'TAM' ? 27 : 20
    }));
  };

  // 2. Alan Güncelleyiciler (Maaş bordrosundan tamamen BAĞIMSIZ!)
  const updateField = <K extends keyof IkramiyeData>(field: K, value: IkramiyeData[K]) => {
    onChangeIkramiye(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 3. Hesaplamalar (Merkezi calculateIkramiyeTotals motorundan alınır - Birebir TCDD Otantik Formülü)
  const totals = calculateIkramiyeTotals(ikramiyeData, bordro.saatUcr, bordro.emkZam);
  const {
    toplamSaatlik,
    ikrTutari,
    toplamGelir,
    gelirVM,
    gelirVergisi,
    damgaVergisi,
    kesintiToplami,
    odemeTutari
  } = totals;

  return (
    <section
      id="ikramiye-bordro-container"
      className="payslip-container w-full max-w-7xl 2xl:max-w-[1920px] 3xl:max-w-[2560px] bg-white border-2 border-amber-400 rounded-xl p-3 sm:p-5 2xl:p-7 shadow-md font-dotmatrix"
    >
      {/* İkramiye Üst Çubuğu ve Aksiyon Kontrolleri */}
      <div className="mb-3.5 border-b-2 border-dashed border-amber-300 pb-3 no-print">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-gradient-to-r from-amber-50 via-amber-100/70 to-amber-50 p-2.5 sm:p-3 rounded-xl border border-amber-300 shadow-2xs">
          {/* Sol: İkramiye Başlığı ve Bağımsızlık Bilgisi */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-sm shrink-0">
              <Gift className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-xs sm:text-sm text-slate-900 tracking-tight">
                  TCDD TAŞIMACILIK A.Ş. İKRAMİYE BORDROSU
                </span>
                <span className="bg-amber-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase shadow-2xs">
                  {ikramiyeType} İKRAMİYE
                </span>
              </div>
              <p className="text-amber-900 text-[11px] font-semibold flex items-center gap-1.5 mt-0.5">
                <span>31. Dönem TİS • 4/a Sürekli İşçi Yasal İkramiye Tahakkuku</span>
                <span className="text-purple-800 font-bold bg-purple-100 px-1.5 py-0.2 rounded border border-purple-300">
                  Sabit Dilim Vergi Sistemi (%{vergiOrani})
                </span>
              </p>
            </div>
          </div>

          {/* Sağ: İkramiye Türü Seçimi (TAM / YARIM) ve Araçlar */}
          <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
            {/* TAM / YARIM Butonları */}
            <div className="flex items-center bg-white p-1 rounded-xl border-2 border-amber-400 shadow-2xs gap-1">
              <button
                type="button"
                onClick={() => handleSelectType('TAM')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  ikramiyeType === 'TAM'
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-xs'
                    : 'bg-transparent text-slate-700 hover:bg-amber-50'
                }`}
                title="Tam İkramiye: 225 Saat, 184 Gün, %27 Sabit Dilim"
              >
                {ikramiyeType === 'TAM' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                <span>TAM (225 Sa.)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectType('YARIM')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  ikramiyeType === 'YARIM'
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-xs'
                    : 'bg-transparent text-slate-700 hover:bg-amber-50'
                }`}
                title="Yarım İkramiye: 97.5 Saat, 92 Gün, %20 Sabit Dilim"
              >
                {ikramiyeType === 'YARIM' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                <span>YARIM (97.5 Sa.)</span>
              </button>
            </div>

            {/* 3. Madde: SIFIRLA / FORMU TEMİZLE BUTONU */}
            <button
              type="button"
              onClick={onResetIkramiye}
              className="px-2.5 sm:px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs border border-rose-800"
              title="İkramiye formundaki tüm ücret, süre ve kesinti alanlarını sıfırla"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-200" />
              <span>Sıfırla</span>
            </button>

            {/* Varsayılanlara Dön Butonu */}
            <button
              type="button"
              onClick={() => onRestoreDefaultIkramiye(ikramiyeType)}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs border border-slate-700"
              title="TCDD standart taban değerlerini geri yükle (TAM: 225 Sa, 385.97 ₺ vb.)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
              <span>Varsayılan</span>
            </button>

            {/* TİS Zammı Butonu */}
            <button
              type="button"
              onClick={onOpenZamModal}
              className="px-2.5 sm:px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs border border-amber-700"
              title="İkramiye ve maaş saat ücretlerine TİS zammı simülasyonu uygula"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-200" />
              <span>TİS Zammı</span>
            </button>

            {/* Maaş Bordrosundaki Saat Ücretini İkramiyeye Eşitle Butonu */}
            {onSyncSaatUcretiFromBordro && (
              <button
                type="button"
                onClick={onSyncSaatUcretiFromBordro}
                className="px-2.5 sm:px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs border border-sky-800"
                title={`Maaş bordrosundaki saat ücretini (${formatCurrency(bordro.saatUcr, 2)} ₺) ve emek zammını ikramiyeye aktar`}
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-200" />
                <span>Maaş Ücretini Aktar</span>
              </button>
            )}

            {/* PDF Olarak İndir Butonu */}
            <button
              type="button"
              onClick={() => generateIkramiyeBordroPDF(bordro, ikramiyeData)}
              className="px-2.5 sm:px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-sm border border-amber-500"
              title="Resmi TCDD antetli ikramiye bordrosunu PDF olarak indir"
            >
              <FileDown className="w-4 h-4 text-amber-100 shrink-0" />
              <span>PDF Olarak İndir</span>
            </button>

            {/* Rehber Butonu */}
            {onOpenRehberModal && (
              <button
                type="button"
                onClick={onOpenRehberModal}
                className="px-2.5 sm:px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-900 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs border border-sky-300"
                title="Kullanım Kılavuzu, Düğmeler, Zam ve Statü Rehberi"
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-700" />
                <span>Rehber</span>
              </button>
            )}

            {/* Maaş Bordrosuna Dön */}
            <button
              type="button"
              onClick={onSwitchToMaas}
              className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-black flex items-center gap-1 transition cursor-pointer shadow-xs"
              title="Aylık Maaş Bordrosuna Dönüş"
            >
              <span>Maaş Bordrosu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* İkramiye Canlı Özet Göstergesi */}
      <div className="mb-3.5 bg-slate-900 text-white px-3 sm:px-4 py-2.5 rounded-xl flex items-center justify-between gap-2 shadow-xs text-xs font-dotmatrix border border-slate-800">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-2 sm:px-2.5 py-1 rounded-lg">
            <span className="text-slate-300 text-[10px] sm:text-[11px] font-bold uppercase">
              Saat Ücreti:
            </span>
            <span className="font-extrabold text-amber-300 font-mono text-xs sm:text-sm">
              {formatCurrency(saatUcr, 6)} ₺
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-2 sm:px-2.5 py-1 rounded-lg">
            <span className="text-slate-300 text-[10px] sm:text-[11px] font-bold uppercase">
              Emek Zammı:
            </span>
            <span className="font-extrabold text-amber-300 font-mono text-xs sm:text-sm">
              {formatCurrency(emkZam, 6)} ₺
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-950/90 border border-emerald-500/40 px-2 sm:px-2.5 py-1 rounded-lg">
            <span className="text-emerald-300 text-[10px] sm:text-[11px] font-bold uppercase">
              İkr. Tutarı:
            </span>
            <span className="font-extrabold text-emerald-400 font-mono text-xs sm:text-sm">
              {formatCurrency(ikrTutari)} ₺
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-purple-950/90 border border-purple-500/40 px-2 sm:px-2.5 py-1 rounded-lg">
            <span className="text-purple-300 text-[10px] sm:text-[11px] font-bold uppercase">
              Vergi Dilimi:
            </span>
            <span className="font-extrabold text-purple-300 font-mono text-xs sm:text-sm">
              %{vergiOrani} Sabit
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-950/90 border border-amber-500/40 px-2 sm:px-2.5 py-1 rounded-lg">
            <span className="text-amber-300 text-[10px] sm:text-[11px] font-bold uppercase">
              Kesintiler:
            </span>
            <span className="font-extrabold text-amber-400 font-mono text-xs sm:text-sm">
              {formatCurrency(kesintiToplami)} ₺
            </span>
          </div>
        </div>

        {/* Büyük Kırmızı Ödeme Tutarı Kutusu (Görsellerdeki Otantik Kırmızı Alan) */}
        <div className="flex items-center gap-1.5 bg-red-600 border-2 border-red-300 px-3.5 py-1 rounded-lg shrink-0 shadow-md">
          <span className="text-[10.5px] sm:text-xs text-white font-black uppercase tracking-wider">
            ÖDEME TUTARI:
          </span>
          <span className="font-black text-xs sm:text-base md:text-lg text-white font-mono drop-shadow-xs">
            {formatCurrency(odemeTutari)} ₺
          </span>
        </div>
      </div>

      {/* NORMAL BORDRO GİBİ 3 ANA BLOKLU RESMİ GÖVDE (Excel Şablonunun Yüksek Kaliteli Tasarımı) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 2xl:gap-4 text-xs font-dotmatrix">
        {/* ========================================================================= */}
        {/* 1. SÜTUN: SAAT VE ÜCRET BİLGİLERİ (Bağımsız Saat Ücreti ve Emek Zammı) */}
        {/* ========================================================================= */}
        <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-slate-300">
              <span className="font-black text-slate-800 uppercase flex items-center gap-1.5 text-xs">
                <Coins className="w-4 h-4 text-amber-600" />
                ÜCRET & SÜRE BİLGİLERİ
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-950 font-bold px-1.5 py-0.5 rounded border border-amber-300">
                İkramiyeye Özel Bağımsız
              </span>
            </div>

            {/* Hızlı Eşitleme / Maaş Ücretini Getir */}
            {onSyncSaatUcretiFromBordro && (
              <div className="mb-2 bg-sky-50 border border-sky-300 rounded-lg p-1.5 flex items-center justify-between gap-1 text-[11px]">
                <div className="text-sky-900 font-semibold truncate">
                  Maaş Saat Ücreti: <strong className="font-mono font-bold">{formatCurrency(bordro.saatUcr, 4)} ₺</strong>
                </div>
                <button
                  type="button"
                  onClick={onSyncSaatUcretiFromBordro}
                  className="px-2 py-0.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold shrink-0 transition cursor-pointer shadow-2xs text-[10px]"
                  title="Maaş bordrosundaki güncel veya zamlı saat ücretini ikramiyeye kopyala"
                >
                  İkramiyeye Aktar
                </button>
              </div>
            )}

            <div className="space-y-1.5">
              {/* Saat Ücreti (4. Madde: Normal bordrodan bağımsız!) */}
              <div className="grid grid-cols-2 rounded-lg overflow-hidden border-2 border-black">
                <div className="bg-[#fef3c7] p-2 font-bold flex items-center border-r-2 border-black text-slate-900">
                  Saat Ücreti
                </div>
                <div className="bg-[#bfdbfe] p-1.5 flex items-center justify-end font-mono font-bold text-slate-950">
                  <span className="text-slate-800 font-semibold mr-1">₺</span>
                  <input
                    type="number"
                    step="0.000001"
                    value={saatUcr === 0 ? '' : saatUcr}
                    placeholder="0,00"
                    onChange={e => updateField('saatUcr', parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent font-black text-slate-950 focus:bg-white focus:outline-none px-1 rounded text-right"
                  />
                </div>
              </div>

              {/* Emek Zammı (4. Madde: Normal bordrodan bağımsız!) */}
              <div className="grid grid-cols-2 rounded-lg overflow-hidden border-2 border-black">
                <div className="bg-[#fef3c7] p-2 font-bold flex items-center border-r-2 border-black text-slate-900">
                  Emek Zammı
                </div>
                <div className="bg-[#bfdbfe] p-1.5 flex items-center justify-end font-mono font-bold text-slate-950">
                  <span className="text-slate-800 font-semibold mr-1">₺</span>
                  <input
                    type="number"
                    step="0.000001"
                    value={emkZam === 0 ? '' : emkZam}
                    placeholder="0,00"
                    onChange={e => updateField('emkZam', parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent font-black text-slate-950 focus:bg-white focus:outline-none px-1 rounded text-right"
                  />
                </div>
              </div>

              {/* Brüt Aylık */}
              <div className="grid grid-cols-2 rounded-lg overflow-hidden border-2 border-black">
                <div className="bg-[#fef3c7] p-2 font-bold flex items-center border-r-2 border-black text-slate-900">
                  Brüt Aylık
                </div>
                <div className="bg-[#bfdbfe] p-1.5 flex items-center justify-end font-mono font-bold text-slate-950">
                  <span className="text-slate-800 font-semibold mr-1">₺</span>
                  <input
                    type="number"
                    value={brutAylik === 0 ? '' : brutAylik}
                    placeholder="-"
                    onChange={e => updateField('brutAylik', parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent font-black text-slate-950 focus:bg-white focus:outline-none px-1 rounded text-right"
                  />
                </div>
              </div>

              {/* Kıdem Zam. */}
              <div className="grid grid-cols-2 rounded-lg overflow-hidden border-2 border-black">
                <div className="bg-[#fef3c7] p-2 font-bold flex items-center border-r-2 border-black text-slate-900">
                  Kıdem Zam.
                </div>
                <div className="bg-[#bfdbfe] p-1.5 flex items-center justify-end font-mono font-bold text-slate-950">
                  <span className="text-slate-800 font-semibold mr-1">₺</span>
                  <input
                    type="number"
                    value={kidemZammi === 0 ? '' : kidemZammi}
                    placeholder="-"
                    onChange={e => updateField('kidemZammi', parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent font-black text-slate-950 focus:bg-white focus:outline-none px-1 rounded text-right"
                  />
                </div>
              </div>

              {/* İkr. Saati */}
              <div className="grid grid-cols-2 rounded-lg overflow-hidden border-2 border-black">
                <div className="bg-[#fef3c7] p-2 font-bold flex items-center border-r-2 border-black text-slate-900">
                  İkr.Saati
                </div>
                <div className="bg-[#bfdbfe] p-1.5 flex items-center justify-end font-mono font-bold text-slate-950">
                  <input
                    type="number"
                    step="0.5"
                    value={ikrSaati === 0 ? '' : ikrSaati}
                    placeholder="0"
                    onChange={e => updateField('ikrSaati', parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent font-black text-slate-950 focus:bg-white focus:outline-none px-1 rounded text-right"
                  />
                  <span className="ml-1 text-[11px] text-slate-800 font-black">Sa</span>
                </div>
              </div>

              {/* İkr. Günü */}
              <div className="grid grid-cols-2 rounded-lg overflow-hidden border-2 border-black">
                <div className="bg-[#fef3c7] p-2 font-bold flex items-center border-r-2 border-black text-slate-900">
                  İkr.Günü
                </div>
                <div className="bg-[#bfdbfe] p-1.5 flex items-center justify-end font-mono font-bold text-slate-950">
                  <input
                    type="number"
                    value={ikrGunu === 0 ? '' : ikrGunu}
                    placeholder="0"
                    onChange={e => updateField('ikrGunu', parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent font-black text-slate-950 focus:bg-white focus:outline-none px-1 rounded text-right"
                  />
                  <span className="ml-1 text-[11px] text-slate-800 font-black">Gün</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-slate-700 flex justify-between items-center">
            <span className="font-bold text-amber-900">Toplam Saatlik: </span>
            <span className="font-mono font-extrabold text-slate-900">
              {formatCurrency(toplamSaatlik, 6)} ₺
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SÜTUN: VERGİ VE YASAL KESİNTİLER (5. Madde: Tamamen Sabit Vergi Dilimi!) */}
        {/* ========================================================================= */}
        <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b-2 border-slate-300">
              <span className="font-black text-slate-800 uppercase flex items-center gap-1.5 text-xs">
                <Percent className="w-4 h-4 text-purple-700" />
                SABİT VERGİ DİLİMLERİ
              </span>
              <span className="text-[10px] bg-purple-100 text-purple-950 font-bold px-1.5 py-0.5 rounded border border-purple-300">
                Seçilen: %{vergiOrani}
              </span>
            </div>

            {/* 5. Madde: SABİT VERGİ DİLİMİ SEÇİM BUTONLARI */}
            <div className="mb-2 p-1.5 bg-white border border-purple-200 rounded-lg">
              <div className="text-[10.5px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Vergi Dilimi Seçiniz:</span>
                <span className="text-purple-700 font-extrabold">%{vergiOrani} Sabit Kesinti</span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {SABIT_VERGI_DILIMLERI.map(dilim => (
                  <button
                    key={dilim}
                    type="button"
                    onClick={() => updateField('vergiOrani', dilim)}
                    className={`py-1.5 rounded text-xs font-black transition cursor-pointer text-center ${
                      vergiOrani === dilim
                        ? 'bg-purple-700 text-white shadow-xs ring-2 ring-purple-400'
                        : 'bg-slate-100 text-slate-700 hover:bg-purple-50 hover:text-purple-900 border border-slate-200'
                    }`}
                  >
                    %{dilim}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              {/* Gelir V.M. */}
              <div className="grid grid-cols-2 rounded-lg overflow-hidden border-2 border-black">
                <div className="bg-[#fef3c7] p-2 font-bold flex items-center border-r-2 border-black text-slate-900">
                  Gelir V.M.
                </div>
                <div className="bg-[#bfdbfe] p-2 flex items-center justify-end font-mono font-bold text-slate-950">
                  ₺{formatCurrency(gelirVM)}
                </div>
              </div>

              {/* Gelir Vergisi (Sabit % dilimle hesaplanır) */}
              <div className="grid grid-cols-2 rounded-lg overflow-hidden border-2 border-black">
                <div className="bg-[#fef3c7] p-2 font-bold flex items-center justify-between border-r-2 border-black text-slate-900">
                  <span>Gelir Vergisi</span>
                  <span className="text-[10px] bg-purple-200 text-purple-950 font-black px-1 rounded">
                    %{vergiOrani}
                  </span>
                </div>
                <div className="bg-[#bfdbfe] p-2 flex items-center justify-end font-mono font-bold text-rose-950">
                  ₺{formatCurrency(gelirVergisi)}
                </div>
              </div>

              {/* Damga Vergisi */}
              <div className="grid grid-cols-2 rounded-lg overflow-hidden border-2 border-black">
                <div className="bg-[#fef3c7] p-2 font-bold flex items-center justify-between border-r-2 border-black text-slate-900">
                  <span>Damga Vergisi</span>
                  <span className="text-[10px] bg-amber-200/80 px-1 rounded font-normal">
                    ‰7.59
                  </span>
                </div>
                <div className="bg-[#bfdbfe] p-2 flex items-center justify-end font-mono font-bold text-rose-950">
                  ₺{formatCurrency(damgaVergisi)}
                </div>
              </div>

              {/* İcra Tutarı */}
              <div className="grid grid-cols-2 rounded-lg overflow-hidden border-2 border-black">
                <div className="bg-[#fef3c7] p-2 font-bold flex items-center border-r-2 border-black text-slate-900">
                  İcra Tutarı
                </div>
                <div className="bg-[#bfdbfe] p-1.5 flex items-center justify-end font-mono font-bold text-slate-950">
                  <span className="text-slate-800 font-semibold mr-1">₺</span>
                  <input
                    type="number"
                    value={icraTutari === 0 ? '' : icraTutari}
                    placeholder="0,00"
                    onChange={e => updateField('icraTutari', parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent font-black text-slate-950 focus:bg-white focus:outline-none px-1 rounded text-right"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vergi Sistemi Bilgilendirmesi */}
          <div className="mt-3 p-2 bg-purple-50 rounded-lg border border-purple-200 text-[11px] text-purple-950 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-purple-700 shrink-0" />
            <span>Kümülatif dikkate alınmaz; doğrudan seçilen <strong>%{vergiOrani}</strong> sabit vergi dilimi uygulanır.</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. SÜTUN: HAKEDİŞLER, KESİNTİLER VE ÖDEME TUTARI */}
        {/* ========================================================================= */}
        <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b-2 border-slate-300">
              <span className="font-black text-slate-800 uppercase flex items-center gap-1.5 text-xs">
                <Scissors className="w-4 h-4 text-emerald-700" />
                HAKEDİŞ & NET ÖDEME
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-950 font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                Net Ele Geçecek
              </span>
            </div>

            <div className="space-y-1.5">
              {/* İkr. Tutarı */}
              <div className="grid grid-cols-2 rounded-lg overflow-hidden border-2 border-black">
                <div className="bg-[#fef3c7] p-2 font-bold flex items-center border-r-2 border-black text-slate-900">
                  İkr.Tutarı
                </div>
                <div className="bg-[#bfdbfe] p-2 flex items-center justify-end font-mono font-bold text-emerald-950">
                  ₺{formatCurrency(ikrTutari)}
                </div>
              </div>

              {/* İnikas */}
              <div className="grid grid-cols-2 rounded-lg overflow-hidden border-2 border-black">
                <div className="bg-[#fef3c7] p-2 font-bold flex items-center border-r-2 border-black text-slate-900">
                  İnikas
                </div>
                <div className="bg-[#bfdbfe] p-1.5 flex items-center justify-end font-mono font-bold text-slate-950">
                  <span className="text-slate-800 font-semibold mr-1">₺</span>
                  <input
                    type="number"
                    value={inikas === 0 ? '' : inikas}
                    placeholder="0,00"
                    onChange={e => updateField('inikas', parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent font-black text-slate-950 focus:bg-white focus:outline-none px-1 rounded text-right"
                  />
                </div>
              </div>

              {/* Denge Öd. */}
              <div className="grid grid-cols-2 rounded-lg overflow-hidden border-2 border-black">
                <div className="bg-[#fef3c7] p-2 font-bold flex items-center border-r-2 border-black text-slate-900">
                  Denge Öd.
                </div>
                <div className="bg-[#bfdbfe] p-1.5 flex items-center justify-end font-mono font-bold text-slate-950">
                  <span className="text-slate-800 font-semibold mr-1">₺</span>
                  <input
                    type="number"
                    value={dengeOdenege === 0 ? '' : dengeOdenege}
                    placeholder="0,00"
                    onChange={e => updateField('dengeOdenege', parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent font-black text-slate-950 focus:bg-white focus:outline-none px-1 rounded text-right"
                  />
                </div>
              </div>

              {/* Kes. Toplamı */}
              <div className="grid grid-cols-2 rounded-lg overflow-hidden border-2 border-black">
                <div className="bg-[#fef3c7] p-2 font-bold flex items-center border-r-2 border-black text-slate-900">
                  Kes.Toplamı
                </div>
                <div className="bg-[#bfdbfe] p-2 flex items-center justify-end font-mono font-bold text-rose-950">
                  ₺{formatCurrency(kesintiToplami)}
                </div>
              </div>
            </div>
          </div>

          {/* BÜYÜK KIRMIZI ÖDEME TUTARI ALANI (Otantik Kırmızı Bölüm) */}
          <div className="mt-3.5 bg-red-600 text-white p-3.5 rounded-xl border-2 border-black shadow-lg flex items-center justify-between">
            <div>
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider block">
                ÖDEME TUTARI
              </span>
              <span className="text-[10px] text-red-200">
                (Net Ele Geçecek Tutar)
              </span>
            </div>
            <span className="text-lg sm:text-2xl font-black font-mono tracking-tight text-white drop-shadow-md">
              ₺{formatCurrency(odemeTutari)}
            </span>
          </div>
        </div>
      </div>

      {/* İkramiye Alt Dipnot ve Bilgi Şeridi */}
      <div className="mt-3.5 pt-2.5 border-t-2 border-dashed border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">Personel:</span>
          <span>{bordro.adSoyad || 'İLYAS İLMİK'}</span>
          <span className="text-slate-400">•</span>
          <span className="font-bold text-slate-800">Sicil:</span>
          <span>{bordro.sicilNo || '1510'}</span>
          <span className="text-slate-400">•</span>
          <span className="font-bold text-slate-800">Statü:</span>
          <span className="uppercase font-semibold">{bordro.calisanStatusu}</span>
        </div>

        <div className="flex items-center gap-3">
          <span>* İkramiye saat ücreti normal bordrodan bağımsızdır ve sabit vergi dilimiyle hesaplanır.</span>
          <button
            type="button"
            onClick={onSwitchToMaas}
            className="text-blue-700 font-bold underline hover:text-blue-900 cursor-pointer"
          >
            Maaş Bordrosuna Dön
          </button>
        </div>
      </div>
    </section>
  );
};
