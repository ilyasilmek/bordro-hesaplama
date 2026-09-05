import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { BordroData } from '../types';
import { formatCurrency, parseCurrency } from '../utils/bordroEngine';

interface EarningsAndDeductionsSectionProps {
  bordro: BordroData;
  onChange: (updates: Partial<BordroData>) => void;
  onHourChange: (id: string, hours: number) => void;
  onAmountChange?: (id: string, amount: number) => void;
}

export const EarningsAndDeductionsSection: React.FC<EarningsAndDeductionsSectionProps> = ({
  bordro,
  onChange,
  onHourChange,
  onAmountChange
}) => {
  const [newDedName, setNewDedName] = useState('');
  const [newDedAmount, setNewDedAmount] = useState('');

  const handleAddCustomDeduction = () => {
    if (!newDedName.trim()) return;
    const amount = parseCurrency(newDedAmount);
    const updated = [
      ...(bordro.customDeductions || []),
      {
        id: `custom-ded-${Date.now()}`,
        name: newDedName.trim(),
        amount
      }
    ];
    onChange({ customDeductions: updated });
    setNewDedName('');
    setNewDedAmount('');
  };

  const handleRemoveCustomDeduction = (id: string) => {
    const updated = (bordro.customDeductions || []).filter(item => item.id !== id);
    onChange({ customDeductions: updated });
  };

  const handleCustomDeductionAmountChange = (id: string, val: string) => {
    const amount = parseCurrency(val);
    const updated = (bordro.customDeductions || []).map(item =>
      item.id === id ? { ...item, amount } : item
    );
    onChange({ customDeductions: updated });
  };

  const handleSetFmRate = (id: string, targetRule: 'mesai175' | 'mesai200') => {
    const updatedEarnings = bordro.earnings.map(item => {
      if (item.id === id || item.rule === 'mesai175' || item.rule === 'mesai200') {
        return {
          ...item,
          rule: targetRule,
          label: targetRule === 'mesai175' ? 'FM %75 Pntr' : 'Fzl Mes %100',
          badge: targetRule === 'mesai175' ? '%75' : '%100'
        };
      }
      return item;
    });
    onChange({ earnings: updatedEarnings });
  };

  const visibleEarnings = bordro.earnings.filter(earning => {
    const isNormal = bordro.calisanStatusu === 'normal';
    // Normal çalışanlarda GŞT %10 (Gazi Şeref Tazminatı) gösterilmez
    if (isNormal && earning.id === 'gst') return false;
    // Gazi bordrosunda Postabaşılık Saati gösterilmez
    if (!isNormal && (earning.id === 'postabasi' || earning.rule === 'postabasi')) return false;
    return true;
  });

  const handleHourKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    if (e.key === 'Enter' || (e.key === 'Tab' && !e.shiftKey)) {
      if (currentIndex < visibleEarnings.length - 1) {
        e.preventDefault();
        const input = e.currentTarget;
        input.blur();
        const nextId = `hour-${visibleEarnings[currentIndex + 1].id}`;
        setTimeout(() => {
          const nextEl = document.getElementById(nextId) as HTMLInputElement | null;
          if (nextEl) {
            nextEl.focus();
            nextEl.select();
          }
        }, 10);
      }
    } else if (e.key === 'Tab' && e.shiftKey) {
      if (currentIndex > 0) {
        e.preventDefault();
        const input = e.currentTarget;
        input.blur();
        const prevId = `hour-${visibleEarnings[currentIndex - 1].id}`;
        setTimeout(() => {
          const prevEl = document.getElementById(prevId) as HTMLInputElement | null;
          if (prevEl) {
            prevEl.focus();
            prevEl.select();
          }
        }, 10);
      }
    }
  };

  return (
    <section id="earnings-and-deductions-section" className="md:col-span-6 font-dotmatrix">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 2xl:gap-4 h-full">
        {/* Left Card: Hakediş Kalemleri */}
        <div className="bg-emerald-50/40 border border-emerald-200/90 rounded-lg p-3 2xl:p-3.5 space-y-1.5 2xl:space-y-2 shadow-xs flex flex-col justify-between">
          <div className="space-y-1 2xl:space-y-1.5">
            <div className="text-xs font-bold text-emerald-950 uppercase mb-2 pb-1 border-b border-emerald-200/90 flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                HAKEDİŞ KALEMLERİ
              </span>
              <span className="text-[10.5px] text-emerald-800 font-semibold">SAAT / TUTAR (₺)</span>
            </div>

            {visibleEarnings.map((earning, index) => {
              const isNormal = bordro.calisanStatusu === 'normal';
              const isFmItem = earning.id === 'fm' || earning.rule === 'mesai175' || earning.rule === 'mesai200';
              const isPostabasi = earning.id === 'postabasi' || earning.rule === 'postabasi';

              return (
                <div key={earning.id} className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-center">
                    {isFmItem ? (
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="text-[11px] 2xl:text-xs text-slate-800 font-bold truncate">
                          {isNormal && earning.rule === 'mesai175' ? 'FM %75 Pntr' : 'Fzl Mes %100'}
                        </span>
                        {/* %75 / %100 Seçim Butonları sadece Normal İşçi için gösterilir */}
                        {isNormal && (
                          <div
                            id={`fm-selector-${earning.id}`}
                            className="no-print inline-flex items-center bg-slate-200/90 p-0.5 rounded border border-slate-300 text-[9px] font-bold shrink-0 ml-1"
                          >
                            <button
                              id={`btn-fm-75-${earning.id}`}
                              type="button"
                              tabIndex={-1}
                              onClick={() => handleSetFmRate(earning.id, 'mesai175')}
                              className={`px-1.5 py-0.2 rounded cursor-pointer transition ${
                                earning.rule === 'mesai175'
                                  ? 'bg-amber-600 text-white shadow-2xs font-extrabold'
                                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
                              }`}
                              title="Haftalık 45 saati aşan çalışma: (Saat Ücr + Emek Zam) toplamının %75 fazlası (1,75x)"
                            >
                              %75 Pntr
                            </button>
                            <button
                              id={`btn-fm-100-${earning.id}`}
                              type="button"
                              tabIndex={-1}
                              onClick={() => handleSetFmRate(earning.id, 'mesai200')}
                              className={`px-1.5 py-0.2 rounded cursor-pointer transition ${
                                earning.rule === 'mesai200'
                                  ? 'bg-purple-700 text-white shadow-2xs font-extrabold'
                                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
                              }`}
                              title="Hafta tatili / bayram çalışması: (Saat Ücr + Emek Zam) toplamının %100 fazlası (2,00x)"
                            >
                              %100
                            </button>
                          </div>
                        )}
                      </div>
                    ) : isPostabasi ? (
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[11px] 2xl:text-xs text-slate-800 font-semibold truncate">
                          {earning.label}
                        </span>
                        <span
                          className="no-print text-[8.5px] text-sky-800 bg-sky-100/90 px-1.5 py-0.2 rounded border border-sky-200 font-semibold"
                          title={`TİS Postabaşılık saat ücreti ${formatCurrency(bordro.postabasiSaatUcreti ?? 4.84)} TL baz alınır (Zam uygulandığında oransal artar)`}
                        >
                          {formatCurrency(bordro.postabasiSaatUcreti ?? 4.84)} ₺/saat
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] 2xl:text-xs text-slate-800 font-medium truncate">
                        {earning.label}
                      </span>
                    )}

                    {isFmItem ? (
                      <span
                        className={`no-print text-[8px] px-1.5 py-0.2 rounded font-semibold border ${
                          isNormal && earning.rule === 'mesai175'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-purple-100 text-purple-900 border-purple-300'
                        }`}
                        title={
                          isNormal && earning.rule === 'mesai175'
                            ? 'Hesaplama: Saat x (Saat Ücreti + Emek Zammı) x 1.75'
                            : 'Hesaplama: Saat x (Saat Ücreti + Emek Zammı) x 2.00'
                        }
                      >
                        {isNormal && earning.rule === 'mesai175' ? '1.75x' : '2.00x'}
                      </span>
                    ) : isPostabasi ? (
                      <span
                        className="no-print text-[8px] bg-sky-100 text-sky-900 px-1.5 py-0.2 rounded font-semibold border border-sky-300"
                        title={`TİS Postabaşılık Saati: Saat x ${formatCurrency(bordro.postabasiSaatUcreti ?? 4.84)} TL`}
                      >
                        {formatCurrency(bordro.postabasiSaatUcreti ?? 4.84)} ₺
                      </span>
                    ) : (
                      <span
                        className="no-print text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold border border-emerald-200"
                        title="Formül ile anlık katsayı çarpımı"
                      >
                        {earning.badge || 'OTO'}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-12 gap-1.5">
                    <input
                      key={`hours-${earning.id}-${earning.hours}`}
                      id={`hour-${earning.id}`}
                      title={`${earning.label} Süresi (${earning.unitLabel || 'Saat'}) - Tab tuşuyla alt satıra geçer`}
                      type="text"
                      placeholder="0,00"
                      defaultValue={earning.hours > 0 ? formatCurrency(earning.hours) : ''}
                      onKeyDown={e => handleHourKeyDown(e, index)}
                      onFocus={e => e.target.select()}
                      onBlur={e => onHourChange(earning.id, parseCurrency(e.target.value))}
                      className="col-span-5 text-xs text-right bg-white/95 border border-emerald-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                    <input
                      key={`amount-${earning.id}-${earning.amount}`}
                      id={`amount-${earning.id}`}
                      tabIndex={-1}
                      title={`${earning.label} Tutarı (Otomatik veya Manuel Düzenlenebilir)`}
                      type="text"
                      placeholder="0,00"
                      defaultValue={earning.amount > 0 ? formatCurrency(earning.amount) : ''}
                      onFocus={e => e.target.select()}
                      onBlur={e => {
                        if (onAmountChange) {
                          onAmountChange(earning.id, parseCurrency(e.target.value));
                        }
                      }}
                      className="col-span-7 text-xs font-bold text-right bg-emerald-100/50 text-emerald-950 border border-emerald-200/90 rounded px-1.5 py-0.5 font-mono focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Card: Özel Kesintiler */}
        <div className="bg-amber-50/45 border border-amber-200/90 rounded-lg p-3 2xl:p-3.5 space-y-1.5 2xl:space-y-2 shadow-xs flex flex-col justify-between">
          <div className="space-y-1.5 2xl:space-y-2">
            <div className="text-xs font-bold text-amber-950 uppercase mb-2 pb-1 border-b border-amber-200/90 flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                ÖZEL KESİNTİLER
              </span>
              <span className="text-[10.5px] text-amber-800 font-semibold">TUTAR (TL)</span>
            </div>

            {/* Birleştirilmiş Sosyal Yardım */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-1">
                <label
                  className="text-[11px] 2xl:text-xs text-slate-800 font-medium whitespace-nowrap"
                  htmlFor="kesBirlestirilm"
                  title="Birleştirilmiş Sosyal Yardım (Gelir Kalemi)"
                >
                  Birleştirilmiş
                </label>
                <span
                  className="no-print text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-300 shrink-0 leading-tight"
                  title="TCDD TİS kapsamında Gelir Toplamına eklenen sosyal yardım"
                >
                  +GELİR
                </span>
              </div>
              <div className="flex items-center w-28 sm:w-32 2xl:w-36 shrink-0">
                <span className="mr-1 text-slate-500 font-bold">:</span>
                <input
                  key={`birlestirilm-${bordro.birlestirilmSosyalYardim}`}
                  id="kesBirlestirilm"
                  name="kesBirlestirilm"
                  type="text"
                  placeholder="0,00"
                  defaultValue={bordro.birlestirilmSosyalYardim > 0 ? formatCurrency(bordro.birlestirilmSosyalYardim) : ''}
                  onFocus={e => e.target.select()}
                  onBlur={e => onChange({ birlestirilmSosyalYardim: parseCurrency(e.target.value) })}
                  className="w-full text-xs font-bold text-right bg-white/95 border border-amber-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Sendika Aidatı */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-1">
                <label
                  className="text-[11px] 2xl:text-xs text-slate-700 font-medium whitespace-nowrap"
                  htmlFor="kesSendika"
                  title="31. Dönem TİS Madde 18 & GVK 63/4: Sendika üyesi personelden aylık 1 günlük yevmiye [6,20 saat x (Saat Ücreti + Emek Zammı)] çıplak ücreti tutarında kesilir ve Gelir Vergisi matrahından tenzil edilir."
                >
                  Sendika Aidatı
                </label>
                <div className="no-print flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const tisAmount = Math.round(6.20 * (bordro.saatUcr + bordro.emkZam) * 100) / 100;
                      onChange({ sendikaAidati: tisAmount, sendikaAidatiModu: 'oto' });
                    }}
                    className={`text-[8.5px] px-1.5 py-0.2 rounded border font-bold cursor-pointer transition ${
                      bordro.sendikaAidatiModu !== 'manuel'
                        ? 'bg-purple-100 text-purple-900 border-purple-300 shadow-2xs'
                        : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-purple-50'
                    }`}
                    title="31. Dönem TİS Md. 18 formülü ile otomatik hesapla: 6,20 × (Saat Ücreti + Emek Zammı)"
                  >
                    TİS 6,20x {bordro.sendikaAidatiModu !== 'manuel' ? '(OTO)' : ''}
                  </button>
                  {bordro.sendikaAidatiModu === 'manuel' && (
                    <span className="text-[8px] bg-amber-100 text-amber-900 border border-amber-300 px-1 py-0.2 rounded font-semibold">
                      MANUEL
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center w-28 sm:w-32 2xl:w-36 shrink-0">
                <span className="mr-1 text-slate-500 font-bold">:</span>
                <input
                  key={`sendika-${bordro.sendikaAidati}`}
                  id="kesSendika"
                  name="kesSendika"
                  type="text"
                  placeholder="0,00"
                  defaultValue={bordro.sendikaAidati > 0 ? formatCurrency(bordro.sendikaAidati) : ''}
                  onFocus={e => e.target.select()}
                  onBlur={e => {
                    const parsed = parseCurrency(e.target.value);
                    const tisAmount = Math.round(6.20 * (bordro.saatUcr + bordro.emkZam) * 100) / 100;
                    onChange({
                      sendikaAidati: parsed,
                      sendikaAidatiModu: Math.abs(parsed - tisAmount) < 0.01 ? 'oto' : 'manuel'
                    });
                  }}
                  title="Sendika Aidatı (TİS Md. 18 & GVK 63/4 uyarınca Gelir Vergisi matrahından tenzil edilir)"
                  className="w-full text-xs font-bold text-right bg-white/95 border border-amber-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>

            {/* Spor Aidatı */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center flex-1 min-w-0 pr-1">
                <label
                  className="text-[11px] 2xl:text-xs text-slate-700 font-medium whitespace-nowrap"
                  htmlFor="kesSpor"
                  title="Spor Aidatı"
                >
                  Spor Aidatı
                </label>
              </div>
              <div className="flex items-center w-28 sm:w-32 2xl:w-36 shrink-0">
                <span className="mr-1 text-slate-500 font-bold">:</span>
                <input
                  key={`spor-${bordro.sporAidati}`}
                  id="kesSpor"
                  name="kesSpor"
                  type="text"
                  placeholder="0,00"
                  defaultValue={bordro.sporAidati > 0 ? formatCurrency(bordro.sporAidati) : ''}
                  onFocus={e => e.target.select()}
                  onBlur={e => onChange({ sporAidati: parseCurrency(e.target.value) })}
                  className="w-full text-xs font-bold text-right bg-white/95 border border-amber-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Vergiden Mua (3.000 TL Gazi / Engellilik İndirimi) - Sadece Gazi Statüsünde gösterilir */}
            {bordro.calisanStatusu !== 'normal' && (
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-1">
                  <label
                    className="text-[11px] 2xl:text-xs text-slate-800 font-medium whitespace-nowrap"
                    htmlFor="kesVergidenMua"
                    title="GVK Madde 31 - Engelli / Gazi Vergi İndirimi"
                  >
                    Vergiden Mua
                  </label>
                  <span
                    className="no-print text-[8px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.2 rounded border border-sky-300 shrink-0 leading-tight"
                    title="Vergi matrahından düşen istisna tutarı"
                  >
                    İNDİRİM
                  </span>
                </div>
                <div className="flex items-center w-28 sm:w-32 2xl:w-36 shrink-0">
                  <span className="mr-1 text-slate-500 font-bold">:</span>
                  <input
                    key={`vergiMuafiyeti-${bordro.vergiMuafiyeti}`}
                    id="kesVergidenMua"
                    name="kesVergidenMua"
                    type="text"
                    placeholder="0,00"
                    defaultValue={bordro.vergiMuafiyeti > 0 ? formatCurrency(bordro.vergiMuafiyeti) : ''}
                    onFocus={e => e.target.select()}
                    onBlur={e => onChange({ vergiMuafiyeti: parseCurrency(e.target.value) })}
                    className="w-full text-xs font-bold text-right bg-white/95 border border-amber-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}

            {/* Terfi Farkı (+GELİR) */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-1">
                <label
                  className="text-[11px] 2xl:text-xs text-slate-800 font-medium whitespace-nowrap"
                  htmlFor="kesTerfiFarki"
                  title="TİS İntibak / Terfi Farkı (Gelir Kalemi)"
                >
                  Terfi Fark-İ
                </label>
                <span
                  className="no-print text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-300 shrink-0 leading-tight"
                  title="TCDD TİS kapsamında Gelir Toplamına eklenen intibak/terfi farkı"
                >
                  +GELİR
                </span>
              </div>
              <div className="flex items-center w-28 sm:w-32 2xl:w-36 shrink-0">
                <span className="mr-1 text-slate-500 font-bold">:</span>
                <input
                  key={`terfiFarki-${bordro.terfiFarki}`}
                  id="kesTerfiFarki"
                  name="kesTerfiFarki"
                  type="text"
                  placeholder="0,00"
                  defaultValue={bordro.terfiFarki > 0 ? formatCurrency(bordro.terfiFarki) : ''}
                  onFocus={e => e.target.select()}
                  onBlur={e => onChange({ terfiFarki: parseCurrency(e.target.value) })}
                  className="w-full text-xs font-bold text-right bg-white/95 border border-amber-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Mahsup Ksnt. */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center flex-1 min-w-0 pr-1">
                <label
                  className="text-[11px] 2xl:text-xs text-slate-700 font-medium whitespace-nowrap"
                  htmlFor="kesMahsup"
                  title="Mahsup Kesintisi"
                >
                  Mahsup Ksnt.
                </label>
              </div>
              <div className="flex items-center w-28 sm:w-32 2xl:w-36 shrink-0">
                <span className="mr-1 text-slate-500 font-bold">:</span>
                <input
                  key={`mahsupKesintisi-${bordro.mahsupKesintisi}`}
                  id="kesMahsup"
                  name="kesMahsup"
                  type="text"
                  placeholder="0,00"
                  defaultValue={bordro.mahsupKesintisi > 0 ? formatCurrency(bordro.mahsupKesintisi) : ''}
                  onFocus={e => e.target.select()}
                  onBlur={e => onChange({ mahsupKesintisi: parseCurrency(e.target.value) })}
                  className="w-full text-xs font-bold text-right bg-white/95 border border-amber-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* SSK Matrah D: (SSK Matrah Düzeltmesi) */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-1">
                <label
                  className="text-[11px] 2xl:text-xs text-slate-800 font-medium whitespace-nowrap"
                  htmlFor="kesSskMatrahD"
                  title="SSK Matrah Düzeltmesi: Yalnızca SSK Matrahını ve SSK primlerini etkiler; vergi matrahına ve vergilere dahil edilmez."
                >
                  SSK Matrah D:
                </label>
                <span
                  className="no-print text-[8px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded border border-indigo-300 shrink-0 leading-tight"
                  title="Yalnızca SSK Matrahı ve primlerini (%9 işçi, %14.25 işveren) etkiler. Vergide hesaba katılmaz."
                >
                  SSK ETKİ
                </span>
              </div>
              <div className="flex items-center w-28 sm:w-32 2xl:w-36 shrink-0">
                <span className="mr-1 text-slate-500 font-bold">:</span>
                <input
                  key={`sskMatrahD-${bordro.sskMatrahD}`}
                  id="kesSskMatrahD"
                  name="kesSskMatrahD"
                  type="text"
                  placeholder="0,00"
                  defaultValue={bordro.sskMatrahD > 0 ? formatCurrency(bordro.sskMatrahD) : ''}
                  onFocus={e => e.target.select()}
                  onBlur={e => onChange({ sskMatrahD: parseCurrency(e.target.value) })}
                  className="w-full text-xs font-bold text-right bg-white/95 border border-amber-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Custom Deductions List */}
            {(bordro.customDeductions || []).map(item => (
              <div key={item.id} className="flex items-center justify-between gap-1.5 pt-0.5">
                <div className="flex items-center gap-1 flex-1 min-w-0 pr-1">
                  <span className="text-[11px] text-slate-700 font-medium truncate">{item.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomDeduction(item.id)}
                    className="no-print p-0.5 text-rose-500 hover:text-rose-700"
                    title="Bu kesintiyi sil"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center w-28 sm:w-32 2xl:w-36 shrink-0">
                  <span className="mr-1 text-slate-500 font-bold">:</span>
                  <input
                    key={`custom-ded-${item.id}-${item.amount}`}
                    type="text"
                    defaultValue={formatCurrency(item.amount)}
                    onBlur={e => handleCustomDeductionAmountChange(item.id, e.target.value)}
                    className="w-full text-xs font-semibold text-right bg-white/95 border border-amber-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* New Custom Deduction Form */}
          <div className="pt-2 mt-2 border-t border-amber-200/80 no-print">
            <div className="text-[10px] font-bold text-amber-900 uppercase mb-1 flex items-center gap-1">
              <Plus className="w-3 h-3" />
              Özel Kesinti / İcra / Avans Ekle
            </div>
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Kesinti Adı (Örn: İcra)"
                value={newDedName}
                onChange={e => setNewDedName(e.target.value)}
                className="flex-1 text-[11px] bg-white border border-amber-300 rounded px-1.5 py-1 focus:outline-none focus:border-amber-600"
              />
              <input
                type="text"
                placeholder="Tutar"
                value={newDedAmount}
                onChange={e => setNewDedAmount(e.target.value)}
                className="w-20 text-[11px] text-right bg-white border border-amber-300 rounded px-1.5 py-1 focus:outline-none focus:border-amber-600"
              />
              <button
                type="button"
                onClick={handleAddCustomDeduction}
                className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded cursor-pointer"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
