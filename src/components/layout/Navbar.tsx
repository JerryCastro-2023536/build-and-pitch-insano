import React from 'react';
import { ScreenId } from '../../domain/flowStateMachine';
import { BalamJaguarAvatar } from '../common/BalamJaguarAvatar';

export interface NavbarProps {
  currentScreenId: ScreenId;
  onSelectScreen: (screenId: ScreenId) => void;
  studentName?: string;
  onResetDemo: () => void;
  onLoadPitchScenario: () => void;
}

export const SCREENS_META: { id: ScreenId; title: string; subtitle: string; icon: string }[] = [
  { id: 1, title: '1. Registro', subtitle: 'Bienvenida', icon: 'person_add' },
  { id: 2, title: '2. Mi Camino', subtitle: 'Hub interactivo', icon: 'explore' },
  { id: 3, title: '3. Pizarra', subtitle: 'Resolución', icon: 'draw' },
  { id: 4, title: '4. Feedback', subtitle: 'Cámara lenta', icon: 'troubleshoot' },
  { id: 5, title: '5. Ruta Nudos', subtitle: '5 Nudos', icon: 'route' },
  { id: 6, title: '6. Apoyo', subtitle: 'Guía PEMDAS', icon: 'menu_book' },
  { id: 7, title: '7. Mi Progreso', subtitle: 'Métricas y Telar', icon: 'analytics' },
  { id: 8, title: '8. Docente/Tutor', subtitle: 'Acompañamiento', icon: 'supervisor_account' },
  { id: 9, title: '9. Base Reparada', subtitle: 'Cierre de Pitch', icon: 'celebration' }
];

export const Navbar: React.FC<NavbarProps> = ({
  currentScreenId,
  onSelectScreen,
  studentName = 'Camila Morales',
  onResetDemo,
  onLoadPitchScenario
}) => {
  return (
    <header className="bg-[#fff8f0]/95 backdrop-blur-md border-b-2 border-[#201b0d]/10 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Logo & Title */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group" 
            onClick={() => onSelectScreen(2)}
            title="Ir a Mi Camino"
          >
            <BalamJaguarAvatar size={38} animated />
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <span className="font-headline font-bold text-xl sm:text-2xl text-[#201b0d] tracking-tight">
                  Balam
                </span>
                <span className="font-mono text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#f5a623] text-[#291800] shadow-[1px_1px_0px_#201b0d]">
                  PISA 2025
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#b90c55] font-bold uppercase tracking-wider mt-0.5">
                Plataforma de Remediación Matemática
              </span>
            </div>
          </div>

          {/* User Metrics & Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Racha de 5 días */}
            <div className="flex items-center gap-1 bg-[#fef3db] border border-[#d7c3ae] px-2.5 py-1 rounded-full shadow-[2px_2px_0px_#201b0d]" title="Racha de 5 días de práctica">
              <span className="material-symbols-outlined text-[#835500] text-[18px]">local_fire_department</span>
              <span className="font-mono text-[12px] font-bold text-[#201b0d]">5d</span>
            </div>

            {/* Puntos de Urdimbre */}
            <div className="hidden xs:flex items-center gap-1 bg-[#f5a623] text-[#291800] border border-[#201b0d] px-2.5 py-1 rounded-full shadow-[2px_2px_0px_#201b0d]" title="Puntos del telar">
              <span className="material-symbols-outlined text-[16px]">stars</span>
              <span className="font-mono text-[12px] font-bold">320</span>
            </div>

            {/* Active Student Pill */}
            {studentName && (
              <div 
                className="flex items-center gap-2 bg-[#f8edd5] border border-[#201b0d]/20 px-2.5 py-1 rounded-full cursor-pointer hover:bg-[#f2e7d0] transition-colors"
                onClick={() => onSelectScreen(7)}
                title="Ver perfil y progreso"
              >
                <div className="w-6 h-6 rounded-full bg-[#1e1548] text-white flex items-center justify-center font-bold text-[11px]">
                  {studentName.charAt(0)}
                </div>
                <span className="font-sans text-xs font-bold text-[#201b0d] hidden sm:inline">
                  {studentName}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 9 Screens Navigation Slider Tabs */}
        <nav 
          aria-label="Pantallas de la plataforma"
          className="flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar border-t border-[#201b0d]/10 text-xs"
        >
          {SCREENS_META.map((screen) => {
            const isActive = currentScreenId === screen.id;
            return (
              <button
                key={screen.id}
                onClick={() => onSelectScreen(screen.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-[#1e1548] text-white shadow-[2px_2px_0px_#f5a623] border border-[#1e1548]'
                    : 'bg-[#fff8f0] text-[#524534] hover:text-[#201b0d] hover:bg-[#f8edd5] border border-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{screen.icon}</span>
                <span>{screen.title}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623] animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
