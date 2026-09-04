import React from 'react';
import { EmployeeInput, PayrollResult, TisParameters } from '../types';
import { formatTRY, numberToTurkishWords } from '../utils/payrollCalculator';
import { Printer, Download, ArrowLeft } from 'lucide-react';

interface PayrollSlipProps {
  employee: EmployeeInput;
  payroll: PayrollResult;
  tisConfig: TisParameters;
  onBackToCalculator: () => void;
}

export const PayrollSlip: React.FC<PayrollSlipProps> = ({
  employee,
  payroll,
  tisConfig,
  onBackToCalculator,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const netWords = numberToTurkishWords(payroll.netWage);

  return (
    <div className="w-full flex-1 p-6 flex flex-col items-center max-w-[1400px] mx-auto">
      {/* Non-printed Toolbar */}
      <div className="w-full max-w-[900px] mb-4 flex items-center justify-between print:hidden">
        <button
          onClick={onBackToCalculator}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bordro Editörüne Dön</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">A4 Resmi Formatı Baskıya Hazır</span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Yazdır / PDF Kaydet</span>
          </button>
        </div>
      </div>

      {/* Official Printed Document (White paper design for A4 fidelity) */}
      <div
        id="official-payroll-slip"
        className="w-full max-w-[900px] bg-white text-slate-900 border border-slate-300 rounded-lg shadow-xl p-8 print:shadow-none print:border-none print:p-0 print:m-0 font-sans text-xs"
      >
        {/* Document Header */}
        <div className="border-b-2 border-slate-800 pb-3 mb-4 flex items-start justify-between">
          <div>
            <div className="text-lg font-black tracking-tight text-slate-900 uppercase">
              TİS KAPSAMINDA ÇALIŞAN PERSONEL
            </div>
            <div className="text-xs font-bold text-slate-700 uppercase">
              RESMİ ÜCRET HESAP PUSULASI
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              4857 Sayılı İş Kanunu Madde 37 ve 6356 Sayılı Sendikalar ve Toplu İş Sözleşmesi Kanunu Gereği Düzenlenmiştir
            </div>
          </div>

          <div className="text-right">
            <div className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 font-bold text-xs rounded text-slate-800">
              DÖNEM: {payroll.monthName.toUpperCase()} / {payroll.year}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Sözleşme Modeli: {tisConfig.name}
            </div>
          </div>
        </div>

        {/* Employee & Employment Meta Info */}
        <div className="grid grid-cols-2 gap-4 border border-slate-300 rounded p-3 mb-4 bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex">
              <span className="w-28 text-slate-500 font-medium">Adı Soyadı:</span>
              <span className="font-bold text-slate-900">{employee.fullName}</span>
            </div>
            <div className="flex">
              <span className="w-28 text-slate-500 font-medium">T.C. Kimlik No:</span>
              <span className="font-mono font-semibold text-slate-800">{employee.tcNo}</span>
            </div>
            <div className="flex">
              <span className="w-28 text-slate-500 font-medium">Birim / Departman:</span>
              <span className="text-slate-800">{employee.department}</span>
            </div>
            <div className="flex">
              <span className="w-28 text-slate-500 font-medium">Görevi / Unvan:</span>
              <span className="text-slate-800">{employee.jobTitle}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex">
              <span className="w-32 text-slate-500 font-medium">Kıdem Süresi:</span>
              <span className="font-semibold text-slate-800">{employee.seniorityYears} Yıl</span>
            </div>
            <div className="flex">
              <span className="w-32 text-slate-500 font-medium">Çıplak Yevmiye:</span>
              <span className="font-bold text-slate-900">
                {employee.wageType === 'daily'
                  ? `${formatTRY(employee.baseDailyWage)} / Gün`
                  : `${formatTRY(employee.baseMonthlyGross)} / Ay`}
              </span>
            </div>
            <div className="flex">
              <span className="w-32 text-slate-500 font-medium">Sendika Üyeliği:</span>
              <span className="font-semibold text-slate-800">
                {employee.isUnionMember ? 'Üye (Aidat Kesintili)' : 'Üye Değil'}
              </span>
            </div>
            <div className="flex">
              <span className="w-32 text-slate-500 font-medium">Hak Edilen Gün:</span>
              <span className="font-bold text-slate-900">{payroll.days.totalPaidDays} Gün</span>
            </div>
          </div>
        </div>

        {/* Days & Working Hours Summary Bar */}
        <div className="grid grid-cols-6 border border-slate-300 rounded mb-4 text-center divide-x divide-slate-300 bg-white text-[11px]">
          <div className="p-1.5">
            <span className="text-slate-500 block text-[10px]">Fiili Çalışma</span>
            <span className="font-bold text-slate-800">{payroll.days.worked} Gün</span>
          </div>
          <div className="p-1.5">
            <span className="text-slate-500 block text-[10px]">Hafta Tatili</span>
            <span className="font-bold text-slate-800">{payroll.days.weeklyRest} Gün</span>
          </div>
          <div className="p-1.5">
            <span className="text-slate-500 block text-[10px]">Ücretli İzin</span>
            <span className="font-bold text-slate-800">{payroll.days.paidLeave} Gün</span>
          </div>
          <div className="p-1.5">
            <span className="text-slate-500 block text-[10px]">Fazla Mesai</span>
            <span className="font-bold text-slate-800">{employee.normalOvertimeHours} Saat</span>
          </div>
          <div className="p-1.5">
            <span className="text-slate-500 block text-[10px]">Bayram Çalışması</span>
            <span className="font-bold text-slate-800">{employee.holidayOvertimeDays} Gün</span>
          </div>
          <div className="p-1.5">
            <span className="text-slate-500 block text-[10px]">Gece Vardiyası</span>
            <span className="font-bold text-slate-800">{employee.nightShiftHours} Saat</span>
          </div>
        </div>

        {/* Dual Column: Earnings vs Deductions */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Earnings (Kazançlar) */}
          <div className="border border-slate-300 rounded overflow-hidden">
            <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-800 border-b border-slate-300 flex justify-between">
              <span>HAK EDİLEN KAZANÇLAR</span>
              <span>TUTAR (₺)</span>
            </div>
            <div className="p-2 space-y-1.5 min-h-[220px]">
              {payroll.earningItems.map((item) => (
                <div key={item.code} className="flex justify-between items-center text-[11px] border-b border-slate-100 pb-1">
                  <span className="text-slate-700">{item.name}</span>
                  <span className="font-semibold text-slate-900">{formatTRY(item.grossAmount)}</span>
                </div>
              ))}
            </div>
            <div className="bg-slate-100 px-3 py-2 font-bold text-slate-900 border-t border-slate-300 flex justify-between">
              <span>TOPLAM BRÜT KAZANÇ:</span>
              <span className="text-sm font-black">{formatTRY(payroll.totalGrossWage)}</span>
            </div>
          </div>

          {/* Deductions (Kesintiler) */}
          <div className="border border-slate-300 rounded overflow-hidden">
            <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-800 border-b border-slate-300 flex justify-between">
              <span>YASAL VE ÖZEL KESİNTİLER</span>
              <span>TUTAR (₺)</span>
            </div>
            <div className="p-2 space-y-1.5 min-h-[220px]">
              {payroll.deductionItems.map((item) => (
                <div key={item.code} className="flex justify-between items-center text-[11px] border-b border-slate-100 pb-1">
                  <span className="text-slate-700">{item.name}</span>
                  <span className="font-semibold text-rose-700">{formatTRY(item.amount)}</span>
                </div>
              ))}
            </div>
            <div className="bg-slate-100 px-3 py-2 font-bold text-slate-900 border-t border-slate-300 flex justify-between">
              <span>TOPLAM KESİNTİLER:</span>
              <span className="text-sm font-black text-rose-700">{formatTRY(payroll.totalDeductions)}</span>
            </div>
          </div>
        </div>

        {/* Legal Tax Bases and 7349 Law Exemptions Row */}
        <div className="border border-slate-300 rounded p-3 mb-4 bg-slate-50/50">
          <div className="text-[11px] font-bold text-slate-800 uppercase mb-2">
            Yasal Matrahlar ve Asgari Ücret Vergi İstisnası Bilgileri
          </div>
          <div className="grid grid-cols-4 gap-2 text-[11px]">
            <div>
              <span className="text-slate-500 block">SGK Matrahı (SPEK):</span>
              <span className="font-bold text-slate-900">{formatTRY(payroll.sgkBase)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Gelir Vergisi Matrahı:</span>
              <span className="font-bold text-slate-900">{formatTRY(payroll.incomeTaxBaseCurrentMonth)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Kümülatif GV Matrahı:</span>
              <span className="font-bold text-slate-900">{formatTRY(payroll.cumulativeTaxBaseAfter)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Uygulanan Vergi Dilimi:</span>
              <span className="font-bold text-emerald-800">{payroll.effectiveTaxBracketRates}</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-600 flex justify-between">
            <span>
              * 7349 Sayılı Kanun Asgari Ücret GV İstisnası: <strong>{formatTRY(payroll.minWageIncomeTaxExemption)}</strong> | Damga Vergisi İstisnası: <strong>{formatTRY(payroll.minWageStampTaxExemption)}</strong>
            </span>
            <span>
              GVK 63/4 Sendika Aidatı Matrah İndirimi: <strong>{formatTRY(payroll.unionDuesAmount)}</strong>
            </span>
          </div>
        </div>

        {/* Net Salary Payable Grand Highlight */}
        <div className="border-2 border-slate-900 rounded p-4 mb-4 bg-slate-50 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase block">NET ÖDENECEK TUTAR</span>
            <span className="text-[11px] text-slate-500 italic mt-0.5 block">
              YALNIZ: {netWords}
            </span>
          </div>
          <div className="text-2xl font-black text-slate-950 tracking-tight">
            {formatTRY(payroll.netWage)}
          </div>
        </div>

        {/* Signatures and Legal Receipt Declaration */}
        <div className="mt-6 pt-4 border-t border-slate-300">
          <p className="text-[10px] text-slate-500 italic mb-6">
            "Yukarıdaki hesap pusulasında belirtilen brüt ve net hak edişlerimin dökümünü inceledim. Net tutarı banka hesabımdan eksiksiz olarak teslim aldığımı, TİS ve mevzuat kapsamındaki tüm alacaklarımın ödendiğini beyan ve teyit ederim."
          </p>

          <div className="grid grid-cols-2 gap-12 text-center text-xs">
            <div>
              <div className="font-bold text-slate-800">İŞVEREN / KURUM YETKİLİSİ</div>
              <div className="text-[10px] text-slate-500">Kaşe / İmza</div>
              <div className="h-14 border-b border-slate-400 mt-2"></div>
            </div>
            <div>
              <div className="font-bold text-slate-800">PERSONEL</div>
              <div className="text-[10px] text-slate-500">{employee.fullName} / İmza</div>
              <div className="h-14 border-b border-slate-400 mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
