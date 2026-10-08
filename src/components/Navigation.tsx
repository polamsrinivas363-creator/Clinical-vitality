import React from 'react';
import { 
  Activity, 
  HeartPulse, 
  FileText, 
  AlertTriangle, 
  Pill
} from 'lucide-react';

export type TabType = 'dashboard' | 'triage' | 'records' | 'emergency' | 'medications';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  urgentAlertCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  urgentAlertCount = 0
}) => {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Vitality Dashboard',
      shortLabel: 'Vitals',
      icon: Activity,
      badge: null
    },
    {
      id: 'triage' as TabType,
      label: 'AI Symptom Triage',
      shortLabel: 'AI Triage',
      icon: HeartPulse,
      badge: 'Interactive'
    },
    {
      id: 'records' as TabType,
      label: 'Diagnostics & Records',
      shortLabel: 'Records',
      icon: FileText,
      badge: null
    },
    {
      id: 'emergency' as TabType,
      label: '24/7 ER Hub & Tele-Vet',
      shortLabel: 'ER Hub',
      icon: AlertTriangle,
      badge: urgentAlertCount > 0 ? `${urgentAlertCount} Active` : null,
      badgeUrgent: urgentAlertCount > 0
    },
    {
      id: 'medications' as TabType,
      label: 'Medications & Plan',
      shortLabel: 'Meds',
      icon: Pill,
      badge: null
    }
  ];

  return (
    <nav className="bg-white border-b border-[#e2e8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-heading font-semibold text-xs sm:text-sm whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-[#00685f] text-white shadow-sm shadow-[#00685f]/20'
                    : 'text-[#6d7a77] hover:text-[#131b2e] hover:bg-[#faf8ff]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6d7a77]'}`} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>

                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      tab.badgeUrgent
                        ? isActive
                          ? 'bg-red-500 text-white'
                          : 'bg-red-100 text-red-700'
                        : isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#eaedff] text-[#006398]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
