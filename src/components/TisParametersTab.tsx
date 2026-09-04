import React from 'react';
import { TisParameters, TaxBracket } from '../types';
import { formatTRY } from '../utils/payrollCalculator';
import { Settings2, RotateCcw, Save, CheckCircle2, ShieldCheck, Percent, HelpCircle } from 'lucide-react';
import { DEFAULT_TIS_TEMPLATES } from '../constants/defaultTisConfig';

interface TisParametersTabProps {
  tisConfig: TisParameters;
  onChangeConfig: (config: TisParameters) => void;
  onResetToDefaults: () => void;
}

export const TisParametersTab: React.FC<TisParametersTabProps> = ({
  tisConfig,
  onChangeConfig,
  onResetToDefaults,
}) => {
  const updateField = <K extends keyof TisParameters>(field: K, value: TisParameters[K]) => {
    onChangeConfig({
      ...tisConfig,
      [field]: value,
    });
  };

  const updateTaxBracket = (index: number, field: 'limit' | 'rate', value: number) => {
    const updated = [...tisConfig.taxBrackets];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChangeConfig({
      ...tisConfig,
      taxBrackets: updated,
    });
  };

  return (
    <div className="w-full flex-1 p-6 space-y-6 max-w-[1500px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              TİS Sözleşme Katsayıları ve Yasal Mevzuat Parametreleri
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Toplu İş Sözleşmesi maddelerindeki oranlar, vergi dilimleri ve SGK istisna sınırlarını buradan yönetebilirsiniz.
          </p>
        </div>

        <button
          onClick={onResetToDefaults}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Varsayılan TİS Değerlerine Dön</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: TİS Contract Multipliers & Overtime */}
        <div className="space-y-6">
          {/* Overtime Multipliers */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span>TİS Fazla Mesai ve Vardiya Çarpanları</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Normal Fazla Çalışma Oranı</span>
                  <span className="text-[11px] text-slate-400">Yasal zorunlu: %150 (TİS'lerde %160-%200)</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="3.0"
                    value={tisConfig.normalOvertimeMultiplier}
                    onChange={(e) => updateField('normalOvertimeMultiplier', parseFloat(e.target.value) || 1.5)}
                    className="w-20 bg-slate-900 text-xs text-center font-bold text-emerald-400 rounded px-2 py-1.5 border border-slate-700"
                  />
                  <span className="font-mono text-slate-400 font-bold">x Yevmiye</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Hafta Tatili Çalışma Çarpanı</span>
                  <span className="text-[11px] text-slate-400">TİS standardı: %200 - %250</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="4.0"
                    value={tisConfig.weekendOvertimeMultiplier}
                    onChange={(e) => updateField('weekendOvertimeMultiplier', parseFloat(e.target.value) || 2.0)}
                    className="w-20 bg-slate-900 text-xs text-center font-bold text-emerald-400 rounded px-2 py-1.5 border border-slate-700"
                  />
                  <span className="font-mono text-slate-400 font-bold">x Yevmiye</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Bayram / Genel Tatil Çalışma Çarpanı</span>
                  <span className="text-[11px] text-slate-400">TİS standardı: %300 - %400 (1+2 veya 1+3)</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="1.0"
                    max="5.0"
                    value={tisConfig.holidayOvertimeMultiplier}
                    onChange={(e) => updateField('holidayOvertimeMultiplier', parseFloat(e.target.value) || 3.0)}
                    className="w-20 bg-slate-900 text-xs text-center font-bold text-emerald-400 rounded px-2 py-1.5 border border-slate-700"
                  />
                  <span className="font-mono text-slate-400 font-bold">x Yevmiye</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Gece Çalışma Vardiya Zammı (%)</span>
                  <span className="text-[11px] text-slate-400">20:00 - 06:00 arası saatlik zam oranı</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="0.5"
                    value={tisConfig.nightShiftAllowanceRate}
                    onChange={(e) => updateField('nightShiftAllowanceRate', parseFloat(e.target.value) || 0.15)}
                    className="w-20 bg-slate-900 text-xs text-center font-bold text-emerald-400 rounded px-2 py-1.5 border border-slate-700"
                  />
                  <span className="font-mono text-slate-400 font-bold">% Oran</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bonus & Seniority Rules */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              TİS İkramiye ve Kıdem Zammı Düzeni
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Yıllık Toplam İkramiye Gün Sayısı</span>
                  <span className="text-[11px] text-slate-400">Kamu: 60 gün | Belediye: 112 gün | Sanayi: 120 gün</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={tisConfig.annualBonusDaysTotal}
                  onChange={(e) => updateField('annualBonusDaysTotal', parseFloat(e.target.value) || 60)}
                  className="w-20 bg-slate-900 text-xs text-center font-bold text-emerald-400 rounded px-2 py-1.5 border border-slate-700"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Kıdem Zammı (Yıl Başına Günlük Ek ₺)</span>
                  <span className="text-[11px] text-slate-400">Her çalışma yılı için yevmiyeye eklenen TL</span>
                </div>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={tisConfig.seniorityPayPerYear}
                  onChange={(e) => updateField('seniorityPayPerYear', parseFloat(e.target.value) || 0)}
                  className="w-24 bg-slate-900 text-xs text-center font-bold text-emerald-400 rounded px-2 py-1.5 border border-slate-700"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">TİS Sendika Aidatı Gün Sayısı</span>
                  <span className="text-[11px] text-slate-400">Sendikalı işçiden her ay kesilen aidat miktarı</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="2"
                    value={tisConfig.unionDuesDays}
                    onChange={(e) => updateField('unionDuesDays', parseInt(e.target.value) || 1)}
                    className="w-16 bg-slate-900 text-xs text-center font-bold text-slate-200 rounded px-2 py-1.5 border border-slate-700"
                  />
                  <span className="text-slate-400">Günlük Yevmiye</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Legal Tax Brackets, Minimum Wage, Exemptions */}
        <div className="space-y-6">
          {/* Statutory Minimum Wage & Rates */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Yasal Asgari Ücret ve SGK Oranları
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Brüt Asgari Ücret (₺)</span>
                  <span className="text-[11px] text-slate-400">İstisnalar ve tavan bu tutara bağlıdır</span>
                </div>
                <input
                  type="number"
                  step="100"
                  value={tisConfig.minimumWageGross}
                  onChange={(e) => updateField('minimumWageGross', parseFloat(e.target.value) || 0)}
                  className="w-32 bg-slate-900 text-xs text-right font-bold text-emerald-400 rounded px-2.5 py-1.5 border border-slate-700"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">SGK Tavan Katsayısı</span>
                  <span className="text-[11px] text-slate-400">
                    Asgari Ücretin 7.5 katı: {formatTRY(tisConfig.minimumWageGross * tisConfig.sgkCeilingMultiplier)}
                  </span>
                </div>
                <input
                  type="number"
                  step="0.5"
                  value={tisConfig.sgkCeilingMultiplier}
                  onChange={(e) => updateField('sgkCeilingMultiplier', parseFloat(e.target.value) || 7.5)}
                  className="w-20 bg-slate-900 text-xs text-center font-bold text-slate-200 rounded px-2 py-1.5 border border-slate-700"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Günlük Yemek SGK/GV İstisna Tavanı (₺)</span>
                  <span className="text-[11px] text-slate-400">Bu tutara kadar olan yemek yardımı vergiden muaftır</span>
                </div>
                <input
                  type="number"
                  step="10"
                  value={tisConfig.foodAidDailyExemption}
                  onChange={(e) => updateField('foodAidDailyExemption', parseFloat(e.target.value) || 0)}
                  className="w-24 bg-slate-900 text-xs text-right font-bold text-slate-200 rounded px-2.5 py-1.5 border border-slate-700"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="incentiveCheck"
                    checked={tisConfig.employerIncentive5Percent}
                    onChange={(e) => updateField('employerIncentive5Percent', e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <label htmlFor="incentiveCheck" className="font-semibold text-slate-200 cursor-pointer block">
                      %5 Hazine Prim Teşviki (5510 SK)
                    </label>
                    <span className="text-[11px] text-slate-400">
                      SGK İşveren payı %20.5 yerine %15.5 olarak uygulanır
                    </span>
                  </div>
                </div>
                <span className="font-bold text-xs text-emerald-400">
                  {tisConfig.employerIncentive5Percent ? '%15.5' : '%20.5'}
                </span>
              </div>
            </div>
          </div>

          {/* Income Tax Brackets Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Gelir Vergisi Dilimleri ve Oranları
              </h3>
              <span className="text-[11px] text-slate-400">GVK Madde 103</span>
            </div>

            <div className="space-y-2 text-xs">
              {tisConfig.taxBrackets.map((bracket, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-950/70 rounded-lg border border-slate-800"
                >
                  <span className="font-semibold text-slate-300 w-24">
                    {idx + 1}. Dilim (%{Math.round(bracket.rate * 100)})
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">Üst Limit:</span>
                    {bracket.limit === Infinity ? (
                      <span className="font-mono font-bold text-slate-400 w-36 text-right">Sınırsız (Üzeri)</span>
                    ) : (
                      <input
                        type="number"
                        step="1000"
                        value={bracket.limit}
                        onChange={(e) => updateTaxBracket(idx, 'limit', parseFloat(e.target.value) || 0)}
                        className="w-36 bg-slate-900 text-xs text-right font-mono font-bold text-slate-200 rounded px-2.5 py-1 border border-slate-700"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
