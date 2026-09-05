export type WageType = 'daily' | 'monthly';

export interface TaxBracket {
  limit: number;
  rate: number;
}

export interface TisParameters {
  id: string;
  name: string;
  description: string;
  year: number;
  minimumWageGross: number;
  sgkCeilingMultiplier: number;
  sgkEmployeeRate: number;
  unemploymentEmployeeRate: number;
  sgkEmployerRate: number;
  unemploymentEmployerRate: number;
  employerIncentive5Percent: boolean;
  stampTaxRate: number;
  taxBrackets: TaxBracket[];
  foodAidDailyExemption: number;
  childAidExemptionPercent: number;
  familyAidExemptionPercent: number;
  normalOvertimeMultiplier: number;
  weekendOvertimeMultiplier: number;
  holidayOvertimeMultiplier: number;
  nightShiftAllowanceRate: number;
  seniorityPayPerYear: number;
  defaultMonthlyFuelAid: number;
  defaultDailyFoodAid: number;
  defaultMonthlyTransportAid: number;
  defaultFamilyAidAmount: number;
  defaultChildAidPerChild: number;
  defaultHygieneClothingAid: number;
  annualBonusDaysTotal: number;
  bonusMonths: number[];
  bonusDailyMultiplier: number;
  unionDuesDays: number;
  unionDuesPercentFallback: number;
}

export interface EmployeeInput {
  tcNo: string;
  fullName: string;
  department: string;
  jobTitle: string;
  startDate: string;
  seniorityYears: number;
  wageType: WageType;
  baseDailyWage: number;
  baseMonthlyGross: number;
  workedDays: number;
  weeklyRestDays: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  sickLeaveDays: number;
  totalPayableDays: number;
  normalOvertimeHours: number;
  weekendOvertimeDays: number;
  holidayOvertimeDays: number;
  nightShiftHours: number;
  hasBonusThisMonth: boolean;
  bonusDaysOverride?: number;
  applySeniorityPay: boolean;
  customSeniorityPayDaily?: number;
  foodAidType: 'cash' | 'ticket' | 'none';
  foodDailyAmount: number;
  foodDays: number;
  transportAidType: 'cash' | 'card' | 'none';
  transportMonthlyAmount: number;
  fuelAidMonthly: number;
  hasFamilyAid: boolean;
  childCount: number;
  religiousHolidayBonus: number;
  educationAid: number;
  clothingSocialAid: number;
  responsibilityRiskBonus: number;
  performanceBonus: number;
  isUnionMember: boolean;
  unionDuesType: 'one_day' | 'percent' | 'fixed';
  customUnionDuesAmount?: number;
  isBesEnrolled: boolean;
  courtGarnishment: number;
  salaryAdvance: number;
  otherPrivateDeductions: number;
  cumulativeTaxBaseStart: number;
  month: number;
}

export interface PayrollEarningItem {
  code: string;
  name: string;
  grossAmount: number;
  isSgkSubject: boolean;
  sgkExemptAmount: number;
  isIncomeTaxSubject: boolean;
  incomeTaxExemptAmount: number;
  isStampTaxSubject: boolean;
  notes?: string;
}

export interface PayrollDeductionItem {
  code: string;
  name: string;
  amount: number;
  type: 'legal' | 'special';
  rateOrFormula?: string;
}

export interface PayrollResult {
  month: number;
  monthName: string;
  year: number;
  days: {
    worked: number;
    weeklyRest: number;
    paidLeave: number;
    unpaidLeave: number;
    sickLeave: number;
    totalPaidDays: number;
  };
  baseGrossWage: number;
  seniorityPayTotal: number;
  bonusGross: number;
  normalOvertimePay: number;
  weekendOvertimePay: number;
  holidayOvertimePay: number;
  nightShiftPay: number;
  foodAidGross: number;
  transportAidGross: number;
  fuelAidGross: number;
  familyAidGross: number;
  childAidGross: number;
  socialAllowancesGross: number;
  earningItems: PayrollEarningItem[];
  totalGrossWage: number;
  sgkBase: number;
  sgkCeilingApplied: boolean;
  sgkEmployeeAmount: number;
  unemploymentEmployeeAmount: number;
  totalWorkerSgkDeduction: number;
  incomeTaxBaseCurrentMonth: number;
  cumulativeTaxBaseBefore: number;
  cumulativeTaxBaseAfter: number;
  effectiveTaxBracketRates: string;
  calculatedIncomeTax: number;
  minWageIncomeTaxExemption: number;
  payableIncomeTax: number;
  calculatedStampTax: number;
  minWageStampTaxExemption: number;
  payableStampTax: number;
  unionDuesAmount: number;
  besDeductionAmount: number;
  courtGarnishmentAmount: number;
  salaryAdvanceAmount: number;
  otherPrivateDeductionAmount: number;
  deductionItems: PayrollDeductionItem[];
  totalLegalDeductions: number;
  totalSpecialDeductions: number;
  totalDeductions: number;
  netWage: number;
  sgkEmployerAmount: number;
  unemploymentEmployerAmount: number;
  totalEmployerCost: number;
}

