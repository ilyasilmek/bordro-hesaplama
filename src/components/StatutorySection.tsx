import React from 'react';
import { BordroData } from '../types';
import { formatCurrency, parseCurrency } from '../utils/bordroEngine';

interface StatutorySectionProps {
  bordro: BordroData;
  onChange: (updates: Partial<BordroData>) => void;
}

export const StatutorySection: React.FC<StatutorySectionProps> = ({
  bordro,
  onChange
}) => {
  const effectiveRate =
    bordro.aylikGlrVM > 0
      ? ((bordro.gelirVergisi / bordro.aylikGlrVM) * 100).toFixed(1)
      : '0.0';

  return (
    <section
      id="statutory-and-summary-section"
      className="md:col-span-3 p-3 2xl:p-3.5 rounded-lg bg-indigo-50/45 border border-indigo-200/90 space-y-1.5 2xl:space-y-2 font-dotmatrix shadow-xs flex flex-col justify-between"
    >
      <div className="space-y-1 2xl:space-y-1.5">
        {/* Çalıştığı Gün */}
        <div className="flex items-center justify-between gap-1">
          <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="calistigiGun">
            Çalıştığı Gün
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              key={`calistigiGun-${bordro.calistigiGun}`}
              id="calistigiGun"
              name="calistigiGun"
              type="text"
              defaultValue={formatCurrency(bordro.calistigiGun)}
              onBlur={e => onChange({ calistigiGun: parseCurrency(e.target.value) })}
              className="w-full text-xs font-semibold text-right bg-white/95 border border-indigo-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* SSK Günü */}
        <div className="flex items-center justify-between gap-1">
          <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="sskGunu">
            SSK Günü
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              key={`sskGunu-${bordro.sskGunu}`}
              id="sskGunu"
              name="sskGunu"
              type="text"
              defaultValue={formatCurrency(bordro.sskGunu)}
              onBlur={e => onChange({ sskGunu: parseCurrency(e.target.value) })}
              className="w-full text-xs font-semibold text-right bg-white/95 border border-indigo-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* SSK Matrahı */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <label className="text-slate-800 shrink-0 text-xs font-semibold" htmlFor="sskMatrahi">
              SSK Matrahı
            </label>
            <span
              className="no-print text-[8px] bg-indigo-100 text-indigo-800 px-1 rounded font-semibold border border-indigo-200"
              title="Gelir Toplamı - (300 TL x İaşe Günü İstisnası) + SSK Matrah Düzeltmesi"
            >
              OTO
            </span>
          </div>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              id="sskMatrahi"
              name="sskMatrahi"
              type="text"
              readOnly
              value={formatCurrency(bordro.sskMatrahi)}
              className="w-full text-xs font-bold text-right bg-indigo-100/50 border border-indigo-200/90 rounded px-1.5 py-0.5 text-slate-900"
            />
          </div>
        </div>

        {/* SSK Prim İşçi */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="sskPrimIsci">
              SSK Prim İşçi
            </label>
            <span
              className={`no-print text-[8px] px-1 rounded font-semibold border ${
                bordro.calisanStatusu === 'normal'
                  ? 'bg-sky-100 text-sky-800 border-sky-300'
                  : 'bg-indigo-100 text-indigo-800 border-indigo-300'
              }`}
              title={
                bordro.calisanStatusu === 'normal'
                  ? '4/a Sürekli İşçi Standart Prim Oranı (%14: %9 MYÖ + %5 GSS)'
                  : 'Gazi / Terörle Mücadele Özel Prim Oranı (%9)'
              }
            >
              {bordro.calisanStatusu === 'normal' ? '%14 STD' : '%9 ÖZEL'}
            </span>
          </div>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              id="sskPrimIsci"
              name="sskPrimIsci"
              type="text"
              readOnly
              value={formatCurrency(bordro.sskPrimIsci)}
              className="w-full text-xs font-semibold text-right bg-indigo-100/50 border border-indigo-200/90 rounded px-1.5 py-0.5 text-slate-900"
            />
          </div>
        </div>

        {/* SSK Prim(İşv) */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="sskPrimIsv">
              SSK Prim(İşv)
            </label>
            <span
              className="no-print text-[8px] bg-indigo-100 text-indigo-800 px-1 rounded font-semibold border border-indigo-200"
              title={
                bordro.calisanStatusu === 'normal'
                  ? 'Standart İşveren Prim Payı (%21.75: %11 MYÖ + %7.5 GSS + %3.25 Tehlike/KVS)'
                  : 'İşveren Prim Payı (%14.25)'
              }
            >
              {bordro.calisanStatusu === 'normal' ? '%21.75' : '%14.25'}
            </span>
          </div>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              id="sskPrimIsv"
              name="sskPrimIsv"
              type="text"
              readOnly
              value={formatCurrency(bordro.sskPrimIsv)}
              className="w-full text-xs font-semibold text-right bg-indigo-100/50 border border-indigo-200/90 rounded px-1.5 py-0.5 text-slate-900"
            />
          </div>
        </div>

        {/* Yıllık Glr.VM (Kümülatif Matrah) */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <label
              className="text-slate-700 shrink-0 text-xs font-medium"
              htmlFor="yillikGlrVM"
              title="Bu ay başlamadan önceki kümülatif gelir vergisi matrahı"
            >
              Yıllık Glr.VM
            </label>
            <span
              className="no-print text-[8px] bg-indigo-200/80 text-indigo-900 px-1 rounded font-bold border border-indigo-300"
              title="Önceki Aylar Kümülatif Matrahı"
            >
              KÜM
            </span>
          </div>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              key={`yillikGlrVM-${bordro.yillikGlrVM}`}
              id="yillikGlrVM"
              name="yillikGlrVM"
              type="text"
              defaultValue={formatCurrency(bordro.yillikGlrVM)}
              onBlur={e => onChange({ yillikGlrVM: parseCurrency(e.target.value) })}
              className="w-full text-xs font-semibold text-right bg-white/95 border border-indigo-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Aylık Glr.VM */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="aylikGlrVM">
              Aylık Glr.VM
            </label>
            <span
              className="no-print text-[8px] bg-indigo-100 text-indigo-800 px-1 rounded font-semibold border border-indigo-200"
              title="SSK Matrahı - SSK İşçi Primi - Sendika Aidatı - Engelli Muafiyeti"
            >
              OTO
            </span>
          </div>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              id="aylikGlrVM"
              name="aylikGlrVM"
              type="text"
              readOnly
              value={formatCurrency(bordro.aylikGlrVM)}
              className="w-full text-xs font-semibold text-right bg-indigo-100/50 border border-indigo-200/90 rounded px-1.5 py-0.5 text-slate-900"
            />
          </div>
        </div>

        {/* Gelir Vergisi (with mode selector) */}
        <div className="flex flex-col gap-1 bg-indigo-100/60 p-1.5 rounded border border-indigo-300/80">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <label className="text-indigo-950 font-bold shrink-0 text-xs" htmlFor="gelirVergisi">
                Gelir Vergisi
              </label>
              <select
                id="vergiDilimModu"
                value={bordro.vergiDilimModu}
                onChange={e => onChange({ vergiDilimModu: e.target.value })}
                className="no-print text-[9px] font-bold bg-white text-indigo-950 border border-indigo-300 rounded px-1 py-0.5 focus:ring-1 focus:ring-indigo-600 cursor-pointer"
                title="Otomatik Kademeli Tarife veya Sabit Dilim Seçimi"
              >
                <option value="oto">Kademeli (GİB 2026)</option>
                <option value="15">%15 Sabit Dilim</option>
                <option value="20">%20 Sabit Dilim</option>
                <option value="27">%27 Sabit Dilim</option>
                <option value="35">%35 Sabit Dilim</option>
              </select>
            </div>
            <div className="flex items-center w-28 sm:w-32 2xl:w-36 shrink-0">
              <span className="mr-1 text-indigo-900 font-bold">:</span>
              <input
                id="gelirVergisi"
                name="gelirVergisi"
                type="text"
                readOnly
                value={formatCurrency(bordro.gelirVergisi)}
                className="w-full text-xs font-bold text-right text-indigo-950 bg-white border border-indigo-300 rounded px-1.5 py-0.5"
              />
            </div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-indigo-800 px-0.5">
            <span>Efektif Oran:</span>
            <span className="font-semibold">%{effectiveRate}</span>
          </div>
        </div>

        {/* Damga Vergisi */}
        <div className="flex items-center justify-between gap-1">
          <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="damgaVergisi">
            Damga Vergisi
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              id="damgaVergisi"
              name="damgaVergisi"
              type="text"
              readOnly
              value={formatCurrency(bordro.damgaVergisi)}
              className="w-full text-xs font-semibold text-right bg-indigo-100/50 border border-indigo-200/90 rounded px-1.5 py-0.5 text-slate-900"
            />
          </div>
        </div>

        {/* İşs.Sig.(İşç) */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="issSigIsc">
              İşs.Sig.(İşç)
            </label>
            <span
              className={`no-print text-[8px] px-1 rounded font-semibold border ${
                bordro.calisanStatusu === 'normal'
                  ? 'bg-sky-100 text-sky-800 border-sky-300'
                  : 'bg-slate-200 text-slate-700 border-slate-300'
              }`}
              title={
                bordro.calisanStatusu === 'normal'
                  ? 'Standart 4/a İşçi İşsizlik Sigortası Primi (%1)'
                  : 'Terörle Mücadele / Gazi Kapsamında İşsizlik Primi Kesilmez'
              }
            >
              {bordro.calisanStatusu === 'normal' ? '%1 AKTİF' : 'MUAF'}
            </span>
          </div>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              id="issSigIsc"
              name="issSigIsc"
              type="text"
              readOnly
              value={formatCurrency(bordro.issSigIsc)}
              className="w-full text-xs font-semibold text-right bg-indigo-100/50 border border-indigo-200/90 rounded px-1.5 py-0.5 text-slate-900"
            />
          </div>
        </div>

        {/* İşs.Sig.(İşv) */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="issSigIsv">
              İşs.Sig.(İşv)
            </label>
            <span
              className={`no-print text-[8px] px-1 rounded font-semibold border ${
                bordro.calisanStatusu === 'normal'
                  ? 'bg-sky-100 text-sky-800 border-sky-300'
                  : 'bg-slate-200 text-slate-700 border-slate-300'
              }`}
              title={
                bordro.calisanStatusu === 'normal'
                  ? 'Standart İşveren İşsizlik Sigortası Primi (%2)'
                  : 'Terörle Mücadele / Gazi Kapsamında İşsizlik Primi Kesilmez'
              }
            >
              {bordro.calisanStatusu === 'normal' ? '%2 AKTİF' : 'MUAF'}
            </span>
          </div>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              id="issSigIsv"
              name="issSigIsv"
              type="text"
              readOnly
              value={formatCurrency(bordro.issSigIsv)}
              className="w-full text-xs font-semibold text-right bg-indigo-100/50 border border-indigo-200/90 rounded px-1.5 py-0.5 text-slate-900"
            />
          </div>
        </div>

        {/* Mahsup Fark */}
        <div className="flex items-center justify-between gap-1">
          <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="mahsupFark">
            Mahsup Fark
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              key={`mahsupFark-${bordro.mahsupFark}`}
              id="mahsupFark"
              name="mahsupFark"
              type="text"
              defaultValue={formatCurrency(bordro.mahsupFark)}
              onBlur={e => onChange({ mahsupFark: parseCurrency(e.target.value) })}
              className="w-full text-xs font-semibold text-right bg-white/95 border border-indigo-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Summary Totals & Net Pay */}
      <div className="space-y-1.5 pt-2 border-t-2 border-indigo-200/90">
        {/* Gelir Toplamı */}
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-emerald-950 shrink-0" htmlFor="gelirToplami">
            Gelir Toplamı
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 font-bold text-emerald-800">:</span>
            <input
              id="gelirToplami"
              name="gelirToplami"
              type="text"
              readOnly
              value={`${formatCurrency(bordro.gelirToplami)} TL`}
              className="w-full text-xs 2xl:text-sm font-bold text-right text-emerald-900 bg-emerald-100/70 border border-emerald-300 rounded px-1.5 py-0.5"
            />
          </div>
        </div>

        {/* Kesinti Toplamı */}
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-rose-950 shrink-0" htmlFor="kesintiTopl">
            Kesinti Toplamı
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 font-bold text-rose-800">:</span>
            <input
              id="kesintiTopl"
              name="kesintiTopl"
              type="text"
              readOnly
              value={`${formatCurrency(bordro.kesintiTopl)} TL`}
              className="w-full text-xs 2xl:text-sm font-bold text-right text-rose-900 bg-rose-100/70 border border-rose-300 rounded px-1.5 py-0.5"
            />
          </div>
        </div>

        {/* NET ÖDEME */}
        <div className="flex items-center justify-between p-1.5 bg-emerald-100/80 rounded-md border-2 border-emerald-600 shadow-xs">
          <div className="flex items-center gap-1">
            <label
              className="font-black text-xs 2xl:text-sm tracking-wide text-emerald-950 shrink-0"
              htmlFor="netOdeme"
            >
              Net Ödeme
            </label>
            <span className="no-print text-[8px] bg-emerald-700 text-white font-bold px-1.5 py-0.5 rounded">
              NET
            </span>
          </div>
          <div className="flex items-center w-40 2xl:w-48">
            <span className="mr-1 font-bold text-emerald-900">:</span>
            <input
              id="netOdeme"
              name="netOdeme"
              type="text"
              readOnly
              value={`${formatCurrency(bordro.netOdeme)} TL`}
              className="w-full text-sm 2xl:text-base font-black text-right text-emerald-950 bg-white border border-emerald-500 rounded px-2 py-0.5 shadow-xs"
            />
          </div>
        </div>

        {/* Asgari Geç.İn */}
        <div className="flex items-center justify-between text-xs text-slate-700">
          <label className="shrink-0 font-medium" htmlFor="asgariGecIn">
            Asgari Geç.İn
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              key={`asgariGecIn-${bordro.asgariGecIn}`}
              id="asgariGecIn"
              name="asgariGecIn"
              type="text"
              defaultValue={formatCurrency(bordro.asgariGecIn)}
              onBlur={e => onChange({ asgariGecIn: parseCurrency(e.target.value) })}
              className="w-full text-xs text-right bg-white/95 border border-indigo-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
