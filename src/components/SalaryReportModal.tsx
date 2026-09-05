import React, { useState, useMemo } from 'react';
import {
  X,
  Printer,
  Download,
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Percent,
  CheckCircle2,
  FileSpreadsheet,
  PlusCircle,
  HelpCircle,
  RotateCcw,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { BordroData, TcddMonthlySlip } from '../types';
import { TCDD_ACTUAL_SLIPS } from '../constants/tcddData';
import { formatCurrency } from '../utils/bordroEngine';
import {
  verifyPassword,
  changePasswordWithCurrent
} from '../utils/reportSecurity';

interface SalaryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBordro: BordroData;
  onLoadBordro: (bordro: BordroData) => void;
}

// Convert a historical TcddMonthlySlip into active BordroData
export function slipToBordroData(slip: TcddMonthlySlip): BordroData {
  const isGazi = slip.issSigIsci === 0;
  return {
    bordroBaslik: "TCDD TAŞIMACILIK A.Ş. İŞÇİ AYLIĞI MAAŞ BORDROSU",
    bordroDonem: `${slip.periodCode} ${slip.periodDates}`,
    aySecim: slip.monthIndex,
    ayNo: slip.monthIndex,
    calisanStatusu: isGazi ? "gazi" : "normal",
    mevzuatNotu: isGazi
      ? "Terörle Mücadele Kapsamı (Gazi) • 3. Derece Engelli Vergi İndirimi (3.000 ₺) • 31. Dönem TİS 1/1"
      : "31. Dönem TİS 1/1 • TCDD Taşımacılık A.Ş. Sürekli İşçi Bordrosu (Standart 4/a)",
    islYS: slip.islYs,
    adi: slip.adi,
    soyadi: slip.soyadi,
    sicilNo: slip.sicilNo,
    persNo: slip.persNo,
    sskNo: slip.sskNo,
    unvani: slip.unvani,
    derKad: slip.derKad,
    kidemYili: slip.kidemYili,
    hzmZammiYil: slip.hzmZammiYil,
    saatUcr: slip.saatUcr,
    emkZam: slip.emkZam,
    brtAylk: slip.brtAylk,
    kdmZam: slip.kdmZam,
    hastGun: slip.hastGun,
    isySsk: slip.isySsk,
    imzaNot: "",
    birlestirilmSosyalYardim: slip.birlestirilmAmount,
    sendikaAidati: slip.sendikaAidaAmount,
    sendikaAidatiModu: 'oto',
    sporAidati: slip.sporAidatiAmount,
    vergiMuafiyeti: slip.vergidenMuaAmount,
    terfiFarki: slip.terfiFarkAmount || 0,
    mahsupKesintisi: slip.mahsupKsntAmount || 0,
    sskMatrahD: slip.sskMatrahDAmount || 0,
    customDeductions: [],
    calistigiGun: slip.calistigiGun,
    sskGunu: slip.sskGunu,
    sskMatrahi: slip.sskMatrahi,
    sskPrimIsci: slip.sskPrimIsci,
    sskPrimIsv: slip.sskPrimIsv,
    yillikGlrVM: Math.max(0, Math.round((slip.yillikGlrVm - slip.aylikGlrVm) * 100) / 100),
    aylikGlrVM: slip.aylikGlrVm,
    asgariUcretMatrah: 0,
    vergiDilimModu: "oto",
    gelirVergisi: slip.gelirVergisi,
    damgaVergisi: slip.damgaVergisi,
    issSigIsc: slip.issSigIsci,
    issSigIsv: slip.issSigIsv,
    mahsupFark: slip.mahsupFark,
    asgariGecIn: slip.asgariGecIn,
    iaseGunlukKatsayi: slip.iaseGunuDays > 0 ? slip.iaseGunuAmount / slip.iaseGunuDays : 301.1575,
    hizmetYillikKatsayi: slip.hizmetZammiYear > 0 ? slip.hizmetZammiAmount / slip.hizmetZammiYear : 24.67,
    postabasiSaatUcreti: 4.84,
    earnings: [
      { id: "nc", label: "Normal Çalış", hours: slip.normalCalisHours, amount: slip.normalCalisAmount, rule: "base", badge: "OTO" },
      { id: "ht", label: "Hafta Tatili", hours: slip.haftaTatiliHours || 0, amount: slip.haftaTatiliAmount || 0, rule: "base", badge: "OTO" },
      { id: "ubgt", label: "UBGT", hours: slip.ubgtHours || slip.pazarBayramHours || 0, amount: slip.ubgtAmount || slip.pazarBayramAmount || 0, rule: "base", badge: "OTO" },
      { id: "ui", label: "Ücretli İzin", hours: slip.ucretliIzinHours || 0, amount: slip.ucretliIzinAmount || 0, rule: "base", badge: "OTO" },
      { id: "postabasi", label: "Postabaşılık Saati", hours: 0, amount: 0, rule: "postabasi", badge: "4,84 ₺" },
      { id: "ur", label: "Ücretli Rapor", hours: slip.ucretliRapoHours || 0, amount: slip.ucretliRapoAmount || 0, rule: "base", badge: "OTO" },
      { id: "vp", label: "Vardiya Prim", hours: slip.vardiyaPrimHours || 0, amount: slip.vardiyaPrimAmount || 0, rule: "vardiya10", badge: "OTO" },
      { id: "gc", label: "Gece Çalışma", hours: slip.geceCalismaHours || 0, amount: slip.geceCalismaAmount || 0, rule: "gece15", badge: "OTO" },
      { id: "fm", label: "Fzl Mes %100", hours: slip.fzlMes100Hours || 0, amount: slip.fzlMes100Amount || 0, rule: "mesai200", badge: "OTO" },
      { id: "iase", label: "İaşe Günü", hours: slip.iaseGunuDays, amount: slip.iaseGunuAmount, rule: "iase", unitLabel: "Saat/Gün", badge: "OTO" },
      { id: "gst", label: "GŞT %10", hours: slip.gst10Hours, amount: slip.gst10Amount, rule: "gst10", badge: "OTO" },
      { id: "hzm", label: "Hizmet Zammı", hours: slip.hizmetZammiYear, amount: slip.hizmetZammiAmount, rule: "hizmet", unitLabel: "Saat/Yıl", badge: "OTO" },
      { id: "gms", label: "GMŞ%(17+7)24", hours: slip.gms17Plus7Hours, amount: slip.gms17Plus7Amount, rule: "gms24", badge: "OTO" }
    ],
    gelirToplami: slip.gelirToplami,
    kesintiTopl: slip.kesintiTopl,
    netOdeme: slip.netOdeme
  };
}

