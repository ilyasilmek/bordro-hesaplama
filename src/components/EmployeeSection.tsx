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
        <div className="flex items-center justify-between gap-1">
          <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="adi">
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
              className="w-full text-xs 2xl:text-sm font-bold bg-white/95 border border-sky-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-400"
            />
          </div>
        </div>

        {/* Soyadı */}
        <div className="flex items-center justify-between gap-1">
          <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="soyadi">
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
              className="w-full text-xs 2xl:text-sm font-bold uppercase bg-white/95 border border-sky-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-400"
            />
          </div>
        </div>

        {/* Ünvanı */}
        <div className="flex items-center justify-between gap-1">
          <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="unvani">
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
              className="w-full text-xs 2xl:text-sm font-semibold uppercase bg-white/95 border border-sky-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-400"
            />
          </div>
        </div>

        {/* Der/Kad. */}
        <div className="flex items-center justify-between gap-1">
          <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="derKad">
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
              className="w-full text-xs 2xl:text-sm font-semibold bg-white/95 border border-sky-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-400"
            />
          </div>
        </div>

        {/* Kıdem & Hizmet Yılı */}
        <div className="grid grid-cols-2 gap-1.5 text-xs pt-0.5">
          <div>
            <label className="text-slate-700 block text-[10.5px] font-medium" htmlFor="kidemYili">
              Kıdem Yılı
            </label>
            <input
              id="kidemYili"
              name="kidemYili"
              type="number"
              placeholder="0"
              value={bordro.kidemYili || ''}
              onChange={e => onChange({ kidemYili: parseInt(e.target.value, 10) || 0 })}
              onFocus={e => e.target.select()}
              className="w-full text-xs 2xl:text-sm font-semibold text-right bg-white/95 border border-sky-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-400"
            />
          </div>
          <div>
            <label className="text-slate-700 block text-[10.5px] font-medium" htmlFor="hzmZammiYil">
              Hzm.Zammı Yıl
            </label>
            <input
              id="hzmZammiYil"
              name="hzmZammiYil"
              type="number"
              placeholder="0"
              value={bordro.hzmZammiYil || ''}
              onChange={e => onChange({ hzmZammiYil: parseInt(e.target.value, 10) || 0 })}
              onFocus={e => e.target.select()}
              className="w-full text-xs 2xl:text-sm font-semibold text-right bg-white/95 border border-sky-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-400"
            />
          </div>
        </div>

        {/* Saat Ücreti - Temel Baz Katsayı */}
        <div className="flex items-center justify-between gap-1 bg-sky-100/70 p-1.5 rounded border border-sky-300/90">
          <div className="flex items-center gap-1">
            <label className="text-sky-950 font-bold shrink-0 text-xs" htmlFor="saatUcr">
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
              placeholder="0,000000"
              defaultValue={bordro.saatUcr > 0 ? formatCurrency(bordro.saatUcr, 6) : ''}
              onBlur={e => handleSaatUcrBlur(e.target.value)}
              onFocus={e => e.target.select()}
              className="w-full text-xs 2xl:text-sm font-bold text-right text-sky-950 bg-white border border-sky-300 rounded px-1.5 py-0.5 focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
            />
          </div>
        </div>

        {/* Emk. Zam */}
        <div className="flex items-center justify-between gap-1">
          <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="emkZam">
            Emk. Zam
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              key={`emkZam-${bordro.emkZam}`}
              id="emkZam"
              name="emkZam"
              type="text"
              placeholder="0,000000"
              defaultValue={bordro.emkZam > 0 ? formatCurrency(bordro.emkZam, 6) : ''}
              onBlur={e => handleEmkZamBlur(e.target.value)}
              onFocus={e => e.target.select()}
              className="w-full text-xs 2xl:text-sm font-semibold text-right bg-white/95 border border-sky-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-400"
            />
          </div>
        </div>

        {/* Brt Aylk */}
        <div className="flex items-center justify-between gap-1">
          <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="brtAylk">
            Brt Aylk
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              key={`brtAylk-${bordro.brtAylk}`}
              id="brtAylk"
              name="brtAylk"
              type="text"
              placeholder="0,00"
              defaultValue={bordro.brtAylk > 0 ? formatCurrency(bordro.brtAylk) : ''}
              onBlur={e => onChange({ brtAylk: parseCurrency(e.target.value) })}
              onFocus={e => e.target.select()}
              className="w-full text-xs 2xl:text-sm font-semibold text-right bg-white/95 border border-sky-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-400"
            />
          </div>
        </div>

        {/* Kdm. Zam */}
        <div className="flex items-center justify-between gap-1">
          <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="kdmZam">
            Kdm. Zam
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              key={`kdmZam-${bordro.kdmZam}`}
              id="kdmZam"
              name="kdmZam"
              type="text"
              placeholder="0,00"
              defaultValue={bordro.kdmZam > 0 ? formatCurrency(bordro.kdmZam) : ''}
              onBlur={e => onChange({ kdmZam: parseCurrency(e.target.value) })}
              onFocus={e => e.target.select()}
              className="w-full text-xs 2xl:text-sm font-semibold text-right bg-white/95 border border-sky-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-400"
            />
          </div>
        </div>

        {/* Hast. Gün */}
        <div className="flex items-center justify-between gap-1">
          <label className="text-slate-700 shrink-0 text-xs font-medium" htmlFor="hastGun">
            Hast. Gün
          </label>
          <div className="flex items-center w-36 2xl:w-44">
            <span className="mr-1 text-slate-500 font-bold">:</span>
            <input
              key={`hastGun-${bordro.hastGun}`}
              id="hastGun"
              name="hastGun"
              type="text"
              placeholder="0"
              defaultValue={bordro.hastGun > 0 ? formatCurrency(bordro.hastGun) : ''}
              onBlur={e => onChange({ hastGun: parseCurrency(e.target.value) })}
              onFocus={e => e.target.select()}
              className="w-full text-xs 2xl:text-sm font-semibold text-right bg-white/95 border border-sky-200/90 rounded px-1.5 py-0.5 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-400"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
