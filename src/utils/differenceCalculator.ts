import {
  TisParameters,
  EmployeeInput,
  RetroactiveDiffMonth,
  RetroactiveDiffSummary
} from '../types';
import { calculatePayroll } from './payrollCalculator';
import { TURKISH_MONTHS } from '../constants/defaultTisConfig';

/**
 * Calculates retroactive difference payroll for a range of months (e.g. months 1 to 6)
 * when a new TIS increases daily wages and allowances retroactively.
 */
export function calculateRetroactiveDifference(
  baseEmployee: EmployeeInput,
  tis: TisParameters,
  oldDailyWage: number,
  newDailyWage: number,
  startMonth: number,
  endMonth: number,
  oldMonthlyAllowances: number = 0,
  newMonthlyAllowances: number = 0
): RetroactiveDiffSummary {
  const details: RetroactiveDiffMonth[] = [];

  let totalGrossDiff = 0;
  let totalSgkDiff = 0;
  let totalTaxDiff = 0;
  let totalStampDiff = 0;
  let totalUnionDiff = 0;
  let totalNetToPay = 0;
  let totalEmployerCostDiff = 0;

  // Track cumulative tax bases separately for old and new contracts
  let cumulativeOldTaxBase = 0;
  let cumulativeNewTaxBase = 0;

  for (let m = 1; m <= endMonth; m++) {
    const isBonusScheduled = tis.bonusMonths.includes(m);
    const bonusDays = isBonusScheduled ? (tis.annualBonusDaysTotal / tis.bonusMonths.length) : 0;

    // Run Old Contract
    const oldEmpInput: EmployeeInput = {
      ...baseEmployee,
      month: m,
      baseDailyWage: oldDailyWage,
      hasBonusThisMonth: isBonusScheduled,
      bonusDaysOverride: bonusDays,
      fuelAidMonthly: baseEmployee.fuelAidMonthly + oldMonthlyAllowances,
      cumulativeTaxBaseStart: cumulativeOldTaxBase,
    };
    const oldResult = calculatePayroll(oldEmpInput, tis);
    cumulativeOldTaxBase = oldResult.cumulativeTaxBaseAfter;

    // Run New Contract
    const newEmpInput: EmployeeInput = {
      ...baseEmployee,
      month: m,
      baseDailyWage: newDailyWage,
      hasBonusThisMonth: isBonusScheduled,
      bonusDaysOverride: bonusDays,
      fuelAidMonthly: baseEmployee.fuelAidMonthly + newMonthlyAllowances,
      cumulativeTaxBaseStart: cumulativeNewTaxBase,
    };
    const newResult = calculatePayroll(newEmpInput, tis);
    cumulativeNewTaxBase = newResult.cumulativeTaxBaseAfter;

    // If within the retroactive difference window:
    if (m >= startMonth && m <= endMonth) {
      const grossDiff = Math.round((newResult.totalGrossWage - oldResult.totalGrossWage) * 100) / 100;
      const sgkDiff = Math.round((newResult.totalWorkerSgkDeduction - oldResult.totalWorkerSgkDeduction) * 100) / 100;
      const taxDiff = Math.round((newResult.payableIncomeTax - oldResult.payableIncomeTax) * 100) / 100;
      const stampDiff = Math.round((newResult.payableStampTax - oldResult.payableStampTax) * 100) / 100;
      const unionDiff = Math.round((newResult.unionDuesAmount - oldResult.unionDuesAmount) * 100) / 100;
      const netDiff = Math.round((newResult.netWage - oldResult.netWage) * 100) / 100;
      const empCostDiff = Math.round((newResult.totalEmployerCost - oldResult.totalEmployerCost) * 100) / 100;

      details.push({
        month: m,
        monthName: TURKISH_MONTHS[m - 1],
        oldBaseGross: oldResult.totalGrossWage,
        newBaseGross: newResult.totalGrossWage,
        grossDifference: grossDiff,
        sgkDifference: sgkDiff,
        unemploymentDifference: Math.round((newResult.unemploymentEmployeeAmount - oldResult.unemploymentEmployeeAmount) * 100) / 100,
        incomeTaxDifference: taxDiff,
        stampTaxDifference: stampDiff,
        unionDuesDifference: unionDiff,
        netDifference: netDiff,
        employerCostDifference: empCostDiff,
      });

      totalGrossDiff += grossDiff;
      totalSgkDiff += sgkDiff;
      totalTaxDiff += taxDiff;
      totalStampDiff += stampDiff;
      totalUnionDiff += unionDiff;
      totalNetToPay += netDiff;
      totalEmployerCostDiff += empCostDiff;
    }
  }

  return {
    startMonth,
    endMonth,
    monthsCount: endMonth - startMonth + 1,
    totalGrossDiff: Math.round(totalGrossDiff * 100) / 100,
    totalSgkDiff: Math.round(totalSgkDiff * 100) / 100,
    totalTaxDiff: Math.round(totalTaxDiff * 100) / 100,
    totalStampDiff: Math.round(totalStampDiff * 100) / 100,
    totalUnionDiff: Math.round(totalUnionDiff * 100) / 100,
    totalNetToPay: Math.round(totalNetToPay * 100) / 100,
    totalEmployerCostDiff: Math.round(totalEmployerCostDiff * 100) / 100,
    details,
  };
}
