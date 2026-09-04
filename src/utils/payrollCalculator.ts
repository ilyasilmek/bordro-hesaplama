import {
  TisParameters,
  EmployeeInput,
  PayrollResult,
  PayrollEarningItem,
  PayrollDeductionItem,
  TaxBracket
} from '../types';
import { TURKISH_MONTHS } from '../constants/defaultTisConfig';

/**
 * Calculates income tax for a given tax base considering cumulative previous base
 */
export function calculateBracketTax(
  currentMonthBase: number,
  previousCumulativeBase: number,
  brackets: TaxBracket[]
): number {
  if (currentMonthBase <= 0) return 0;

  const startBase = previousCumulativeBase;
  const endBase = previousCumulativeBase + currentMonthBase;
  let tax = 0;
  let lowerLimit = 0;

  for (const bracket of brackets) {
    const upperLimit = bracket.limit;

    // Check if the current bracket overlaps with [startBase, endBase]
    if (endBase > lowerLimit && startBase < upperLimit) {
      const taxableInThisBracket =
        Math.min(endBase, upperLimit) - Math.max(startBase, lowerLimit);

      if (taxableInThisBracket > 0) {
        tax += taxableInThisBracket * bracket.rate;
      }
    }

    lowerLimit = upperLimit;
    if (startBase >= upperLimit && upperLimit !== Infinity) {
      continue;
    }
  }

  return Math.round(tax * 100) / 100;
}

/**
 * Calculates the Minimum Wage Tax Exemptions for the specified month (Law No. 7349)
 */
export function calculateMinWageExemptions(
  monthIndex: number, // 1 to 12
  tisConfig: TisParameters
) {
  const minWageGross = tisConfig.minimumWageGross;
  const minWageSgkWorker = minWageGross * (tisConfig.sgkEmployeeRate + tisConfig.unemploymentEmployeeRate);
  const minWageMonthlyTaxBase = minWageGross - minWageSgkWorker;

  // Cumulative base of minimum wage up to previous month
  const minWagePrevCumulativeBase = minWageMonthlyTaxBase * (monthIndex - 1);

  // Minimum wage income tax exemption for this month
  const minWageIncomeTaxExemption = calculateBracketTax(
    minWageMonthlyTaxBase,
    minWagePrevCumulativeBase,
    tisConfig.taxBrackets
  );

  // Minimum wage stamp tax exemption
  const minWageStampTaxExemption = Math.round(minWageGross * tisConfig.stampTaxRate * 100) / 100;

  return {
    minWageIncomeTaxExemption,
    minWageStampTaxExemption,
    minWageMonthlyTaxBase,
  };
}

/**
 * Main Payroll Calculation Function
 */
