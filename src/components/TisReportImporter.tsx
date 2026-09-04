import React, { useState } from 'react';
import { TisParameters, EmployeeInput, TisReportNote } from '../types';
import { formatTRY } from '../utils/payrollCalculator';
import {
  FileText,
  FileSpreadsheet,
  Sparkles,
  CheckCircle2,
  Copy,
  UploadCloud,
  FileCheck,
  ArrowRight,
  BookOpen,
  Info
} from 'lucide-react';

interface TisReportImporterProps {
  tisConfig: TisParameters;
  onUpdateTisConfig: (config: TisParameters) => void;
  employee: EmployeeInput;
  onUpdateEmployee: (emp: EmployeeInput) => void;
  onNavigateToCalculator: () => void;
}

const SAMPLE_TIS_REPORTS: Record<string, { title: string; content: string }> = {
  kamu_ornek: {
    title: 'Örnek Kamu Çerçeve TİS Protokolü & Bordro Raporu',
    content: `TOPLU İŞ SÖZLEŞMESİ HESAPLAMA VE UYGULAMA RAPORU

Madde 1 - Taban Ücret ve Yevmiyeler:
İşçilerin günlük brüt çıplak yevmiyesi 1.450,00 TL olarak belirlenmiştir. Aylık 30 günlük temel brüt 43.500,00 TL'dir.

Madde 2 - Hizmet / Kıdem Zammı:
İşçilere her tam kıdem yılı için günlük brüt 18,50 TL kıdem zammı ödenir. (Örn: 7 yıl kıdemi olan işçi için: 7 x 18,50 = 129,50 TL/gün x 30 = 3.885,00 TL/ay brüt).

Madde 3 - İkramiye ve İlave Tediye:
Yılda toplam 60 günlük çıplak yevmiye tutarında akdi ikramiye ödenir. Ödemeler Mart, Haziran, Eylül ve Aralık aylarında 15'er günlük eşit dilimler halinde yapılır.

Madde 4 - Fazla Çalışma ve Tatil Mesaileri:
a) Normal fazla çalışma saat ücreti, normal saat ücretinin %160 zamlısı olarak ödenir (Çarpan: 1.60).
b) Hafta tatili günü çalışan işçiye 2 yevmiye ödenir (Çarpan: 2.00).
c) Ulusal bayram ve genel tatil günlerinde çalıştırılan işçilere ilave 2 yevmiye ödenir (Toplam 3 yevmiye, Çarpan: 3.00).
d) Gece vardiyasında (20:00 - 06:00) çalışan personele saatlik brüt %15 gece çalışma zammı tahakkuk ettirilir.

Madde 5 - Sosyal Yardımlar:
a) Yemek Yardımı: Fiilen çalışılan her gün için brüt 260,00 TL nakdi yemek yardımı verilir. (Günlük yasal istisna tutarı düşüldükten sonra kalan kısım vergiye tabidir).
b) Yol / Servis Yardımı: Aylık brüt 1.800,00 TL nakdi ulaşım bedeli ödenir.
c) Yakacak Yardımı: Her ay brüt 1.500,00 TL yakacak yardımı ödenir.
d) Aile ve Çocuk Yardımı: Eşi çalışmayan işçiye aylık 1.200,00 TL aile yardımı, her çocuk için 350,00 TL çocuk yardımı (en fazla 2 çocuk için SGK istisnası uygulanır).
e) Koruyucu Giyim ve Hijyen Paketi: Aylık brüt 850,00 TL ödenir.

Madde 6 - Sendika Aidatı:
Sendika üyesi personelden her ay 1 günlük çıplak brüt yevmiyesi tutarında sendika aidatı kesilir. 193 Sayılı GVK Madde 63/4 gereğince kesilen aidat Gelir Vergisi matrahından indirilir.`
  },
  belediye_ornek: {
    title: 'Örnek Belediye İştirak Şirketi TİS Maddeleri',
    content: `BELEDİYE PERSONEL A.Ş. TOPLU İŞ SÖZLEŞMESİ VE BORDRO ŞABLONU

1. Ücret Seviyesi:
Saha ve teknik personelin günlük brüt çıplak taban yevmiyesi 1.620,00 TL'dir.

2. İkramiyeler:
Yılda 112 gün ikramiye (Her 2 ayda bir 18.66 gün veya yılda 4 defa 28 gün) olarak tahakkuk ettirilir.

3. Kıdem Zammı:
Hizmet yılı başına günlük 22,00 TL ilave kıdem tazminatı verilir.

4. Sosyal Yardımlar:
- Nakdi Yemek: Günlük 280,00 TL
- Nakdi Ulaşım Kartı: Aylık 2.100,00 TL
- Yakacak Yardımı: Aylık 1.800,00 TL
- Bayram Harçlığı: Ramazan ve Kurban bayramlarında 4.500,00 TL
- Normal Fazla Mesai Çarpanı: %170 (1.70)
- Hafta Tatili: %250 (2.50)
- Bayram Mesaisi: %350 (3.50)`
  }
};

