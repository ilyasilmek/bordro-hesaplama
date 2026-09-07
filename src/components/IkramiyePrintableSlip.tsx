import React from 'react';
import { BordroData, IkramiyeData } from '../types';
import { formatCurrency } from '../utils/bordroEngine';

interface IkramiyePrintableSlipProps {
  bordro: BordroData;
  ikramiyeData: IkramiyeData;
}

export const IkramiyePrintableSlip: React.FC<IkramiyePrintableSlipProps> = ({
  bordro,
  ikramiyeData
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

  const toplamSaatlik = (Number(saatUcr) || 0) + (Number(emkZam) || 0);

  const ikrTutari =
    Math.round(
      (toplamSaatlik * (Number(ikrSaati) || 0) +
        (Number(brutAylik) || 0) +
        (Number(kidemZammi) || 0)) *
        100
    ) / 100;

  const toplamGelir =
    Math.round(
      (ikrTutari + (Number(inikas) || 0) + (Number(dengeOdenege) || 0)) * 100
    ) / 100;

  const gelirVM = ikrTutari;
  const gelirVergisi = Math.round(gelirVM * (vergiOrani / 100) * 100) / 100;
  const damgaVergisi = Math.round(ikrTutari * 0.00759 * 100) / 100;
  const kesintiToplami =
    Math.round((gelirVergisi + damgaVergisi + (Number(icraTutari) || 0)) * 100) / 100;
  const odemeTutari = Math.round((toplamGelir - kesintiToplami) * 100) / 100;

  return (
    <div
      id="printable-ikramiye-slip"
      className="hidden print:block print-single-page w-full bg-white text-black font-mono text-[11px] leading-tight"
      style={{
        fontFamily: "'Courier New', Courier, 'Lucida Console', Monaco, monospace",
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact'
      }}
    >
      <div className="border border-black p-3 bg-white">
        {/* Başlık */}
        <div className="border-b border-dashed border-black pb-1 mb-2 text-center">
          <div className="font-bold text-sm tracking-wide">
            TCDD TAŞIMACILIK A.Ş. İŞÇİ İKRAMİYE BORDROSU ({ikramiyeType} İKRAMİYE)
          </div>
          <div className="text-[10px] text-gray-700">
            31. Dönem Toplu İş Sözleşmesi (TİS) • 4/a Sürekli İşçi
          </div>
        </div>

        {/* Bilgi Başlıkları */}
        <div className="grid grid-cols-3 gap-2 border-b border-black pb-2 mb-2 text-[10.5px]">
          <div>
            <div><strong>Adı Soyadı:</strong> {bordro.adSoyad || 'İLYAS İLMİK'}</div>
            <div><strong>Sicil No:</strong> {bordro.sicilNo || '1510'}</div>
            <div><strong>Görevi / Statü:</strong> {bordro.unvan || 'Makinist'} / {bordro.calisanStatusu}</div>
          </div>
          <div>
            <div><strong>Dönem:</strong> {bordro.bordroDonem || '2026 Yılı'}</div>
            <div><strong>İkramiye Türü:</strong> {ikramiyeType} İKRAMİYE</div>
            <div><strong>Vergi Sistemi:</strong> Sabit Dilim (%{vergiOrani})</div>
          </div>
          <div>
            <div><strong>Saat Ücreti:</strong> {formatCurrency(saatUcr, 6)} ₺</div>
            <div><strong>Emek Zammı:</strong> {formatCurrency(emkZam, 6)} ₺</div>
            <div><strong>Toplam Saatlik:</strong> {formatCurrency(toplamSaatlik, 6)} ₺</div>
          </div>
        </div>

        {/* 3 Bloklu Çizelge */}
        <div className="grid grid-cols-3 gap-2 border border-black mb-3">
          {/* 1. Blok: Süre ve Hakediş */}
          <div className="border-r border-black p-2 space-y-1">
            <div className="font-bold border-b border-black pb-1 mb-1 text-center bg-gray-100">
              SÜRE VE HAKEDİŞ BİLGİSİ
            </div>
            <div className="flex justify-between">
              <span>İkr. Saati:</span>
              <span className="font-bold">{ikrSaati} Saat</span>
            </div>
            <div className="flex justify-between">
              <span>İkr. Günü:</span>
              <span className="font-bold">{ikrGunu} Gün</span>
            </div>
            {brutAylik > 0 && (
              <div className="flex justify-between">
                <span>Brüt Aylık:</span>
                <span>{formatCurrency(brutAylik)} ₺</span>
              </div>
            )}
            {kidemZammi > 0 && (
              <div className="flex justify-between">
                <span>Kıdem Zammı:</span>
                <span>{formatCurrency(kidemZammi)} ₺</span>
              </div>
            )}
            <div className="flex justify-between pt-1 border-t border-dashed border-gray-400">
              <span className="font-bold">İkramiye Tutarı:</span>
              <span className="font-bold">{formatCurrency(ikrTutari)} ₺</span>
            </div>
            {inikas > 0 && (
              <div className="flex justify-between">
                <span>İnikas:</span>
                <span>{formatCurrency(inikas)} ₺</span>
              </div>
            )}
            {dengeOdenege > 0 && (
              <div className="flex justify-between">
                <span>Denge Ödeneği:</span>
                <span>{formatCurrency(dengeOdenege)} ₺</span>
              </div>
            )}
          </div>

          {/* 2. Blok: Vergi ve Matrah */}
          <div className="border-r border-black p-2 space-y-1">
            <div className="font-bold border-b border-black pb-1 mb-1 text-center bg-gray-100">
              SABİT VERGİ VE KESİNTİLER
            </div>
            <div className="flex justify-between">
              <span>Gelir V.M.:</span>
              <span className="font-bold">{formatCurrency(gelirVM)} ₺</span>
            </div>
            <div className="flex justify-between">
              <span>Gelir Vergisi (%{vergiOrani}):</span>
              <span className="font-bold">{formatCurrency(gelirVergisi)} ₺</span>
            </div>
            <div className="flex justify-between">
              <span>Damga Vergisi (‰7.59):</span>
              <span className="font-bold">{formatCurrency(damgaVergisi)} ₺</span>
            </div>
            {icraTutari > 0 && (
              <div className="flex justify-between">
                <span>İcra Tutarı:</span>
                <span className="text-red-700">{formatCurrency(icraTutari)} ₺</span>
              </div>
            )}
            <div className="flex justify-between pt-1 border-t border-dashed border-gray-400">
              <span className="font-bold">Kesinti Toplamı:</span>
              <span className="font-bold">{formatCurrency(kesintiToplami)} ₺</span>
            </div>
          </div>

          {/* 3. Blok: Net Ödeme */}
          <div className="p-2 flex flex-col justify-between">
            <div>
              <div className="font-bold border-b border-black pb-1 mb-1 text-center bg-gray-100">
                NET ÖDEME SONUCU
              </div>
              <div className="flex justify-between">
                <span>Toplam Gelir:</span>
                <span>{formatCurrency(toplamGelir)} ₺</span>
              </div>
              <div className="flex justify-between">
                <span>Yasal Kesintiler:</span>
                <span>-{formatCurrency(kesintiToplami)} ₺</span>
              </div>
            </div>

            <div className="border border-black p-2 mt-2 bg-gray-50 text-center">
              <div className="text-[10px] font-bold">ÖDENECEK NET TUTAR</div>
              <div className="text-base font-bold">{formatCurrency(odemeTutari)} ₺</div>
            </div>
          </div>
        </div>

        {/* İmza ve Onay */}
        <div className="flex justify-between items-center text-[10px] border-t border-black pt-2">
          <div>* Bu bordro TCDD Taşımacılık A.Ş. 31. Dönem TİS gereğince düzenlenmiştir. Sabit %{vergiOrani} dilimi uygulanmıştır.</div>
          <div className="flex gap-4">
            <div><strong>Tanzim Eden:</strong> Personel Şube</div>
            <div><strong>İşçi İmzası:</strong> ______________</div>
          </div>
        </div>
      </div>
    </div>
  );
};