export function calculatePayroll(
  employee: EmployeeInput,
  tis: TisParameters
): PayrollResult {
  const earningItems: PayrollEarningItem[] = [];
  const deductionItems: PayrollDeductionItem[] = [];

  const daysWorked = employee.workedDays;
  const totalPaidDays = employee.totalPayableDays > 0 ? employee.totalPayableDays : 30;

  // 1. Base Gross Wage
  let baseGrossWage = 0;
  let effectiveDailyWage = employee.baseDailyWage;

  if (employee.wageType === 'daily') {
    effectiveDailyWage = employee.baseDailyWage;
    baseGrossWage = effectiveDailyWage * totalPaidDays;
  } else {
    baseGrossWage = employee.baseMonthlyGross * (totalPaidDays / 30);
    effectiveDailyWage = employee.baseMonthlyGross / 30;
  }
  baseGrossWage = Math.round(baseGrossWage * 100) / 100;

  earningItems.push({
    code: '101',
    name: employee.wageType === 'daily' ? `Temel Çıplak Ücret (${totalPaidDays} Gün x ${effectiveDailyWage.toFixed(2)} ₺)` : 'Temel Maktu Aylık Ücret',
    grossAmount: baseGrossWage,
    isSgkSubject: true,
    sgkExemptAmount: 0,
    isIncomeTaxSubject: true,
    incomeTaxExemptAmount: 0,
    isStampTaxSubject: true,
  });

  const hourlyWage = effectiveDailyWage / 7.5;

  // 2. Kıdem Zammı (Seniority Pay)
  let seniorityPayTotal = 0;
  const seniorityDailyRate = employee.customSeniorityPayDaily ?? tis.seniorityPayPerYear;
  if (employee.applySeniorityPay && employee.seniorityYears > 0) {
    const dailySeniorityIncrease = employee.seniorityYears * seniorityDailyRate;
    seniorityPayTotal = Math.round(dailySeniorityIncrease * totalPaidDays * 100) / 100;
    earningItems.push({
      code: '102',
      name: `Kıdem / Hizmet Zammı (${employee.seniorityYears} Yıl x ${seniorityDailyRate.toFixed(2)} ₺ x ${totalPaidDays} Gün)`,
      grossAmount: seniorityPayTotal,
      isSgkSubject: true,
      sgkExemptAmount: 0,
      isIncomeTaxSubject: true,
      incomeTaxExemptAmount: 0,
      isStampTaxSubject: true,
    });
  }

  // 3. İkramiye / Tediye
  let bonusGross = 0;
  const isBonusMonth = employee.hasBonusThisMonth || tis.bonusMonths.includes(employee.month);
  if (isBonusMonth) {
    const bonusDays = employee.bonusDaysOverride ?? (tis.annualBonusDaysTotal / (tis.bonusMonths.length || 1));
    const bonusDailyBase = (effectiveDailyWage + (seniorityPayTotal > 0 ? (seniorityPayTotal / totalPaidDays) : 0)) * tis.bonusDailyMultiplier;
    bonusGross = Math.round(bonusDays * bonusDailyBase * 100) / 100;

    earningItems.push({
      code: '103',
      name: `TİS Akdi İkramiye / Tediye (${bonusDays.toFixed(1)} Günlük)`,
      grossAmount: bonusGross,
      isSgkSubject: true,
      sgkExemptAmount: 0,
      isIncomeTaxSubject: true,
      incomeTaxExemptAmount: 0,
      isStampTaxSubject: true,
    });
  }

  // 4. Fazla Mesailer
  // Normal Overtime
  let normalOvertimePay = 0;
  if (employee.normalOvertimeHours > 0) {
    normalOvertimePay = Math.round(employee.normalOvertimeHours * hourlyWage * tis.normalOvertimeMultiplier * 100) / 100;
    earningItems.push({
      code: '104',
      name: `Normal Fazla Çalışma (${employee.normalOvertimeHours} Saat x %${Math.round(tis.normalOvertimeMultiplier * 100)})`,
      grossAmount: normalOvertimePay,
      isSgkSubject: true,
      sgkExemptAmount: 0,
      isIncomeTaxSubject: true,
      incomeTaxExemptAmount: 0,
      isStampTaxSubject: true,
    });
  }

  // Weekend Overtime
  let weekendOvertimePay = 0;
  if (employee.weekendOvertimeDays > 0) {
    weekendOvertimePay = Math.round(employee.weekendOvertimeDays * effectiveDailyWage * tis.weekendOvertimeMultiplier * 100) / 100;
    earningItems.push({
      code: '105',
      name: `Hafta Tatili Çalışması (${employee.weekendOvertimeDays} Gün x %${Math.round(tis.weekendOvertimeMultiplier * 100)})`,
      grossAmount: weekendOvertimePay,
      isSgkSubject: true,
      sgkExemptAmount: 0,
      isIncomeTaxSubject: true,
      incomeTaxExemptAmount: 0,
      isStampTaxSubject: true,
    });
  }

  // Holiday Overtime
  let holidayOvertimePay = 0;
  if (employee.holidayOvertimeDays > 0) {
    holidayOvertimePay = Math.round(employee.holidayOvertimeDays * effectiveDailyWage * tis.holidayOvertimeMultiplier * 100) / 100;
    earningItems.push({
      code: '106',
      name: `Bayram / Genel Tatil Mesaisi (${employee.holidayOvertimeDays} Gün x %${Math.round(tis.holidayOvertimeMultiplier * 100)})`,
      grossAmount: holidayOvertimePay,
      isSgkSubject: true,
      sgkExemptAmount: 0,
      isIncomeTaxSubject: true,
      incomeTaxExemptAmount: 0,
      isStampTaxSubject: true,
    });
  }

  // Night Shift Allowance
  let nightShiftPay = 0;
  if (employee.nightShiftHours > 0) {
    nightShiftPay = Math.round(employee.nightShiftHours * hourlyWage * tis.nightShiftAllowanceRate * 100) / 100;
    earningItems.push({
      code: '107',
      name: `Gece Vardiya Zammı (${employee.nightShiftHours} Saat x %${Math.round(tis.nightShiftAllowanceRate * 100)})`,
      grossAmount: nightShiftPay,
      isSgkSubject: true,
      sgkExemptAmount: 0,
      isIncomeTaxSubject: true,
      incomeTaxExemptAmount: 0,
      isStampTaxSubject: true,
    });
  }

  // 5. Sosyal Yardımlar & TİS Ödenekleri
  // Yemek Yardımı
  let foodAidGross = 0;
  if (employee.foodAidType === 'cash' && employee.foodDailyAmount > 0 && employee.foodDays > 0) {
    foodAidGross = Math.round(employee.foodDailyAmount * employee.foodDays * 100) / 100;
    const foodExemptionTotal = Math.min(foodAidGross, tis.foodAidDailyExemption * employee.foodDays);
    earningItems.push({
      code: '201',
      name: `Yemek Yardımı (Nakdi - ${employee.foodDays} Gün x ${employee.foodDailyAmount} ₺)`,
      grossAmount: foodAidGross,
      isSgkSubject: true,
      sgkExemptAmount: foodExemptionTotal,
      isIncomeTaxSubject: true,
      incomeTaxExemptAmount: foodExemptionTotal,
      isStampTaxSubject: true,
      notes: `Günlük SGK/GV İstisnası: ${tis.foodAidDailyExemption} ₺`,
    });
  }

  // Ulaşım / Yol Yardımı
  let transportAidGross = 0;
  if (employee.transportAidType === 'cash' && employee.transportMonthlyAmount > 0) {
    transportAidGross = Math.round(employee.transportMonthlyAmount * 100) / 100;
    earningItems.push({
      code: '202',
      name: 'Ulaşım / Yol Yardımı (Nakdi)',
      grossAmount: transportAidGross,
      isSgkSubject: true,
      sgkExemptAmount: 0,
      isIncomeTaxSubject: true,
      incomeTaxExemptAmount: 0,
      isStampTaxSubject: true,
    });
  }

  // Yakacak Yardımı
  let fuelAidGross = 0;
  if (employee.fuelAidMonthly > 0) {
    fuelAidGross = Math.round(employee.fuelAidMonthly * 100) / 100;
    earningItems.push({
      code: '203',
      name: 'Yakacak / Isınma Yardımı',
      grossAmount: fuelAidGross,
      isSgkSubject: true,
      sgkExemptAmount: 0,
      isIncomeTaxSubject: true,
      incomeTaxExemptAmount: 0,
      isStampTaxSubject: true,
    });
  }

  // Aile Yardımı
  let familyAidGross = 0;
  if (employee.hasFamilyAid && tis.defaultFamilyAidAmount > 0) {
    familyAidGross = tis.defaultFamilyAidAmount;
    const sgkExemptFamily = Math.round(tis.minimumWageGross * tis.familyAidExemptionPercent * 100) / 100;
    earningItems.push({
      code: '204',
      name: 'Aile / Eş Yardımı',
      grossAmount: familyAidGross,
      isSgkSubject: true,
      sgkExemptAmount: Math.min(familyAidGross, sgkExemptFamily),
      isIncomeTaxSubject: true,
      incomeTaxExemptAmount: 0,
      isStampTaxSubject: true,
      notes: `SGK İstisnası: ${sgkExemptFamily} ₺ (Asgari Ücretin %10'u)`,
    });
  }

  // Çocuk Yardımı
  let childAidGross = 0;
  if (employee.childCount > 0 && tis.defaultChildAidPerChild > 0) {
    childAidGross = employee.childCount * tis.defaultChildAidPerChild;
    // En fazla 2 çocuk için SGK istisnası uygulanır
    const eligibleChildren = Math.min(2, employee.childCount);
    const sgkExemptChild = Math.round(eligibleChildren * (tis.minimumWageGross * tis.childAidExemptionPercent) * 100) / 100;
    earningItems.push({
      code: '205',
      name: `Çocuk Yardımı (${employee.childCount} Çocuk)`,
      grossAmount: childAidGross,
      isSgkSubject: true,
      sgkExemptAmount: Math.min(childAidGross, sgkExemptChild),
      isIncomeTaxSubject: true,
      incomeTaxExemptAmount: 0,
      isStampTaxSubject: true,
      notes: `SGK İstisnası (Maks 2 Çocuk): ${sgkExemptChild} ₺`,
    });
  }

  // Diğer Sosyal Yardımlar (Giyim, Bayram, Sorumluluk, Prim)
  let socialAllowancesGross = 0;
  if (employee.clothingSocialAid > 0) {
    socialAllowancesGross += employee.clothingSocialAid;
    earningItems.push({
      code: '206',
      name: 'Hijyen & Koruyucu Giyim / Sosyal Paket',
      grossAmount: employee.clothingSocialAid,
      isSgkSubject: true,
      sgkExemptAmount: 0,
      isIncomeTaxSubject: true,
      incomeTaxExemptAmount: 0,
      isStampTaxSubject: true,
    });
  }

  if (employee.religiousHolidayBonus > 0) {
    socialAllowancesGross += employee.religiousHolidayBonus;
    earningItems.push({
      code: '207',
      name: 'Dini Bayram Harçlığı (Ramazan/Kurban)',
      grossAmount: employee.religiousHolidayBonus,
      isSgkSubject: true,
      sgkExemptAmount: 0,
      isIncomeTaxSubject: true,
      incomeTaxExemptAmount: 0,
      isStampTaxSubject: true,
    });
  }

  if (employee.educationAid > 0) {
    socialAllowancesGross += employee.educationAid;
    earningItems.push({
      code: '208',
      name: 'Eğitim & Öğrenim Yardımı',
      grossAmount: employee.educationAid,
      isSgkSubject: true,
      sgkExemptAmount: 0,
      isIncomeTaxSubject: true,
      incomeTaxExemptAmount: 0,
      isStampTaxSubject: true,
    });
  }

  if (employee.responsibilityRiskBonus > 0) {
    socialAllowancesGross += employee.responsibilityRiskBonus;
    earningItems.push({
      code: '209',
      name: 'Sorumluluk / İş Riski / Direksiyon Primi',
      grossAmount: employee.responsibilityRiskBonus,
      isSgkSubject: true,
      sgkExemptAmount: 0,
      isIncomeTaxSubject: true,
      incomeTaxExemptAmount: 0,
      isStampTaxSubject: true,
    });
  }

  if (employee.performanceBonus > 0) {
    socialAllowancesGross += employee.performanceBonus;
    earningItems.push({
      code: '210',
      name: 'Devamlılık / Performans Teşvik Primi',
      grossAmount: employee.performanceBonus,
      isSgkSubject: true,
      sgkExemptAmount: 0,
      isIncomeTaxSubject: true,
      incomeTaxExemptAmount: 0,
      isStampTaxSubject: true,
    });
  }

  // TOPLAM BRÜT KAZANÇ
  const totalGrossWage = earningItems.reduce((acc, item) => acc + item.grossAmount, 0);

  // 6. SGK Matrahı Hesaplaması
  const sgkGrossSubject = earningItems
    .filter((item) => item.isSgkSubject)
    .reduce((acc, item) => acc + Math.max(0, item.grossAmount - item.sgkExemptAmount), 0);

  const sgkCeiling = Math.round(tis.minimumWageGross * tis.sgkCeilingMultiplier * 100) / 100;
  const sgkBase = Math.min(sgkGrossSubject, sgkCeiling);
  const sgkCeilingApplied = sgkGrossSubject > sgkCeiling;

  // SGK İşçi Payı (%14) ve İşsizlik İşçi Payı (%1)
  const sgkEmployeeAmount = Math.round(sgkBase * tis.sgkEmployeeRate * 100) / 100;
  const unemploymentEmployeeAmount = Math.round(sgkBase * tis.unemploymentEmployeeRate * 100) / 100;
  const totalWorkerSgkDeduction = sgkEmployeeAmount + unemploymentEmployeeAmount;

  deductionItems.push({
    code: '301',
    name: 'SGK İşçi Primi Payı',
    amount: sgkEmployeeAmount,
    type: 'legal',
    rateOrFormula: `%${Math.round(tis.sgkEmployeeRate * 100)} (Matrah: ${sgkBase.toFixed(2)} ₺)`,
  });

  deductionItems.push({
    code: '302',
    name: 'İşsizlik Sigortası İşçi Payı',
    amount: unemploymentEmployeeAmount,
    type: 'legal',
    rateOrFormula: `%${Math.round(tis.unemploymentEmployeeRate * 100)} (Matrah: ${sgkBase.toFixed(2)} ₺)`,
  });

  // 7. Sendika Aidatı Hesaplaması (Önce hesaplanır çünkü GVK Madde 63/4'e göre GV matrahından indirilir!)
  let unionDuesAmount = 0;
  if (employee.isUnionMember) {
    if (employee.unionDuesType === 'one_day') {
      unionDuesAmount = Math.round(effectiveDailyWage * tis.unionDuesDays * 100) / 100;
    } else if (employee.unionDuesType === 'fixed' && employee.customUnionDuesAmount) {
      unionDuesAmount = employee.customUnionDuesAmount;
    } else {
      unionDuesAmount = Math.round(baseGrossWage * tis.unionDuesPercentFallback * 100) / 100;
    }

    deductionItems.push({
      code: '401',
      name: 'Sendika Üyelik Aidatı',
      amount: unionDuesAmount,
      type: 'special',
      rateOrFormula: employee.unionDuesType === 'one_day' ? '1 Günlük Çıplak Yevmiye' : 'TİS Oranı',
    });
  }

  // 8. Gelir Vergisi Matrahı
  const incomeTaxGrossSubject = earningItems
    .filter((item) => item.isIncomeTaxSubject)
    .reduce((acc, item) => acc + Math.max(0, item.grossAmount - item.incomeTaxExemptAmount), 0);

  // Gelir Vergisi Matrahı = Vergiye Tabi Brüt - SGK İşçi Payları - Sendika Aidatı (GVK 63/4)
  const incomeTaxBaseCurrentMonth = Math.max(0, Math.round((incomeTaxGrossSubject - totalWorkerSgkDeduction - unionDuesAmount) * 100) / 100);
  const cumulativeTaxBaseBefore = employee.cumulativeTaxBaseStart;
  const cumulativeTaxBaseAfter = cumulativeTaxBaseBefore + incomeTaxBaseCurrentMonth;

  // Hesaplanan Gelir Vergisi
  const calculatedIncomeTax = calculateBracketTax(
    incomeTaxBaseCurrentMonth,
    cumulativeTaxBaseBefore,
    tis.taxBrackets
  );

  // Asgari Ücret Vergi İstisnaları (Law 7349)
  const { minWageIncomeTaxExemption, minWageStampTaxExemption } = calculateMinWageExemptions(
    employee.month,
    tis
  );

  // Ödenecek Gelir Vergisi (İstisna düşülmüş)
  const payableIncomeTax = Math.max(0, Math.round((calculatedIncomeTax - minWageIncomeTaxExemption) * 100) / 100);

  deductionItems.push({
    code: '303',
    name: 'Gelir Vergisi (Net Kesilen)',
    amount: payableIncomeTax,
    type: 'legal',
    rateOrFormula: `Hesaplanan: ${calculatedIncomeTax.toFixed(2)} ₺ - Asgari Ücret İstisnası: ${minWageIncomeTaxExemption.toFixed(2)} ₺`,
  });

  // 9. Damga Vergisi Hesaplaması
  const stampTaxGrossSubject = earningItems
    .filter((item) => item.isStampTaxSubject)
    .reduce((acc, item) => acc + item.grossAmount, 0);

  const calculatedStampTax = Math.round(stampTaxGrossSubject * tis.stampTaxRate * 100) / 100;
  const payableStampTax = Math.max(0, Math.round((calculatedStampTax - minWageStampTaxExemption) * 100) / 100);

  deductionItems.push({
    code: '304',
    name: 'Damga Vergisi (Net Kesilen)',
    amount: payableStampTax,
    type: 'legal',
    rateOrFormula: `Binde 7.59 (Hesaplanan: ${calculatedStampTax.toFixed(2)} ₺ - İstisna: ${minWageStampTaxExemption.toFixed(2)} ₺)`,
  });

  // 10. Diğer Özel Kesintiler
  // BES (%3)
  let besDeductionAmount = 0;
  if (employee.isBesEnrolled) {
    besDeductionAmount = Math.round(sgkBase * 0.03 * 100) / 100;
    deductionItems.push({
      code: '402',
      name: 'Otomatik BES Kesintisi (%3)',
      amount: besDeductionAmount,
      type: 'special',
      rateOrFormula: '%3 x SGK Matrahı',
    });
  }

  // İcra Kesintisi
  let courtGarnishmentAmount = 0;
  if (employee.courtGarnishment > 0) {
    courtGarnishmentAmount = employee.courtGarnishment;
    deductionItems.push({
      code: '403',
      name: 'İcra Müdürlüğü Kesintisi',
      amount: courtGarnishmentAmount,
      type: 'special',
    });
  }

  // Avans Kesintisi
  let salaryAdvanceAmount = 0;
  if (employee.salaryAdvance > 0) {
    salaryAdvanceAmount = employee.salaryAdvance;
    deductionItems.push({
      code: '404',
      name: 'Maaş Avansı Mahsubu',
      amount: salaryAdvanceAmount,
      type: 'special',
    });
  }

  // Diğer Şahsi Kesintiler
  let otherPrivateDeductionAmount = 0;
  if (employee.otherPrivateDeductions > 0) {
    otherPrivateDeductionAmount = employee.otherPrivateDeductions;
    deductionItems.push({
      code: '405',
      name: 'Diğer Özel Kesintiler',
      amount: otherPrivateDeductionAmount,
      type: 'special',
    });
  }

  // Toplam Kesintiler
  const totalLegalDeductions = Math.round((sgkEmployeeAmount + unemploymentEmployeeAmount + payableIncomeTax + payableStampTax) * 100) / 100;
  const totalSpecialDeductions = Math.round((unionDuesAmount + besDeductionAmount + courtGarnishmentAmount + salaryAdvanceAmount + otherPrivateDeductionAmount) * 100) / 100;
  const totalDeductions = Math.round((totalLegalDeductions + totalSpecialDeductions) * 100) / 100;

  // NET ÖDENECEK TUTAR
  const netWage = Math.round((totalGrossWage - totalDeductions) * 100) / 100;

  // 11. İşveren Maliyeti
  const effectiveSgkEmployerRate = tis.employerIncentive5Percent
    ? Math.max(0, tis.sgkEmployerRate - 0.05) // %15.5
    : tis.sgkEmployerRate; // %20.5

  const sgkEmployerAmount = Math.round(sgkBase * effectiveSgkEmployerRate * 100) / 100;
  const unemploymentEmployerAmount = Math.round(sgkBase * tis.unemploymentEmployerRate * 100) / 100;
  const totalEmployerCost = Math.round((totalGrossWage + sgkEmployerAmount + unemploymentEmployerAmount) * 100) / 100;

  // Determine which tax brackets were hit
  let effectiveTaxBracketRates = '%15';
  if (cumulativeTaxBaseAfter > tis.taxBrackets[0].limit) {
    if (cumulativeTaxBaseBefore < tis.taxBrackets[0].limit) {
      effectiveTaxBracketRates = '%15 → %20';
    } else if (cumulativeTaxBaseAfter <= tis.taxBrackets[1].limit) {
      effectiveTaxBracketRates = '%20';
    } else if (cumulativeTaxBaseBefore < tis.taxBrackets[1].limit) {
      effectiveTaxBracketRates = '%20 → %27';
    } else if (cumulativeTaxBaseAfter <= tis.taxBrackets[2].limit) {
      effectiveTaxBracketRates = '%27';
    } else {
      effectiveTaxBracketRates = '%27 → %35+';
    }
  }

  return {
    month: employee.month,
    monthName: TURKISH_MONTHS[employee.month - 1] || `${employee.month}. Ay`,
    year: tis.year,
    days: {
      worked: daysWorked,
      weeklyRest: employee.weeklyRestDays,
      paidLeave: employee.paidLeaveDays,
      unpaidLeave: employee.unpaidLeaveDays,
      sickLeave: employee.sickLeaveDays,
      totalPaidDays: totalPaidDays,
    },
    baseGrossWage,
    seniorityPayTotal,
    bonusGross,
    normalOvertimePay,
    weekendOvertimePay,
    holidayOvertimePay,
    nightShiftPay,
    foodAidGross,
    transportAidGross,
    fuelAidGross,
    familyAidGross,
    childAidGross,
    socialAllowancesGross,
    earningItems,
    totalGrossWage,
    sgkBase,
    sgkCeilingApplied,
    sgkEmployeeAmount,
    unemploymentEmployeeAmount,
    totalWorkerSgkDeduction,
    incomeTaxBaseCurrentMonth,
    cumulativeTaxBaseBefore,
    cumulativeTaxBaseAfter,
    effectiveTaxBracketRates,
    calculatedIncomeTax,
    minWageIncomeTaxExemption,
    payableIncomeTax,
    calculatedStampTax,
    minWageStampTaxExemption,
    payableStampTax,
    unionDuesAmount,
    besDeductionAmount,
    courtGarnishmentAmount,
    salaryAdvanceAmount,
    otherPrivateDeductionAmount,
    deductionItems,
    totalLegalDeductions,
    totalSpecialDeductions,
    totalDeductions,
    netWage,
    sgkEmployerAmount,
    unemploymentEmployerAmount,
    totalEmployerCost,
  };
}