export const TisReportImporter: React.FC<TisReportImporterProps> = ({
  tisConfig,
  onUpdateTisConfig,
  employee,
  onUpdateEmployee,
  onNavigateToCalculator,
}) => {
  const [reportText, setReportText] = useState<string>(SAMPLE_TIS_REPORTS.kamu_ornek.content);
  const [reportTitle, setReportTitle] = useState<string>('TİS Sözleşme ve Formül Raporu');
  const [extractedData, setExtractedData] = useState<{
    dailyWage?: number;
    seniorityPay?: number;
    bonusDays?: number;
    overtimeRate?: number;
    holidayRate?: number;
    nightRate?: number;
    foodDaily?: number;
    transportMonthly?: number;
    fuelMonthly?: number;
  }>({});
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);

  // Parse TİS Text using regex heuristic rules
  const handleAnalyzeReport = () => {
    const text = reportText;
    const extracted: typeof extractedData = {};

    // 1. Daily Wage
    const wageMatch = text.match(/(?:yevmiye|yevmiyesi|taban\s*ücret)[\s\w:]*?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?|\d+)\s*(?:TL|₺)/i);
    if (wageMatch) {
      const cleanNum = parseFloat(wageMatch[1].replace(/\./g, '').replace(',', '.'));
      if (cleanNum > 100) extracted.dailyWage = cleanNum;
    }

    // 2. Seniority Pay
    const seniorityMatch = text.match(/(?:kıdem|hizmet)\s*(?:zammı|primi)[\s\w:]*?(\d{1,3}(?:[.,]\d{2})?|\d+)\s*(?:TL|₺)/i);
    if (seniorityMatch) {
      const cleanNum = parseFloat(seniorityMatch[1].replace(',', '.'));
      if (cleanNum > 0) extracted.seniorityPay = cleanNum;
    }

    // 3. Bonus Days
    const bonusMatch = text.match(/(\d{2,3})\s*(?:gün|günlük)\s*(?:çıplak\s*yevmiye|ikramiye|tediye)/i);
    if (bonusMatch) {
      const cleanNum = parseInt(bonusMatch[1]);
      if (cleanNum > 0) extracted.bonusDays = cleanNum;
    }

    // 4. Overtime Multipliers
    const otMatch = text.match(/(?:normal\s*fazla\s*çalışma|fazla\s*mesai)[\s\w:]*?%?\s*(\d{2,3})/i);
    if (otMatch) {
      const pct = parseInt(otMatch[1]);
      if (pct >= 50 && pct <= 100) extracted.overtimeRate = 1 + pct / 100;
      else if (pct > 100 && pct <= 300) extracted.overtimeRate = pct / 100;
    }

    // 5. Holiday Overtime Multiplier
    const holidayMatch = text.match(/(?:bayram|genel\s*tatil)[\s\w:]*?(?:%?\s*(\d{2,3})|(\d)\s*yevmiye)/i);
    if (holidayMatch) {
      if (holidayMatch[1]) {
        const pct = parseInt(holidayMatch[1]);
        if (pct >= 100) extracted.holidayRate = pct / 100;
      } else if (holidayMatch[2]) {
        extracted.holidayRate = parseInt(holidayMatch[2]);
      }
    }

    // 6. Food Aid
    const foodMatch = text.match(/yemek\s*yardımı[\s\w:]*?(\d{2,3}(?:[.,]\d{2})?)\s*(?:TL|₺)/i);
    if (foodMatch) {
      extracted.foodDaily = parseFloat(foodMatch[1].replace(',', '.'));
    }

    // 7. Transport Aid
    const transportMatch = text.match(/(?:ulaşım|yol)\s*(?:yardımı|bedeli)[\s\w:]*?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?|\d+)\s*(?:TL|₺)/i);
    if (transportMatch) {
      extracted.transportMonthly = parseFloat(transportMatch[1].replace(/\./g, '').replace(',', '.'));
    }

    // 8. Fuel Aid
    const fuelMatch = text.match(/yakacak\s*yardımı[\s\w:]*?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?|\d+)\s*(?:TL|₺)/i);
    if (fuelMatch) {
      extracted.fuelMonthly = parseFloat(fuelMatch[1].replace(/\./g, '').replace(',', '.'));
    }

    setExtractedData(extracted);
    setAppliedSuccess(false);
  };

  // Apply extracted parameters to current TİS and Employee state
  const handleApplyToRobot = () => {
    // Update TIS configuration
    const updatedTis: TisParameters = {
      ...tisConfig,
      seniorityPayPerYear: extractedData.seniorityPay ?? tisConfig.seniorityPayPerYear,
      annualBonusDaysTotal: extractedData.bonusDays ?? tisConfig.annualBonusDaysTotal,
      normalOvertimeMultiplier: extractedData.overtimeRate ?? tisConfig.normalOvertimeMultiplier,
      holidayOvertimeMultiplier: extractedData.holidayRate ?? tisConfig.holidayOvertimeMultiplier,
      defaultDailyFoodAid: extractedData.foodDaily ?? tisConfig.defaultDailyFoodAid,
      defaultMonthlyTransportAid: extractedData.transportMonthly ?? tisConfig.defaultMonthlyTransportAid,
      defaultMonthlyFuelAid: extractedData.fuelMonthly ?? tisConfig.defaultMonthlyFuelAid,
    };
    onUpdateTisConfig(updatedTis);

    // Update Employee state
    const updatedEmployee: EmployeeInput = {
      ...employee,
      baseDailyWage: extractedData.dailyWage ?? employee.baseDailyWage,
      customSeniorityPayDaily: extractedData.seniorityPay ?? employee.customSeniorityPayDaily,
      foodDailyAmount: extractedData.foodDaily ?? employee.foodDailyAmount,
      transportMonthlyAmount: extractedData.transportMonthly ?? employee.transportMonthlyAmount,
      fuelAidMonthly: extractedData.fuelMonthly ?? employee.fuelAidMonthly,
    };
    onUpdateEmployee(updatedEmployee);

    setAppliedSuccess(true);
  };

  const loadSample = (key: string) => {
    if (SAMPLE_TIS_REPORTS[key]) {
      setReportTitle(SAMPLE_TIS_REPORTS[key].title);
      setReportText(SAMPLE_TIS_REPORTS[key].content);
      setExtractedData({});
      setAppliedSuccess(false);
    }
  };

  return (
    <div className="w-full flex-1 p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              TİS Sözleşme Metni, Formül ve Örnek Bordro Aktarma İstasyonu
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Vereceğiniz Toplu İş Sözleşmesi maddelerini, formülleri veya bordro dökümlerini buraya yapıştırıp analiz edebilir ve tek tıkla robotun hesaplama motoruna aktarabilirsiniz.
          </p>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Hazır Rapor Örneği:</span>
          <button
            onClick={() => loadSample('kamu_ornek')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 cursor-pointer"
          >
            Kamu Çerçeve TİS
          </button>
          <button
            onClick={() => loadSample('belediye_ornek')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 cursor-pointer"
          >
            Belediye TİS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Big Paste Area & Editor (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-300" />
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="bg-transparent text-xs font-bold text-white border-b border-transparent hover:border-slate-700 focus:border-emerald-500 focus:outline-none w-80 px-1 py-0.5"
                placeholder="Rapor Başlığı..."
              />
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {reportText.length} Karakter
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Sözleşme Maddeleri / Rapor / Formüller Metin Alanı:
            </label>
            <textarea
              rows={16}
              value={reportText}
              onChange={(e) => {
                setReportText(e.target.value);
                setAppliedSuccess(false);
              }}
              placeholder="TİS metnini, ücret maddelerini, yevmiye tutarlarını, ikramiye gün sayılarını ve sosyal yardımları buraya yapıştırabilirsiniz..."
              className="w-full bg-slate-950 font-mono text-xs text-slate-200 rounded-lg p-4 border border-slate-700 focus:border-emerald-500 focus:outline-none leading-relaxed resize-y"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setReportText('')}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Metni Temizle
            </button>

            <button
              onClick={handleAnalyzeReport}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Metni Tara ve Parametreleri Ayrıştır</span>
            </button>
          </div>
        </div>

        {/* Right Column: Parsed Results & One-Click Apply (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Ayrıştırılan TİS Parametreleri</span>
              </h3>
              {Object.keys(extractedData).length > 0 && (
                <span className="text-[10px] font-semibold bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                  {Object.keys(extractedData).length} Parametre Bulundu
                </span>
              )}
            </div>

            {Object.keys(extractedData).length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-3">
                <Info className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs max-w-sm mx-auto">
                  Sol tarafa TİS rapor metnini veya örnek bordroyu yapıştırdıktan sonra <strong>"Metni Tara ve Parametreleri Ayrıştır"</strong> butonuna tıklayınız.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                {extractedData.dailyWage !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Çıplak Günlük Yevmiye:</span>
                    <span className="font-bold text-emerald-400 font-mono text-sm">
                      {formatTRY(extractedData.dailyWage)}
                    </span>
                  </div>
                )}

                {extractedData.seniorityPay !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Kıdem Zammı (Yıl Başına Günlük):</span>
                    <span className="font-bold text-slate-200 font-mono">
                      {formatTRY(extractedData.seniorityPay)} / Gün
                    </span>
                  </div>
                )}

                {extractedData.bonusDays !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Yıllık İkramiye Gün Sayısı:</span>
                    <span className="font-bold text-amber-300 font-mono">
                      {extractedData.bonusDays} Günlük
                    </span>
                  </div>
                )}

                {extractedData.overtimeRate !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Normal Fazla Mesai Çarpanı:</span>
                    <span className="font-bold text-slate-200 font-mono">
                      %{Math.round(extractedData.overtimeRate * 100)} ({extractedData.overtimeRate}x)
                    </span>
                  </div>
                )}

                {extractedData.holidayRate !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Bayram Mesaisi Çarpanı:</span>
                    <span className="font-bold text-slate-200 font-mono">
                      %{Math.round(extractedData.holidayRate * 100)} ({extractedData.holidayRate}x)
                    </span>
                  </div>
                )}

                {extractedData.foodDaily !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Nakdi Yemek Yardımı:</span>
                    <span className="font-bold text-slate-200 font-mono">
                      {formatTRY(extractedData.foodDaily)} / Gün
                    </span>
                  </div>
                )}

                {extractedData.transportMonthly !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Ulaşım / Yol Yardımı:</span>
                    <span className="font-bold text-slate-200 font-mono">
                      {formatTRY(extractedData.transportMonthly)} / Ay
                    </span>
                  </div>
                )}

                {extractedData.fuelMonthly !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Yakacak / Isınma Yardımı:</span>
                    <span className="font-bold text-slate-200 font-mono">
                      {formatTRY(extractedData.fuelMonthly)} / Ay
                    </span>
                  </div>
                )}

                {/* Apply Button */}
                <div className="pt-2">
                  <button
                    onClick={handleApplyToRobot}
                    className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Bu Değerleri Robota Aktar ve Uygula</span>
                  </button>
                </div>
              </div>
            )}

            {/* Success Feedback */}
            {appliedSuccess && (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/70 rounded-lg text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Parametreler Başarıyla Bordro Robotuna Aktarıldı!</span>
                </div>
                <p className="text-emerald-200/80">
                  TİS katsayıları ve personel yevmiyesi güncellendi. Anlık hesaplamayı görmek için aylık bordro editörüne geçebilirsiniz.
                </p>
                <button
                  onClick={onNavigateToCalculator}
                  className="flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 rounded transition-colors cursor-pointer"
                >
                  <span>Aylık Bordroya Git</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
