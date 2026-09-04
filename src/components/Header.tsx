import React from 'react';
import {
  FileText,
  Calculator,
  Calendar,
  Layers,
  Settings2,
  FileSpreadsheet,
  Printer,
  RotateCcw,
  Sparkles,
  FileSearch,
  Award
} from 'lucide-react';
import { TisParameters } from '../types';
import { DEFAULT_TIS_TEMPLATES, TURKISH_MONTHS } from '../constants/defaultTisConfig';
import { formatTRY } from '../utils/payrollCalculator';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedTemplateKey: string;
  onSelectTemplate: (key: string) => void;
  activeMonth: number;
  onSelectMonth: (month: number) => void;
  tisConfig: TisParameters;
  onResetToDefaults: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedTemplateKey,
  onSelectTemplate,
  activeMonth,
  onSelectMonth,
  tisConfig,
  onResetToDefaults,
  onPrint,
}) => {
  const tabs = [
    {
      id: 'retro',
      label: 'TCDD Bordro Pusulası (Orijinal Format)',
      icon: Award,
      badge: 'Bordrolar',
    },
    {
      id: 'report',
      label: 'TCDD Bordro İnceleme Raporu',
      icon: FileSearch,
      badge: 'Rapor',
    },
    {
      id: 'calculator',
      label: 'Dinamik Bordro Hesaplayıcı',
      icon: Calculator,
    },
    {
      id: 'yearly',
      label: '12 Aylık Projeksiyon',
      icon: Calendar,
    },
    {
      id: 'difference',
      label: 'TİS Geriye Dönük Fark',
      icon: Layers,
    },
    {
      id: 'slip',
      label: 'A4 Resmi Pusula',
      icon: FileText,
    },
    {
      id: 'importer',
      label: 'TİS & Rapor Aktarımı',
      icon: FileSpreadsheet,
    },
    {
      id: 'settings',
      label: 'TİS & Vergi Parametreleri',
      icon: Settings2,
    },
  ];

  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 shadow-md print:hidden select-none">
      {/* Top Bar with System Branding and Global Context */}
      <div className="w-full px-6 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white shadow-sm font-bold text-xl tracking-tight">
            ₺
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-bold tracking-tight text-white">
                TCDD Taşımacılık A.Ş. — TİS ve Personel Bordro Robotu
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                31. Dönem TİS
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-medium rounded bg-purple-950 text-purple-300 border border-purple-800/60">
                Gazi & Şehit Yakını Uyumlu
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Demiryol-İş 31. Dönem Grup Toplu İş Sözleşmesi (2025–2027), 4857 SK, 5510 SK ve 193 Sayılı GVK
            </p>
          </div>
        </div>

        {/* Global Controls: TİS Template Selector & Month Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* TİS Template Dropdown */}
          <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
            <span className="text-slate-400">TİS Şablonu:</span>
            <select
              id="tis-template-select"
              value={selectedTemplateKey}
              onChange={(e) => onSelectTemplate(e.target.value)}
              className="bg-slate-900 text-xs font-bold text-emerald-400 rounded px-2 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="kamu">TCDD Taşımacılık 31. Dönem TİS (Demiryol-İş)</option>
              <option value="belediye">Belediye İştirak Şirketi TİS</option>
              <option value="sanayi">Ağır Sanayi ve Metal TİS</option>
              <option value="custom">Özel Tanımlı TİS</option>
            </select>
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
            <span className="text-slate-400">Dönem:</span>
            <select
              id="period-month-select"
              value={activeMonth}
              onChange={(e) => onSelectMonth(Number(e.target.value))}
              className="bg-slate-900 text-xs font-bold text-blue-400 rounded px-2 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {TURKISH_MONTHS.map((mName, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {idx + 1}. Ay ({mName} 2026)
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button
              id="btn-quick-print"
              onClick={onPrint}
              title="Resmi Bordro Pusulasını Yazdır / PDF İndir"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Yazdır</span>
            </button>
            <button
              id="btn-quick-reset"
              onClick={onResetToDefaults}
              title="Varsayılan Değerlere Sıfırla"
              className="p-1.5 text-xs rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="w-full px-6 flex items-center gap-1 bg-slate-950/70 border-t border-slate-800/40 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-emerald-500 text-emerald-400 bg-slate-900/80 shadow-inner'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`ml-1 px-1.5 py-0.2 rounded text-[10px] font-extrabold ${
                  tab.id === 'retro'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
