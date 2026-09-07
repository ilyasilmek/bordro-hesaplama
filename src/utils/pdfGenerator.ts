import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BordroData, IkramiyeData } from '../types';
import { formatCurrency, calculateIkramiyeTotals } from './bordroEngine';

/**
 * jsPDF standart fontlarında (Helvetica) Türkçe karakterlerin bozulmasını,
 * soru işareti veya kayıp glif olmasını önleyen güvenli metin dönüştürücü.
 */
function cleanText(text: string | number | undefined | null): string {
  if (text === undefined || text === null) return '';
  return String(text)
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'G')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'I')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 'S')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'C')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'O')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'U')
    .replace(/₺/g, 'TL');
}

/**
 * Sayı formatlayıcı (Türkçe Lira formatı, TL son ekli)
 */
function fmt(val: number | undefined | null, decimals: number = 2): string {
  if (val === undefined || val === null || isNaN(val)) return '0,00';
  return formatCurrency(val, decimals).replace(/₺/g, '').trim();
}

function fmtTL(val: number | undefined | null, decimals: number = 2): string {
  return `${fmt(val, decimals)} TL`;
}

/**
 * TCDD Taşımacılık A.Ş. Resmi Aylık Ücret Bordrosu PDF Oluşturucu
 */
export function generateMaasBordroPDF(bordro: BordroData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  let y = 10;

  // 1. ÜST ANTET & BAŞLIK (Resmi TCDD Kurumsal Şablon)
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, y, pageWidth - margin * 2, 20, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text(cleanText('T.C. ULAŞTIRMA VE ALTYAPI BAKANLIĞI'), pageWidth / 2, y + 5.5, { align: 'center' });

  doc.setFontSize(12.5);
  doc.text(cleanText('TCDD TAŞIMACILIK A.Ş. GENEL MÜDÜRLÜĞÜ'), pageWidth / 2, y + 11.5, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(cleanText('SÜREKLİ İŞÇİ AYLIK ÜCRET VE TAHAKKUK BORDROSU'), pageWidth / 2, y + 16.5, { align: 'center' });

  y += 22;

  // 2. DÖNEM VE STATÜ BİLGİSİ BANTI
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'S');

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(cleanText(`BORDRO DÖNEMİ: ${bordro.bordroDonem}`), margin + 3, y + 4.8);

  const statusStr =
    bordro.calisanStatusu === 'gazi'
      ? 'GAZİ (Terör Mağduru - SSK İstisna)'
      : bordro.calisanStatusu === 'engelli'
      ? 'ENGELLİ (GVK Madde 31 İndirimi)'
      : 'STANDART (4/a Sürekli İşçi)';
  doc.text(cleanText(`STATÜ: ${statusStr}`), pageWidth - margin - 3, y + 4.8, { align: 'right' });

  y += 9;

  // 3. PERSONEL ÖZLÜK & ÜCRET BİLGİLERİ TABLOSU
  const fullName = cleanText(`${bordro.adi} ${bordro.soyadi}`).toUpperCase();
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 7.5, cellPadding: 1.5, lineColor: [203, 213, 225], lineWidth: 0.2 },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: [248, 250, 252], cellWidth: 35 },
      1: { cellWidth: 55 },
      2: { fontStyle: 'bold', fillColor: [248, 250, 252], cellWidth: 38 },
      3: { cellWidth: 62 },
    },
    body: [
      [
        cleanText('Adı Soyadı'),
        fullName,
        cleanText('T.C. / SSK Sicil No'),
        cleanText(`${bordro.sskNo || '-'} / ${bordro.sicilNo}`),
      ],
      [
        cleanText('Personel No'),
        cleanText(bordro.persNo || '-'),
        cleanText('Görevi / Ünvanı'),
        cleanText(bordro.unvani || 'SÜREKLİ İŞÇİ'),
      ],
      [
        cleanText('İş Yeri SSK No'),
        cleanText(bordro.isySsk || '13317020211372650410'),
        cleanText('İşletme Y/S - Der/Kad'),
        cleanText(`${bordro.islYS || '01/0104/03'} • ${bordro.derKad || '001/00'}`),
      ],
      [
        cleanText('Kıdem / Hizmet Yılı'),
        cleanText(`${bordro.kidemYili || 0} Yıl / ${bordro.hzmZammiYil || 0} Yıl`),
        cleanText('Saat Ücreti / Emek Zammı'),
        `${fmt(bordro.saatUcr, 4)} TL / ${fmt(bordro.emkZam, 4)} TL`,
      ],
    ],
  });

  // @ts-expect-error autoTable adds lastAutoTable to doc
  y = doc.lastAutoTable.finalY + 4;

  // 4. BİRLEŞİK HAKEDİŞLER VE KESİNTİLER TABLOSU (Sayfayı aşmayan, simetrik 5 sütunlu düzen)
  const earningsList: { label: string; unit: string; amount: number }[] = [];
  bordro.earnings
    .filter(e => e.hours > 0 || e.amount > 0)
    .forEach(e => {
      const unit = e.rule === 'hizmet' ? 'Yıl' : e.rule === 'iase' ? 'Gün' : 'Sa';
      earningsList.push({
        label: e.label,
        unit: `${fmt(e.hours, 1)} ${unit}`,
        amount: e.amount,
      });
    });

  if (bordro.birlestirilmSosyalYardim > 0) {
    earningsList.push({
      label: 'Birleştirilmiş Sosyal Yardım (Md 69)',
      unit: 'Aylık',
      amount: bordro.birlestirilmSosyalYardim,
    });
  }
  if (bordro.terfiFarki > 0) {
    earningsList.push({
      label: 'Terfi / İntibak Farkı',
      unit: '1 Adet',
      amount: bordro.terfiFarki,
    });
  }

  const deductionsList: { label: string; amount: number }[] = [
    { label: 'SGK İşçi Primi (%9 veya %14)', amount: bordro.sskPrimIsci },
    { label: 'İşsizlik Sigortası Primi (%1)', amount: bordro.issSigIsc },
    { label: 'Gelir Vergisi', amount: bordro.gelirVergisi },
    { label: 'Damga Vergisi (%0,759)', amount: bordro.damgaVergisi },
    { label: 'Demiryol-İş Sendika Aidatı (Md 18)', amount: bordro.sendikaAidati },
    { label: 'Demirspor Kulübü Spor Aidatı (Md 96)', amount: bordro.sporAidati },
  ];

  if (bordro.customDeductions && bordro.customDeductions.length > 0) {
    bordro.customDeductions.forEach(d => {
      if (d.amount > 0) deductionsList.push({ label: d.name, amount: d.amount });
    });
  }
  if (bordro.mahsupKesintisi > 0) {
    deductionsList.push({ label: 'Mahsup Kesintisi', amount: bordro.mahsupKesintisi });
  }

  // İki listenin satır sayısını eşitleyelim
  const maxRows = Math.max(earningsList.length, deductionsList.length);
  const combinedRows: string[][] = [];

  for (let i = 0; i < maxRows; i++) {
    const ern = earningsList[i];
    const ded = deductionsList[i];

    combinedRows.push([
      ern ? cleanText(ern.label) : '',
      ern ? cleanText(ern.unit) : '',
      ern ? fmtTL(ern.amount, 2) : '',
      ded ? cleanText(ded.label) : '',
      ded ? fmtTL(ded.amount, 2) : '',
    ]);
  }

  // Tek ve kusursuz 5 sütunlu tablo
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 7, cellPadding: 1.2, lineColor: [226, 232, 240], lineWidth: 0.2 },
    headStyles: { fontStyle: 'bold', textColor: 255 },
    columnStyles: {
      0: { cellWidth: 55 },
      1: { cellWidth: 18, halign: 'center' },
      2: { cellWidth: 25, halign: 'right', fontStyle: 'bold', textColor: [22, 101, 52] },
      3: { cellWidth: 62 },
      4: { cellWidth: 30, halign: 'right', fontStyle: 'bold', textColor: [153, 27, 27] },
    },
    head: [
      [
        { content: cleanText('KAZANÇ / HAKEDİŞ KALEMİ'), colSpan: 1, styles: { fillColor: [16, 185, 129] } },
        { content: cleanText('SÜRE'), colSpan: 1, styles: { fillColor: [16, 185, 129], halign: 'center' } },
        { content: cleanText('TUTAR (TL)'), colSpan: 1, styles: { fillColor: [16, 185, 129], halign: 'right' } },
        { content: cleanText('YASAL VE ÖZEL KESİNTİLER'), colSpan: 1, styles: { fillColor: [220, 38, 38] } },
        { content: cleanText('TUTAR (TL)'), colSpan: 1, styles: { fillColor: [220, 38, 38], halign: 'right' } },
      ],
    ],
    body: combinedRows,
    foot: [
      [
        { content: cleanText('TOPLAM BRÜT KAZANÇ'), colSpan: 2, styles: { fontStyle: 'bold', fillColor: [240, 253, 244], textColor: [22, 101, 52] } },
        { content: fmtTL(bordro.gelirToplami, 2), styles: { fontStyle: 'bold', halign: 'right', fillColor: [240, 253, 244], textColor: [22, 101, 52] } },
        { content: cleanText('TOPLAM KESİNTİLER'), styles: { fontStyle: 'bold', fillColor: [254, 242, 242], textColor: [153, 27, 27] } },
        { content: fmtTL(bordro.kesintiTopl, 2), styles: { fontStyle: 'bold', halign: 'right', fillColor: [254, 242, 242], textColor: [153, 27, 27] } },
      ],
    ],
  });

  // @ts-expect-error autoTable adds lastAutoTable to doc
  y = doc.lastAutoTable.finalY + 4;

  // 5. YASAL MATRAH VE İŞVEREN BİLGİLERİ (Özet Tablosu)
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 6.8, cellPadding: 1.2, lineColor: [203, 213, 225], lineWidth: 0.2 },
    headStyles: { fillColor: [71, 85, 105], textColor: 255, fontStyle: 'bold', halign: 'center' },
    head: [[
      cleanText('SSK GÜNÜ'),
      cleanText('ÇALIŞTIĞI GÜN'),
      cleanText('SGK MATRAHI'),
      cleanText('KÜMÜLATİF GV MATRAHI'),
      cleanText('AYLIK GV MATRAHI'),
      cleanText('ASGARİ ÜCR. GV İSTİSNASI'),
      cleanText('VERGİ MUAFİYETİ')
    ]],
    columnStyles: {
      0: { halign: 'center' },
      1: { halign: 'center' },
      2: { halign: 'right', fontStyle: 'bold' },
      3: { halign: 'right', fontStyle: 'bold' },
      4: { halign: 'right', fontStyle: 'bold' },
      5: { halign: 'right' },
      6: { halign: 'right' },
    },
    body: [
      [
        `${bordro.sskGunu || 30} Gun`,
        `${bordro.calistigiGun || 30} Gun`,
        fmtTL(bordro.sskMatrahi, 2),
        fmtTL(bordro.yillikGlrVM, 2),
        fmtTL(bordro.aylikGlrVM, 2),
        fmtTL(bordro.asgariGecIn, 2),
        fmtTL(bordro.vergiMuafiyeti, 2),
      ],
    ],
  });

  // @ts-expect-error autoTable adds lastAutoTable to doc
  y = doc.lastAutoTable.finalY + 4;

  // 6. BÜYÜK NET ELE GEÇEN ÖDEME KUTUSU
  const netBoxHeight = 15;
  doc.setFillColor(30, 58, 138); // blue-900
  doc.rect(margin, y, pageWidth - margin * 2, netBoxHeight, 'F');
  doc.setDrawColor(29, 78, 216);
  doc.rect(margin, y, pageWidth - margin * 2, netBoxHeight, 'S');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(cleanText('NET ELE GEÇEN ÖDENECEK MAAŞ TUTARI :'), margin + 5, y + 9.5);

  doc.setFontSize(14.5);
  doc.text(fmtTL(bordro.netOdeme, 2), pageWidth - margin - 5, y + 10, { align: 'right' });

  y += netBoxHeight + 5;

  // 7. YASAL BİLGİLENDİRME NOTU
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    cleanText('Not: Bu bordro 4857 Sayili Is Kanunu, 5510 Sayili SSGSS Kanunu ve TCDD Toplu Is Sozlesmesi hukumlerine gore duzenlenmistir.'),
    margin,
    y
  );

  y += 7;

  // 8. İMZA VE ONAY ALANLARI
  const signBoxWidth = (pageWidth - margin * 2 - 8) / 3;
  const signBoxHeight = 19;

  // Kutu 1: Tanzim Eden
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(250, 250, 250);
  doc.rect(margin, y, signBoxWidth, signBoxHeight, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text(cleanText('BORDRO TANZİM EDEN'), margin + signBoxWidth / 2, y + 4.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(cleanText('Tahakkuk Memuru'), margin + signBoxWidth / 2, y + 8, { align: 'center' });
  doc.text(cleanText('İmza / Mühür'), margin + signBoxWidth / 2, y + signBoxHeight - 2.5, { align: 'center' });

  // Kutu 2: Kontrol Eden
  const box2X = margin + signBoxWidth + 4;
  doc.rect(box2X, y, signBoxWidth, signBoxHeight, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.text(cleanText('KONTROL VE ONAY'), box2X + signBoxWidth / 2, y + 4.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(cleanText('İnsan Kaynakları / Muhasebe Md.'), box2X + signBoxWidth / 2, y + 8, { align: 'center' });
  doc.text(cleanText('İmza / Kaşe'), box2X + signBoxWidth / 2, y + signBoxHeight - 2.5, { align: 'center' });

  // Kutu 3: İşçi
  const box3X = box2X + signBoxWidth + 4;
  doc.rect(box3X, y, signBoxWidth, signBoxHeight, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.text(cleanText('İŞÇİ / PERSONEL'), box3X + signBoxWidth / 2, y + 4.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(fullName, box3X + signBoxWidth / 2, y + 8, { align: 'center' });
  doc.text(cleanText('İmza (Elden Aldım)'), box3X + signBoxWidth / 2, y + signBoxHeight - 2.5, { align: 'center' });

  // İndirme İşlemi
  const cleanSurname = cleanText(bordro.soyadi).replace(/\s+/g, '_') || 'Personel';
  const cleanForename = cleanText(bordro.adi).replace(/\s+/g, '_') || 'Bordro';
  const fileName = `tcdd-maas-bordrosu-${cleanSurname}_${cleanForename}-${bordro.aySecim}_ay.pdf`.toLowerCase();
  doc.save(fileName);
}

/**
 * TCDD Taşımacılık A.Ş. Resmi İkramiye Bordrosu PDF Oluşturucu
 * Ekranda hesaplanan ve gösterilen değerlerle birebir kuruşu kuruşuna eşleşir!
 */
export function generateIkramiyeBordroPDF(bordro: BordroData, ikramiye: IkramiyeData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  let y = 10;

  const isTam = ikramiye.ikramiyeType === 'TAM';

  // Merkezi hesaplama motorundan verileri al (Ekranda gösterilenle %100 birebir aynı)
  const totals = calculateIkramiyeTotals(ikramiye, bordro.saatUcr, bordro.emkZam);

  // 1. ÜST ANTET & BAŞLIK (Resmi TCDD Altın / Kehribar Kurumsal Şablon)
  doc.setFillColor(180, 83, 9); // amber-700
  doc.rect(margin, y, pageWidth - margin * 2, 20, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text(cleanText('T.C. ULAŞTIRMA VE ALTYAPI BAKANLIĞI'), pageWidth / 2, y + 5.5, { align: 'center' });

  doc.setFontSize(12.5);
  doc.text(cleanText('TCDD TAŞIMACILIK A.Ş. GENEL MÜDÜRLÜĞÜ'), pageWidth / 2, y + 11.5, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    cleanText(`SÜREKLİ İŞÇİ ${isTam ? 'TAM İKRAMİYE' : 'YARIM İKRAMİYE'} TAHAKKUK BORDROSU`),
    pageWidth / 2,
    y + 16.5,
    { align: 'center' }
  );

  y += 22;

  // 2. DÖNEM VE İKRAMİYE TÜRÜ BİLGİSİ BANTI
  doc.setFillColor(254, 243, 199); // amber-100
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'S');

  doc.setTextColor(120, 53, 15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(
    cleanText(`İKRAMİYE DÖNEMİ: ${ikramiye.donemLabel || `${bordro.aySecim}. Ay İkramiyesi`}`),
    margin + 3,
    y + 4.8
  );
  doc.text(
    cleanText(`TÜR: ${isTam ? 'TAM İKRAMİYE (30 GÜN / 225 SAAT)' : 'YARIM İKRAMİYE (15 GÜN / 112,5 SAAT)'}`),
    pageWidth - margin - 3,
    y + 4.8,
    { align: 'right' }
  );

  y += 9;

  // 3. PERSONEL ÖZLÜK & ÜCRET BİLGİLERİ TABLOSU
  const fullName = cleanText(`${bordro.adi} ${bordro.soyadi}`).toUpperCase();
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 7.5, cellPadding: 1.5, lineColor: [251, 191, 36], lineWidth: 0.2 },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: [255, 251, 235], cellWidth: 35 },
      1: { cellWidth: 55 },
      2: { fontStyle: 'bold', fillColor: [255, 251, 235], cellWidth: 38 },
      3: { cellWidth: 62 },
    },
    body: [
      [
        cleanText('Adı Soyadı'),
        fullName,
        cleanText('Sicil / Personel No'),
        cleanText(`${bordro.sicilNo} / ${bordro.persNo || '-'}`),
      ],
      [
        cleanText('Görevi / Ünvanı'),
        cleanText(bordro.unvani || 'SÜREKLİ İŞÇİ'),
        cleanText('T.C. / SSK Sicil No'),
        cleanText(`${bordro.sskNo || '-'}`),
      ],
      [
        cleanText('İkramiye Saat Ücreti'),
        fmtTL(totals.saatUcr, 4),
        cleanText('Emek Zammı'),
        fmtTL(totals.emkZam, 4),
      ],
      [
        cleanText('İkramiye Süresi'),
        `${fmt(totals.ikrSaati, 1)} Sa (${fmt(totals.ikrGunu, 0)} Gun)`,
        cleanText('Sabit Vergi Oranı'),
        cleanText(`%${totals.vergiOrani} (Sabit Dilim)`),
      ],
    ],
  });

  // @ts-expect-error autoTable adds lastAutoTable to doc
  y = doc.lastAutoTable.finalY + 4;

  // 4. İKRAMİYE HAKEDİŞLERİ VE KESİNTİLERİ TABLOSU (Simetrik 5 sütunlu dengeli tablo)
  const earningsList: { label: string; unit: string; amount: number }[] = [
    {
      label: `${isTam ? 'Tam' : 'Yarım'} İkramiye Tutarı`,
      unit: `${fmt(totals.ikrSaati, 1)} Sa`,
      amount: totals.ikrTutari,
    },
  ];

  if (totals.inikas > 0) {
    earningsList.push({ label: 'İnikas', unit: '-', amount: totals.inikas });
  }
  if (totals.dengeOdenege > 0) {
    earningsList.push({ label: 'Denge Ödeneği', unit: '-', amount: totals.dengeOdenege });
  }
  if (totals.brutAylik > 0) {
    earningsList.push({ label: 'Brüt Aylık İlavesi', unit: '-', amount: totals.brutAylik });
  }
  if (totals.kidemZammi > 0) {
    earningsList.push({ label: 'Kıdem Zammı İlavesi', unit: '-', amount: totals.kidemZammi });
  }

  const deductionsList: { label: string; amount: number }[] = [
    {
      label: `Gelir Vergisi (%${totals.vergiOrani} Sabit Dilim)`,
      amount: totals.gelirVergisi,
    },
    {
      label: 'Damga Vergisi (%0,759)',
      amount: totals.damgaVergisi,
    },
  ];

  if (totals.icraTutari > 0) {
    deductionsList.push({
      label: 'İcra / Mahkeme Kesintisi',
      amount: totals.icraTutari,
    });
  }

  const maxRows = Math.max(earningsList.length, deductionsList.length);
  const combinedRows: string[][] = [];

  for (let i = 0; i < maxRows; i++) {
    const ern = earningsList[i];
    const ded = deductionsList[i];

    combinedRows.push([
      ern ? cleanText(ern.label) : '',
      ern ? cleanText(ern.unit) : '',
      ern ? fmtTL(ern.amount, 2) : '',
      ded ? cleanText(ded.label) : '',
      ded ? fmtTL(ded.amount, 2) : '',
    ]);
  }

  // Tek ve kusursuz 5 sütunlu tablo
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 7.5, cellPadding: 1.5, lineColor: [251, 191, 36], lineWidth: 0.2 },
    columnStyles: {
      0: { cellWidth: 55 },
      1: { cellWidth: 18, halign: 'center' },
      2: { cellWidth: 25, halign: 'right', fontStyle: 'bold', textColor: [180, 83, 9] },
      3: { cellWidth: 62 },
      4: { cellWidth: 30, halign: 'right', fontStyle: 'bold', textColor: [185, 28, 28] },
    },
    head: [
      [
        { content: cleanText('İKRAMİYE HAKEDİŞ KALEMİ'), colSpan: 1, styles: { fillColor: [217, 119, 6] } },
        { content: cleanText('SÜRE'), colSpan: 1, styles: { fillColor: [217, 119, 6], halign: 'center' } },
        { content: cleanText('TUTAR (TL)'), colSpan: 1, styles: { fillColor: [217, 119, 6], halign: 'right' } },
        { content: cleanText('YASAL KESİNTİLER'), colSpan: 1, styles: { fillColor: [220, 38, 38] } },
        { content: cleanText('TUTAR (TL)'), colSpan: 1, styles: { fillColor: [220, 38, 38], halign: 'right' } },
      ],
    ],
    body: combinedRows,
    foot: [
      [
        { content: cleanText('TOPLAM GELİR (BRÜT)'), colSpan: 2, styles: { fontStyle: 'bold', fillColor: [254, 243, 199], textColor: [146, 64, 14] } },
        { content: fmtTL(totals.toplamGelir, 2), styles: { fontStyle: 'bold', halign: 'right', fillColor: [254, 243, 199], textColor: [146, 64, 14] } },
        { content: cleanText('TOPLAM KESİNTİLER'), styles: { fontStyle: 'bold', fillColor: [254, 242, 242], textColor: [153, 27, 27] } },
        { content: fmtTL(totals.kesintiToplami, 2), styles: { fontStyle: 'bold', halign: 'right', fillColor: [254, 242, 242], textColor: [153, 27, 27] } },
      ],
    ],
  });

  // @ts-expect-error autoTable adds lastAutoTable to doc
  y = doc.lastAutoTable.finalY + 4;

  // 5. YASAL VERGİ MATRAHI VE HESAP PARAMETRELERİ ÖZETİ
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 7, cellPadding: 1.3, lineColor: [251, 191, 36], lineWidth: 0.2 },
    headStyles: { fillColor: [120, 53, 15], textColor: 255, fontStyle: 'bold', halign: 'center' },
    head: [[
      cleanText('İKRAMİYE GV MATRAHI'),
      cleanText('UYGULANAN SABİT VERGİ ORANI'),
      cleanText('DAMGA VERGİSİ MATRAHI'),
      cleanText('SGK KESİNTİ DURUMU'),
      cleanText('KÜMÜLATİF VERGİ MATRAHI ETKİSİ')
    ]],
    columnStyles: {
      0: { halign: 'right', fontStyle: 'bold' },
      1: { halign: 'center', fontStyle: 'bold' },
      2: { halign: 'right', fontStyle: 'bold' },
      3: { halign: 'center' },
      4: { halign: 'center' },
    },
    body: [
      [
        fmtTL(totals.gelirVM, 2),
        `%${totals.vergiOrani}`,
        fmtTL(totals.ikrTutari, 2),
        cleanText('Muaf / Kesilmez'),
        cleanText('Etkilenmez (Sabit Dilim)'),
      ],
    ],
  });

  // @ts-expect-error autoTable adds lastAutoTable to doc
  y = doc.lastAutoTable.finalY + 4;

  // 6. BÜYÜK NET ELE GEÇEN İKRAMİYE ÖDEME KUTUSU (Ekranda görünenle %100 Birebir Aynı!)
  const netBoxHeight = 15;
  doc.setFillColor(180, 83, 9); // amber-700
  doc.rect(margin, y, pageWidth - margin * 2, netBoxHeight, 'F');
  doc.setDrawColor(146, 64, 14);
  doc.rect(margin, y, pageWidth - margin * 2, netBoxHeight, 'S');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(cleanText('NET ELE GEÇEN İKRAMİYE ÖDEME TUTARI :'), margin + 5, y + 9.5);

  doc.setFontSize(15);
  doc.text(fmtTL(totals.odemeTutari, 2), pageWidth - margin - 5, y + 10, { align: 'right' });

  y += netBoxHeight + 5;

  // 7. AÇIKLAMA VE BİLGİ
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    cleanText('Not: Ikramiye tahakkukunda Toplu Is Sozlesmesi hukumleri geregince sabit vergi dilimi uygulanmis olup kumulatif matrah etkilenmemistir.'),
    margin,
    y
  );

  y += 7;

  // 8. İMZA VE ONAY ALANLARI
  const signBoxWidth = (pageWidth - margin * 2 - 8) / 3;
  const signBoxHeight = 19;

  // Kutu 1: Tanzim Eden
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(250, 250, 250);
  doc.rect(margin, y, signBoxWidth, signBoxHeight, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text(cleanText('BORDRO TANZİM EDEN'), margin + signBoxWidth / 2, y + 4.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(cleanText('Tahakkuk Memuru'), margin + signBoxWidth / 2, y + 8, { align: 'center' });
  doc.text(cleanText('İmza / Mühür'), margin + signBoxWidth / 2, y + signBoxHeight - 2.5, { align: 'center' });

  // Kutu 2: Kontrol Eden
  const box2X = margin + signBoxWidth + 4;
  doc.rect(box2X, y, signBoxWidth, signBoxHeight, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.text(cleanText('KONTROL VE ONAY'), box2X + signBoxWidth / 2, y + 4.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(cleanText('İnsan Kaynakları / Muhasebe Md.'), box2X + signBoxWidth / 2, y + 8, { align: 'center' });
  doc.text(cleanText('İmza / Kaşe'), box2X + signBoxWidth / 2, y + signBoxHeight - 2.5, { align: 'center' });

  // Kutu 3: İşçi / Hak Sahibi
  const box3X = box2X + signBoxWidth + 4;
  doc.rect(box3X, y, signBoxWidth, signBoxHeight, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.text(cleanText('İŞÇİ / HAK SAHİBİ'), box3X + signBoxWidth / 2, y + 4.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(fullName, box3X + signBoxWidth / 2, y + 8, { align: 'center' });
  doc.text(cleanText('İmza (Elden Aldım)'), box3X + signBoxWidth / 2, y + signBoxHeight - 2.5, { align: 'center' });

  // İndirme İşlemi
  const cleanSurname = cleanText(bordro.soyadi).replace(/\s+/g, '_') || 'Personel';
  const cleanForename = cleanText(bordro.adi).replace(/\s+/g, '_') || 'Bordro';
  const fileName = `tcdd-ikramiye-bordrosu-${isTam ? 'tam' : 'yarim'}-${cleanSurname}_${cleanForename}.pdf`.toLowerCase();
  doc.save(fileName);
}