export interface RetroactiveDiffMonth {
  month: number;
  monthName: string;
  oldBaseGross: number;
  newBaseGross: number;
  grossDifference: number;
  sgkDifference: number;
  unemploymentDifference: number;
  incomeTaxDifference: number;
  stampTaxDifference: number;
  unionDuesDifference: number;
  netDifference: number;
  employerCostDifference: number;
}

export interface RetroactiveDiffSummary {
  startMonth: number;
  endMonth: number;
  monthsCount: number;
  totalGrossDiff: number;
  totalSgkDiff: number;
  totalTaxDiff: number;
  totalStampDiff: number;
  totalUnionDiff: number;
  totalNetToPay: number;
  totalEmployerCostDiff: number;
  details: RetroactiveDiffMonth[];
}

export interface TisReportNote {
  id: string;
  title: string;
  contractName: string;
  sourceText: string;
  parsedSummary: {
    baseDailyWage?: number;
    bonusDays?: number;
    seniorityBonus?: number;
    overtimeRate?: number;
    holidayRate?: number;
    fuelAid?: number;
    foodAid?: number;
    transportAid?: number;
    unionDues?: string;
  };
  createdAt: string;
}

// Exact TCDD Payroll Slip Structure (1:1 with uploaded 1.jpg - 8.png)
export interface EarningItem {
  id: string;
  label: string;
  hours: number;
  amount: number;
  rule: 'base' | 'gst10' | 'vardiya10' | 'gece15' | 'mesai200' | 'mesai175' | 'postabasi' | 'gms24' | 'iase' | 'hizmet' | 'custom';
  unitLabel?: string;
  badge?: string;
  customRate?: number;
  manualAmount?: number;
}

export interface CustomDeduction {
  id: string;
  name: string;
  amount: number;
}

export interface BordroData {
  bordroBaslik: string;
  bordroDonem: string;
  aySecim: number;
  calisanStatusu?: 'gazi' | 'normal';
  mevzuatNotu: string;
  islYS: string;
  adi: string;
  soyadi: string;
  sicilNo: string;
  persNo: string;
  sskNo: string;
  unvani: string;
  derKad: string;
  kidemYili: number;
  hzmZammiYil: number;
  saatUcr: number;
  emkZam: number;
  brtAylk: number;
  kdmZam: number;
  hastGun: number;
  isySsk: string;
  imzaNot: string;
  earnings: EarningItem[];
  birlestirilmSosyalYardim: number;
  postabasiSaatUcreti?: number;
  sendikaAidati: number;
  sendikaAidatiModu?: 'oto' | 'manuel';
  sporAidati: number;
  vergiMuafiyeti: number;
  terfiFarki: number;
  mahsupKesintisi: number;
  sskMatrahD: number;
  customDeductions: CustomDeduction[];
  calistigiGun: number;
  sskGunu: number;
  sskMatrahi: number;
  sskPrimIsci: number;
  sskPrimIsv: number;
  yillikGlrVM: number;
  aylikGlrVM: number;
  ayNo: number;
  asgariUcretMatrah: number;
  vergiDilimModu: string;
  gelirVergisi: number;
  damgaVergisi: number;
  issSigIsc: number;
  issSigIsv: number;
  mahsupFark: number;
  asgariGecIn: number;
  iaseGunlukKatsayi: number;
  hizmetYillikKatsayi: number;
  gelirToplami: number;
  kesintiTopl: number;
  netOdeme: number;
}