/**
 * 12-Month Year Simulation Engine
 * Simulates an entire year month-by-month, accurately accumulating tax bases.
 */
export function simulateYearlyPayroll(
  employee: EmployeeInput,
  tis: TisParameters
): PayrollResult[] {
  const yearlyResults: PayrollResult[] = [];
  let runningCumulativeTaxBase = 0;

  for (let m = 1; m <= 12; m++) {
    // Check if this month has bonus according to TIS schedule
    const isBonusScheduled = tis.bonusMonths.includes(m);
    
    // Check if religious holiday bonus in certain months (e.g. Ramazan in March/April, Kurban in June)
    const isReligiousBonus = (m === 3 || m === 6) ? employee.religiousHolidayBonus : 0;
    // Education aid usually in September (Month 9)
    const isEducationMonth = (m === 9) ? employee.educationAid : 0;

    const monthInput: EmployeeInput = {
      ...employee,
      month: m,
      cumulativeTaxBaseStart: runningCumulativeTaxBase,
      hasBonusThisMonth: isBonusScheduled,
      bonusDaysOverride: isBonusScheduled ? (tis.annualBonusDaysTotal / tis.bonusMonths.length) : 0,
      religiousHolidayBonus: isReligiousBonus,
      educationAid: isEducationMonth,
    };

    const monthResult = calculatePayroll(monthInput, tis);
    yearlyResults.push(monthResult);

    runningCumulativeTaxBase = monthResult.cumulativeTaxBaseAfter;
  }

  return yearlyResults;
}

