import React from 'react';
import { ScreenId } from '../../domain/flowStateMachine';

export interface BottomNavigationProps {
  currentScreenId: ScreenId;
  onNavigate: (screenId: ScreenId) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentScreenId,
  onNavigate
}) => {
  const NAV_ITEMS: { screenId: ScreenId; label: string; icon: string }[] = [
    { screenId: 2, label: 'Mi Camino', icon: 'explore' },
    { screenId: 3, label: 'Pizarra', icon: 'draw' },
    { screenId: 7, label: 'Progreso', icon: 'analytics' },
    { screenId: 8, label: 'Tutor/Familia', icon: 'supervisor_account' }
  ];

  return (
    <nav 
      aria-label="Navegación principal móvil"
      className="fixed bottom-0 inset-x-0 z-40 bg-[#fff8f0]/95 backdrop-blur-xl border-t border-[#201b0d]/10 pb-safe shadow-[0_-2px_12px_rgba(32,27,13,0.06)]"
    >
      <div className="max-w-[420px] mx-auto flex justify-around items-center h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = currentScreenId === item.screenId;
          return (
            <button
              key={item.screenId}
              type="button"
              onClick={() => onNavigate(item.screenId)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-[#201b0d] bg-[#f8edd5] shadow-[2px_2px_0px_#201b0d] font-bold'
                  : 'text-[#524534] hover:text-[#201b0d] hover:bg-[#fef3db]'
              }`}
            >
              <span 
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="font-mono text-[10px] mt-0.5 leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
