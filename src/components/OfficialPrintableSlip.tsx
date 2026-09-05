import React from 'react';
import { BordroData } from '../types';

interface OfficialPrintableSlipProps {
  bordro: BordroData;
}

const fmtMoney = (val?: number) => {
  if (val === undefined || val === null || isNaN(val)) return '0,00';
  return val.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const fmtHours = (val?: number) => {
  if (val === undefined || val === null || isNaN(val)) return '0,00';
  return val.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const OfficialPrintableSlip: React.FC<OfficialPrintableSlipProps> = ({ bordro }) => {
  // Aktif veya tutarı > 0 olan hakedişleri ayıkla
  const activeEarnings = bordro.earnings.filter(
    e => (e.hours && e.hours > 0) || (e.amount && e.amount > 0)
  );

  // Özel Kesintiler listesi
  const specialDeductions: { label: string; amount: number }[] = [];
  if (bordro.birlestirilmSosyalYardim > 0) {
    specialDeductions.push({ label: 'Birleştirilm', amount: bordro.birlestirilmSosyalYardim });
  }
  if (bordro.sendikaAidati > 0) {
    specialDeductions.push({ label: 'Sendika Aida', amount: bordro.sendikaAidati });
  }
  if (bordro.sporAidati > 0) {
    specialDeductions.push({ label: 'Spor Aidatı ', amount: bordro.sporAidati });
  }
  if (bordro.vergiMuafiyeti > 0) {
    specialDeductions.push({ label: 'Vergiden Mua', amount: bordro.vergiMuafiyeti });
  }
  if (bordro.mahsupKesintisi !== 0) {
    specialDeductions.push({ label: 'Mahsup Ksnt.', amount: bordro.mahsupKesintisi });
  }
  if (bordro.sskMatrahD !== 0) {
    specialDeductions.push({ label: 'SSK Matrah D', amount: bordro.sskMatrahD });
  }
  if (bordro.terfiFarki !== 0) {
    specialDeductions.push({ label: 'Terfi Fark-İ', amount: bordro.terfiFarki });
  }
  if (bordro.customDeductions && bordro.customDeductions.length > 0) {
    bordro.customDeductions.forEach(cd => {
      if (cd.amount > 0) {
        specialDeductions.push({ label: cd.name.slice(0, 12), amount: cd.amount });
      }
    });
  }

  // Maksimum satır sayısı: Hakediş veya Kesinti sayısı (en az 10 satır dot-matrix dengesi için)
  const maxMiddleRows = Math.max(activeEarnings.length, specialDeductions.length, 10);

  return (
    <div
      id="printable-retro-slip"
      className="hidden print:block print-single-page w-full bg-white text-black font-mono text-[11px] leading-tight"
      style={{
        fontFamily: "'Courier New', Courier, 'Lucida Console', Monaco, monospace",
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact'
      }}
    >
      <div className="border border-black p-2 bg-white">
        {/* Başlık Satırı */}
        <div className="border-b border-dashed border-black pb-1 mb-1">
          <div className="flex justify-between items-center text-xs font-bold tracking-tight">
            <span>|TCDD TAŞIMACILIK A.Ş. İŞÇİ AYLIK MAAŞ BORDROSU -------------------------------------------------------------|</span>
          </div>
          <div className="grid grid-cols-12 text-[11px] font-bold mt-1 pt-1 border-t border-dashed border-black">
            <div className="col-span-4 border-r border-dashed border-black pr-2 truncate">
              |{bordro.bordroDonem || '08/2026 (15.07.2026-14.08.2026)'}
            </div>
            <div className="col-span-5 text-center border-r border-dashed border-black px-2">
              HAKEDİŞLER VE ÖZEL KESİNTİLER
            </div>
            <div className="col-span-3 text-right pl-2">
              |YASAL KESİNTİ VE SONUÇLAR|
            </div>
          </div>
        </div>

        {/* Ana 3 Sütunlu Gövde */}
        <div className="grid grid-cols-12 gap-0 divide-x divide-dashed divide-black text-[10.5px] leading-[1.35]">
          {/* SÜTUN 1: Özlük, İşyeri ve Temel Ücret Bilgileri (4 Sütun) */}
          <div className="col-span-4 pr-2 space-y-[2px]">
            <div className="flex justify-between">
              <span>|İşl/Y/S</span>
              <span className="font-bold">:{bordro.islYs || '01/0104/03'}</span>
            </div>
            <div className="flex justify-between">
              <span>|Adı</span>
              <span className="font-bold">:{bordro.adi || 'İlyas'}</span>
            </div>
            <div className="flex justify-between">
              <span>|Soyadı</span>
              <span className="font-bold">:{bordro.soyadi || 'İLMEK'}</span>
            </div>
            <div className="flex justify-between">
              <span>|Sicil No</span>
              <span className="font-bold">:{bordro.sicilNo || '084857'}</span>
            </div>
            <div className="flex justify-between">
              <span>|Pers.No</span>
              <span className="font-bold">:{bordro.persNo || '11000867'}</span>
            </div>
            <div className="flex justify-between">
              <span>|SSK No</span>
              <span className="font-bold">:{bordro.sskNo || '3408199916012'}</span>
            </div>
            <div className="flex justify-between">
              <span>|Ünvanı</span>
              <span className="font-bold">:{bordro.unvani || 'VAGON İMAL VE TAMİRC'}</span>
            </div>
            <div className="flex justify-between">
              <span>|Der/Kad.</span>
              <span className="font-bold">:{bordro.derKad || '001/  00'}</span>
            </div>
            <div className="flex justify-between">
              <span>|Kıdem Yılı:{bordro.kidemYili || 14}</span>
              <span>Hzm.Zammı Yıl: {bordro.hzmZammiYil || 14}</span>
            </div>
            <div className="flex justify-between">
              <span>|Saat Ücr</span>
              <span className="font-bold">:{bordro.saatUcr.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span>|Emk. Zam</span>
              <span className="font-bold">:{bordro.emkZam.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span>|Brt Aylk</span>
              <span>:{fmtMoney(bordro.brtAylk)}</span>
            </div>
            <div className="flex justify-between">
              <span>|Kdm. Zam</span>
              <span>:{fmtMoney(bordro.kdmZam)}</span>
            </div>
            <div className="flex justify-between">
              <span>|Hast.Gün</span>
              <span className={bordro.hastGun > 0 ? 'font-bold' : ''}>:{bordro.hastGun.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span>|İşy.SSK</span>
              <span>:{bordro.isySsk || '13317020211372650410'}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-dashed border-black/40">
              <span className="font-bold">|İMZA</span>
              <span>: ______________________</span>
            </div>
          </div>

          {/* SÜTUN 2: Hakedişler ve Karşısında Özel Kesintiler (5 Sütun) */}
          <div className="col-span-5 px-2 space-y-[2px]">
            {Array.from({ length: maxMiddleRows }).map((_, idx) => {
              const earning = activeEarnings[idx];
              const deduction = specialDeductions[idx];

              return (
                <div key={idx} className="flex justify-between items-center text-[10.5px]">
                  {/* Sol Kısım: Hakediş */}
                  <div className="flex justify-between items-center w-[58%] pr-1">
                    {earning ? (
                      <>
                        <span className="truncate" title={earning.label}>
                          |{earning.label.slice(0, 12).padEnd(12, ' ')}: {fmtHours(earning.hours)}
                        </span>
                        <span className="font-bold text-right ml-1">{fmtMoney(earning.amount)}</span>
                      </>
                    ) : (
                      <span>|                       </span>
                    )}
                  </div>

                  {/* Sağ Kısım: Özel Kesinti */}
                  <div className="flex justify-between items-center w-[42%] pl-1 border-l border-dashed border-black/40">
                    {deduction ? (
                      <>
                        <span className="truncate">|{deduction.label.padEnd(12, ' ')}</span>
                        <span className="font-bold text-right ml-1">{fmtMoney(deduction.amount)}</span>
                      </>
                    ) : (
                      <span>|                 </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SÜTUN 3: Yasal Kesintiler ve Sonuçlar (3 Sütun) */}
          <div className="col-span-3 pl-2 space-y-[2px]">
            <div className="flex justify-between">
              <span>|Çalıştığı Gün:</span>
              <span className="font-bold">{bordro.calistigiGun.toFixed(2)}|</span>
            </div>
            <div className="flex justify-between">
              <span>|SSK Günü      :</span>
              <span className="font-bold">{bordro.sskGunu.toFixed(2)}|</span>
            </div>
            <div className="flex justify-between">
              <span>|SSK Matrahı   :</span>
              <span className="font-bold">{fmtMoney(bordro.sskMatrahi)}|</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>|SSK Prim İşçi :</span>
              <span>{fmtMoney(bordro.sskPrimIsci)}|</span>
            </div>
            <div className="flex justify-between">
              <span>|SSK Prim(İşv) :</span>
              <span>{fmtMoney(bordro.sskPrimIsv)}|</span>
            </div>
            <div className="flex justify-between">
              <span>|Yıllık Glr.VM :</span>
              <span className="font-bold">{fmtMoney(bordro.yillikGlrVM)}|</span>
            </div>
            <div className="flex justify-between">
              <span>|Aylık Glr.VM  :</span>
              <span className="font-bold">{fmtMoney(bordro.aylikGlrVM)}|</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>|Gelir Vergisi :</span>
              <span>{fmtMoney(bordro.gelirVergisi)}|</span>
            </div>
            <div className="flex justify-between">
              <span>|Damga Vergisi :</span>
              <span className="font-bold">{fmtMoney(bordro.damgaVergisi)}|</span>
            </div>
            <div className="flex justify-between">
              <span>|İşs.Sig.(İşç) :</span>
              <span className="font-bold">{fmtMoney(bordro.issSigIsc)}|</span>
            </div>
            <div className="flex justify-between">
              <span>|İşs.Sig.(İşv) :</span>
              <span className="font-bold">{fmtMoney(bordro.issSigIsv)}|</span>
            </div>
            <div className="flex justify-between">
              <span>|Mahsup Fark   :</span>
              <span>{fmtMoney(bordro.mahsupFark)}|</span>
            </div>
            <div className="flex justify-between border-t border-dashed border-black pt-0.5 font-bold">
              <span>|Gelir Toplamı:</span>
              <span>{fmtMoney(bordro.gelirToplami)}|</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>|Kesinti Topl.:</span>
              <span>{fmtMoney(bordro.kesintiTopl)}|</span>
            </div>

            {/* NET ÖDEME */}
            <div className="flex justify-between text-xs font-black border-y-2 border-double border-black py-0.5 my-0.5 bg-black/5">
              <span>|Net Ödeme     :</span>
              <span className="tracking-wider">{fmtMoney(bordro.netOdeme)}|</span>
            </div>

            <div className="flex justify-between text-[10px]">
              <span>|Asgari Geç.İn:</span>
              <span>{fmtMoney(bordro.asgariGecIn)}|</span>
            </div>
          </div>
        </div>

        {/* Alt Bilgi Çizgisi */}
        <div className="mt-1 pt-1 border-t border-dashed border-black text-[9.5px] flex justify-between items-center">
          <span>|TCDD TAŞIMACILIK A.Ş. İNSAN KAYNAKLARI DAİRESİ BAŞKANLIĞI BORDRO SERVİSİ|</span>
          <span className="font-bold">4857 SK MD.37 RESMİ ÜCRET HESAP PUSULASI FORMATIDIR</span>
        </div>
      </div>
    </div>
  );
};