export const SalaryReportModal: React.FC<SalaryReportModalProps> = ({
  isOpen,
  onClose,
  currentBordro,
  onLoadBordro
}) => {
  const [activeTab, setActiveTab] = useState<'kpi' | 'table' | 'breakdown' | 'tax'>('kpi');
  const [selectedMonthCode, setSelectedMonthCode] = useState<string>('08/2026');
  const [customSlips, setCustomSlips] = useState<TcddMonthlySlip[]>(() => {
    try {
      const stored = localStorage.getItem('tcdd_report_slips_v1');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return TCDD_ACTUAL_SLIPS;
  });

  // Security, PIN and Privacy states
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [currentPin, setCurrentPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [confirmNewPin, setConfirmNewPin] = useState<string>('');
  const [securityError, setSecurityError] = useState<string>('');
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showCurrentPin, setShowCurrentPin] = useState<boolean>(false);
  const [showNewPin, setShowNewPin] = useState<boolean>(false);
  const [isChangingPin, setIsChangingPin] = useState<boolean>(false);
  const [isPrivacyMasked, setIsPrivacyMasked] = useState<boolean>(false);

  // Security handlers
  const handleUnlock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSecurityError('');
    if (!enteredPin.trim()) {
      setSecurityError('Lütfen şifrenizi giriniz.');
      return;
    }
    const valid = await verifyPassword(enteredPin);
    if (valid) {
      setIsUnlocked(true);
      setEnteredPin('');
      setSecurityError('');
    } else {
      setSecurityError('Hatalı şifre! Lütfen tekrar deneyiniz.');
    }
  };

  const handleSetNewPin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSecurityError('');
    setPasswordSuccessMsg('');

    if (!currentPin.trim()) {
      setSecurityError('Lütfen mevcut şifrenizi giriniz.');
      return;
    }

    const clean = newPin.trim();
    if (clean.length < 4) {
      setSecurityError('Yeni şifreniz en az 4 karakterden oluşmalıdır.');
      return;
    }
    if (clean !== confirmNewPin.trim()) {
      setSecurityError('Girdiğiniz yeni şifreler birbiriyle eşleşmiyor.');
      return;
    }

    const res = await changePasswordWithCurrent(currentPin, clean);
    if (res.success) {
      setPasswordSuccessMsg('Güvenlik şifreniz başarıyla değiştirildi.');
      setIsChangingPin(false);
      setCurrentPin('');
      setNewPin('');
      setConfirmNewPin('');
      setSecurityError('');
      setTimeout(() => setPasswordSuccessMsg(''), 5000);
    } else {
      setSecurityError(res.error || 'Şifre değiştirilemedi.');
    }
  };

  const handleLockReport = () => {
    setIsUnlocked(false);
    setEnteredPin('');
    setSecurityError('');
    setIsChangingPin(false);
    setCurrentPin('');
    setNewPin('');
    setConfirmNewPin('');
  };

  const handleModalClose = () => {
    // Re-lock so subsequent opens require the password
    setIsUnlocked(false);
    setEnteredPin('');
    setSecurityError('');
    setIsChangingPin(false);
    setCurrentPin('');
    setNewPin('');
    setConfirmNewPin('');
    onClose();
  };

  // Helper for formatted money with privacy mask support
  const fmt = (amount: number | undefined | null): string => {
    if (amount === undefined || amount === null) return '0,00 ₺';
    if (isPrivacyMasked) return '•••••• ₺';
    return `${formatCurrency(amount)} ₺`;
  };

  // Calculate overall aggregates
  const totals = useMemo(() => {
    const gross = customSlips.reduce((acc, s) => acc + (s.gelirToplami || 0), 0);
    const deductions = customSlips.reduce((acc, s) => acc + (s.kesintiTopl || 0), 0);
    const net = customSlips.reduce((acc, s) => acc + (s.netOdeme || 0), 0);
    const incomeTax = customSlips.reduce((acc, s) => acc + (s.gelirVergisi || 0), 0);
    const stampTax = customSlips.reduce((acc, s) => acc + (s.damgaVergisi || 0), 0);
    const totalTax = incomeTax + stampTax;
    const sskEmployee = customSlips.reduce((acc, s) => acc + (s.sskPrimIsci || 0), 0);
    const sskEmployer = customSlips.reduce((acc, s) => acc + (s.sskPrimIsv || 0), 0);
    const unionDues = customSlips.reduce((acc, s) => acc + (s.sendikaAidaAmount || 0), 0);
    const avgNet = customSlips.length > 0 ? net / customSlips.length : 0;
    const deductionRate = gross > 0 ? (deductions / gross) * 100 : 0;
    const netRate = gross > 0 ? (net / gross) * 100 : 0;
    const taxRate = gross > 0 ? (totalTax / gross) * 100 : 0;
    const sskRate = gross > 0 ? (sskEmployee / gross) * 100 : 0;

    return {
      gross,
      deductions,
      net,
      incomeTax,
      stampTax,
      totalTax,
      sskEmployee,
      sskEmployer,
      unionDues,
      avgNet,
      deductionRate,
      netRate,
      taxRate,
      sskRate,
      count: customSlips.length
    };
  }, [customSlips]);

  // Selected slip for detailed inspection
  const selectedSlip = useMemo(() => {
    return customSlips.find(s => s.periodCode === selectedMonthCode) || customSlips[customSlips.length - 1];
  }, [customSlips, selectedMonthCode]);

  // Maximum value for bar charts scaling
  const maxGross = useMemo(() => {
    return Math.max(...customSlips.map(s => s.gelirToplami), 140000);
  }, [customSlips]);

  if (!isOpen) return null;

  // Add or update current active bordro into report list
  const handleSaveCurrentToReport = () => {
    const periodCode = currentBordro.aySecim < 10 ? `0${currentBordro.aySecim}/2026` : `${currentBordro.aySecim}/2026`;
    const newSlip: TcddMonthlySlip = {
      periodCode,
      periodDates: currentBordro.bordroDonem.replace(periodCode, '').trim() || '(15.gün-14.gün)',
      monthIndex: currentBordro.aySecim,
      monthName: `${currentBordro.aySecim}. Ay 2026`,
      islYs: currentBordro.islYS,
      adi: currentBordro.adi,
      soyadi: currentBordro.soyadi,
      sicilNo: currentBordro.sicilNo,
      persNo: currentBordro.persNo,
      sskNo: currentBordro.sskNo,
      unvani: currentBordro.unvani,
      derKad: currentBordro.derKad,
      kidemYili: currentBordro.kidemYili,
      hzmZammiYil: currentBordro.hzmZammiYil,
      saatUcr: currentBordro.saatUcr,
      emkZam: currentBordro.emkZam,
      brtAylk: currentBordro.brtAylk,
      kdmZam: currentBordro.kdmZam,
      hastGun: currentBordro.hastGun,
      isySsk: currentBordro.isySsk,
      normalCalisHours: currentBordro.earnings.find(e => e.id === 'nc')?.hours || 0,
      normalCalisAmount: currentBordro.earnings.find(e => e.id === 'nc')?.amount || 0,
      haftaTatiliHours: currentBordro.earnings.find(e => e.id === 'ht')?.hours || 0,
      haftaTatiliAmount: currentBordro.earnings.find(e => e.id === 'ht')?.amount || 0,
      ubgtHours: currentBordro.earnings.find(e => e.id === 'ubgt')?.hours || 0,
      ubgtAmount: currentBordro.earnings.find(e => e.id === 'ubgt')?.amount || 0,
      ucretliIzinHours: currentBordro.earnings.find(e => e.id === 'ui')?.hours || 0,
      ucretliIzinAmount: currentBordro.earnings.find(e => e.id === 'ui')?.amount || 0,
      ucretliRapoHours: currentBordro.earnings.find(e => e.id === 'ur')?.hours || 0,
      ucretliRapoAmount: currentBordro.earnings.find(e => e.id === 'ur')?.amount || 0,
      fzlMes100Hours: currentBordro.earnings.find(e => e.id === 'fm')?.hours || 0,
      fzlMes100Amount: currentBordro.earnings.find(e => e.id === 'fm')?.amount || 0,
      vardiyaPrimHours: currentBordro.earnings.find(e => e.id === 'vp')?.hours || 0,
      vardiyaPrimAmount: currentBordro.earnings.find(e => e.id === 'vp')?.amount || 0,
      geceCalismaHours: currentBordro.earnings.find(e => e.id === 'gc')?.hours || 0,
      geceCalismaAmount: currentBordro.earnings.find(e => e.id === 'gc')?.amount || 0,
      iaseGunuDays: currentBordro.earnings.find(e => e.id === 'iase')?.hours || 0,
      iaseGunuAmount: currentBordro.earnings.find(e => e.id === 'iase')?.amount || 0,
      gst10Hours: currentBordro.earnings.find(e => e.id === 'gst')?.hours || 0,
      gst10Amount: currentBordro.earnings.find(e => e.id === 'gst')?.amount || 0,
      hizmetZammiYear: currentBordro.earnings.find(e => e.id === 'hzm')?.hours || 0,
      hizmetZammiAmount: currentBordro.earnings.find(e => e.id === 'hzm')?.amount || 0,
      gms17Plus7Hours: currentBordro.earnings.find(e => e.id === 'gms')?.hours || 0,
      gms17Plus7Amount: currentBordro.earnings.find(e => e.id === 'gms')?.amount || 0,
      birlestirilmAmount: currentBordro.birlestirilmSosyalYardim,
      sendikaAidaAmount: currentBordro.sendikaAidati,
      sporAidatiAmount: currentBordro.sporAidati,
      vergidenMuaAmount: currentBordro.vergiMuafiyeti,
      terfiFarkAmount: currentBordro.terfiFarki,
      mahsupKsntAmount: currentBordro.mahsupKesintisi,
      sskMatrahDAmount: currentBordro.sskMatrahD,
      calistigiGun: currentBordro.calistigiGun,
      sskGunu: currentBordro.sskGunu,
      sskMatrahi: currentBordro.sskMatrahi,
      sskPrimIsci: currentBordro.sskPrimIsci,
      sskPrimIsv: currentBordro.sskPrimIsv,
      yillikGlrVm: currentBordro.yillikGlrVM + currentBordro.aylikGlrVM,
      aylikGlrVm: currentBordro.aylikGlrVM,
      gelirVergisi: currentBordro.gelirVergisi,
      damgaVergisi: currentBordro.damgaVergisi,
      issSigIsci: currentBordro.issSigIsc,
      issSigIsv: currentBordro.issSigIsv,
      mahsupFark: currentBordro.mahsupFark,
      gelirToplami: currentBordro.gelirToplami,
      kesintiTopl: currentBordro.kesintiTopl,
      netOdeme: currentBordro.netOdeme,
      asgariGecIn: currentBordro.asgariGecIn
    };

    const existingIndex = customSlips.findIndex(s => s.periodCode === periodCode);
    let updated: TcddMonthlySlip[];
    if (existingIndex >= 0) {
      updated = [...customSlips];
      updated[existingIndex] = newSlip;
    } else {
      updated = [...customSlips, newSlip].sort((a, b) => a.monthIndex - b.monthIndex);
    }
    setCustomSlips(updated);
    try {
      localStorage.setItem('tcdd_report_slips_v1', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setSelectedMonthCode(periodCode);
  };

  // Reset to original TCDD official records
  const handleResetToOfficial = () => {
    if (window.confirm('Rapor verilerini orijinal 8 aylık TCDD resmi bordro verilerine sıfırlamak istiyor musunuz?')) {
      setCustomSlips(TCDD_ACTUAL_SLIPS);
      try {
        localStorage.removeItem('tcdd_report_slips_v1');
      } catch {
        // ignore
      }
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Dönem',
      'Ay',
      'Gelir Toplamı (₺)',
      'Kesinti Toplamı (₺)',
      'Net Ödeme (₺)',
      'SGK Matrahı (₺)',
      'SSK Prim İşçi (₺)',
      'Gelir Vergisi (₺)',
      'Damga Vergisi (₺)',
      'Sendika Aidatı (₺)'
    ];
    const rows = customSlips.map(s => [
      s.periodCode,
      s.monthName,
      s.gelirToplami.toFixed(2),
      s.kesintiTopl.toFixed(2),
      s.netOdeme.toFixed(2),
      s.sskMatrahi.toFixed(2),
      s.sskPrimIsci.toFixed(2),
      s.gelirVergisi.toFixed(2),
      s.damgaVergisi.toFixed(2),
      s.sendikaAidaAmount.toFixed(2)
    ]);
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tcdd-maas-raporu-2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  // If locked, require PIN / password to access personal salary data
  if (!isUnlocked) {
    return (
      <div
        id="salary-report-lock-overlay"
        className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-dotmatrix animate-in fade-in duration-150"
      >
        <div
          id="salary-report-lock-card"
          className="bg-slate-900 border-2 border-slate-700 text-white rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-2xl overflow-hidden relative"
        >
          {/* Close button */}
          <button
            id="btn-lock-close"
            type="button"
            onClick={handleModalClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>

          {/* ŞİFRE İLE GÜVENLİ GİRİŞ EKRANI (Varsayılan: 1510) */}
          <div>
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto mb-3">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-center text-white mb-1">
              Kişiye Özel Rapor Kilitli
            </h3>
            <p className="text-xs text-slate-400 text-center mb-4 leading-relaxed">
              Bu rapordaki maaş ve vergi bilgileri <strong className="text-white">İlyas İLMEK</strong> personeline aittir. Görüntülemek için rapor güvenlik şifrenizi giriniz.
            </p>

            {securityError && (
              <div className="mb-3.5 p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-lg text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{securityError}</span>
              </div>
            )}

            <form onSubmit={handleUnlock} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Giriş Şifreniz / PIN
                </label>
                <div className="relative">
                  <input
                    id="input-enter-report-pin"
                    type={showPassword ? 'text' : 'password'}
                    inputMode="numeric"
                    value={enteredPin}
                    onChange={e => setEnteredPin(e.target.value)}
                    onFocus={e => e.target.select()}
                    onClick={e => (e.target as HTMLInputElement).select()}
                    placeholder="Şifrenizi girin"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 pr-10 outline-none font-mono tracking-wider"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="btn-unlock-report"
                type="submit"
                className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs sm:text-sm rounded-lg transition shadow-lg flex items-center justify-center gap-2 cursor-pointer ring-2 ring-emerald-500/40"
              >
                <Unlock className="w-4 h-4" />
                <span>Rapor Kilidini Aç</span>
              </button>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-end text-xs">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="salary-report-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 font-dotmatrix overflow-y-auto"
    >
      <div
        id="salary-report-modal-content"
        className="bg-white border-2 border-slate-800 rounded-xl w-full max-w-7xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 relative"
      >
        {/* Şifre Değiştirme Modal Açılır Penceresi (Mevcut Şifre Doğrulaması Şarttır) */}
        {isChangingPin && (
          <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 text-white rounded-xl max-w-sm w-full p-5 shadow-2xl relative">
              <button
                type="button"
                onClick={() => {
                  setIsChangingPin(false);
                  setSecurityError('');
                  setCurrentPin('');
                  setNewPin('');
                  setConfirmNewPin('');
                }}
                className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
              <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <span>Güvenlik Şifresini Değiştir</span>
              </h4>
              <p className="text-[11px] text-slate-400 mb-3">
                Güvenliğiniz için yeni bir şifre belirleyebilmek adına önce mevcut şifrenizi doğrulamanız şarttır.
              </p>

              {securityError && (
                <div className="mb-3 p-2 bg-rose-500/20 border border-rose-500/40 rounded text-rose-300 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{securityError}</span>
                </div>
              )}

              <form onSubmit={handleSetNewPin} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mevcut Şifreniz</label>
                  <div className="relative">
                    <input
                      type={showCurrentPin ? 'text' : 'password'}
                      inputMode="numeric"
                      value={currentPin}
                      onChange={e => setCurrentPin(e.target.value)}
                      onFocus={e => e.target.select()}
                      onClick={e => (e.target as HTMLInputElement).select()}
                      placeholder="Şu anki geçerli şifreniz"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded px-3 py-2 text-white pr-9 outline-none font-mono"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPin(!showCurrentPin)}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-200"
                    >
                      {showCurrentPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Yeni Şifre (En az 4 karakter)</label>
                  <div className="relative">
                    <input
                      type={showNewPin ? 'text' : 'password'}
                      inputMode="numeric"
                      value={newPin}
                      onChange={e => setNewPin(e.target.value)}
                      onFocus={e => e.target.select()}
                      onClick={e => (e.target as HTMLInputElement).select()}
                      placeholder="Yeni şifreniz"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded px-3 py-2 text-white pr-9 outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPin(!showNewPin)}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-200"
                    >
                      {showNewPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Yeni Şifre Tekrarı</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={confirmNewPin}
                    onChange={e => setConfirmNewPin(e.target.value)}
                    onFocus={e => e.target.select()}
                    onClick={e => (e.target as HTMLInputElement).select()}
                    placeholder="Yeni şifrenizi tekrar girin"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded px-3 py-2 text-white outline-none font-mono"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPin(false);
                      setSecurityError('');
                      setCurrentPin('');
                      setNewPin('');
                      setConfirmNewPin('');
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded cursor-pointer flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Şifreyi Güncelle</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Top Header Bar */}
        <div className="bg-slate-900 text-white p-3 sm:p-4 border-b-2 border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase">
                  TCDD TAŞIMACILIK A.Ş. MAAŞ & GELİR-GİDER RAPORU
                </h2>
                <span className="text-[11px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-700">
                  {totals.count} Bordro Dönemi
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Personel: <strong className="text-white">İlyas İLMEK</strong> (Sicil: 084857 • Vagon İmal ve Tamirci) | 31. Dönem TİS Kapsamı
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Şifre Korumalı & Özel Rozeti */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-950/80 border border-emerald-600/60 rounded-md text-[11px] text-emerald-300 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kişiye Özel & Şifreli</span>
            </div>

            {/* Gizlilik Maskeleme Butonu */}
            <button
              id="btn-report-privacy"
              type="button"
              onClick={() => setIsPrivacyMasked(!isPrivacyMasked)}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded border transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isPrivacyMasked
                  ? 'bg-amber-950/80 border-amber-600 text-amber-300 hover:bg-amber-900/80'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title={isPrivacyMasked ? 'Maaş rakamlarını göster' : 'Maaş rakamlarını gizle/maskele'}
            >
              {isPrivacyMasked ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
              <span>{isPrivacyMasked ? 'Rakamları Göster' : 'Gizle'}</span>
            </button>

            {/* Şifre Değiştir */}
            <button
              id="btn-report-change-pin"
              type="button"
              onClick={() => {
                setIsChangingPin(true);
                setSecurityError('');
                setCurrentPin('');
                setNewPin('');
                setConfirmNewPin('');
              }}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              title="Rapor güvenlik şifresini değiştir"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span>Şifre Değiştir</span>
            </button>

            {/* Kilitle */}
            <button
              id="btn-report-lock"
              type="button"
              onClick={handleLockReport}
              className="px-2.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-700 text-xs font-semibold rounded shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              title="Raporu hemen kilitle ve şifre korumasına al"
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>Kilitle</span>
            </button>

            <button
              id="btn-report-save-current"
              type="button"
              onClick={handleSaveCurrentToReport}
              className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              title="Şu an ekranda açık olan bordroyu bu raporun listesine ekler veya günceller"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Mevcut Ayı Ekle
            </button>

            <button
              id="btn-report-export-csv"
              type="button"
              onClick={handleExportCSV}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              title="Rapor tablosunu Excel / CSV olarak indir"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              CSV
            </button>

            <button
              id="btn-report-print"
              type="button"
              onClick={() => window.print()}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              title="Raporu yazdır veya PDF olarak kaydet"
            >
              <Printer className="w-3.5 h-3.5" />
              Yazdır
            </button>

            <button
              id="btn-report-reset"
              type="button"
              onClick={handleResetToOfficial}
              className="px-2 py-1.5 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-200 text-xs rounded border border-slate-700 transition flex items-center gap-1 cursor-pointer"
              title="Orijinal resmi TCDD 8 bordrosuna sıfırla"
            >
              <RotateCcw className="w-3 h-3" />
            </button>

            <button
              id="btn-report-close"
              type="button"
              onClick={handleModalClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="Raporu Kapat ve Kilitle"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Başarı Bildirim Çubuğu */}
        {passwordSuccessMsg && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-2.5 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-200 shrink-0" />
              <span>{passwordSuccessMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setPasswordSuccessMsg('')}
              className="text-emerald-200 hover:text-white p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Navigation Controls */}
        <div className="bg-slate-100 border-b border-slate-300 px-3 sm:px-4 py-2 flex flex-wrap gap-2 items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              id="tab-btn-kpi"
              type="button"
              onClick={() => setActiveTab('kpi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'kpi'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Genel Özet & Grafikler</span>
            </button>

            <button
              id="tab-btn-table"
              type="button"
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'table'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>Tüm Önceki Maaşlar Tablosu</span>
            </button>

            <button
              id="tab-btn-breakdown"
              type="button"
              onClick={() => setActiveTab('breakdown')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'breakdown'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Gelir & Gider Kalemleri</span>
            </button>

            <button
              id="tab-btn-tax"
              type="button"
              onClick={() => setActiveTab('tax')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'tax'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Percent className="w-3.5 h-3.5 text-purple-400" />
              <span>Vergi & SGK Raporu</span>
            </button>
          </div>

          <div className="text-xs text-slate-600 flex items-center gap-2">
            <span>Seçili Ay:</span>
            <select
              id="select-report-month"
              value={selectedMonthCode}
              onChange={e => setSelectedMonthCode(e.target.value)}
              className="bg-white text-slate-800 border border-slate-300 rounded px-2 py-1 text-xs font-bold font-mono focus:border-slate-800"
            >
              {customSlips.map(s => (
                <option key={s.periodCode} value={s.periodCode}>
                  {s.monthName} ({s.periodCode})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Main Scrollable Content */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-5 bg-slate-50/50 flex-1">
          {/* TAB 1: GENEL ÖZET & GRAFİKLER */}
          {activeTab === 'kpi' && (
            <div className="space-y-5">
              {/* Macro Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {/* 1. Toplam Brüt Gelir */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-300 shadow-2xs">
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">
                    Toplam Brüt Gelir
                  </span>
                  <div className="text-lg 2xl:text-xl font-black text-slate-900 mt-1 font-mono">
                    {fmt(totals.gross)}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {totals.count} Dönem Hakediş Toplamı
                  </span>
                </div>

                {/* 2. Toplam Kesintiler */}
                <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-200 shadow-2xs">
                  <span className="text-[11px] text-rose-700 font-semibold block uppercase">
                    Toplam Kesintiler (Gider)
                  </span>
                  <div className="text-lg 2xl:text-xl font-black text-rose-700 mt-1 font-mono">
                    {fmt(totals.deductions)}
                  </div>
                  <span className="text-[10px] text-rose-600 mt-1 block font-medium">
                    Kesinti Oranı: %{totals.deductionRate.toFixed(1)}
                  </span>
                </div>

                {/* 3. Toplam Net Ele Geçen */}
                <div className="bg-emerald-50 p-3.5 rounded-xl border-2 border-emerald-500 shadow-xs">
                  <span className="text-[11px] text-emerald-800 font-bold block uppercase tracking-wide">
                    Toplam Net Maaş (Ele Geçen)
                  </span>
                  <div className="text-xl 2xl:text-2xl font-black text-emerald-800 mt-1 font-mono">
                    {fmt(totals.net)}
                  </div>
                  <span className="text-[10px] text-emerald-700 mt-1 block font-semibold">
                    Ort. Aylık: {fmt(totals.avgNet)}
                  </span>
                </div>

                {/* 4. Toplam Ödenen Vergiler */}
                <div className="bg-purple-50/70 p-3.5 rounded-xl border border-purple-200 shadow-2xs">
                  <span className="text-[11px] text-purple-700 font-semibold block uppercase">
                    Toplam Vergi (GV + DV)
                  </span>
                  <div className="text-lg 2xl:text-xl font-black text-purple-900 mt-1 font-mono">
                    {fmt(totals.totalTax)}
                  </div>
                  <span className="text-[10px] text-purple-600 mt-1 block font-medium">
                    GV: {fmt(totals.incomeTax)} | DV: {fmt(totals.stampTax)}
                  </span>
                </div>

                {/* 5. Toplam SGK Primi */}
                <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 shadow-2xs">
                  <span className="text-[11px] text-blue-700 font-semibold block uppercase">
                    Toplam SGK Primi (İşçi)
                  </span>
                  <div className="text-lg 2xl:text-xl font-black text-blue-900 mt-1 font-mono">
                    {fmt(totals.sskEmployee)}
                  </div>
                  <span className="text-[10px] text-blue-600 mt-1 block font-medium">
                    İşveren Payı: {fmt(totals.sskEmployer)}
                  </span>
                </div>
              </div>

              {/* GRAFİK 1: AYLIK MAAŞ GELİŞİMİ BAR GRAFİĞİ (GELİR / KESİNTİ / NET) */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-300 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-600" />
                      Aylara Göre Maaş & Gelir-Gider Karşılaştırması
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Her ay için Brüt Gelir, Kesintiler ve Net Ele Geçen Maaş seyri
                    </p>
                  </div>

                  {/* Graph Legend */}
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-xs bg-sky-600 inline-block" />
                      <span className="text-slate-700">Brüt Gelir</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block" />
                      <span className="text-slate-700">Kesintiler</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
                      <span className="text-slate-700">Net Maaş</span>
                    </div>
                  </div>
                </div>

                {/* Bar Chart Container */}
                <div className="pt-2">
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3 items-end h-56 sm:h-64 border-b border-slate-300 pb-2">
                    {customSlips.map(slip => {
                      const grossHeight = Math.min(100, Math.round((slip.gelirToplami / maxGross) * 100));
                      const netHeight = Math.min(100, Math.round((slip.netOdeme / maxGross) * 100));
                      const dedHeight = Math.min(100, Math.round((slip.kesintiTopl / maxGross) * 100));
                      const isSelected = slip.periodCode === selectedMonthCode;

                      return (
                        <div
                          key={slip.periodCode}
                          onClick={() => setSelectedMonthCode(slip.periodCode)}
                          className={`flex flex-col items-center justify-end h-full p-1 sm:p-1.5 rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-slate-100 ring-2 ring-slate-800'
                              : 'hover:bg-slate-50'
                          }`}
                          title={`${slip.monthName} (${slip.periodCode})\nBrüt: ${formatCurrency(slip.gelirToplami)} ₺\nKesinti: ${formatCurrency(slip.kesintiTopl)} ₺\nNet: ${formatCurrency(slip.netOdeme)} ₺`}
                        >
                          {/* Triple Bars */}
                          <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-44">
                            {/* Gross Bar */}
                            <div
                              style={{ height: `${grossHeight}%` }}
                              className="w-2.5 sm:w-3.5 bg-sky-600 rounded-t transition-all hover:brightness-110"
                            />
                            {/* Net Bar */}
                            <div
                              style={{ height: `${netHeight}%` }}
                              className="w-2.5 sm:w-3.5 bg-emerald-600 rounded-t transition-all hover:brightness-110"
                            />
                            {/* Deductions Bar */}
                            <div
                              style={{ height: `${dedHeight}%` }}
                              className="w-2 sm:w-2.5 bg-rose-500 rounded-t transition-all hover:brightness-110"
                            />
                          </div>

                          {/* Net Value Text */}
                          <div className="mt-1 text-[10px] font-bold text-slate-800 font-mono text-center">
                            {Math.round(slip.netOdeme / 1000)}k
                          </div>
                          {/* Month Label */}
                          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-600 text-center truncate w-full">
                            {slip.monthName.split(' ')[0]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Info bar below graph */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800">Seçili Dönem:</span>
                    <span className="text-emerald-700 font-bold">{selectedSlip.monthName} ({selectedSlip.periodCode})</span>
                    <span className="text-slate-400">•</span>
                    <span>Brüt: <strong>{fmt(selectedSlip.gelirToplami)}</strong></span>
                    <span className="text-slate-400">•</span>
                    <span>Kesinti: <strong className="text-rose-600">{fmt(selectedSlip.kesintiTopl)}</strong></span>
                    <span className="text-slate-400">•</span>
                    <span>Net Ele Geçen: <strong className="text-emerald-700">{fmt(selectedSlip.netOdeme)}</strong></span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onLoadBordro(slipToBordroData(selectedSlip));
                      onClose();
                    }}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded flex items-center gap-1 cursor-pointer transition shadow-2xs"
                  >
                    <span>Bu Ayı Düzenleyiciye Aktar</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* GRAFİK 2 & 3: KESİNTİ DAĞILIMI VE KÜMÜLATİF VERGİ GELİŞİMİ */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Sol: 100 TL Gelirin Dağılımı (Stacked Bar / Donut Analizi) */}
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-300 shadow-2xs space-y-3">
                  <div className="border-b border-slate-200 pb-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-purple-600" />
                      Gelirin Harcama & Kesinti Dağılımı (100 ₺ Kırılımı)
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Toplam brüt hakedişin ne kadarı ele geçiyor, ne kadarı vergi ve primlere gidiyor?
                    </p>
                  </div>

                  {/* Multi-segment Bar */}
                  <div className="space-y-2">
                    <div className="h-6 w-full rounded-lg overflow-hidden flex shadow-inner">
                      <div
                        style={{ width: `${totals.netRate}%` }}
                        className="bg-emerald-500 transition-all flex items-center justify-center text-[10px] font-bold text-white"
                        title={`Net Ele Geçen: %${totals.netRate.toFixed(1)}`}
                      >
                        %{totals.netRate.toFixed(0)} Net
                      </div>
                      <div
                        style={{ width: `${(totals.incomeTax / totals.gross) * 100}%` }}
                        className="bg-purple-600 transition-all flex items-center justify-center text-[10px] font-bold text-white"
                        title={`Gelir Vergisi: %${((totals.incomeTax / totals.gross) * 100).toFixed(1)}`}
                      >
                        %{((totals.incomeTax / totals.gross) * 100).toFixed(0)} GV
                      </div>
                      <div
                        style={{ width: `${totals.sskRate}%` }}
                        className="bg-blue-600 transition-all flex items-center justify-center text-[10px] font-bold text-white"
                        title={`SGK Primi: %${totals.sskRate.toFixed(1)}`}
                      >
                        %{totals.sskRate.toFixed(0)} SSK
                      </div>
                      <div
                        style={{ width: `${((totals.unionDues + totals.stampTax) / totals.gross) * 100}%` }}
                        className="bg-amber-500 transition-all flex items-center justify-center text-[10px] font-bold text-white"
                        title="Sendika & Damga Vergisi"
                      >
                        Diğer
                      </div>
                    </div>

                    {/* Breakdown Details List */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                      <div className="p-2 rounded bg-emerald-50 border border-emerald-200 flex justify-between items-center">
                        <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                          Net Maaş (Ele Geçen):
                        </span>
                        <strong className="text-emerald-900 font-mono">%{totals.netRate.toFixed(1)}</strong>
                      </div>

                      <div className="p-2 rounded bg-purple-50 border border-purple-200 flex justify-between items-center">
                        <span className="font-semibold text-purple-900 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
                          Gelir Vergisi:
                        </span>
                        <strong className="text-purple-900 font-mono">%{((totals.incomeTax / totals.gross) * 100).toFixed(1)}</strong>
                      </div>

                      <div className="p-2 rounded bg-blue-50 border border-blue-200 flex justify-between items-center">
                        <span className="font-semibold text-blue-900 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                          SSK İşçi Primi (%9):
                        </span>
                        <strong className="text-blue-900 font-mono">%{totals.sskRate.toFixed(1)}</strong>
                      </div>

                      <div className="p-2 rounded bg-amber-50 border border-amber-200 flex justify-between items-center">
                        <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
                          Sendika & Diğer Kesintiler:
                        </span>
                        <strong className="text-amber-900 font-mono">%{((totals.unionDues + totals.stampTax) / totals.gross * 100).toFixed(1)}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sağ: Vergi Dilimleri ve Kümülatif Matrah Basamakları */}
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-300 shadow-2xs space-y-3">
                  <div className="border-b border-slate-200 pb-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <Percent className="w-4 h-4 text-rose-600" />
                      GİB 2026 Gelir Vergisi Dilim İlerlemesi
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Kümülatif gelir vergisi matrahı arttıkça vergi dilimi yükselir (%15 ➔ %20 ➔ %27)
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    {/* %15 Dilimi */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                        <span>1. Dilim (%15): 0 - 190.000 TL</span>
                        <span className="font-bold text-emerald-700">Tamamlandı (Ocak-Şubat)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full w-full" />
                      </div>
                    </div>

                    {/* %20 Dilimi */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                        <span>2. Dilim (%20): 190.000 - 400.000 TL</span>
                        <span className="font-bold text-amber-700">Tamamlandı (Mart-Nisan)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-full" />
                      </div>
                    </div>

                    {/* %27 Dilimi */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                        <span>3. Dilim (%27): 400.000 - 1.500.000 TL</span>
                        <span className="font-bold text-rose-700">Aktif Dilim (%27 uygulanıyor)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-rose-600 h-full w-[65%]" />
                      </div>
                    </div>

                    <div className="pt-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
                      * <strong>Vergiden Muafiyet:</strong> Her ay 3.000 TL 3. derece engellilik indirimi ve asgari ücret tutarı kadar gelir vergisi istisnası uygulanmaktadır.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TÜM ÖNCEKİ MAAŞLAR TABLOSU */}
          {activeTab === 'table' && (
            <div className="bg-white rounded-xl border border-slate-300 shadow-2xs overflow-hidden space-y-0">
              <div className="p-3 bg-slate-100 border-b border-slate-300 flex flex-wrap justify-between items-center gap-2">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                    2026 Yılı Ay Ay Gerçek Bordro Cetveli
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Satırlara tıklayarak o ayın bordrosunu ana ekrandaki düzenleyiciye yükleyebilirsiniz
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded border border-emerald-300">
                  Toplam {customSlips.length} Ay Kayıtlı
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-dotmatrix">
                  <thead className="bg-slate-900 text-slate-200 text-[11px] uppercase tracking-wider whitespace-nowrap">
                    <tr>
                      <th className="py-2.5 px-3">Dönem / Ay</th>
                      <th className="py-2.5 px-3 text-right">Gelir Toplamı</th>
                      <th className="py-2.5 px-3 text-right text-rose-300">Kesintiler</th>
                      <th className="py-2.5 px-3 text-right text-emerald-300 font-bold bg-slate-950">
                        Net Ele Geçen
                      </th>
                      <th className="py-2.5 px-3 text-right">SGK Matrahı</th>
                      <th className="py-2.5 px-3 text-right">SGK İşçi (%9)</th>
                      <th className="py-2.5 px-3 text-right">Gelir Vergisi</th>
                      <th className="py-2.5 px-3 text-right">Damga Vergisi</th>
                      <th className="py-2.5 px-3 text-right">Sendika Aidatı</th>
                      <th className="py-2.5 px-3 text-center">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-xs whitespace-nowrap">
                    {customSlips.map((s, idx) => {
                      const isSelected = s.periodCode === selectedMonthCode;
                      return (
                        <tr
                          key={s.periodCode}
                          onClick={() => setSelectedMonthCode(s.periodCode)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-amber-50/80 font-semibold'
                              : idx % 2 === 0
                              ? 'bg-white hover:bg-slate-50'
                              : 'bg-slate-50/70 hover:bg-slate-100'
                          }`}
                        >
                          <td className="py-2.5 px-3 font-sans font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{s.monthName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">({s.periodCode})</span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                            {formatCurrency(s.gelirToplami)} ₺
                          </td>
                          <td className="py-2.5 px-3 text-right text-rose-700 font-semibold">
                            {formatCurrency(s.kesintiTopl)} ₺
                          </td>
                          <td className="py-2.5 px-3 text-right font-black text-emerald-800 bg-emerald-50/50 text-sm">
                            {formatCurrency(s.netOdeme)} ₺
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-700">
                            {formatCurrency(s.sskMatrahi)} ₺
                          </td>
                          <td className="py-2.5 px-3 text-right text-blue-700">
                            {formatCurrency(s.sskPrimIsci)} ₺
                          </td>
                          <td className="py-2.5 px-3 text-right text-purple-800">
                            {formatCurrency(s.gelirVergisi)} ₺
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-700">
                            {formatCurrency(s.damgaVergisi)} ₺
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-700">
                            {formatCurrency(s.sendikaAidaAmount)} ₺
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onLoadBordro(slipToBordroData(s));
                                onClose();
                              }}
                              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-bold font-sans cursor-pointer transition shadow-2xs"
                              title="Bu bordroyu düzenleyiciye aktar"
                            >
                              Yükle
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-900 text-white font-mono font-bold text-xs border-t-2 border-slate-800 whitespace-nowrap">
                    <tr>
                      <td className="py-3 px-3 font-sans uppercase text-emerald-400">
                        GENEL TOPLAM ({totals.count} AY):
                      </td>
                      <td className="py-3 px-3 text-right text-white">
                        {formatCurrency(totals.gross)} ₺
                      </td>
                      <td className="py-3 px-3 text-right text-rose-300">
                        {formatCurrency(totals.deductions)} ₺
                      </td>
                      <td className="py-3 px-3 text-right text-emerald-300 font-black text-sm bg-slate-950">
                        {formatCurrency(totals.net)} ₺
                      </td>
                      <td className="py-3 px-3 text-right text-slate-400">-</td>
                      <td className="py-3 px-3 text-right text-blue-300">
                        {formatCurrency(totals.sskEmployee)} ₺
                      </td>
                      <td className="py-3 px-3 text-right text-purple-300">
                        {formatCurrency(totals.incomeTax)} ₺
                      </td>
                      <td className="py-3 px-3 text-right text-slate-300">
                        {formatCurrency(totals.stampTax)} ₺
                      </td>
                      <td className="py-3 px-3 text-right text-slate-300">
                        {formatCurrency(totals.unionDues)} ₺
                      </td>
                      <td className="py-3 px-3 text-center text-slate-400">-</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: GELİR & GİDER KALEMLERİ ANALİZİ */}
          {activeTab === 'breakdown' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-2xs flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase">
                    {selectedSlip.monthName} ({selectedSlip.periodCode}) Kalem Detayları
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tarih Aralığı: {selectedSlip.periodDates} | Saat Ücreti: {selectedSlip.saatUcr.toFixed(2)} ₺
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">Ay Değiştir:</span>
                  <select
                    value={selectedMonthCode}
                    onChange={e => setSelectedMonthCode(e.target.value)}
                    className="bg-white text-slate-900 border border-slate-300 rounded px-2 py-1 text-xs font-bold font-mono"
                  >
                    {customSlips.map(s => (
                      <option key={s.periodCode} value={s.periodCode}>
                        {s.monthName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hakediş Kalemleri Listesi */}
                <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-2xs space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-emerald-800 uppercase flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      Hakediş Kalemleri (Gelirler)
                    </span>
                    <strong className="text-xs text-emerald-800 font-mono">
                      {formatCurrency(selectedSlip.gelirToplami)} ₺
                    </strong>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">Normal Çalışma ({selectedSlip.normalCalisHours} saat):</span>
                      <strong className="font-mono text-slate-900">{formatCurrency(selectedSlip.normalCalisAmount)} ₺</strong>
                    </div>

                    {(selectedSlip.haftaTatiliAmount || 0) > 0 && (
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-700">Hafta Tatili ({selectedSlip.haftaTatiliHours} saat):</span>
                        <strong className="font-mono text-slate-900">{formatCurrency(selectedSlip.haftaTatiliAmount)} ₺</strong>
                      </div>
                    )}

                    {(selectedSlip.ucretliIzinAmount || 0) > 0 && (
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-700">Ücretli İzin ({selectedSlip.ucretliIzinHours} saat):</span>
                        <strong className="font-mono text-slate-900">{formatCurrency(selectedSlip.ucretliIzinAmount)} ₺</strong>
                      </div>
                    )}

                    {(selectedSlip.ucretliRapoAmount || 0) > 0 && (
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-700">Ücretli Rapor ({selectedSlip.ucretliRapoHours} saat):</span>
                        <strong className="font-mono text-slate-900">{formatCurrency(selectedSlip.ucretliRapoAmount)} ₺</strong>
                      </div>
                    )}

                    {(selectedSlip.pazarBayramAmount || 0) > 0 && (
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-700">Pazar/Bayram ({selectedSlip.pazarBayramHours} saat):</span>
                        <strong className="font-mono text-slate-900">{formatCurrency(selectedSlip.pazarBayramAmount)} ₺</strong>
                      </div>
                    )}

                    {(selectedSlip.vardiyaPrimAmount || 0) > 0 && (
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-700">Vardiya Prim ({selectedSlip.vardiyaPrimHours} saat):</span>
                        <strong className="font-mono text-slate-900">{formatCurrency(selectedSlip.vardiyaPrimAmount)} ₺</strong>
                      </div>
                    )}

                    {(selectedSlip.geceCalismaAmount || 0) > 0 && (
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-700">Gece Çalışma ({selectedSlip.geceCalismaHours} saat):</span>
                        <strong className="font-mono text-slate-900">{formatCurrency(selectedSlip.geceCalismaAmount)} ₺</strong>
                      </div>
                    )}

                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">İaşe Bedeli ({selectedSlip.iaseGunuDays} gün):</span>
                      <strong className="font-mono text-slate-900">{formatCurrency(selectedSlip.iaseGunuAmount)} ₺</strong>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">GŞT %10 Ek Prim ({selectedSlip.gst10Hours} saat):</span>
                      <strong className="font-mono text-emerald-800">{formatCurrency(selectedSlip.gst10Amount)} ₺</strong>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">Hizmet Zammı ({selectedSlip.hizmetZammiYear} yıl):</span>
                      <strong className="font-mono text-slate-900">{formatCurrency(selectedSlip.hizmetZammiAmount)} ₺</strong>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">GMŞ %(17+7)24 Ağır İş ({selectedSlip.gms17Plus7Hours} saat):</span>
                      <strong className="font-mono text-slate-900">{formatCurrency(selectedSlip.gms17Plus7Amount)} ₺</strong>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-slate-700">Birleştirilmiş Sosyal Yardım:</span>
                      <strong className="font-mono text-slate-900">{formatCurrency(selectedSlip.birlestirilmAmount)} ₺</strong>
                    </div>
                  </div>
                </div>

                {/* Kesintiler Listesi */}
                <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-2xs space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-rose-800 uppercase flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-rose-600" />
                      Kesintiler (Giderler)
                    </span>
                    <strong className="text-xs text-rose-800 font-mono">
                      {formatCurrency(selectedSlip.kesintiTopl)} ₺
                    </strong>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">SSK Prim İşçi (%9,000):</span>
                      <strong className="font-mono text-slate-900">{formatCurrency(selectedSlip.sskPrimIsci)} ₺</strong>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">Gelir Vergisi:</span>
                      <strong className="font-mono text-rose-700">{formatCurrency(selectedSlip.gelirVergisi)} ₺</strong>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">Damga Vergisi:</span>
                      <strong className="font-mono text-slate-900">{formatCurrency(selectedSlip.damgaVergisi)} ₺</strong>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">Demiryol-İş Sendika Aidatı:</span>
                      <strong className="font-mono text-slate-900">{formatCurrency(selectedSlip.sendikaAidaAmount)} ₺</strong>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700">Demirspor Spor Aidatı:</span>
                      <strong className="font-mono text-slate-900">{formatCurrency(selectedSlip.sporAidatiAmount)} ₺</strong>
                    </div>

                    {(selectedSlip.mahsupKsntAmount || 0) !== 0 && (
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-700">Mahsup Kesintisi:</span>
                        <strong className="font-mono text-slate-900">{formatCurrency(selectedSlip.mahsupKsntAmount)} ₺</strong>
                      </div>
                    )}

                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-300 mt-3 flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-900 uppercase">
                        Net Ele Geçen Maaş:
                      </span>
                      <strong className="text-base font-black text-emerald-800 font-mono">
                        {formatCurrency(selectedSlip.netOdeme)} ₺
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VERGİ & SGK RAPORU */}
          {activeTab === 'tax' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-300 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase">
                    Gazi / Şehit Yakını Mali Hükümleri
                  </h3>
                </div>
                <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p>
                    • <strong>GŞT %10 Ek Primi:</strong> 31. Dönem TİS 130. maddesi uyarınca günlük çıplak saat ücretinin %10'u ek prim olarak her ay hakedişlere eklenmektedir.
                  </p>
                  <p>
                    • <strong>SSK Primi (%9,000):</strong> 5510 Sayılı Kanun Madde 5/1-c gereğince malullük sağlık güvencesi bulunduğundan genel sağlık sigortası kesilmez; işçi primi %14 yerine %9 olarak tahakkuk eder.
                  </p>
                  <p>
                    • <strong>İşsizlik Sigortası Muafiyeti:</strong> 4447 Sayılı Kanun gereğince malullük aylığı alan personel işsizlik sigortasından tam muaftır (0,00 TL).
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-300 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Percent className="w-5 h-5 text-purple-600" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase">
                    Vergi İndirimleri & Muafiyetler
                  </h3>
                </div>
                <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p>
                    • <strong>3. Derece Engellilik İndirimi:</strong> Gelir Vergisi Kanunu Madde 31 uyarınca her ay vergi matrahından <strong>3.000,00 TL</strong> doğrudan düşülmektedir.
                  </p>
                  <p>
                    • <strong>Asgari Ücret Gelir & Damga Vergisi İstisnası:</strong> 7349 Sayılı Kanun uyarınca asgari ücrete isabet eden vergi tutarı bordroda istisna olarak tenzil edilmektedir.
                  </p>
                  <p>
                    • <strong>Yemek (İaşe) SGK İstisnası:</strong> Fiilen çalışılan iaşe günleri için günlük 300 TL yemek parası istisnası SSK matrahından indirilmektedir.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-300 flex flex-wrap justify-between items-center gap-2 shrink-0">
          <div className="text-xs text-slate-600">
            * Veriler TCDD Taşımacılık A.Ş. 31. Dönem TİS ve GİB 2026 mevzuat parametreleriyle tam uyumludur.
          </div>
          <button
            id="btn-report-bottom-close"
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded shadow-xs cursor-pointer transition"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