export interface SavedBordroRecord {
  id: string;
  title: string;
  date: string;
  netOdeme: number;
  data: BordroData;
}

export interface TcddMonthlySlip {

  periodCode: string;          // e.g. "01/2026"
  periodDates: string;         // e.g. "(15.12.2025-14.01.2026)"
  monthIndex: number;          // 1 to 8
  monthName: string;           // "Ocak 2026"
  // Left Panel (Employee Info)
  islYs: string;               // "01/0104/03"
  adi: string;                 // "İlyas"
  soyadi: string;              // "İLMEK"
  sicilNo: string;             // "084857"
  persNo: string;              // "11000867"
  sskNo: string;               // "3408199916012"
  unvani: string;              // "VAGON İMAL VE TAMİRC"
  derKad: string;              // "001/  00" or "001/  01"
  kidemYili: number;           // 14 or 15
  hzmZammiYil: number;         // 14 or 15
  saatUcr: number;             // 330.37, 380.88, 385.98
  emkZam: number;              // 15.40, 17.78, 19.05
  brtAylk: number;             // 0.00
  kdmZam: number;              // 0.00
  hastGun: number;             // 0.00, 1.00, 3.00, 8.00
  isySsk: string;              // "13317020211372650410"
  
  // Middle Panel - Hakedişler (Saat / Gün ve Tutarlar)
  normalCalisHours: number;
  normalCalisAmount: number;
  pazarBayramHours?: number;
  pazarBayramAmount?: number;
  haftaTatiliHours?: number;
  haftaTatiliAmount?: number;
  ubgtHours?: number;
  ubgtAmount?: number;
  ucretliIzinHours?: number;
  ucretliIzinAmount?: number;
  ucretliRapoHours?: number;
  ucretliRapoAmount?: number;
  fzlMes100Hours?: number;
  fzlMes100Amount?: number;
  vardiyaPrimHours?: number;
  vardiyaPrimAmount?: number;
  geceCalismaHours?: number;
  geceCalismaAmount?: number;
  iaseGunuDays: number;
  iaseGunuAmount: number;
  gst10Hours: number;          // Gazi/Şehit Yakını/Terör Mağduru %10 Ek Prim (Madde 130)
  gst10Amount: number;
  hizmetZammiYear: number;
  hizmetZammiAmount: number;   // Madde 129
  gms17Plus7Hours: number;     // Ağır/Tehlikeli İş Tazminatı %24 (Madde 51)
  gms17Plus7Amount: number;

  // Middle Panel - Sosyal Yardımlar & Özel Kesintiler
  birlestirilmAmount: number;  // Madde 69 Birleştirilmiş Sosyal Yardım
  sendikaAidaAmount: number;   // Demiryol-İş Sendika Aidatı (Madde 18)
  sporAidatiAmount: number;    // Demirspor Spor Yardımı 10.00 TL (Madde 96)
  vergidenMuaAmount: number;   // 3.000,00 TL (GVK Madde 31 - 3. Derece Engellilik İndirimi)
  terfiFarkAmount?: number;    // Terfi Fark-İ
  mahsupKsntAmount?: number;   // Mahsup Ksnt.
  sskMatrahDAmount?: number;   // SSK Matrah Düzeltmesi

  // Right Panel - Yasal Kesintiler ve Sonuçlar
  calistigiGun: number;        // 31.00 or 28.00 or 30.00
  sskGunu: number;             // 30.00
  sskMatrahi: number;
  sskPrimIsci: number;         // Tam %9.000 (GSS kesilmiyor, Madde 5/1-c)
  sskPrimIsv: number;          // %13.250 - %14.250
  yillikGlrVm: number;         // Kümülatif Gelir Vergisi Matrahı
  aylikGlrVm: number;          // Aylık Gelir Vergisi Matrahı
  gelirVergisi: number;
  damgaVergisi: number;
  issSigIsci: number;          // 0.00 TL (Gazi/malul muafiyeti)
  issSigIsv: number;           // 0.00 TL
  mahsupFark: number;
  gelirToplami: number;        // Toplam Hakediş
  kesintiTopl: number;         // Toplam Kesinti
  netOdeme: number;            // NET ELE GEÇEN
  asgariGecIn: number;         // 0.00
}
