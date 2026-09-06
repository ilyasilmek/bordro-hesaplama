import React, { useState } from 'react';
import {
  EmployeeInput,
  TisParameters,
  PayrollResult
} from '../types';
import { formatTRY } from '../utils/payrollCalculator';
import {
  User,
  Clock,
  Gift,
  HeartHandshake,
  ShieldAlert,
  HelpCircle,
  Building2,
  Percent,
  Coins,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface MonthlyCalculatorProps {
  employee: EmployeeInput;
  onChangeEmployee: (updated: EmployeeInput) => void;
  tisConfig: TisParameters;
  payroll: PayrollResult;
  onNavigateToSlip: () => void;
}

export const MonthlyCalculator: React.FC<MonthlyCalculatorProps> = ({
  employee,
  onChangeEmployee,
  tisConfig,
  payroll,
  onNavigateToSlip,
}) => {
  const [activeInputSection, setActiveInputSection] = useState<'base' | 'overtime' | 'bonus' | 'social' | 'deductions'>('base');

  const updateField = <K extends keyof EmployeeInput>(field: K, value: EmployeeInput[K]) => {
    onChangeEmployee({
      ...employee,
      [field]: value,
    });
  };

  return (
    <div className="w-full flex-1 flex flex-col p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Top 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Gross */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Toplam Brüt Kazanç</span>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 rounded border border-slate-700">
              {payroll.earningItems.length} Kalem
            </span>
          </div>
          <div className="text-2xl font-bold text-white mt-2 tracking-tight">
            {formatTRY(payroll.totalGrossWage)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span>SGK Matrahı:</span>
            <span className="font-semibold text-slate-200">{formatTRY(payroll.sgkBase)}</span>
            {payroll.sgkCeilingApplied && (
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
                Tavan Aşıldı
              </span>
            )}
          </div>
        </div>

        {/* Net Salary - Star Focus */}
        <div className="bg-emerald-950/40 border-2 border-emerald-500/70 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Net Ele Geçen Maaş
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500 text-slate-950 rounded">
              ÖDENECEK TUTAR
            </span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-300 mt-1 tracking-tight">
            {formatTRY(payroll.netWage)}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-emerald-200/80">
            <span>Dönem: {payroll.monthName} {payroll.year}</span>
            <button
              onClick={onNavigateToSlip}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-200 underline cursor-pointer"
            >
              Pusulayı Görüntüle →
            </button>
          </div>
        </div>

        {/* Total Deductions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Toplam Kesintiler</span>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-950/60 text-rose-300 rounded border border-rose-800/60">
              {formatTRY(payroll.totalDeductions)}
            </span>
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-2 tracking-tight">
            {formatTRY(payroll.totalLegalDeductions)}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
            <span>Özel Kesintiler (Sendika/BES):</span>
            <span className="font-semibold text-slate-200">{formatTRY(payroll.totalSpecialDeductions)}</span>
          </div>
        </div>

        {/* Total Employer Cost */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Toplam İşveren Maliyeti</span>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-950/60 text-blue-300 rounded border border-blue-800/60">
              {tisConfig.employerIncentive5Percent ? '%15.5 Teşvikli' : '%20.5 Normal'}
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-300 mt-2 tracking-tight">
            {formatTRY(payroll.totalEmployerCost)}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
            <span>SGK + İşsizlik İşveren:</span>
            <span className="font-semibold text-slate-200">
              {formatTRY(payroll.sgkEmployerAmount + payroll.unemploymentEmployerAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Workstation Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: TİS & Employee Inputs (5 Columns in xl) */}
        <div className="xl:col-span-5 bg-slate-900 border border-slate-800 rounded-xl shadow-sm flex flex-col overflow-hidden">
          {/* Input Section Sub-Tabs */}
          <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-3 pt-2 gap-1 overflow-x-auto select-none">
            <button
              onClick={() => setActiveInputSection('base')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer ${
                activeInputSection === 'base'
                  ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Temel & Ücret</span>
            </button>
            <button
              onClick={() => setActiveInputSection('bonus')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer ${
                activeInputSection === 'bonus'
                  ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>İkramiye & Kıdem</span>
            </button>
            <button
              onClick={() => setActiveInputSection('overtime')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer ${
                activeInputSection === 'overtime'
                  ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Mesai & Gece</span>
            </button>
            <button
              onClick={() => setActiveInputSection('social')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer ${
                activeInputSection === 'social'
                  ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Sosyal Yardımlar</span>
            </button>
            <button
              onClick={() => setActiveInputSection('deductions')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer ${
                activeInputSection === 'deductions'
                  ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Kesintiler & Matrah</span>
            </button>
          </div>

          {/* Input Forms Body */}
          <div className="p-5 space-y-4 max-h-[720px] overflow-y-auto">
            {/* 1. Base & Wage Section */}
            {activeInputSection === 'base' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Personel ve Sözleşme Bilgileri</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Çalışanın TİS kapsamındaki temel unvanı, yevmiyesi ve hak kazanılan günleri.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Ad Soyad</label>
                    <input
                      type="text"
                      value={employee.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      className="w-full bg-slate-950 text-xs text-slate-100 rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">T.C. Kimlik No</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={11}
                      value={employee.tcNo}
                      onChange={(e) => updateField('tcNo', e.target.value)}
                      onFocus={e => e.target.select()}
                      onClick={e => (e.target as HTMLInputElement).select()}
                      className="w-full bg-slate-950 text-xs text-slate-100 rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Birim / Departman</label>
                    <input
                      type="text"
                      value={employee.department}
                      onChange={(e) => updateField('department', e.target.value)}
                      className="w-full bg-slate-950 text-xs text-slate-100 rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Görev / Unvan</label>
                    <input
                      type="text"
                      value={employee.jobTitle}
                      onChange={(e) => updateField('jobTitle', e.target.value)}
                      className="w-full bg-slate-950 text-xs text-slate-100 rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Wage Type Toggle */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">Ücret Hesaplama Türü:</span>
                    <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-700">
                      <button
                        onClick={() => updateField('wageType', 'daily')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer transition-all ${
                          employee.wageType === 'daily'
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Günlük Yevmiye (TİS Standart)
                      </button>
                      <button
                        onClick={() => updateField('wageType', 'monthly')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer transition-all ${
                          employee.wageType === 'monthly'
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Aylık Maktu Brüt
                      </button>
                    </div>
                  </div>

                  {employee.wageType === 'daily' ? (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-emerald-400">
                          Çıplak Brüt Günlük Yevmiye (₺)
                        </label>
                        <span className="text-[11px] text-slate-400">
                          Aylık 30 Günlük: {formatTRY(employee.baseDailyWage * 30)}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="decimal"
                          pattern="[0-9]*[.,]?[0-9]*"
                          step="0.01"
                          min="0"
                          value={employee.baseDailyWage}
                          onChange={(e) => updateField('baseDailyWage', parseFloat(e.target.value) || 0)}
                          onFocus={e => e.target.select()}
                          onClick={e => (e.target as HTMLInputElement).select()}
                          className="w-full bg-slate-900 text-sm font-bold text-white rounded-lg pl-8 pr-4 py-2.5 border border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        />
                        <span className="absolute left-3 top-2.5 text-emerald-400 font-bold text-sm">₺</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-emerald-400 mb-1">
                        Aylık Çıplak Maktu Brüt Ücret (₺)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="decimal"
                          pattern="[0-9]*[.,]?[0-9]*"
                          step="0.01"
                          min="0"
                          value={employee.baseMonthlyGross}
                          onChange={(e) => updateField('baseMonthlyGross', parseFloat(e.target.value) || 0)}
                          onFocus={e => e.target.select()}
                          onClick={e => (e.target as HTMLInputElement).select()}
                          className="w-full bg-slate-900 text-sm font-bold text-white rounded-lg pl-8 pr-4 py-2.5 border border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        />
                        <span className="absolute left-3 top-2.5 text-emerald-400 font-bold text-sm">₺</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Days Breakdown */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">Aylık Gün Dağılımı</span>
                    <span className="text-xs font-bold text-emerald-400">
                      Toplam Ücrete Esas: {employee.totalPayableDays} Gün
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">Fiili Çalışma</label>
                      <input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        min="0"
                        max="31"
                        value={employee.workedDays}
                        onChange={(e) => updateField('workedDays', parseInt(e.target.value) || 0)}
                        onFocus={e => e.target.select()}
                        onClick={e => (e.target as HTMLInputElement).select()}
                        className="w-full bg-slate-900 text-xs text-center text-slate-200 rounded px-2 py-1.5 border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">Hafta Tatili</label>
                      <input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        min="0"
                        max="10"
                        value={employee.weeklyRestDays}
                        onChange={(e) => updateField('weeklyRestDays', parseInt(e.target.value) || 0)}
                        onFocus={e => e.target.select()}
                        onClick={e => (e.target as HTMLInputElement).select()}
                        className="w-full bg-slate-900 text-xs text-center text-slate-200 rounded px-2 py-1.5 border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">Ücretli İzin</label>
                      <input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        min="0"
                        max="31"
                        value={employee.paidLeaveDays}
                        onChange={(e) => updateField('paidLeaveDays', parseInt(e.target.value) || 0)}
                        onFocus={e => e.target.select()}
                        onClick={e => (e.target as HTMLInputElement).select()}
                        className="w-full bg-slate-900 text-xs text-center text-slate-200 rounded px-2 py-1.5 border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">Toplam Gün</label>
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        max="31"
                        value={employee.totalPayableDays}
                        onChange={(e) => updateField('totalPayableDays', parseInt(e.target.value) || 0)}
                        onFocus={e => e.target.select()}
                        onClick={e => (e.target as HTMLInputElement).select()}
                        className="w-full bg-slate-900 text-xs text-center font-bold text-emerald-400 rounded px-2 py-1.5 border border-emerald-500/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Bonus & Seniority (İkramiye & Kıdem) */}
            {activeInputSection === 'bonus' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white">TİS Kıdem Zammı ve İkramiye / Tediye</h3>
                  <p className="text-xs text-slate-400">
                    Sözleşme hükümlerine göre kıdem puanı ve dönemsel ikramiye dilimleri.
                  </p>
                </div>

                {/* Seniority Pay */}
                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="applySeniorityCheck"
                        checked={employee.applySeniorityPay}
                        onChange={(e) => updateField('applySeniorityPay', e.target.checked)}
                        className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="applySeniorityCheck" className="text-xs font-semibold text-slate-200 cursor-pointer">
                        Kıdem / Hizmet Zammı Uygula
                      </label>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">
                      {formatTRY(payroll.seniorityPayTotal)}
                    </span>
                  </div>

                  {employee.applySeniorityPay && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Kıdem Yılı</label>
                        <input
                          type="number"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          min="0"
                          max="50"
                          value={employee.seniorityYears}
                          onChange={(e) => updateField('seniorityYears', parseInt(e.target.value) || 0)}
                          onFocus={e => e.target.select()}
                          onClick={e => (e.target as HTMLInputElement).select()}
                          className="w-full bg-slate-900 text-xs text-slate-100 rounded-lg px-3 py-2 border border-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Yıl Başına Günlük Ek (₺)</label>
                        <input
                          type="number"
                          inputMode="decimal"
                          pattern="[0-9]*[.,]?[0-9]*"
                          step="0.5"
                          value={employee.customSeniorityPayDaily ?? tisConfig.seniorityPayPerYear}
                          onChange={(e) => updateField('customSeniorityPayDaily', parseFloat(e.target.value) || 0)}
                          onFocus={e => e.target.select()}
                          onClick={e => (e.target as HTMLInputElement).select()}
                          className="w-full bg-slate-900 text-xs text-slate-100 rounded-lg px-3 py-2 border border-slate-700"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Bonus / Tediye */}
                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="bonusCheck"
                        checked={employee.hasBonusThisMonth}
                        onChange={(e) => updateField('hasBonusThisMonth', e.target.checked)}
                        className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="bonusCheck" className="text-xs font-semibold text-slate-200 cursor-pointer">
                        Bu Ay İkramiye / Tediye Ödensin
                      </label>
                    </div>
                    {employee.hasBonusThisMonth && (
                      <span className="text-xs font-bold text-emerald-400">
                        {formatTRY(payroll.bonusGross)}
                      </span>
                    )}
                  </div>

                  {employee.hasBonusThisMonth && (
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-slate-400">Ödenecek İkramiye Gün Sayısı:</label>
                        <span className="text-xs text-slate-400">
                          (TİS Yıllık: {tisConfig.annualBonusDaysTotal} gün)
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[15, 30, tisConfig.annualBonusDaysTotal / tisConfig.bonusMonths.length].map((days) => (
                          <button
                            key={days}
                            type="button"
                            onClick={() => updateField('bonusDaysOverride', days)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                              employee.bonusDaysOverride === days
                                ? 'bg-emerald-600 text-white border-emerald-500'
                                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                            }`}
                          >
                            {days} Gün
                          </button>
                        ))}
                      </div>
                      <div className="mt-2">
                        <label className="block text-[11px] text-slate-400 mb-1">Özel Gün Sayısı Gir:</label>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="1"
                          max="120"
                          value={employee.bonusDaysOverride ?? 15}
                          onChange={(e) => updateField('bonusDaysOverride', parseFloat(e.target.value) || 0)}
                          onFocus={e => e.target.select()}
                          onClick={e => (e.target as HTMLInputElement).select()}
                          className="w-full bg-slate-900 text-xs text-slate-100 rounded-lg px-3 py-2 border border-slate-700"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. Overtime & Night Shift */}
            {activeInputSection === 'overtime' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white">Fazla Çalışma ve Vardiya Primleri</h3>
                  <p className="text-xs text-slate-400">
                    TİS sözleşmesindeki zamlı çarpanlara göre mesai saat ve günleri.
                  </p>
                </div>

                {/* Normal Overtime */}
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-200">Normal Fazla Çalışma (Saat)</span>
                    <p className="text-[11px] text-slate-400">
                      TİS Çarpanı: %{Math.round(tisConfig.normalOvertimeMultiplier * 100)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      min="0"
                      max="100"
                      value={employee.normalOvertimeHours}
                      onChange={(e) => updateField('normalOvertimeHours', parseFloat(e.target.value) || 0)}
                      onFocus={e => e.target.select()}
                      onClick={e => (e.target as HTMLInputElement).select()}
                      className="w-20 bg-slate-900 text-xs text-center font-bold text-slate-100 rounded-lg py-2 border border-slate-700"
                    />
                    <span className="text-xs font-semibold text-emerald-400 w-24 text-right">
                      {formatTRY(payroll.normalOvertimePay)}
                    </span>
                  </div>
                </div>

                {/* Weekend Overtime */}
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-200">Hafta Tatili Çalışması (Gün)</span>
                    <p className="text-[11px] text-slate-400">
                      TİS Çarpanı: %{Math.round(tisConfig.weekendOvertimeMultiplier * 100)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      min="0"
                      max="8"
                      value={employee.weekendOvertimeDays}
                      onChange={(e) => updateField('weekendOvertimeDays', parseFloat(e.target.value) || 0)}
                      onFocus={e => e.target.select()}
                      onClick={e => (e.target as HTMLInputElement).select()}
                      className="w-20 bg-slate-900 text-xs text-center font-bold text-slate-100 rounded-lg py-2 border border-slate-700"
                    />
                    <span className="text-xs font-semibold text-emerald-400 w-24 text-right">
                      {formatTRY(payroll.weekendOvertimePay)}
                    </span>
                  </div>
                </div>

                {/* Holiday Overtime */}
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-200">Bayram / Genel Tatil (Gün)</span>
                    <p className="text-[11px] text-slate-400">
                      TİS Çarpanı: %{Math.round(tisConfig.holidayOvertimeMultiplier * 100)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      min="0"
                      max="15"
                      value={employee.holidayOvertimeDays}
                      onChange={(e) => updateField('holidayOvertimeDays', parseFloat(e.target.value) || 0)}
                      onFocus={e => e.target.select()}
                      onClick={e => (e.target as HTMLInputElement).select()}
                      className="w-20 bg-slate-900 text-xs text-center font-bold text-slate-100 rounded-lg py-2 border border-slate-700"
                    />
                    <span className="text-xs font-semibold text-emerald-400 w-24 text-right">
                      {formatTRY(payroll.holidayOvertimePay)}
                    </span>
                  </div>
                </div>

                {/* Night Shift Hours */}
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-200">Gece Vardiyası (Saat)</span>
                    <p className="text-[11px] text-slate-400">
                      Gece Zammı: %{Math.round(tisConfig.nightShiftAllowanceRate * 100)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      min="0"
                      max="200"
                      value={employee.nightShiftHours}
                      onChange={(e) => updateField('nightShiftHours', parseFloat(e.target.value) || 0)}
                      onFocus={e => e.target.select()}
                      onClick={e => (e.target as HTMLInputElement).select()}
                      className="w-20 bg-slate-900 text-xs text-center font-bold text-slate-100 rounded-lg py-2 border border-slate-700"
                    />
                    <span className="text-xs font-semibold text-emerald-400 w-24 text-right">
                      {formatTRY(payroll.nightShiftPay)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Social Allowances */}
            {activeInputSection === 'social' && (
              <div className="space-y-3.5">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white">TİS Sosyal Yardımları & Ödenekleri</h3>
                  <p className="text-xs text-slate-400">
                    Mevzuat istisnaları (SGK & Vergi muafiyetleri) sistem tarafından otomatik uygulanır.
                  </p>
                </div>

                {/* Food Aid */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">Yemek Yardımı (Nakdi)</span>
                    <span className="text-xs font-bold text-emerald-400">
                      {formatTRY(payroll.foodAidGross)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">Günlük Tutar (₺)</label>
                      <input
                        type="number"
                        inputMode="decimal"
                        pattern="[0-9]*[.,]?[0-9]*"
                        value={employee.foodDailyAmount}
                        onChange={(e) => updateField('foodDailyAmount', parseFloat(e.target.value) || 0)}
                        onFocus={e => e.target.select()}
                        onClick={e => (e.target as HTMLInputElement).select()}
                        className="w-full bg-slate-900 text-xs text-slate-100 rounded px-2.5 py-1.5 border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">Yemek Günü Sayısı</label>
                      <input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={employee.foodDays}
                        onChange={(e) => updateField('foodDays', parseInt(e.target.value) || 0)}
                        onFocus={e => e.target.select()}
                        onClick={e => (e.target as HTMLInputElement).select()}
                        className="w-full bg-slate-900 text-xs text-slate-100 rounded px-2.5 py-1.5 border border-slate-700"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    * Yasal Günlük İstisna: {tisConfig.foodAidDailyExemption} ₺ (İstisna tutarı SGK ve GV matrahından muaf tutulur).
                  </p>
                </div>

                {/* Transport & Fuel */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <label className="block text-xs font-semibold text-slate-200 mb-1">Ulaşım / Yol (₺/Ay)</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      value={employee.transportMonthlyAmount}
                      onChange={(e) => updateField('transportMonthlyAmount', parseFloat(e.target.value) || 0)}
                      onFocus={e => e.target.select()}
                      onClick={e => (e.target as HTMLInputElement).select()}
                      className="w-full bg-slate-900 text-xs text-slate-100 rounded px-2.5 py-1.5 border border-slate-700"
                    />
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <label className="block text-xs font-semibold text-slate-200 mb-1">Yakacak Yardımı (₺/Ay)</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      value={employee.fuelAidMonthly}
                      onChange={(e) => updateField('fuelAidMonthly', parseFloat(e.target.value) || 0)}
                      onFocus={e => e.target.select()}
                      onClick={e => (e.target as HTMLInputElement).select()}
                      className="w-full bg-slate-900 text-xs text-slate-100 rounded px-2.5 py-1.5 border border-slate-700"
                    />
                  </div>
                </div>

                {/* Family & Child Aid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-200">Aile / Eş Yardımı</label>
                      <input
                        type="checkbox"
                        checked={employee.hasFamilyAid}
                        onChange={(e) => updateField('hasFamilyAid', e.target.checked)}
                        className="rounded border-slate-700 text-emerald-500 w-4 h-4 cursor-pointer"
                      />
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold">
                      {employee.hasFamilyAid ? formatTRY(tisConfig.defaultFamilyAidAmount) : 'Yok'}
                    </span>
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <label className="block text-xs font-semibold text-slate-200 mb-1">Çocuk Sayısı</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      min="0"
                      max="10"
                      value={employee.childCount}
                      onChange={(e) => updateField('childCount', parseInt(e.target.value) || 0)}
                      onFocus={e => e.target.select()}
                      onClick={e => (e.target as HTMLInputElement).select()}
                      className="w-full bg-slate-900 text-xs text-slate-100 rounded px-2.5 py-1.5 border border-slate-700"
                    />
                  </div>
                </div>

                {/* Additional Allowances */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <label className="block text-xs font-semibold text-slate-200 mb-1">Giyim / Hijyen (₺)</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      value={employee.clothingSocialAid}
                      onChange={(e) => updateField('clothingSocialAid', parseFloat(e.target.value) || 0)}
                      onFocus={e => e.target.select()}
                      onClick={e => (e.target as HTMLInputElement).select()}
                      className="w-full bg-slate-900 text-xs text-slate-100 rounded px-2.5 py-1.5 border border-slate-700"
                    />
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <label className="block text-xs font-semibold text-slate-200 mb-1">Sorumluluk/Kasa (₺)</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      value={employee.responsibilityRiskBonus}
                      onChange={(e) => updateField('responsibilityRiskBonus', parseFloat(e.target.value) || 0)}
                      onFocus={e => e.target.select()}
                      onClick={e => (e.target as HTMLInputElement).select()}
                      className="w-full bg-slate-900 text-xs text-slate-100 rounded px-2.5 py-1.5 border border-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <label className="block text-xs font-semibold text-slate-200 mb-1">Bayram Harçlığı (₺)</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      value={employee.religiousHolidayBonus}
                      onChange={(e) => updateField('religiousHolidayBonus', parseFloat(e.target.value) || 0)}
                      onFocus={e => e.target.select()}
                      onClick={e => (e.target as HTMLInputElement).select()}
                      className="w-full bg-slate-900 text-xs text-slate-100 rounded px-2.5 py-1.5 border border-slate-700"
                    />
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <label className="block text-xs font-semibold text-slate-200 mb-1">Öğrenim Yardımı (₺)</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      value={employee.educationAid}
                      onChange={(e) => updateField('educationAid', parseFloat(e.target.value) || 0)}
                      onFocus={e => e.target.select()}
                      onClick={e => (e.target as HTMLInputElement).select()}
                      className="w-full bg-slate-900 text-xs text-slate-100 rounded px-2.5 py-1.5 border border-slate-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. Deductions & Cumulative Base */}
            {activeInputSection === 'deductions' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white">Sendika Aidatı, BES ve Vergi Matrahı Devri</h3>
                  <p className="text-xs text-slate-400">
                    Sendika aidatı GVK 63/4 uyarınca vergi matrahından düşülür.
                  </p>
                </div>

                {/* Union Membership & Dues */}
                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="unionMemberCheck"
                        checked={employee.isUnionMember}
                        onChange={(e) => updateField('isUnionMember', e.target.checked)}
                        className="rounded border-slate-700 text-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="unionMemberCheck" className="text-xs font-semibold text-slate-200 cursor-pointer">
                        Sendika Üyesi (TİS Kapsamında)
                      </label>
                    </div>
                    {employee.isUnionMember && (
                      <span className="text-xs font-bold text-rose-400">
                        Kesinti: {formatTRY(payroll.unionDuesAmount)}
                      </span>
                    )}
                  </div>

                  {employee.isUnionMember && (
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <span className="text-xs text-slate-400">Aidat Kesinti Yöntemi:</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => updateField('unionDuesType', 'one_day')}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                            employee.unionDuesType === 'one_day'
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-slate-900 text-slate-300 border-slate-700'
                          }`}
                        >
                          1 Günlük Yevmiye (TİS Standart)
                        </button>
                        <button
                          type="button"
                          onClick={() => updateField('unionDuesType', 'percent')}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                            employee.unionDuesType === 'percent'
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-slate-900 text-slate-300 border-slate-700'
                          }`}
                        >
                          Oransal Kesinti (%3.33)
                        </button>
                      </div>
                      <p className="text-[11px] text-emerald-400/90">
                        ✓ Yasal Avantaj: Sendika aidatı Gelir Vergisi matrahından tenzil edilmiştir.
                      </p>
                    </div>
                  )}
                </div>

                {/* BES Checkbox */}
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="besCheck"
                      checked={employee.isBesEnrolled}
                      onChange={(e) => updateField('isBesEnrolled', e.target.checked)}
                      className="rounded border-slate-700 text-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <label htmlFor="besCheck" className="text-xs font-semibold text-slate-200 cursor-pointer">
                        Otomatik BES Katılımı (%3)
                      </label>
                      <p className="text-[11px] text-slate-400">SGK matrahı üzerinden %3 kesilir</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-rose-400">
                    {employee.isBesEnrolled ? formatTRY(payroll.besDeductionAmount) : '0,00 ₺'}
                  </span>
                </div>

                {/* Private Deductions (Court, Advance) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <label className="block text-xs font-semibold text-slate-200 mb-1">İcra Kesintisi (₺)</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      value={employee.courtGarnishment}
                      onChange={(e) => updateField('courtGarnishment', parseFloat(e.target.value) || 0)}
                      onFocus={e => e.target.select()}
                      onClick={e => (e.target as HTMLInputElement).select()}
                      className="w-full bg-slate-900 text-xs text-slate-100 rounded px-2.5 py-1.5 border border-slate-700"
                    />
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <label className="block text-xs font-semibold text-slate-200 mb-1">Maaş Avansı (₺)</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      value={employee.salaryAdvance}
                      onChange={(e) => updateField('salaryAdvance', parseFloat(e.target.value) || 0)}
                      onFocus={e => e.target.select()}
                      onClick={e => (e.target as HTMLInputElement).select()}
                      className="w-full bg-slate-900 text-xs text-slate-100 rounded px-2.5 py-1.5 border border-slate-700"
                    />
                  </div>
                </div>

                {/* Cumulative Tax Base Start */}
                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-200">
                      Önceki Aylardan Devreden Küm. GV Matrahı
                    </label>
                    <span className="text-xs text-amber-400 font-bold">
                      Dilim: {payroll.effectiveTaxBracketRates}
                    </span>
                  </div>
                  <input
                    type="number"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    step="100"
                    value={employee.cumulativeTaxBaseStart}
                    onChange={(e) => updateField('cumulativeTaxBaseStart', parseFloat(e.target.value) || 0)}
                    onFocus={e => e.target.select()}
                    onClick={e => (e.target as HTMLInputElement).select()}
                    className="w-full bg-slate-900 text-sm font-semibold text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-amber-400"
                  />
                  <p className="text-[11px] text-slate-400">
                    * Ay sonundaki kümülatif matrah: {formatTRY(payroll.cumulativeTaxBaseAfter)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Detailed Financial Breakdown (7 Columns in xl) */}
        <div className="xl:col-span-7 space-y-5">
          {/* Minimum Wage Tax Exemption (7349) Highlight Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Vergi Hesaplaması & 7349 Sayılı Kanun Asgari Ücret İstisnası
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                Vergi Dilimi: {payroll.effectiveTaxBracketRates}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Hesaplanan Gelir Vergisi</span>
                <span className="text-sm font-bold text-slate-200 mt-1 block">
                  {formatTRY(payroll.calculatedIncomeTax)}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Matrah: {formatTRY(payroll.incomeTaxBaseCurrentMonth)}</span>
              </div>
              <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-800/50">
                <span className="text-emerald-300 block text-[11px] font-semibold">Asgari Ücret İstisnası (7349)</span>
                <span className="text-sm font-bold text-emerald-400 mt-1 block">
                  - {formatTRY(payroll.minWageIncomeTaxExemption)}
                </span>
                <span className="text-[10px] text-emerald-300/70 mt-0.5 block">Devlet Tarafından Karşılanan</span>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
                <span className="text-rose-300 block text-[11px] font-semibold">Personelden Kesilen Net GV</span>
                <span className="text-sm font-bold text-rose-400 mt-1 block">
                  {formatTRY(payroll.payableIncomeTax)}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Damga Vergisi: {formatTRY(payroll.payableStampTax)}</span>
              </div>
            </div>
          </div>

          {/* Detailed Itemized Earnings (Kazançlar) Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <span>Brüt Kazanç Kalemleri Dağılımı</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                  {payroll.earningItems.length} Kalem
                </span>
              </h3>
              <span className="text-xs font-bold text-emerald-400">
                Toplam Brüt: {formatTRY(payroll.totalGrossWage)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/40 text-slate-400 border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Kod</th>
                    <th className="py-2.5 px-4 font-semibold">Kazanç Kalemi</th>
                    <th className="py-2.5 px-4 font-semibold text-center">SGK Durumu</th>
                    <th className="py-2.5 px-4 font-semibold text-center">GV Durumu</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Brüt Tutar (₺)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {payroll.earningItems.map((item) => (
                    <tr key={item.code} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-4 font-mono text-slate-500">{item.code}</td>
                      <td className="py-2.5 px-4 font-medium text-slate-200">
                        {item.name}
                        {item.notes && (
                          <span className="block text-[10px] text-slate-400 mt-0.5">{item.notes}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        {item.sgkExemptAmount > 0 ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800">
                            Kısmi İstisna
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Tabi</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        {item.incomeTaxExemptAmount > 0 ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800">
                            Kısmi İstisna
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Tabi</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-white">
                        {formatTRY(item.grossAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deductions (Kesintiler) Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Yasal ve TİS Özel Kesintileri
              </h3>
              <span className="text-xs font-bold text-rose-400">
                Toplam Kesinti: {formatTRY(payroll.totalDeductions)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/40 text-slate-400 border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Kod</th>
                    <th className="py-2.5 px-4 font-semibold">Kesinti Kalemi</th>
                    <th className="py-2.5 px-4 font-semibold">Tür</th>
                    <th className="py-2.5 px-4 font-semibold">Hesaplama / Oran</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Kesilen Tutar (₺)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {payroll.deductionItems.map((item) => (
                    <tr key={item.code} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-4 font-mono text-slate-500">{item.code}</td>
                      <td className="py-2.5 px-4 font-medium text-slate-200">{item.name}</td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            item.type === 'legal'
                              ? 'bg-blue-950 text-blue-300 border border-blue-800/60'
                              : 'bg-purple-950 text-purple-300 border border-purple-800/60'
                          }`}
                        >
                          {item.type === 'legal' ? 'Yasal' : 'TİS / Özel'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                        {item.rateOrFormula || '-'}
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-rose-400">
                        {formatTRY(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Employer Cost (İşveren Maliyeti) Footnote Bar */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-200 block">Kurum / İşveren Toplam Yükü</span>
              <span className="text-[11px] text-slate-400">
                SGK İşveren (%15.5): {formatTRY(payroll.sgkEmployerAmount)} + İşsizlik İşveren (%2): {formatTRY(payroll.unemploymentEmployerAmount)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Toplam Maliyet</span>
              <span className="text-base font-extrabold text-blue-400">{formatTRY(payroll.totalEmployerCost)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