/**
 * Formatter for Turkish Lira Currency
 */
export function formatTRY(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Number to Turkish Words converter for official payroll slip
 */
export function numberToTurkishWords(num: number): string {
  const units = ['', 'Bir', 'İki', 'Üç', 'Dört', 'Beş', 'Altı', 'Yedi', 'Sekiz', 'Dokuz'];
  const tens = ['', 'On', 'Yirmi', 'Otuz', 'Kırk', 'Elli', 'Altmış', 'Yetmiş', 'Seksen', 'Doksan'];

  function convertGroup(val: number): string {
    let str = '';
    const h = Math.floor(val / 100);
    const t = Math.floor((val % 100) / 10);
    const u = val % 10;

    if (h > 0) {
      str += h === 1 ? 'Yüz' : units[h] + 'Yüz';
    }
    if (t > 0) {
      str += tens[t];
    }
    if (u > 0) {
      str += units[u];
    }
    return str;
  }

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  if (integerPart === 0) {
    return `Sıfır Türk Lirası ${decimalPart > 0 ? `${decimalPart} Kuruş` : ''}`;
  }

  let result = '';
  const millions = Math.floor(integerPart / 1000000);
  const thousands = Math.floor((integerPart % 1000000) / 1000);
  const remainder = integerPart % 1000;

  if (millions > 0) {
    result += convertGroup(millions) + 'Milyon';
  }
  if (thousands > 0) {
    result += thousands === 1 ? 'Bin' : convertGroup(thousands) + 'Bin';
  }
  if (remainder > 0) {
    result += convertGroup(remainder);
  }

  result += ' Türk Lirası';
  if (decimalPart > 0) {
    result += ` ${convertGroup(decimalPart)} Kuruş`;
  }

  return result;
}
