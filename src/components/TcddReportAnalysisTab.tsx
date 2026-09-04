import React, { useState } from 'react';
import { TCDD_ACTUAL_SLIPS } from '../constants/tcddData';
import { formatTRY } from '../utils/payrollCalculator';
import {
  FileText,
  ShieldCheck,
  Percent,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  DollarSign,
  TrendingUp,
  Download,
  FileSpreadsheet
} from 'lucide-react';

export const TcddReportAnalysisTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('all');

  // Aggregates over the 8 months
  const totalGross = TCDD_ACTUAL_SLIPS.reduce((acc, s) => acc + s.gelirToplami, 0);
  const totalDeductions = TCDD_ACTUAL_SLIPS.reduce((acc, s) => acc + s.kesintiTopl, 0);
  const totalNet = TCDD_ACTUAL_SLIPS.reduce((acc, s) => acc + s.netOdeme, 0);
  const totalTax = TCDD_ACTUAL_SLIPS.reduce((acc, s) => acc + s.gelirVergisi, 0);
  const totalSgk = TCDD_ACTUAL_SLIPS.reduce((acc, s) => acc + s.sskPrimIsci, 0);

  return (
    <div className="w-full flex-1 p-6 space-y-8 max-w-[1600px] mx-auto">
      {/* Report Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-emerald-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">
                TCDD TAŞIMACILIK A.Ş. ÜCRET BORDROLARI İNCELEME RAPORU
              </h1>
            </div>
            <p className="text-sm text-slate-300 mt-1">
              Ocak 2026 – Ağustos 2026 Dönemi Bordro Analizi ve Gazi / Şehit Yakını / Terör Mağduru Statüsüne İlişkin Mali Hükümlerin Değerlendirilmesi
            </p>
          </div>

          <div className="bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-xs space-y-1">
            <div className="text-slate-400">İncelenen Personel: <strong className="text-white">İlyas İLMEK</strong></div>
            <div className="text-slate-400">Sicil No: <strong className="text-white">084857</strong> | Ünvan: <strong className="text-white">Vagon İmal ve Tamirci</strong></div>
            <div className="text-slate-400">Dayanak: <strong className="text-emerald-400">31. Dönem TİS (2025 – 2027)</strong></div>
          </div>
        </div>

        {/* 8-Month Macro KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-slate-800">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">8 Aylık Toplam Gelir</span>
            <span className="text-base font-bold text-white mt-1 block">{formatTRY(totalGross)}</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Toplam Kesintiler</span>
            <span className="text-base font-bold text-rose-400 mt-1 block">{formatTRY(totalDeductions)}</span>
          </div>
          <div className="p-3 bg-emerald-950/50 rounded-xl border border-emerald-500/60">
            <span className="text-[11px] text-emerald-300 block font-bold">8 Aylık Net Ödeme</span>
            <span className="text-base font-black text-emerald-300 mt-1 block">{formatTRY(totalNet)}</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Ödenen Gelir Vergisi</span>
            <span className="text-base font-bold text-slate-200 mt-1 block">{formatTRY(totalTax)}</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Ödenen SSK Primi</span>
            <span className="text-base font-bold text-blue-300 mt-1 block">{formatTRY(totalSgk)}</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: 8 AYLIK BORDRO ÖZET TABLOSU */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Bölüm 4: Sekiz Aylık Bordro Özet Tablosu
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              İncelenen sekiz ayın brüt hakediş toplamı, toplam kesinti, net ödeme, SGK matrahı ve kesilen gelir vergisi
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg">
            Ortalama Kesinti Oranı: %29,4
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-[11px] whitespace-nowrap">
              <tr>
                <th className="py-3 px-4 font-semibold">Dönem</th>
                <th className="py-3 px-4 font-semibold text-right">Gelir Toplamı (₺)</th>
                <th className="py-3 px-4 font-semibold text-right text-rose-400">Kesinti Toplamı (₺)</th>
                <th className="py-3 px-4 font-semibold text-right text-emerald-300 font-bold bg-emerald-950/20">
                  NET ÖDEME (₺)
                </th>
                <th className="py-3 px-4 font-semibold text-right">SGK Matrahı (₺)</th>
                <th className="py-3 px-4 font-semibold text-right">SSK Prim İşçi (%9)</th>
                <th className="py-3 px-4 font-semibold text-right">Yıllık Glr.VM</th>
                <th className="py-3 px-4 font-semibold text-right text-rose-300">Gelir Vergisi (₺)</th>
                <th className="py-3 px-4 font-semibold text-right">Damga Vergisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 whitespace-nowrap font-mono">
              {TCDD_ACTUAL_SLIPS.map((s) => (
                <tr key={s.periodCode} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white font-sans flex items-center gap-2">
                    <span>{s.monthName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({s.periodCode})</span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-100">{formatTRY(s.gelirToplami)}</td>
                  <td className="py-3 px-4 text-right text-rose-400">{formatTRY(s.kesintiTopl)}</td>
                  <td className="py-3 px-4 text-right font-extrabold text-emerald-300 bg-emerald-950/30 text-sm">
                    {formatTRY(s.netOdeme)}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300">{formatTRY(s.sskMatrahi)}</td>
                  <td className="py-3 px-4 text-right text-blue-300">{formatTRY(s.sskPrimIsci)}</td>
                  <td className="py-3 px-4 text-right text-slate-400">{formatTRY(s.yillikGlrVm)}</td>
                  <td className="py-3 px-4 text-right font-bold text-rose-400">{formatTRY(s.gelirVergisi)}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{formatTRY(s.damgaVergisi)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-950 font-bold text-xs text-white border-t-2 border-slate-700 whitespace-nowrap font-mono">
              <tr>
                <td className="py-3.5 px-4 font-sans uppercase text-emerald-400">8 AYLIK TOPLAM:</td>
                <td className="py-3.5 px-4 text-right text-white">{formatTRY(totalGross)}</td>
                <td className="py-3.5 px-4 text-right text-rose-400">{formatTRY(totalDeductions)}</td>
                <td className="py-3.5 px-4 text-right text-emerald-300 font-black text-base bg-emerald-950/50">
                  {formatTRY(totalNet)}
                </td>
                <td className="py-3.5 px-4 text-right text-slate-400">-</td>
                <td className="py-3.5 px-4 text-right text-blue-300">{formatTRY(totalSgk)}</td>
                <td className="py-3.5 px-4 text-right text-slate-400">-</td>
                <td className="py-3.5 px-4 text-right text-rose-400">{formatTRY(totalTax)}</td>
                <td className="py-3.5 px-4 text-right">
                  {formatTRY(TCDD_ACTUAL_SLIPS.reduce((a, b) => a + b.damgaVergisi, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* SECTION 2: REPORT DEEP-DIVE (BÖLÜM 5, 6, 7, 8) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bölüm 5: Gazi / Şehit Yakını / Terör Mağduru Statüsü */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <span className="p-2 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Bölüm 5: Gazi & Şehit Yakını Mali Statüsü
              </h3>
              <span className="text-[11px] text-emerald-400 font-medium">3713, 2330 ve 5510 Sayılı Kanunlar</span>
            </div>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300">1. GST %10 Ek Primi (TİS Madde 130)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Her Ay Düzenli Ödeniyor
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                TİS 130. maddesi uyarınca: "Gazi, terör mağduru ve şehit yakınlarına günlük çıplak ücretinin %10'u tutarında Ek Prim ödenecektir." 8 bordronun tamamında aylık çalışma saati tabanı üzerinden tahakkuk ettirilmektedir.
              </p>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300">2. SSK Primi: GSS Kesilmiyor, Tam %9,000</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  5510 SK Madde 5/1-c
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Normal işçide SGK primi %14'tür (%9 malullük/yaşlılık/ölüm + %5 GSS). İlyas Bey'in bordrosunda işçi payı 8 ay boyunca <strong>kuruşu kuruşuna tam %9,000</strong> olarak kesilmiştir. Çünkü malullük nedeniyle sağlık güvencesi zaten mevcuttur.
              </p>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-300">3. İşsizlik Sigortası: 0,00 TL (Tam Muafiyet)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  4447 SK
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                4447 sayılı Kanun gereğince malullük aylığına bağlı olanlar işsizlik sigortasından muaftır; 8 ayın tamamında işçi ve işveren payı 0,00 TL'dir.
              </p>
            </div>
          </div>
        </div>

        {/* Bölüm 6: Gelir Vergisi & Engellilik İndirimi */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <span className="p-2 bg-purple-950 text-purple-400 rounded-lg border border-purple-800">
              <Percent className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Bölüm 6: Gelir Vergisi & Engellilik İndirimi
              </h3>
              <span className="text-[11px] text-purple-400 font-medium">GVK Madde 31 & 7349 Sayılı Kanun</span>
            </div>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            {/* Vergiden Mua: 3.000 TL */}
            <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-800/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300">"Vergiden Mua: 3.000,00 TL" Kaleminin Kimliği</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                  3. Derece Engellilik İndirimi
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Gelir İdaresi Başkanlığı 2026 yılı tarifesinde: 1. Derece (%80+) 12.000 TL, 2. Derece (%60+) 7.000 TL, <strong>3. Derece (%40+) ise tam 3.000 TL'dir</strong>. Bu tutar asgari ücret istisnasına ek olarak aylık vergi matrahından tenzil edilmektedir.
              </p>
            </div>

            {/* Ocak Ayı Matematiksel Sağlaması */}
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1.5 font-mono">
              <span className="font-bold text-emerald-400 font-sans block text-xs">
                Ocak 2026 Gelir Vergisi Kuruşu Kuruşuna Sağlaması:
              </span>
              <div className="text-[11px] text-slate-300 space-y-0.5">
                <div>• Aylık Gelir Vergisi Matrahı: <strong>99.628,26 ₺</strong></div>
                <div>• %15 Dilim Brüt Vergisi: 99.628,26 x %15 = <strong>14.944,24 ₺</strong></div>
                <div>• 2026 Asgari Ücret GV İstisnası: <strong>-4.211,33 ₺</strong></div>
                <div className="text-emerald-300 font-bold border-t border-slate-800 pt-1 mt-1">
                  = Ödenecek Gelir Vergisi: <strong>10.732,91 ₺</strong> (Bordro ile %100 Birebir!)
                </div>
              </div>
            </div>

            {/* 2026 Vergi Dilimleri */}
            <div className="text-[11px] text-slate-400">
              <span className="font-bold text-slate-200">2026 Ücret Gelirleri Dilimleri:</span> 0-190k (%15), 190k-400k (%20), 400k-1.5M (%27), 1.5M-5.3M (%35), 5.3M+ (%40). İlyas Bey Nisan 2026'da %27 dilimine geçmiştir.
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: EN YÜKSEK KALEM: GMŞ %(17+7) 24 & TİS TAZMİNATLARI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GMŞ %24 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <span className="p-2 bg-amber-950 text-amber-400 rounded-lg border border-amber-800">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Bölüm 8: En Yüksek Hakediş - GMŞ %(17+7) 24
              </h3>
              <span className="text-[11px] text-amber-400 font-medium">TİS Madde 51 - Ağır ve Tehlikeli İşler</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <p>
              Bordrolarda Normal Çalışma'dan sonra en yüksek tutarlı kalem her ay <strong>"GMŞ %(17+7) 24"</strong> olarak görünmektedir.
            </p>
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-amber-300">TİS Madde 51 Hükmü:</div>
              <p className="text-slate-400 text-[11px]">
                "Vagon muayene ve bakım onarım işçiliği işlerinde çalışan işçilere saatlik ücretlerinden ayrı olarak, <strong>emek zammı dahil saat ücretinin %24'ü</strong> tutarında brüt tazminat ödenir."
              </p>
              <div className="p-2 bg-amber-950/30 rounded border border-amber-800/40 text-amber-200 font-mono text-[11px]">
                Örnek: 224 saat x [(330,37 + 15,40) x %24] = <strong>18.588,60 ₺</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Sosyal Haklar ve Kesintiler */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <span className="p-2 bg-indigo-950 text-indigo-400 rounded-lg border border-indigo-800">
              <DollarSign className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Sosyal Haklar, İaşe ve Aidat Analizi
              </h3>
              <span className="text-[11px] text-indigo-400 font-medium">TİS Madde 18, 69, 78, 96, 129</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
              <div>
                <span className="font-bold text-white block">Birleştirilmiş Sosyal Yardım (Md. 69)</span>
                <span className="text-[11px] text-slate-400">01/2026'da 4.414,69 ₺ iken zamla 5.089,70 ₺'ye çıkmıştır.</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">5.089,70 ₺ / Ay</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
              <div>
                <span className="font-bold text-white block">İaşe (Yemek) Yardımı (Md. 78)</span>
                <span className="text-[11px] text-slate-400">Çalışılan gün sayısına göre (8 - 24 gün arası nakdi iaşe).</span>
              </div>
              <span className="font-mono font-bold text-slate-200">~275,00 ₺ / Gün</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
              <div>
                <span className="font-bold text-white block">Sendika Aidatı (Md. 18 & GVK 63/4)</span>
                <span className="text-[11px] text-slate-400">1 günlük yevmiye; Gelir Vergisi matrahından tenzil edilir.</span>
              </div>
              <span className="font-mono font-bold text-purple-400">~2.503,31 ₺ / Ay</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
              <div>
                <span className="font-bold text-white block">Demirspor Spor Aidatı (Md. 96)</span>
                <span className="text-[11px] text-slate-400">TCDD Demirspor kulüplerine destek maktu aidatı.</span>
              </div>
              <span className="font-mono font-bold text-slate-300">10,00 ₺ / Ay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
