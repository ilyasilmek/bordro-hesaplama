import React from 'react';
import { BordroData } from '../types';
import { formatCurrency, parseCurrency } from '../utils/bordroEngine';

interface EmployeeSectionProps {
  bordro: BordroData;
  onChange: (updates: Partial<BordroData>) => void;
  onBaseRateChange: (saatUcr: number, emkZam: number) => void;
}

export const EmployeeSection: React.FC<EmployeeSectionProps> = ({
  bordro,
  onChange,
  onBaseRateChange
}) => {
  const handleSaatUcrBlur = (val: string) => {
    const num = parseCurrency(val);
    onBaseRateChange(num, bordro.emkZam);
  };

  const handleEmkZamBlur = (val: string) => {
    const num = parseCurrency(val);
    onBaseRateChange(bordro.saatUcr, num);
  };

  return (
    <section
      id="employee-section"
      className="md:col-span-3 flex flex-col justify-between p-3 2xl:p-3.5 rounded-lg bg-sky-50/45 border border-sky-200/90 space-y-1.5 2xl:space-y-2 text-slate-900 font-dotmatrix shadow-xs"
    >
      <div className="space-y-1.5 2xl:space-y-2">
        {/* Adı */}
        <div className="flex items-center justify-between gap-1 p-1.5 rounded border bg-white/95 border-sky-200/90 shadow-2xs hover:border-sky-400 transition-all">
          <label className="text-slate-700 shrink-0 text-xs font-medium cursor-pointer" htmlFor="adi">
            Adı
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              id="adi"
              name="adi"
              type="text"
              placeholder="Adı"
              value={bordro.adi}
              onChange={e => onChange({ adi: e.target.value })}
              onFocus={e => e.target.select()}
              className="w-full text-xs 2xl:text-sm font-bold bg-white border border-slate-300 rounded px-1.5 py-0.5 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/40 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Soyadı */}
        <div className="flex items-center justify-between gap-1 p-1.5 rounded border bg-sky-50/70 border-sky-100/80 hover:border-sky-400 transition-all">
          <label className="text-slate-700 shrink-0 text-xs font-medium cursor-pointer" htmlFor="soyadi">
            Soyadı
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              id="soyadi"
              name="soyadi"
              type="text"
              placeholder="SOYADI"
              value={bordro.soyadi}
              onChange={e => onChange({ soyadi: e.target.value })}
              onFocus={e => e.target.select()}
              className="w-full text-xs 2xl:text-sm font-bold uppercase bg-white border border-slate-300 rounded px-1.5 py-0.5 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/40 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Ünvanı */}
        <div className="flex items-center justify-between gap-1 p-1.5 rounded border bg-white/95 border-sky-200/90 shadow-2xs hover:border-sky-400 transition-all">
          <label className="text-slate-700 shrink-0 text-xs font-medium cursor-pointer" htmlFor="unvani">
            Ünvanı
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              id="unvani"
              name="unvani"
              type="text"
              placeholder="Ünvanı"
              value={bordro.unvani}
              onChange={e => onChange({ unvani: e.target.value })}
              onFocus={e => e.target.select()}
              className="w-full text-xs 2xl:text-sm font-semibold uppercase bg-white border border-slate-300 rounded px-1.5 py-0.5 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/40 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Der/Kad. */}
        <div className="flex items-center justify-between gap-1 p-1.5 rounded border bg-sky-50/70 border-sky-100/80 hover:border-sky-400 transition-all">
          <label className="text-slate-700 shrink-0 text-xs font-medium cursor-pointer" htmlFor="derKad">
            Der/Kad.
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              id="derKad"
              name="derKad"
              type="text"
              placeholder="001/ 01"
              value={bordro.derKad}
              onChange={e => onChange({ derKad: e.target.value })}
              onFocus={e => e.target.select()}
              className="w-full text-xs 2xl:text-sm font-semibold bg-white border border-slate-300 rounded px-1.5 py-0.5 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/40 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Kıdem & Hizmet Yılı */}
        <div className="grid grid-cols-2 gap-1.5 text-xs p-1.5 rounded border bg-white/95 border-sky-200/90 shadow-2xs hover:border-sky-400 transition-all">
          <div>
            <label className="text-slate-700 block text-[10.5px] font-medium cursor-pointer" htmlFor="kidemYili">
              Kıdem Yılı
            </label>
            <input
              id="kidemYili"
              name="kidemYili"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="0"
              value={bordro.kidemYili || ''}
              onChange={e => onChange({ kidemYili: parseInt(e.target.value, 10) || 0 })}
              onFocus={e => e.target.select()}
              onClick={e => (e.target as HTMLInputElement).select()}
              className="w-full text-xs 2xl:text-sm font-semibold text-right bg-white border border-slate-300 rounded px-1.5 py-0.5 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/40 font-mono transition-all shadow-2xs"
            />
          </div>
          <div>
            <label className="text-slate-700 block text-[10.5px] font-medium cursor-pointer" htmlFor="hzmZammiYil">
              Hzm.Zammı Yıl
            </label>
            <input
              id="hzmZammiYil"
              name="hzmZammiYil"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="0"
              value={bordro.hzmZammiYil || ''}
              onChange={e => {
                const val = parseInt(e.target.value, 10) || 0;
                const updatedEarnings = bordro.earnings.map(item =>
                  item.id === 'hzm' ? { ...item, hours: val } : item
                );
                onChange({ hzmZammiYil: val, earnings: updatedEarnings });
              }}
              onFocus={e => e.target.select()}
              onClick={e => (e.target as HTMLInputElement).select()}
              className="w-full text-xs 2xl:text-sm font-semibold text-right bg-white border border-slate-300 rounded px-1.5 py-0.5 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/40 font-mono transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Saat Ücreti - Temel Baz Katsayı */}
        <div className="flex items-center justify-between gap-1 bg-sky-100/80 p-1.5 rounded border border-sky-300 shadow-2xs hover:border-sky-400 transition-all">
          <div className="flex items-center gap-1">
            <label className="text-sky-950 font-bold shrink-0 text-xs cursor-pointer" htmlFor="saatUcr">
              Saat Ücr
            </label>
            <span
              className="no-print text-[8px] bg-sky-200 text-sky-900 font-bold px-1 rounded border border-sky-300"
              title="Hakediş formüllerinde kullanılan temel katsayı"
            >
              BAZ
            </span>
          </div>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-sky-700 font-bold">:</span>
            <input
              key={`saatUcr-${bordro.saatUcr}`}
              id="saatUcr"
              name="saatUcr"
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              placeholder="0,000000"
              defaultValue={bordro.saatUcr > 0 ? formatCurrency(bordro.saatUcr, 6) : ''}
              onBlur={e => handleSaatUcrBlur(e.target.value)}
              onFocus={e => e.target.select()}
              onClick={e => (e.target as HTMLInputElement).select()}
              className="w-full text-xs 2xl:text-sm font-bold text-right text-sky-950 bg-white border border-sky-300 rounded px-1.5 py-0.5 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/40 font-mono transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Emk. Zam */}
        <div className="flex items-center justify-between gap-1 p-1.5 rounded border bg-sky-50/70 border-sky-100/80 hover:border-sky-400 transition-all">
          <label className="text-slate-700 shrink-0 text-xs font-medium cursor-pointer" htmlFor="emkZam">
            Emk. Zam
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              key={`emkZam-${bordro.emkZam}`}
              id="emkZam"
              name="emkZam"
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              placeholder="0,000000"
              defaultValue={bordro.emkZam > 0 ? formatCurrency(bordro.emkZam, 6) : ''}
              onBlur={e => handleEmkZamBlur(e.target.value)}
              onFocus={e => e.target.select()}
              onClick={e => (e.target as HTMLInputElement).select()}
              className="w-full text-xs 2xl:text-sm font-semibold text-right bg-white border border-slate-300 rounded px-1.5 py-0.5 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/40 font-mono transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Brt Aylk */}
        <div className="flex items-center justify-between gap-1 p-1.5 rounded border bg-white/95 border-sky-200/90 shadow-2xs hover:border-sky-400 transition-all">
          <label className="text-slate-700 shrink-0 text-xs font-medium cursor-pointer" htmlFor="brtAylk">
            Brt Aylk
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              key={`brtAylk-${bordro.brtAylk}`}
              id="brtAylk"
              name="brtAylk"
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              placeholder="0,00"
              defaultValue={bordro.brtAylk > 0 ? formatCurrency(bordro.brtAylk) : ''}
              onBlur={e => onChange({ brtAylk: parseCurrency(e.target.value) })}
              onFocus={e => e.target.select()}
              onClick={e => (e.target as HTMLInputElement).select()}
              className="w-full text-xs 2xl:text-sm font-semibold text-right bg-white border border-slate-300 rounded px-1.5 py-0.5 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/40 font-mono transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Kdm. Zam */}
        <div className="flex items-center justify-between gap-1 p-1.5 rounded border bg-sky-50/70 border-sky-100/80 hover:border-sky-400 transition-all">
          <label className="text-slate-700 shrink-0 text-xs font-medium cursor-pointer" htmlFor="kdmZam">
            Kdm. Zam
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              key={`kdmZam-${bordro.kdmZam}`}
              id="kdmZam"
              name="kdmZam"
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              placeholder="0,00"
              defaultValue={bordro.kdmZam > 0 ? formatCurrency(bordro.kdmZam) : ''}
              onBlur={e => onChange({ kdmZam: parseCurrency(e.target.value) })}
              onFocus={e => e.target.select()}
              onClick={e => (e.target as HTMLInputElement).select()}
              className="w-full text-xs 2xl:text-sm font-semibold text-right bg-white border border-slate-300 rounded px-1.5 py-0.5 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/40 font-mono transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Hast. Gün */}
        <div className="flex items-center justify-between gap-1 p-1.5 rounded border bg-white/95 border-sky-200/90 shadow-2xs hover:border-sky-400 transition-all">
          <label className="text-slate-700 shrink-0 text-xs font-medium cursor-pointer" htmlFor="hastGun">
            Hast. Gün
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              key={`hastGun-${bordro.hastGun}`}
              id="hastGun"
              name="hastGun"
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              placeholder="0"
              defaultValue={bordro.hastGun > 0 ? formatCurrency(bordro.hastGun) : ''}
              onBlur={e => onChange({ hastGun: parseCurrency(e.target.value) })}
              onFocus={e => e.target.select()}
              onClick={e => (e.target as HTMLInputElement).select()}
              className="w-full text-xs 2xl:text-sm font-semibold text-right bg-white border border-slate-300 rounded px-1.5 py-0.5 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/40 font-mono transition-all shadow-2xs"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
