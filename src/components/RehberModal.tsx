import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  X,
  Search,
  HelpCircle,
  TrendingUp,
  Award,
  User,
  Accessibility,
  FileDown,
  FolderOpen,
  BarChart3,
  RotateCcw,
  Download,
  Upload,
  Sparkles,
  Gift,
  LayoutGrid,
  CheckCircle2,
  Info,
  ShieldCheck,
  Calculator,
  ChevronRight,
  Clock,
  Calendar,
  Layers,
  Percent,
  FileText
} from 'lucide-react';

interface RehberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenZamModal?: () => void;
}

type RehberTab = 'genel' | 'butonlar' | 'zam' | 'statuler' | 'mevzuat';

export const RehberModal: React.FC<RehberModalProps> = ({
  isOpen,
  onClose,
  onOpenZamModal
}) => {
  const [activeTab, setActiveTab] = useState<RehberTab>('genel');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  return (
    <div
      id="rehber-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs font-dotmatrix animate-in fade-in duration-150"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="rehber-modal-card"
        className="bg-white rounded-2xl shadow-2xl border-2 border-slate-300 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
      >
        {/* MODAL ÜST BAŞLIK BANTI */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/90 text-white flex items-center justify-center shadow-inner border border-blue-400/40 shrink-0">
              <BookOpen className="w-5 h-5 text-blue-100" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  TCDD BORDRO KULLANIM REHBERİ
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Mevzuat & Kılavuz
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-0.5">
                Uygulama işleyişi, düğme fonksiyonları, TİS zammı ve çalışan statüleri
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer border border-slate-700"
            title="Kapat (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ARAMA VE SEKME ÇUBUĞU */}
        <div className="bg-slate-100 border-b border-slate-200 px-3 sm:px-6 py-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
          {/* Sekmeler */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => {
                setActiveTab('genel');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'genel'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Nasıl Kullanılır?</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('butonlar');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'butonlar'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Düğmeler ve İşlevleri</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('zam');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'zam'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Zam Nasıl Uygulanır?</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('statuler');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'statuler'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Çalışan Statüleri</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('mevzuat');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'mevzuat'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>31. Dönem TİS</span>
            </button>
          </div>

          {/* Arama Kutusu */}
          <div className="relative w-full sm:w-56 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rehberde ara (Örn: zam, gazi, pdf)..."
              className="w-full bg-white border border-slate-300 pl-8 pr-3 py-1 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* MODAL İÇERİK GÖVDESİ (KAYDIRILABİLİR) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed">
          {/* TAB 1: NASIL KULLANILIR? */}
          {(activeTab === 'genel' || searchQuery) && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-blue-500 pb-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900 uppercase">
                  1. Uygulama Nasıl Kullanılır? (Temel Adımlar)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-sky-50/70 border border-sky-200 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-sky-900 font-bold text-xs uppercase">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[11px]">
                      1
                    </span>
                    Özlük ve Ücret Bilgileri
                  </div>
                  <p className="text-slate-700 text-xs">
                    Sol paneldeki <strong>Saat Ücreti</strong> ve <strong>Emek Zammı</strong> alanlarını kontrol edin. Gerekirse kıdem yılı ve derece/kademe bilgilerinizi güncelleyin.
                  </p>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">
                      2
                    </span>
                    Çalışma ve Mesai Saatleri
                  </div>
                  <p className="text-slate-700 text-xs">
                    Ortadaki <strong>Hakediş Kalemleri</strong> sütununda o ay çalıştığınız Normal Çalışma (187,5 sa), Hafta Tatili, Gece Zammı, Fazla Mesai ve İaşe günlerini yazın. Tutar otomatik hesaplanır.
                  </p>
                </div>

                <div className="bg-purple-50/70 border border-purple-200 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[11px]">
                      3
                    </span>
                    Canlı Net Maaş & PDF Çıktısı
                  </div>
                  <p className="text-slate-700 text-xs">
                    Tüm hesaplamalar (SGK, Vergi Dilimi, Asgari Ücret İstisnası) anında sağ alt <strong>NET ÖDEME</strong> kutusuna yansır. Üstteki <strong>PDF İndir</strong> ile imzaya hazır resmi evrak alabilirsiniz.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-300/80 p-3.5 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-amber-950">
                  <span className="font-bold block">Önemli Bordro Dönemi Hatırlatması:</span>
                  <span>
                    Demiryolu işçi maaşları her ayın <strong>15'i ile diğer ayın 14'ü</strong> arasını kapsar. Dönem seçicisinden (örn: 01 - Ocak) ayı değiştirdiğinizde, sistem o aya ait <strong>Kümülatif Vergi Matrahını</strong> ve vergi dilimini (%15, %20 veya %27) otomatik olarak ayarlar.
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: DÜĞMELER VE İŞLEVLERİ SÖZLÜĞÜ */}
          {(activeTab === 'butonlar' || searchQuery) && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-indigo-500 pb-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-slate-900 uppercase">
                  2. Ekrandaki Düğmeler ve İşlevleri Sözlüğü
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Düğme 1: Maaş Modu */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">Maaş (Görünüm Butonu)</span>
                      <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.2 rounded font-semibold">Ana Mod</span>
                    </div>
                    <p className="text-slate-600 text-xs">
                      Aylık Sürekli İşçi bordrosunun normal çalışma, gece zammı, fazla mesai ve SGK/vergi detaylarının bulunduğu ana ekrandır.
                    </p>
                  </div>
                </div>

                {/* Düğme 2: İkramiye Modu */}
                <div className="border border-amber-200 rounded-xl p-3 bg-amber-50/40 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">İkramiye (Görünüm Butonu)</span>
                      <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded font-semibold">TİS Hakları</span>
                    </div>
                    <p className="text-slate-600 text-xs">
                      TCDD Tam (30 Gün / 225 Sa) veya Yarım (15 Gün / 112,5 Sa) ikramiye bordrosuna geçer. İkramiyede SGK kesilmez, sabit gelir vergisi dilimi uygulanır.
                    </p>
                  </div>
                </div>

                {/* Düğme 3: TİS Zammı */}
                <div className="border border-amber-300 rounded-xl p-3 bg-amber-50/80 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">TİS Zammı (Simülatör)</span>
                      <span className="bg-amber-200 text-amber-950 text-[10px] px-1.5 py-0.2 rounded font-semibold">Zam Robotu</span>
                    </div>
                    <p className="text-slate-600 text-xs">
                      Girdiğiniz yüzde oranını (örneğin %15 veya enflasyon farkı) saat ücreti ve emek zammına uygular. Kıst gün hesabı yapabilir ve zammı tek tıkla geri alabilir.
                    </p>
                  </div>
                </div>

                {/* Düğme 4: PDF İndir */}
                <div className="border border-blue-200 rounded-xl p-3 bg-blue-50/40 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <FileDown className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">PDF İndir (Resmi Matbu)</span>
                      <span className="bg-blue-100 text-blue-900 text-[10px] px-1.5 py-0.2 rounded font-semibold">TCDD Antetli</span>
                    </div>
                    <p className="text-slate-600 text-xs">
                      Bordroyu TCDD Taşımacılık A.Ş. Genel Müdürlüğü resmi antetli, A4 boyutunda, tahakkuk memuru, amir ve işçi imza kutuları bulunan resmi PDF olarak cihazınıza kaydeder.
                    </p>
                  </div>
                </div>

                {/* Düğme 5: Rapor */}
                <div className="border border-emerald-200 rounded-xl p-3 bg-emerald-50/40 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">Rapor (Maaş & Vergi Analizi)</span>
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] px-1.5 py-0.2 rounded font-semibold">Şifre: 1510</span>
                    </div>
                    <p className="text-slate-600 text-xs">
                      12 aylık kümülatif net gelir, ödenen toplam gelir vergisi, damga vergisi ve SGK kesintilerini grafiksel tablolarla gösterir. Güvenlik şifresi <strong>1510</strong>'dur.
                    </p>
                  </div>
                </div>

                {/* Düğme 6: Kayıtlılar */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <FolderOpen className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">Kayıtlılar (Bordro Arşivi)</span>
                      <span className="bg-slate-200 text-slate-800 text-[10px] px-1.5 py-0.2 rounded font-semibold">Hafıza</span>
                    </div>
                    <p className="text-slate-600 text-xs">
                      Hazırladığınız bordroları farklı başlıklarla (Örn: "2026 Ocak Mesaili", "Şubat İzinli") tarayıcıya kaydeder, tek tıkla geri çağırır.
                    </p>
                  </div>
                </div>

                {/* Düğme 7: Yükle & Yedekle (JSON) */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">Yükle & Yedekle (JSON)</span>
                      <span className="bg-slate-200 text-slate-800 text-[10px] px-1.5 py-0.2 rounded font-semibold">Dosya Transferi</span>
                    </div>
                    <p className="text-slate-600 text-xs">
                      <strong>Yedekle:</strong> Bordronuzu dosya olarak bilgisayar/telefona kaydeder.<br />
                      <strong>Yükle:</strong> Kayıtlı dosyayı başka cihazda veya daha sonra açarak kaldığınız yerden devam etmenizi sağlar.
                    </p>
                  </div>
                </div>

                {/* Düğme 8: Sıfırla */}
                <div className="border border-rose-200 rounded-xl p-3 bg-rose-50/40 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">Sıfırla (Temizle)</span>
                      <span className="bg-rose-100 text-rose-900 text-[10px] px-1.5 py-0.2 rounded font-semibold">Hızlı Temizlik</span>
                    </div>
                    <p className="text-slate-600 text-xs">
                      Saat ve hakediş tutarlarını sıfırlar; boş şablon üzerinden sıfırdan yeni ay girmeyi kolaylaştırır.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 3: ZAM NASIL UYGULANIR? */}
          {(activeTab === 'zam' || searchQuery) && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-amber-500 pb-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-black text-slate-900 uppercase">
                  3. TİS Zammı Nasıl Uygulanır? (Adım Adım Simülasyon)
                </h3>
              </div>

              <div className="bg-white border-2 border-amber-300 rounded-xl p-4 space-y-3 shadow-xs">
                <p className="text-slate-700 text-xs sm:text-sm">
                  Toplu İş Sözleşmesi (TİS) zamları, enflasyon farkları ve refah payları bordrodaki <strong>Saat Ücreti</strong> ve <strong>Emek Zammı</strong> üzerine doğrudan yansır. Simülatörü çalıştırmak için:
                </p>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="text-xs">
                      <strong>TİS Zammı Butonuna Basın:</strong> Üst barda yer alan kehribar renkli <strong>TİS Zammı</strong> butonuna tıklayın.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="text-xs">
                      <strong>Zam Oranını Girin:</strong> Açılan pencerede zam yüzdesini (örn: <code>15</code>, <code>24.73</code> veya <code>12.5</code>) yazın. Hızlı seçim butonlarından da (%10, %15, %20, %25) faydalanabilirsiniz.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="text-xs">
                      <strong>Hedef Kapsamı Belirleyin:</strong>
                      <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5 text-slate-600">
                        <li><strong>Hem Maaş Hem İkramiye (Önerilen):</strong> Tüm bordro parametrelerini zamlar.</li>
                        <li><strong>Sadece Maaş Bordrosu:</strong> Sadece aylık maaşı etkiler.</li>
                        <li><strong>Sadece İkramiye:</strong> İkramiye saat ücretini günceller.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </div>
                    <div className="text-xs">
                      <strong>Kıst Gün Uygulaması (Ay Ortası Zamları):</strong> Eğer zam ayın tam başında değil de ortasında (örneğin ayın 1'inde) yürürlüğe girdiyse, "Kıst Günlü Uygula" seçeneğini aktif edip eski gün (örn: 17 gün) ve yeni gün (örn: 14 gün) yazabilirsiniz.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      5
                    </div>
                    <div className="text-xs">
                      <strong>Zammı Uygula & Geri Alma Garantisi:</strong> "Zammı Uygula" butonuna bastığınızda tüm hakedişler anında yeni zamlı ücret üzerinden yeniden hesaplanır. İstenirse <strong>"Zammı Geri Al"</strong> düğmesine basılarak eski orijinal ücrete anında dönülebilir.
                    </div>
                  </div>
                </div>

                {onOpenZamModal && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenZamModal();
                      }}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>TİS Zammı Simülatörünü Şimdi Aç</span>
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* TAB 4: ÇALIŞAN STATÜLERİ */}
          {(activeTab === 'statuler' || searchQuery) && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-purple-500 pb-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black text-slate-900 uppercase">
                  4. Çalışan Statüleri ve Yasal İstisnaların Açıklaması
                </h3>
              </div>

              <div className="space-y-3">
                {/* 1. Normal Çalışan */}
                <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-700" />
                      <span className="font-bold text-blue-950 text-sm">1. NORMAL ÇALIŞAN (Standart 4/a Sürekli İşçi)</span>
                    </div>
                    <span className="bg-blue-200/80 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded">Standart Rejim</span>
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    TCDD Taşımacılık A.Ş. bünyesinde 4857 Sayılı İş Kanunu ve 5510 Sayılı Kanunun 4/1-a bendine tabi olarak görev yapan standart sürekli işçileri temsil eder.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="bg-white/80 p-2 rounded-lg border border-blue-100">
                      <strong>SGK İşçi Primi:</strong> %14 prim + %1 İşsizlik Sigortası Primi kesilir.
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-blue-100">
                      <strong>Gece & Mesai:</strong> GMŞ %(17+7)24 ve FM %75 puantör kuralları uygulanır.
                    </div>
                  </div>
                </div>

                {/* 2. Gazi Statüsü */}
                <div className="border border-amber-300 bg-amber-50/60 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-700" />
                      <span className="font-bold text-amber-950 text-sm">2. GAZİ STATÜSÜ (Terörle Mücadele / Vazife Malulü)</span>
                    </div>
                    <span className="bg-amber-200 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded">SGK ve Vergi İstisnası</span>
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    3713 Sayılı Terörle Mücadele Kanunu veya 2330 Sayılı Nakdi Tazminat Kanunu kapsamında istihdam edilen kahraman gazilerimizi ve malul personelimizi kapsar.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                    <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                      <strong>SGK İstisnası:</strong> Standart %14 SSK İşçi primi kesilmez; %9 veya sıfır prim rejimine tabidir.
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                      <strong>Vergi İndirimi:</strong> 3. Derece Engelli Vergi İndirimi (Aylık 3.000 TL matrah muafiyeti) doğrudan uygulanır.
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                      <strong>%100 Fazla Mesai:</strong> Fazla çalışma saatleri %100 zamlı (2 katı) olarak bordroya yansıtılır.
                    </div>
                  </div>
                </div>

                {/* 3. Engelli Çalışan */}
                <div className="border border-purple-300 bg-purple-50/60 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Accessibility className="w-4 h-4 text-purple-700" />
                      <span className="font-bold text-purple-950 text-sm">3. ENGELLİ ÇALIŞAN (GVK Madde 31 İndirimi)</span>
                    </div>
                    <span className="bg-purple-200 text-purple-950 text-[10px] font-bold px-2 py-0.5 rounded">GVK 31 İndirimi</span>
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    193 Sayılı Gelir Vergisi Kanununun 31. maddesi uyarınca yetkili sağlık kurullarından alınan çalışma gücü kaybı oranına göre engellilik indiriminden yararlanan sürekli işçilerdir.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="bg-white/80 p-2 rounded-lg border border-purple-200">
                      <strong>Vergi Muafiyeti:</strong> Gelir Vergisi Matrahından dereceye göre (Örn: 7.000 TL veya ilgili yıl haddi) doğrudan tenzil edilir.
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-purple-200">
                      <strong>GMŞ %(15+7)22 Kuralı:</strong> TİS hükümleri doğrultusunda gece çalışma zammı katsayısı otomatik güncellenir.
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 5: 31. DÖNEM TİS HÜKÜMLERİ VE KURALLAR */}
          {(activeTab === 'mevzuat' || searchQuery) && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-emerald-500 pb-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900 uppercase">
                  5. TCDD 31. Dönem TİS Özel Hakları ve Hesap Parametreleri
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-1.5 shadow-2xs">
                  <span className="font-bold text-xs text-slate-900 block flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Birleştirilmiş Sosyal Yardım (TİS Md 69)
                  </span>
                  <p className="text-slate-600 text-xs">
                    İşçinin her bordrosuna brüt olarak yansıtılan, bayram, yakacak ve aile desteklerini birleştiren aylık maktu sosyal yardım tutarıdır.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-1.5 shadow-2xs">
                  <span className="font-bold text-xs text-slate-900 block flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Demiryol-İş Sendika Aidatı (TİS Md 18)
                  </span>
                  <p className="text-slate-600 text-xs">
                    Demiryol-İş Sendikası üyesi işçilerden kesilen aidattır. Sistemde formülü <strong>Saat Ücreti x 6,20</strong> (1 çıplak yevmiye) olarak otomatik hesaplanır veya manuel girilebilir.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-1.5 shadow-2xs">
                  <span className="font-bold text-xs text-slate-900 block flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Gece Çalışma Zammı (GMŞ %17/%24)
                  </span>
                  <p className="text-slate-600 text-xs">
                    Saat 20:00 ile 06:00 arasında yapılan çalışmalara saat ücretinin %17'si veya kıdemli kademelerde %24'ü oranında ek gece tazminatı ödenir.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-1.5 shadow-2xs">
                  <span className="font-bold text-xs text-slate-900 block flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Fiili İaşe Bedeli (Md 74)
                  </span>
                  <p className="text-slate-600 text-xs">
                    Fiilen işe gelinen ve çalışılan günler için günlük belirlenmiş katsayı (örn: 313,51 TL/gün) üzerinden brüt olarak tahakkuk ettirilir.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-1.5 shadow-2xs">
                  <span className="font-bold text-xs text-slate-900 block flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Demirspor Kulübü Spor Aidatı (Md 96)
                  </span>
                  <p className="text-slate-600 text-xs">
                    TCDD Demirspor Kulübüne üye işçilerden TİS gereğince kesilen aylık <strong>10,00 TL</strong> tutarındaki aidattır.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-1.5 shadow-2xs">
                  <span className="font-bold text-xs text-slate-900 block flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    İkramiye Rejimi (TİS Md 78)
                  </span>
                  <p className="text-slate-600 text-xs">
                    Yılda 4 ikramiye (Tam 30 gün / 225 saat, Yarım 15 gün / 112,5 saat). İkramiyeden SGK primi kesilmez, kümülatif matrahı artırmaz, sabit vergi dilimiyle ödenir.
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* MODAL ALT BANTI & HIZLI BUTONLAR */}
        <div className="bg-slate-100 border-t border-slate-300 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2 text-slate-600 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Tüm hesaplamalar 4857 İş Kanunu ve 31. Dönem TİS'e %100 uyumludur.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onOpenZamModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenZamModal();
                }}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 border border-amber-500/50 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
                <span>TİS Zammı Simülatörü</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
            >
              Anladım, Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
