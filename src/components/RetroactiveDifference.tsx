import React, { useState } from 'react';
import { EmployeeInput, TisParameters } from '../types';
import { calculateRetroactiveDifference } from '../utils/differenceCalculator';
import { formatTRY } from '../utils/payrollCalculator';
import { TURKISH_MONTHS } from '../constants/defaultTisConfig';
import { Layers, ArrowRight, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';

interface RetroactiveDifferenceProps {
  employee: EmployeeInput;
  tisConfig: TisParameters;
}

export const RetroactiveDifference: React.FC<RetroactiveDifferenceProps> = ({
  employee,
  tisConfig,
}) => {
  const [oldDailyWage, setOldDailyWage] = useState<number>(employee.baseDailyWage > 1200 ? employee.baseDailyWage - 350 : 1100);
  const [newDailyWage, setNewDailyWage] = useState<number>(employee.baseDailyWage);
  const [startMonth, setStartMonth] = useState<number>(1); // Ocak
  const [endMonth, setEndMonth] = useState<number>(6); // Haziran (6 aylık fark)
  const [oldAllowance, setOldAllowance] = useState<number>(0);
  const [newAllowance, setNewAllowance] = useState<number>(500); // TİS ile gelen ek sosyal yardım farkı

  const diffSummary = calculateRetroactiveDifference(
    employee,
    tisConfig,
    oldDailyWage,
    newDailyWage,
    startMonth,
    endMonth,
    oldAllowance,
    newAllowance
  );

  return (
    <div className="w-full flex-1 p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Intro Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              TİS Geriye Dönük Zam ve Fark Bordrosu Robotu
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Toplu İş Sözleşmesi imza süreci uzadığında, sözleşmenin yürürlük tarihinden itibaren biriken ay ay yevmiye ve sosyal hak farklarının net ödeme hesabı.
          </p>
        </div>

        <div className="bg-amber-950/50 border border-amber-800/60 px-4 py-2 rounded-lg text-xs text-amber-300">
          <span className="font-bold">Fark Süresi:</span> {diffSummary.monthsCount} Ay ({TURKISH_MONTHS[startMonth - 1]} - {TURKISH_MONTHS[endMonth - 1]})
        </div>
      </div>

      {/* Control Panel: Old Contract vs New Contract */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Eski TİS ve Yeni İmzalanan TİS Parametreleri
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Eski Günlük Yevmiye (₺)
            </label>
            <input
              type="number"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              step="10"
              value={oldDailyWage}
              onChange={(e) => setOldDailyWage(parseFloat(e.target.value) || 0)}
              onFocus={e => e.target.select()}
              onClick={e => (e.target as HTMLInputElement).select()}
              className="w-full bg-slate-900 text-sm font-bold text-slate-200 rounded-lg px-3 py-2 border border-slate-700"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">Aylık: {formatTRY(oldDailyWage * 30)}</span>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-lg border border-emerald-900/40">
            <label className="block text-xs font-semibold text-emerald-400 mb-1">
              Yeni İmzalanan Yevmiye (₺)
            </label>
            <input
              type="number"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              step="10"
              value={newDailyWage}
              onChange={(e) => setNewDailyWage(parseFloat(e.target.value) || 0)}
              onFocus={e => e.target.select()}
              onClick={e => (e.target as HTMLInputElement).select()}
              className="w-full bg-slate-900 text-sm font-bold text-emerald-300 rounded-lg px-3 py-2 border border-emerald-500/60"
            />
            <span className="text-[11px] text-emerald-400/80 mt-1 block">Aylık: {formatTRY(newDailyWage * 30)}</span>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Başlangıç Ayı
            </label>
            <select
              value={startMonth}
              onChange={(e) => setStartMonth(Number(e.target.value))}
              className="w-full bg-slate-900 text-xs font-semibold text-slate-200 rounded-lg px-3 py-2 border border-slate-700"
            >
              {TURKISH_MONTHS.map((m, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {idx + 1}. Ay ({m})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Bitiş Ayı (İmza / Ödeme Ayı)
            </label>
            <select
              value={endMonth}
              onChange={(e) => setEndMonth(Number(e.target.value))}
              className="w-full bg-slate-900 text-xs font-semibold text-slate-200 rounded-lg px-3 py-2 border border-slate-700"
            >
              {TURKISH_MONTHS.map((m, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {idx + 1}. Ay ({m})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Daily Difference Indicator */}
        <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-lg border border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">
              Günlük Yevmiye Artış Farkı: <strong>+{formatTRY(newDailyWage - oldDailyWage)} / Gün</strong>
            </span>
            <span className="text-slate-500">
              ({oldDailyWage > 0 ? `%${(((newDailyWage - oldDailyWage) / oldDailyWage) * 100).toFixed(1)} Zam Oranı` : ''})
            </span>
          </div>
          <span className="text-slate-400">
            Aylık Taban Brüt Farkı: <strong>+{formatTRY((newDailyWage - oldDailyWage) * 30)}</strong>
          </span>
        </div>
      </div>

      {/* Difference Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400">Toplam Brüt Hak Ediş Farkı</span>
          <div className="text-2xl font-bold text-white mt-1.5">
            {formatTRY(diffSummary.totalGrossDiff)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">{diffSummary.monthsCount} aylık brüt kümülatif artış</span>
        </div>

        {/* Net To Pay Grand Highlight */}
        <div className="bg-emerald-950/50 border-2 border-emerald-500 rounded-xl p-4 shadow-md">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
            Personele Ödenecek Net Fark
          </span>
          <div className="text-3xl font-black text-emerald-300 mt-1">
            {formatTRY(diffSummary.totalNetToPay)}
          </div>
          <span className="text-[11px] text-emerald-200/80 mt-1 block">
            Vergi ve SGK kesintileri düşülmüş net tutar
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400">Farklardan Kesilen Vergi & SGK</span>
          <div className="text-2xl font-bold text-rose-400 mt-1.5">
            {formatTRY(diffSummary.totalTaxDiff + diffSummary.totalSgkDiff + diffSummary.totalStampDiff)}
          </div>
          <div className="flex gap-2 text-[11px] text-slate-400 mt-1">
            <span>SGK: {formatTRY(diffSummary.totalSgkDiff)}</span>
            <span>|</span>
            <span>GV: {formatTRY(diffSummary.totalTaxDiff)}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400">İşverene Toplam Ek Maliyet</span>
          <div className="text-2xl font-bold text-blue-300 mt-1.5">
            {formatTRY(diffSummary.totalEmployerCostDiff)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">İşveren SGK primi farkı dahil</span>
        </div>
      </div>

      {/* Month-by-Month Difference Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Aylık TİS Fark Döküm Tablosu
          </span>
          <span className="text-[11px] text-slate-400">
            Dönem: {diffSummary.monthsCount} Ay Boyunca Biriken Farklar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-[11px] whitespace-nowrap">
              <tr>
                <th className="py-3 px-4 font-semibold">Dönem</th>
                <th className="py-3 px-4 font-semibold text-right">Eski Brüt</th>
                <th className="py-3 px-4 font-semibold text-right">Yeni Brüt</th>
                <th className="py-3 px-4 font-semibold text-right text-emerald-400">Brüt Fark (₺)</th>
                <th className="py-3 px-4 font-semibold text-right">SGK Farkı (%14)</th>
                <th className="py-3 px-4 font-semibold text-right">İşsizlik Farkı (%1)</th>
                <th className="py-3 px-4 font-semibold text-right text-rose-400">Gelir Vergisi Farkı</th>
                <th className="py-3 px-4 font-semibold text-right">Damga Vergisi Farkı</th>
                <th className="py-3 px-4 font-semibold text-right">Sendika Aidatı Farkı</th>
                <th className="py-3 px-4 font-semibold text-right font-bold text-emerald-300 bg-emerald-950/30">
                  ÖDENECEK NET FARK (₺)
                </th>
                <th className="py-3 px-4 font-semibold text-right text-blue-300">İşveren Maliyet Farkı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 whitespace-nowrap">
              {diffSummary.details.map((m) => (
                <tr key={m.month} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-slate-200">
                    {m.month}. {m.monthName}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-400 font-mono">
                    {formatTRY(m.oldBaseGross)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-200 font-mono">
                    {formatTRY(m.newBaseGross)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-emerald-400">
                    +{formatTRY(m.grossDifference)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-300">
                    {formatTRY(m.sgkDifference)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-300">
                    {formatTRY(m.unemploymentDifference)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-semibold text-rose-400">
                    {formatTRY(m.incomeTaxDifference)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-300">
                    {formatTRY(m.stampTaxDifference)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-purple-300">
                    {formatTRY(m.unionDuesDifference)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-extrabold text-emerald-300 bg-emerald-950/20 text-sm">
                    +{formatTRY(m.netDifference)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-semibold text-blue-300">
                    +{formatTRY(m.employerCostDifference)}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Grand Total Footer */}
            <tfoot className="bg-slate-950 font-bold text-xs text-slate-200 border-t-2 border-slate-700 whitespace-nowrap">
              <tr>
                <td className="py-3 px-4 text-emerald-400 uppercase">GENEL FARK TOPLAMI:</td>
                <td className="py-3 px-4 text-right text-slate-400">-</td>
                <td className="py-3 px-4 text-right text-slate-400">-</td>
                <td className="py-3 px-4 text-right font-extrabold text-emerald-400 text-sm">
                  +{formatTRY(diffSummary.totalGrossDiff)}
                </td>
                <td className="py-3 px-4 text-right">{formatTRY(diffSummary.totalSgkDiff)}</td>
                <td className="py-3 px-4 text-right">
                  {formatTRY(diffSummary.details.reduce((a, b) => a + b.unemploymentDifference, 0))}
                </td>
                <td className="py-3 px-4 text-right text-rose-400">{formatTRY(diffSummary.totalTaxDiff)}</td>
                <td className="py-3 px-4 text-right">{formatTRY(diffSummary.totalStampDiff)}</td>
                <td className="py-3 px-4 text-right text-purple-300">{formatTRY(diffSummary.totalUnionDiff)}</td>
                <td className="py-3 px-4 text-right font-black text-emerald-300 bg-emerald-950/40 text-base">
                  +{formatTRY(diffSummary.totalNetToPay)}
                </td>
                <td className="py-3 px-4 text-right text-blue-300">
                  +{formatTRY(diffSummary.totalEmployerCostDiff)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
