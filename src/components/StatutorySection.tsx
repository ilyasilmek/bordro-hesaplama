import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BordroData } from '../types';
import {
  formatCurrency,
  parseCurrency,
  autoAdjustTaxBracketForBordro
} from '../utils/bordroEngine';

interface StatutorySectionProps {
  bordro: BordroData;
  onChange: (updates: Partial<BordroData>) => void;
}

export const StatutorySection: React.FC<StatutorySectionProps> = ({
  bordro,
  onChange
}) => {
  const taxAdjustment = autoAdjustTaxBracketForBordro(bordro);
  const effectiveRate =
    bordro.aylikGlrVM > 0
      ? ((bordro.gelirVergisi / bordro.aylikGlrVM) * 100).toFixed(1)
      : '0.0';

  return (
    <section
      id="statutory-and-summary-section"
      className="md:col-span-3 p-3 2xl:p-3.5 rounded-lg bg-indigo-50/45 border border-indigo-200/90 space-y-1.5 2xl:space-y-2 font-dotmatrix shadow-xs flex flex-col justify-between"
    >
      <div className="space-y-1.5 2xl:space-y-2">
        {/* Çalıştığı Gün */}
        <div className="flex items-center justify-between gap-1 p-1.5 rounded border bg-white/95 border-indigo-200/90 shadow-2xs hover:border-indigo-400 transition-all">
          <label className="text-slate-700 shrink-0 text-xs font-medium cursor-pointer" htmlFor="calistigiGun">
            Çalıştığı Gün
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              key={`calistigiGun-${bordro.calistigiGun}`}
              id="calistigiGun"
              name="calistigiGun"
              type="text"
              inputMode="decimal"
              placeholder="0"
              defaultValue={bordro.calistigiGun > 0 ? formatCurrency(bordro.calistigiGun) : ''}
              onFocus={e => e.target.select()}
              onClick={e => (e.target as HTMLInputElement).select()}
              onBlur={e => onChange({ calistigiGun: parseCurrency(e.target.value) })}
              className="w-full text-xs font-semibold text-right bg-white border border-slate-300 rounded px-1.5 py-0.5 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/40 font-mono transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* SSK Günü */}
        <div className="flex items-center justify-between gap-1 p-1.5 rounded border bg-indigo-50/70 border-indigo-100/80 hover:border-indigo-400 transition-all">
          <label className="text-slate-700 shrink-0 text-xs font-medium cursor-pointer" htmlFor="sskGunu">
            SSK Günü
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              key={`sskGunu-${bordro.sskGunu}`}
              id="sskGunu"
              name="sskGunu"
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              placeholder="0"
              defaultValue={bordro.sskGunu > 0 ? formatCurrency(bordro.sskGunu) : ''}
              onFocus={e => e.target.select()}
              onClick={e => (e.target as HTMLInputElement).select()}
              onBlur={e => onChange({ sskGunu: parseCurrency(e.target.value) })}
              className="w-full text-xs font-semibold text-right bg-white border border-slate-300 rounded px-1.5 py-0.5 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/40 font-mono transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* SSK Matrahı */}
        <div className="flex items-center justify-between gap-1 p-1.5 rounded border bg-white/95 border-indigo-200/90 shadow-2xs hover:border-indigo-400 transition-all">
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
              className="w-full text-xs font-bold text-right bg-indigo-100/60 border border-indigo-200 rounded px-1.5 py-0.5 text-slate-900 font-mono"
            />
          </div>
        </div>

        {/* SSK Prim İşçi */}
        <div className="flex items-center justify-between gap-1 p-1.5 rounded border bg-indigo-50/70 border-indigo-100/80 hover:border-indigo-400 transition-all">
          <div className="flex items-center gap-1">
            <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="sskPrimIsci">
              SSK Prim İşçi
            </label>
            <span
              className={`no-print text-[8px] px-1 rounded font-semibold border ${
                bordro.calisanStatusu === 'gazi'
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-sky-100 text-sky-800 border-sky-300'
              }`}
              title={
                bordro.calisanStatusu === 'gazi'
                  ? 'Gazi / Terörle Mücadele Özel Prim Oranı (%9)'
                  : '4/a Sürekli İşçi Standart Prim Oranı (%14: %9 MYÖ + %5 GSS)'
              }
            >
              {bordro.calisanStatusu === 'gazi' ? '%9 ÖZEL' : '%14 STD'}
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
              className="w-full text-xs font-semibold text-right bg-indigo-100/60 border border-indigo-200 rounded px-1.5 py-0.5 text-slate-900 font-mono"
            />
          </div>
        </div>

        {/* SSK Prim(İşv) */}
        <div className="flex items-center justify-between gap-1 p-1.5 rounded border bg-white/95 border-indigo-200/90 shadow-2xs hover:border-indigo-400 transition-all">
          <div className="flex items-center gap-1">
            <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="sskPrimIsv">
              SSK Prim(İşv)
            </label>
            <span
              className="no-print text-[8px] bg-indigo-100 text-indigo-800 px-1 rounded font-semibold border border-indigo-200"
              title={
                bordro.calisanStatusu === 'gazi'
                  ? 'Gazi İşveren Prim Payı (%14.25)'
                  : 'Standart İşveren Prim Payı (%21.75: %11 MYÖ + %7.5 GSS + %3.25 Tehlike/KVS)'
              }
            >
              {bordro.calisanStatusu === 'gazi' ? '%14.25' : '%21.75'}
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
              className="w-full text-xs font-semibold text-right bg-indigo-100/60 border border-indigo-200 rounded px-1.5 py-0.5 text-slate-900 font-mono"
            />
          </div>
        </div>

        {/* Yıllık Glr.VM (Kümülatif Matrah) */}
        <div className="flex items-center justify-between gap-1 p-1.5 rounded border bg-indigo-50/70 border-indigo-100/80 hover:border-indigo-400 transition-all">
          <div className="flex items-center gap-1">
            <label
              className="text-slate-700 shrink-0 text-xs font-medium cursor-pointer"
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
              inputMode="decimal"
              placeholder="0,00"
              defaultValue={bordro.yillikGlrVM > 0 ? formatCurrency(bordro.yillikGlrVM) : ''}
              onFocus={e => e.target.select()}
              onClick={e => (e.target as HTMLInputElement).select()}
              onBlur={e => onChange({ yillikGlrVM: parseCurrency(e.target.value) })}
              className="w-full text-xs font-semibold text-right bg-white border border-slate-300 rounded px-1.5 py-0.5 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/40 font-mono transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Aylık Glr.VM */}
        <div className="flex items-center justify-between gap-1 p-1.5 rounded border bg-white/95 border-indigo-200/90 shadow-2xs hover:border-indigo-400 transition-all">
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
              className="w-full text-xs font-semibold text-right bg-indigo-100/60 border border-indigo-200 rounded px-1.5 py-0.5 text-slate-900 font-mono"
            />
          </div>
        </div>

        {/* Gelir Vergisi (with mode selector) */}
        <div className="flex flex-col gap-1 bg-indigo-100/80 p-2 rounded-lg border border-indigo-300 shadow-2xs hover:border-indigo-400 transition-all">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <label className="text-indigo-950 font-bold shrink-0 text-xs cursor-pointer" htmlFor="gelirVergisi">
                Gelir Vergisi
              </label>
              <select
                id="vergiDilimModu"
                value={bordro.vergiDilimModu}
                onChange={e => onChange({ vergiDilimModu: e.target.value })}
                className="no-print text-[9px] font-bold bg-white text-indigo-950 border border-indigo-300 rounded px-1.5 py-0.5 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/40 cursor-pointer shadow-2xs"
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
                className="w-full text-xs font-bold text-right text-indigo-950 bg-white border border-indigo-300 rounded px-1.5 py-0.5 font-mono shadow-2xs"
              />
            </div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-indigo-900 px-0.5 font-medium flex-wrap gap-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>Efektif: <strong className="font-bold">%{effectiveRate}</strong></span>
              {bordro.vergiDilimModu === 'oto' && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold transition-colors ${
                    taxAdjustment.isBracketCrossed
                      ? 'bg-amber-200 text-amber-950 border border-amber-400 shadow-2xs'
                      : 'bg-indigo-200/90 text-indigo-950 border border-indigo-300'
                  }`}
                  title={taxAdjustment.summary}
                >
                  {taxAdjustment.isBracketCrossed
                    ? `Dilim: ${taxAdjustment.bracketBreakdown.map(b => b.ratePercent).join(' ➔ ')}`
                    : `Dilim: %${Math.round(taxAdjustment.marginalRate * 100)}`}
                </span>
              )}
            </div>
            {bordro.vergiDilimModu === 'oto' && taxAdjustment.minWageExemption > 0 && (
              <span
                className="text-[9px] text-emerald-800 font-semibold cursor-help"
                title={`7349 Sayılı Kanun Asgari Ücret Vergi İstisnası (${taxAdjustment.monthIndex}. Ay): ${formatCurrency(taxAdjustment.minWageExemption)} ₺`}
              >
                İstisna: {formatCurrency(taxAdjustment.minWageExemption)} ₺
              </span>
            )}
          </div>
        </div>

        {/* Damga Vergisi */}
        <div className="flex items-center justify-between gap-1 p-1.5 rounded border bg-white/95 border-indigo-200/90 shadow-2xs hover:border-indigo-400 transition-all">
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
              className="w-full text-xs font-semibold text-right bg-indigo-100/60 border border-indigo-200 rounded px-1.5 py-0.5 text-slate-900 font-mono"
            />
          </div>
        </div>

        {/* İşs.Sig.(İşç) */}
        <div className="flex items-center justify-between gap-1 p-1.5 rounded border bg-indigo-50/70 border-indigo-100/80 hover:border-indigo-400 transition-all">
          <div className="flex items-center gap-1">
            <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="issSigIsc">
              İşs.Sig.(İşç)
            </label>
            <span
              className={`no-print text-[8px] px-1 rounded font-semibold border ${
                bordro.calisanStatusu === 'gazi'
                  ? 'bg-slate-200 text-slate-700 border-slate-300'
                  : 'bg-sky-100 text-sky-800 border-sky-300'
              }`}
              title={
                bordro.calisanStatusu === 'gazi'
                  ? 'Terörle Mücadele / Gazi Kapsamında İşsizlik Primi Kesilmez'
                  : 'Standart 4/a İşçi İşsizlik Sigortası Primi (%1)'
              }
            >
              {bordro.calisanStatusu === 'gazi' ? 'MUAF' : '%1 AKTİF'}
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
              className="w-full text-xs font-semibold text-right bg-indigo-100/60 border border-indigo-200 rounded px-1.5 py-0.5 text-slate-900 font-mono"
            />
          </div>
        </div>

        {/* İşs.Sig.(İşv) */}
        <div className="flex items-center justify-between gap-1 p-1.5 rounded border bg-white/95 border-indigo-200/90 shadow-2xs hover:border-indigo-400 transition-all">
          <div className="flex items-center gap-1">
            <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="issSigIsv">
              İşs.Sig.(İşv)
            </label>
            <span
              className={`no-print text-[8px] px-1 rounded font-semibold border ${
                bordro.calisanStatusu === 'gazi'
                  ? 'bg-slate-200 text-slate-700 border-slate-300'
                  : 'bg-sky-100 text-sky-800 border-sky-300'
              }`}
              title={
                bordro.calisanStatusu === 'gazi'
                  ? 'Terörle Mücadele / Gazi Kapsamında İşsizlik Primi Kesilmez'
                  : 'Standart İşveren İşsizlik Sigortası Primi (%2)'
              }
            >
              {bordro.calisanStatusu === 'gazi' ? 'MUAF' : '%2 AKTİF'}
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
              className="w-full text-xs font-semibold text-right bg-indigo-100/60 border border-indigo-200 rounded px-1.5 py-0.5 text-slate-900 font-mono"
            />
          </div>
        </div>

        {/* Mahsup Fark */}
        <div className="flex items-center justify-between gap-1 p-1.5 rounded border bg-indigo-50/70 border-indigo-100/80 hover:border-indigo-400 transition-all">
          <label className="text-slate-700 shrink-0 text-xs font-medium cursor-pointer" htmlFor="mahsupFark">
            Mahsup Fark
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              key={`mahsupFark-${bordro.mahsupFark}`}
              id="mahsupFark"
              name="mahsupFark"
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              defaultValue={bordro.mahsupFark !== 0 ? formatCurrency(bordro.mahsupFark) : ''}
              onFocus={e => e.target.select()}
              onClick={e => (e.target as HTMLInputElement).select()}
              onBlur={e => onChange({ mahsupFark: parseCurrency(e.target.value) })}
              className="w-full text-xs font-semibold text-right bg-white border border-slate-300 rounded px-1.5 py-0.5 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/40 font-mono transition-all shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Summary Totals & Net Pay */}
      <div className="space-y-2 pt-2 border-t-2 border-indigo-200/90">
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

        {/* NET ÖDEME - Büyük, Vurgulu ve Animasyonlu */}
        <motion.div
          id="net-odeme-container"
          layout
          initial={{ scale: 0.98, opacity: 0.9 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-3 sm:p-3.5 shadow-md shadow-emerald-700/20 border-2 border-emerald-500/90 flex flex-col gap-1.5 print:bg-white print:text-black print:border-black"
        >
          {/* Subtle glow highlight in background */}
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-lg pointer-events-none" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200" />
              </span>
              <span className="font-extrabold text-xs 2xl:text-sm uppercase tracking-wider text-emerald-100 print:text-black">
                NET ÖDEME
              </span>
            </div>
            <span className="no-print text-[9px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/30 tracking-wide uppercase">
              ELE GEÇEN TUTAR
            </span>
          </div>

          <div className="flex items-baseline justify-end w-full">
            <input
              id="netOdeme"
              name="netOdeme"
              type="text"
              readOnly
              value={`${formatCurrency(bordro.netOdeme)} TL`}
              className="sr-only"
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={`net-val-${bordro.netOdeme}`}
                initial={{ scale: 0.93, opacity: 0.5, y: 2 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.97, opacity: 0.7 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="flex items-baseline gap-1"
              >
                <span className="text-2xl sm:text-3xl 2xl:text-4xl font-black font-mono tracking-tight text-white drop-shadow-xs print:text-black">
                  {formatCurrency(bordro.netOdeme)}
                </span>
                <span className="text-base sm:text-lg 2xl:text-xl font-extrabold text-emerald-200 print:text-black">
                  TL
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
