import React from 'react';
import { EmployeeInput, TisParameters, PayrollResult } from '../types';
import { simulateYearlyPayroll, formatTRY } from '../utils/payrollCalculator';
import { Download, Calendar, TrendingUp, Gift, FileSpreadsheet } from 'lucide-react';

interface YearlyProjectionProps {
  employee: EmployeeInput;
  tisConfig: TisParameters;
  onSelectMonth: (month: number) => void;
}

export const YearlyProjection: React.FC<YearlyProjectionProps> = ({
  employee,
  tisConfig,
  onSelectMonth,
}) => {
  const yearlyResults = simulateYearlyPayroll(employee, tisConfig);

  // Annual Aggregations
  const totalAnnualGross = yearlyResults.reduce((acc, r) => acc + r.totalGrossWage, 0);
  const totalAnnualNet = yearlyResults.reduce((acc, r) => acc + r.netWage, 0);
  const totalAnnualWorkerSgk = yearlyResults.reduce((acc, r) => acc + r.totalWorkerSgkDeduction, 0);
  const totalAnnualIncomeTax = yearlyResults.reduce((acc, r) => acc + r.payableIncomeTax, 0);
  const totalAnnualMinWageTaxExemption = yearlyResults.reduce((acc, r) => acc + r.minWageIncomeTaxExemption, 0);
  const totalAnnualUnionDues = yearlyResults.reduce((acc, r) => acc + r.unionDuesAmount, 0);
  const totalAnnualEmployerCost = yearlyResults.reduce((acc, r) => acc + r.totalEmployerCost, 0);

  const exportToCSV = () => {
    const headers = [
      'Ay',
      'Brüt Kazanç',
      'İkramiye/Tediye',
      'SGK İşçi (%14)',
      'İşsizlik İşçi (%1)',
      'Ay Başı Küm. Matrah',
      'Aylık GV Matrahı',
      'Hesaplanan GV',
      'Asgari Ücret GV İstisnası',
      'Ödenecek Net GV',
      'Ödenecek Damga Vergisi',
      'Sendika Aidatı',
      'BES (%3)',
      'Net Ödenen Maaş',
      'İşveren Maliyeti'
    ];

    const rows = yearlyResults.map((r) => [
      r.monthName,
      r.totalGrossWage.toFixed(2),
      r.bonusGross.toFixed(2),
      r.sgkEmployeeAmount.toFixed(2),
      r.unemploymentEmployeeAmount.toFixed(2),
      r.cumulativeTaxBaseBefore.toFixed(2),
      r.incomeTaxBaseCurrentMonth.toFixed(2),
      r.calculatedIncomeTax.toFixed(2),
      r.minWageIncomeTaxExemption.toFixed(2),
      r.payableIncomeTax.toFixed(2),
      r.payableStampTax.toFixed(2),
      r.unionDuesAmount.toFixed(2),
      r.besDeductionAmount.toFixed(2),
      r.netWage.toFixed(2),
      r.totalEmployerCost.toFixed(2),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TIS_Yillik_Bordro_Projeksiyonu_${tisConfig.year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex-1 p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Top Banner and Summary Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              12 Aylık Yıllık Bordro ve Vergi Matrahı Projeksiyonu ({tisConfig.year})
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ay ay vergi dilimi geçişleri (%15 → %20 → %27 → %35), ikramiyeli dönemler ve kümülatif kesintilerin yıllık simülasyonu.
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer self-start md:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Excel (CSV) İndir</span>
        </button>
      </div>

      {/* 4 Annual Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400">Yıllık Toplam Brüt Hak Ediş</span>
          <div className="text-2xl font-bold text-white mt-1.5">
            {formatTRY(totalAnnualGross)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Tüm ikramiye ve ödenekler dahil</span>
        </div>

        <div className="bg-emerald-950/40 border border-emerald-500/60 rounded-xl p-4">
          <span className="text-xs font-bold text-emerald-300">Yıllık Toplam Net Ele Geçen</span>
          <div className="text-2xl font-extrabold text-emerald-300 mt-1.5">
            {formatTRY(totalAnnualNet)}
          </div>
          <span className="text-[11px] text-emerald-200/70 mt-1 block">12 Ayın toplam net nakit geliri</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400">Yıllık Ödenen Net Gelir Vergisi</span>
          <div className="text-2xl font-bold text-rose-400 mt-1.5">
            {formatTRY(totalAnnualIncomeTax)}
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            Devlet İstisnası: {formatTRY(totalAnnualMinWageTaxExemption)}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400">Yıllık Toplam İşveren Yükü</span>
          <div className="text-2xl font-bold text-blue-300 mt-1.5">
            {formatTRY(totalAnnualEmployerCost)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Yıllık Sendika Aidatı: {formatTRY(totalAnnualUnionDues)}
          </span>
        </div>
      </div>

      {/* 12-Month High-Density Desktop Spreadsheet Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Ay Ay Bordro Dağılımı ve Kümülatif Vergi Tablosu
          </span>
          <span className="text-[11px] text-slate-400">
            Aya tıklayarak detaylı aylık bordro editörüne geçebilirsiniz.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-[11px] whitespace-nowrap">
              <tr>
                <th className="py-3 px-3.5 font-semibold">Dönem</th>
                <th className="py-3 px-3.5 font-semibold text-right">Toplam Brüt (₺)</th>
                <th className="py-3 px-3.5 font-semibold text-center">İkramiye</th>
                <th className="py-3 px-3.5 font-semibold text-right">SGK İşçi (%14)</th>
                <th className="py-3 px-3.5 font-semibold text-right">İşsizlik (%1)</th>
                <th className="py-3 px-3.5 font-semibold text-right">Ay Başı Küm. GV</th>
                <th className="py-3 px-3.5 font-semibold text-center">Dilim</th>
                <th className="py-3 px-3.5 font-semibold text-right">Hesaplanan GV</th>
                <th className="py-3 px-3.5 font-semibold text-right text-emerald-400">7349 GV İstisnası</th>
                <th className="py-3 px-3.5 font-semibold text-right text-rose-400">Kesilen GV</th>
                <th className="py-3 px-3.5 font-semibold text-right">Sendika</th>
                <th className="py-3 px-3.5 font-semibold text-right font-bold text-emerald-300 bg-emerald-950/30">
                  NET MAAŞ (₺)
                </th>
                <th className="py-3 px-3.5 font-semibold text-right text-blue-300">İşveren Maliyeti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 whitespace-nowrap">
              {yearlyResults.map((r) => {
                const hasBonus = r.bonusGross > 0;
                return (
                  <tr
                    key={r.month}
                    onClick={() => onSelectMonth(r.month)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 px-3.5 font-semibold text-slate-200 group-hover:text-emerald-400 flex items-center gap-1.5">
                      <span>{r.month}. {r.monthName}</span>
                      {hasBonus && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                          İkramiyeli
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-semibold text-slate-100">
                      {formatTRY(r.totalGrossWage)}
                    </td>
                    <td className="py-2.5 px-3.5 text-center text-slate-300">
                      {hasBonus ? (
                        <span className="font-semibold text-amber-300">{formatTRY(r.bonusGross)}</span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 text-right text-slate-300">
                      {formatTRY(r.sgkEmployeeAmount)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right text-slate-300">
                      {formatTRY(r.unemploymentEmployeeAmount)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-slate-400">
                      {formatTRY(r.cumulativeTaxBaseBefore)}
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {r.effectiveTaxBracketRates}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right text-slate-300">
                      {formatTRY(r.calculatedIncomeTax)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-medium text-emerald-400">
                      -{formatTRY(r.minWageIncomeTaxExemption)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-bold text-rose-400">
                      {formatTRY(r.payableIncomeTax)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right text-purple-300">
                      {formatTRY(r.unionDuesAmount)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-extrabold text-emerald-300 bg-emerald-950/20 text-sm">
                      {formatTRY(r.netWage)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-semibold text-blue-300">
                      {formatTRY(r.totalEmployerCost)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Total Row */}
            <tfoot className="bg-slate-950 font-bold text-xs text-slate-200 border-t-2 border-slate-700 whitespace-nowrap">
              <tr>
                <td className="py-3 px-3.5 text-emerald-400 uppercase">YILLIK TOPLAM:</td>
                <td className="py-3 px-3.5 text-right text-white font-extrabold">{formatTRY(totalAnnualGross)}</td>
                <td className="py-3 px-3.5 text-center text-amber-300">
                  {formatTRY(yearlyResults.reduce((a, b) => a + b.bonusGross, 0))}
                </td>
                <td className="py-3 px-3.5 text-right">{formatTRY(totalAnnualWorkerSgk)}</td>
                <td className="py-3 px-3.5 text-right">
                  {formatTRY(yearlyResults.reduce((a, b) => a + b.unemploymentEmployeeAmount, 0))}
                </td>
                <td className="py-3 px-3.5 text-right text-slate-500">-</td>
                <td className="py-3 px-3.5 text-center text-slate-500">-</td>
                <td className="py-3 px-3.5 text-right">
                  {formatTRY(yearlyResults.reduce((a, b) => a + b.calculatedIncomeTax, 0))}
                </td>
                <td className="py-3 px-3.5 text-right text-emerald-400">
                  -{formatTRY(totalAnnualMinWageTaxExemption)}
                </td>
                <td className="py-3 px-3.5 text-right text-rose-400">{formatTRY(totalAnnualIncomeTax)}</td>
                <td className="py-3 px-3.5 text-right text-purple-300">{formatTRY(totalAnnualUnionDues)}</td>
                <td className="py-3 px-3.5 text-right font-black text-emerald-300 bg-emerald-950/40 text-base">
                  {formatTRY(totalAnnualNet)}
                </td>
                <td className="py-3 px-3.5 text-right text-blue-300">{formatTRY(totalAnnualEmployerCost)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
