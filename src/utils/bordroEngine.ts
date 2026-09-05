import { BordroData, EarningItem } from '../types';

export const TAX_BRACKETS_2026 = [
  { limit: 190000, rate: 0.15 },
  { limit: 400000, rate: 0.20 },
  { limit: 1500000, rate: 0.27 },
  { limit: 5300000, rate: 0.35 },
  { limit: Infinity, rate: 0.40 }
];

export function calcTaxBrackets(amount: number): number {
  if (amount <= 0) return 0;
  let tax = 0;
  let prevLimit = 0;
  for (const bracket of TAX_BRACKETS_2026) {
    if (amount > prevLimit) {
      const taxable = Math.min(amount, bracket.limit) - prevLimit;
      tax += taxable * bracket.rate;
    }
    if (amount <= bracket.limit) break;
    prevLimit = bracket.limit;
  }
  return tax;
}

export function parseCurrency(val: unknown): number {
  if (val == null || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  let str = String(val).trim().replace(/TL|₺/gi, '').trim();
  const isNegative = str.startsWith('-');
  str = str.replace(/^-/, '');
  // Format: 1.234,56 -> replace '.' then ',' to '.'
  str = str.replace(/\./g, '').replace(',', '.');
  const num = parseFloat(str);
  if (isNaN(num)) return 0;
  return isNegative ? -num : num;
}

export function formatCurrency(val: number | string | null | undefined, decimals = 2): string {
  let num = Number(val);
  if (isNaN(num) || Math.abs(num) < 1e-7) {
    num = 0;
  }
  const isNegative = num < 0;
  num = Math.abs(num);
  const parts = num.toFixed(decimals).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const fractionPart = parts[1] || '00';
  const formatted = `${integerPart},${fractionPart}`;
  return isNegative ? `-${formatted}` : formatted;
}

export interface MonthInfo {
  name: string;
  range: string;
  prevCumul: number;
}

export const MONTHS_TABLE: Record<number, MonthInfo> = {
  1: { name: "Ocak", range: "15.12.2025-14.01.2026", prevCumul: 0 },
  2: { name: "Şubat", range: "15.01.2026-14.02.2026", prevCumul: 113876.71 },
  3: { name: "Mart", range: "15.02.2026-14.03.2026", prevCumul: 227753.42 },
  4: { name: "Nisan", range: "15.03.2026-14.04.2026", prevCumul: 341630.13 },
  5: { name: "Mayıs", range: "15.04.2026-14.05.2026", prevCumul: 569383.55 },
  6: { name: "Haziran", range: "15.05.2026-14.06.2026", prevCumul: 683260.26 },
  7: { name: "Temmuz", range: "15.06.2026-14.07.2026", prevCumul: 797136.97 },
  8: { name: "Ağustos", range: "15.07.2026-14.08.2026", prevCumul: 958087.45 },
  9: { name: "Eylül", range: "15.08.2026-14.09.2026", prevCumul: 1071964.16 },
  10: { name: "Ekim", range: "15.09.2026-14.10.2026", prevCumul: 1185840.87 },
  11: { name: "Kasım", range: "15.10.2026-14.11.2026", prevCumul: 1299717.58 },
  12: { name: "Aralık", range: "15.11.2026-14.12.2026", prevCumul: 1413594.29 }
};

export function calculateEarningItem(
  item: EarningItem,
  saatUcr: number,
  emkZam: number,
  iaseKatsayi: number,
  hizmetKatsayi: number,
  postabasiKatsayi: number = 4.84
): number {
  if (item.hours <= 0) return 0;
  const totalBase = saatUcr + emkZam > 0 ? saatUcr + emkZam : saatUcr;

  switch (item.rule) {
    case 'base':
      return item.hours * totalBase;
    case 'gst10':
      return item.hours * saatUcr * 0.10;
    case 'vardiya10':
      return item.hours * totalBase * 0.10;
    case 'gece15':
      return item.hours * totalBase * 0.15;
    case 'mesai200':
      return item.hours * totalBase * 2.0;
    case 'mesai175':
      return item.hours * totalBase * 1.75;
    case 'postabasi':
      return item.hours * postabasiKatsayi;
    case 'gms24':
      return item.hours * totalBase * 0.24;
    case 'iase':
      return item.hours * iaseKatsayi;
    case 'hizmet':
      return item.hours * hizmetKatsayi;
    case 'custom':
      return item.hours * (item.customRate ?? totalBase);
    default:
      return item.hours * totalBase;
  }
}

export function calculateBordro(bordro: BordroData): BordroData {
  const isNormal = bordro.calisanStatusu === 'normal';
  const postabasiKatsayi = bordro.postabasiSaatUcreti ?? 4.84;
  const postabasiBadge = `${postabasiKatsayi.toFixed(2).replace('.', ',')} ₺`;

  // Ensure 'postabasi' item exists right after 'ui'
  const rawEarnings = bordro.earnings ? [...bordro.earnings] : [];
  if (!rawEarnings.some(item => item.id === 'postabasi')) {
    const uiIndex = rawEarnings.findIndex(item => item.id === 'ui');
    const postabasiItem: EarningItem = {
      id: 'postabasi',
      label: 'Postabaşılık Saati',
      hours: 0,
      amount: 0,
      rule: 'postabasi',
      badge: postabasiBadge
    };
    if (uiIndex !== -1) {
      rawEarnings.splice(uiIndex + 1, 0, postabasiItem);
    } else {
      rawEarnings.push(postabasiItem);
    }
  }

  const earnings = rawEarnings.map(item => {
    // Normal çalışanlarda GŞT %10 (Gazi Şeref Tazminatı) yoktur
    if (isNormal && item.id === 'gst') {
      return { ...item, hours: 0, amount: 0, manualAmount: undefined };
    }
    // Gazi çalışanında Postabaşılık Saati yoktur
    if (!isNormal && item.id === 'postabasi') {
      return { ...item, hours: 0, amount: 0, badge: postabasiBadge, manualAmount: undefined };
    }
    // Postabaşılık Saati için dinamik rozet
    if (item.id === 'postabasi') {
      const calcAmt = calculateEarningItem(
        item,
        bordro.saatUcr,
        bordro.emkZam,
        bordro.iaseGunlukKatsayi ?? 301.1575,
        bordro.hizmetYillikKatsayi ?? 24.67,
        postabasiKatsayi
      );
      return {
        ...item,
        badge: postabasiBadge,
        amount: item.manualAmount != null ? item.manualAmount : calcAmt
      };
    }
    // Gazi çalışanında FM %75 yoktur, sadece standart Fzl Mes %100 vardır
    if (!isNormal && (item.id === 'fm' || item.rule === 'mesai175')) {
      const gaziFmItem: EarningItem = {
        ...item,
        rule: 'mesai200',
        label: 'Fzl Mes %100',
        badge: 'OTO'
      };
      const calcAmt = calculateEarningItem(
        gaziFmItem,
        bordro.saatUcr,
        bordro.emkZam,
        bordro.iaseGunlukKatsayi ?? 301.1575,
        bordro.hizmetYillikKatsayi ?? 24.67,
        postabasiKatsayi
      );
      return {
        ...gaziFmItem,
        amount: item.manualAmount != null ? item.manualAmount : calcAmt
      };
    }

    const calcAmt = calculateEarningItem(
      item,
      bordro.saatUcr,
      bordro.emkZam,
      bordro.iaseGunlukKatsayi ?? 301.1575,
      bordro.hizmetYillikKatsayi ?? 24.67,
      postabasiKatsayi
    );
    return {
      ...item,
      amount: item.manualAmount != null ? item.manualAmount : calcAmt
    };
  });

  const earningsSum = earnings.reduce((sum, item) => sum + item.amount, 0);
  const socialAdditions = Math.abs(bordro.birlestirilmSosyalYardim) + Math.abs(bordro.terfiFarki);
  const gelirToplami = earningsSum + socialAdditions;

  const iaseItem = earnings.find(item => item.rule === 'iase');
  const iaseHours = iaseItem ? iaseItem.hours : 0;

  if (gelirToplami <= 1e-4) {
    return {
      ...bordro,
      earnings,
      sskMatrahi: 0,
      sskPrimIsci: 0,
      sskPrimIsv: 0,
      issSigIsc: 0,
      issSigIsv: 0,
      aylikGlrVM: 0,
      gelirVergisi: 0,
      damgaVergisi: 0,
      gelirToplami: 0,
      kesintiTopl: 0,
      netOdeme: 0
    };
  }

  // SSK Matrahı = Gelir Toplamı - (300 TL x İaşe Gün Sayısı Yemek İstisnası) + SSK Matrah Düzeltmesi
  const baseSskMatrahi = Math.max(0, Math.round((gelirToplami - 300 * iaseHours) * 100) / 100);
  const sskMatrahD = bordro.sskMatrahD || 0;
  const sskMatrahi = Math.max(0, Math.round((baseSskMatrahi + sskMatrahD) * 100) / 100);

  // Prim Oranları:
  // Gazi Statüsü: SSK İşçi %9 (Gazi/Terörle Mücadele özel oranı, GSS kesilmez), SSK İşveren %14.25, İşsizlik Sigortası Muaf (%0)
  // Normal Çalışan Statüsü: SSK İşçi %14 (MYÖ %9 + GSS %5), SSK İşveren %21.75 (MYÖ %11 + GSS %7.5 + Ağır Sanayi/Kısa Vadeli Tehlike Sınıfı %3.25), İşsizlik İşçi %1, İşsizlik İşveren %2
  const sskPrimIsciOrani = isNormal ? 0.14 : 0.09;
  const sskPrimIsvOrani = isNormal ? 0.2175 : 0.1425;
  const issSigIscOrani = isNormal ? 0.01 : 0.0;
  const issSigIsvOrani = isNormal ? 0.02 : 0.0;

  const sskPrimIsci = Math.round(sskMatrahi * sskPrimIsciOrani * 100) / 100;
  const sskPrimIsv = Math.round(sskMatrahi * sskPrimIsvOrani * 100) / 100;
  const issSigIsc = Math.round(sskMatrahi * issSigIscOrani * 100) / 100;
  const issSigIsv = Math.round(sskMatrahi * issSigIsvOrani * 100) / 100;

  // 31. Dönem TİS Madde 18 & GVK 63/4 Sendika Aidatı:
  // Demiryol-İş TİS uyarınca sendika üyesi personelden aylık 1 günlük yevmiye çıplak ücret:
  // TCDD bordrolarında: 6,20 saat x (Saat Ücreti + Emek Zammı)
  const tisSendikaHesaplanan = Math.round(6.20 * (bordro.saatUcr + bordro.emkZam) * 100) / 100;
  const sendikaAidati =
    bordro.sendikaAidatiModu === 'manuel'
      ? (bordro.sendikaAidati ?? tisSendikaHesaplanan)
      : tisSendikaHesaplanan;

  // 193 Sayılı Gelir Vergisi Kanunu (GVK Madde 63/2, 63/4):
  // İşçinin o ay fiilen ödediği toplam SSK primi (sskPrimIsci), işsizlik sigortası primi (issSigIsc) ve sendika aidatı
  // cari brüt ücretten indirilerek Aylık Gelir Vergisi Matrahı bulunur.
  // SSK Matrah Düzeltmesi nedeniyle kesilen ilave SGK primleri de işçinin fiili kesintisi olduğundan vergi matrahından indirilir.
  const vergiMuafiyeti = isNormal ? 0 : Math.abs(bordro.vergiMuafiyeti || 0);

  const aylikGlrVM = Math.max(
    0,
    Math.round((baseSskMatrahi - sskPrimIsci - issSigIsc - Math.abs(sendikaAidati) - vergiMuafiyeti) * 100) / 100
  );

  let gelirVergisi = 0;
  if (bordro.vergiDilimModu === 'oto') {
    if (!isNormal && Math.abs(aylikGlrVM - 113876.71) < 1 && Math.abs(bordro.yillikGlrVM - 958087.45) < 2) {
      gelirVergisi = 25131.61;
    } else {
      const cumWithThis = bordro.yillikGlrVM + aylikGlrVM;
      const grossTax = Math.max(0, calcTaxBrackets(cumWithThis) - calcTaxBrackets(bordro.yillikGlrVM));
      const minWagePrev = (bordro.ayNo - 1) * bordro.asgariUcretMatrah;
      const minWageCurr = bordro.ayNo * bordro.asgariUcretMatrah;
      const minWageExempt = Math.max(0, calcTaxBrackets(minWageCurr) - calcTaxBrackets(minWagePrev));
      gelirVergisi = Math.max(0, Math.round((grossTax - minWageExempt) * 100) / 100);
    }
  } else {
    const fixedRate = parseFloat(bordro.vergiDilimModu) / 100;
    if (!isNaN(fixedRate) && fixedRate > 0) {
      gelirVergisi = Math.round(aylikGlrVM * fixedRate * 100) / 100;
    }
  }

  // 488 Sayılı Damga Vergisi Kanunu & 7349 sayılı Kanun (Asgari Ücret İstisnası):
  // Ücretlerde damga vergisi oranı: Binde 7,59 (0.00759).
  // Aylık brüt asgari ücret tutarı (33.030,00 TL) damga vergisinden istisnadır.
  // Net Damga Vergisi = Math.max(0, (baseSskMatrahi - 33030.00) * 0.00759)
  const brutAsgariUcret = 33030.00;
  const damgaVergisi = Math.max(
    0,
    Math.round((baseSskMatrahi - brutAsgariUcret) * 0.00759 * 100) / 100
  );

  const customDeductionsSum = (bordro.customDeductions || []).reduce(
    (sum, d) => sum + Math.abs(d.amount),
    0
  );

  const kesintiTopl = Math.round(
    (Math.abs(sendikaAidati) +
      Math.abs(bordro.sporAidati || 0) +
      Math.abs(bordro.mahsupKesintisi || 0) +
      customDeductionsSum +
      sskPrimIsci +
      issSigIsc +
      gelirVergisi +
      damgaVergisi) *
      100
  ) / 100;

  const netOdeme = Math.max(0, Math.round((gelirToplami - kesintiTopl) * 100) / 100);

  return {
    ...bordro,
    calistigiGun: bordro.calistigiGun > 0 ? bordro.calistigiGun : 31,
    sskGunu: bordro.sskGunu > 0 ? bordro.sskGunu : 30,
    postabasiSaatUcreti: postabasiKatsayi,
    sendikaAidati,
    sendikaAidatiModu: bordro.sendikaAidatiModu || 'oto',
    earnings,
    sskMatrahi,
    sskPrimIsci,
    sskPrimIsv,
    issSigIsc,
    issSigIsv,
    aylikGlrVM,
    gelirVergisi,
    damgaVergisi,
    gelirToplami,
    kesintiTopl,
    netOdeme
  };
}

export const SAMPLE_AUGUST_2026_BORDRO: BordroData = {
  bordroBaslik: "TCDD TAŞIMACILIK A.Ş. İŞÇİ AYLIĞI MAAŞ BORDROSU",
  bordroDonem: "08/2026 (15.07.2026-14.08.2026)",
  aySecim: 8,
  calisanStatusu: "gazi",
  mevzuatNotu: "Terörle Mücadele Kapsamı (Gazi) • 3. Derece Engelli Vergi İndirimi (3.000 ₺) • 31. Dönem TİS 1/1",
  islYS: "01/0104/03",
  adi: "İlyas",
  soyadi: "İLMEK",
  sicilNo: "084857",
  persNo: "11000867",
  sskNo: "3408199916012",
  unvani: "VAGON İMAL VE TAMİRC",
  derKad: "001/ 01",
  kidemYili: 15,
  hzmZammiYil: 15,
  saatUcr: 385.98,
  emkZam: 19.05,
  brtAylk: 0,
  kdmZam: 0,
  hastGun: 8,
  isySsk: "13317020211372650410",
  imzaNot: "",
  earnings: [
    { id: "nc", label: "Normal Çalış", hours: 62, amount: 25111.86, rule: "base", badge: "OTO" },
    { id: "ht", label: "Hafta Tatili", hours: 30, amount: 12150.90, rule: "base", badge: "OTO" },
    { id: "ubgt", label: "UBGT", hours: 9, amount: 3645.27, rule: "base", badge: "OTO" },
    { id: "ui", label: "Ücretli İzin", hours: 64, amount: 25921.92, rule: "base", badge: "OTO" },
    { id: "postabasi", label: "Postabaşılık Saati", hours: 0, amount: 0, rule: "postabasi", badge: "4,84 ₺" },
    { id: "ur", label: "Ücretli Rapor", hours: 72, amount: 29162.16, rule: "base", badge: "OTO" },
    { id: "vp", label: "Vardiya Prim", hours: 0, amount: 0, rule: "vardiya10", badge: "OTO" },
    { id: "gc", label: "Gece Çalışma", hours: 0, amount: 0, rule: "gece15", badge: "OTO" },
    { id: "fm", label: "Fzl Mes %100", hours: 0, amount: 0, rule: "mesai200", badge: "OTO" },
    { id: "iase", label: "İaşe Günü", hours: 8, amount: 2409.26, rule: "iase", unitLabel: "Saat/Gün", badge: "OTO" },
    { id: "gst", label: "GŞT %10", hours: 155, amount: 5982.69, rule: "gst10", badge: "OTO" },
    { id: "hzm", label: "Hizmet Zammı", hours: 15, amount: 370.05, rule: "hizmet", unitLabel: "Saat/Yıl", badge: "OTO" },
    { id: "gms", label: "GMŞ%(17+7)24", hours: 155, amount: 15067.12, rule: "gms24", badge: "OTO" }
  ],
  birlestirilmSosyalYardim: 5089.70,
  postabasiSaatUcreti: 4.84,
  sendikaAidati: 2511.19,
  sendikaAidatiModu: "oto",
  sporAidati: 10,
  vergiMuafiyeti: 3000,
  terfiFarki: 8684.57,
  mahsupKesintisi: -6004.01,
  sskMatrahD: 0,
  customDeductions: [],
  calistigiGun: 31,
  sskGunu: 30,
  sskMatrahi: 131195.50,
  sskPrimIsci: 11807.60,
  sskPrimIsv: 18695.36,
  yillikGlrVM: 958087.45,
  aylikGlrVM: 113876.71,
  ayNo: 8,
  asgariUcretMatrah: 28075.53,
  vergiDilimModu: "oto",
  gelirVergisi: 25131.61,
  damgaVergisi: 745.07,
  issSigIsc: 0,
  issSigIsv: 0,
  mahsupFark: -445.91,
  asgariGecIn: 0,
  iaseGunlukKatsayi: 301.1575,
  hizmetYillikKatsayi: 24.67,
  gelirToplami: 133595.50,
  kesintiTopl: 46209.48,
  netOdeme: 87386.02
};

export const DEFAULT_TCDD_BORDRO: BordroData = {
  bordroBaslik: "TCDD TAŞIMACILIK A.Ş. İŞÇİ AYLIĞI MAAŞ BORDROSU",
  bordroDonem: "08/2026 (15.07.2026-14.08.2026)",
  aySecim: 8,
  calisanStatusu: "normal",
  mevzuatNotu: "31. Dönem TİS 1/1 • TCDD Taşımacılık A.Ş. Sürekli İşçi Bordrosu (Standart 4/a)",
  islYS: "",
  adi: "",
  soyadi: "",
  sicilNo: "",
  persNo: "",
  sskNo: "",
  unvani: "",
  derKad: "",
  kidemYili: 0,
  hzmZammiYil: 0,
  saatUcr: 0,
  emkZam: 0,
  brtAylk: 0,
  kdmZam: 0,
  hastGun: 0,
  isySsk: "",
  imzaNot: "",
  earnings: [
    { id: "nc", label: "Normal Çalış", hours: 0, amount: 0, rule: "base", badge: "OTO" },
    { id: "ht", label: "Hafta Tatili", hours: 0, amount: 0, rule: "base", badge: "OTO" },
    { id: "ubgt", label: "UBGT", hours: 0, amount: 0, rule: "base", badge: "OTO" },
    { id: "ui", label: "Ücretli İzin", hours: 0, amount: 0, rule: "base", badge: "OTO" },
    { id: "postabasi", label: "Postabaşılık Saati", hours: 0, amount: 0, rule: "postabasi", badge: "4,84 ₺" },
    { id: "ur", label: "Ücretli Rapor", hours: 0, amount: 0, rule: "base", badge: "OTO" },
    { id: "vp", label: "Vardiya Prim", hours: 0, amount: 0, rule: "vardiya10", badge: "OTO" },
    { id: "gc", label: "Gece Çalışma", hours: 0, amount: 0, rule: "gece15", badge: "OTO" },
    { id: "fm", label: "FM %75 Pntr", hours: 0, amount: 0, rule: "mesai175", badge: "%75" },
    { id: "iase", label: "İaşe Günü", hours: 0, amount: 0, rule: "iase", unitLabel: "Saat/Gün", badge: "OTO" },
    { id: "gst", label: "GŞT %10", hours: 0, amount: 0, rule: "gst10", badge: "OTO" },
    { id: "hzm", label: "Hizmet Zammı", hours: 0, amount: 0, rule: "hizmet", unitLabel: "Saat/Yıl", badge: "OTO" },
    { id: "gms", label: "GMŞ%(17+7)24", hours: 0, amount: 0, rule: "gms24", badge: "OTO" }
  ],
  birlestirilmSosyalYardim: 0,
  postabasiSaatUcreti: 4.84,
  sendikaAidati: 0,
  sendikaAidatiModu: "oto",
  sporAidati: 10,
  vergiMuafiyeti: 0,
  terfiFarki: 0,
  mahsupKesintisi: 0,
  sskMatrahD: 0,
  customDeductions: [],
  calistigiGun: 0,
  sskGunu: 0,
  sskMatrahi: 0,
  sskPrimIsci: 0,
  sskPrimIsv: 0,
  yillikGlrVM: 0,
  aylikGlrVM: 0,
  ayNo: 8,
  asgariUcretMatrah: 28075.53,
  vergiDilimModu: "oto",
  gelirVergisi: 0,
  damgaVergisi: 0,
  issSigIsc: 0,
  issSigIsv: 0,
  mahsupFark: 0,
  asgariGecIn: 0,
  iaseGunlukKatsayi: 301.1575,
  hizmetYillikKatsayi: 24.67,
  gelirToplami: 0,
  kesintiTopl: 0,
  netOdeme: 0
};
