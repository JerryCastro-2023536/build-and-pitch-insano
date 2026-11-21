import React from 'react';
import { Icons } from '../common/Icons';

export interface NavbarProps {
  currentScreenId: number;
  onSelectScreen: (screenId: number) => void;
  studentName?: string;
  onResetDemo: () => void;
  onLoadPitchScenario: () => void;
}

export const SCREENS_META = [
  { id: 1, title: '1. Registro', stitchId: 'd6f04a15bb124422afdf59ea03e68f8b', tag: 'Registro Inicial' },
  { id: 2, title: '2. Pizarra', stitchId: 'cf0147a592034e049c2ff56aaff8873c', tag: 'Pizarra de Trabajo' },
  { id: 3, title: '3. Diagnóstico', stitchId: '597cc88da3ca4d0d98adfcb5a9e6c28a', tag: 'Dónde se Rompió' },
  { id: 4, title: '4. Mi Ruta', stitchId: '3c22f79a510841adac38188a693ae796', tag: 'Ruta Personalizada' },
  { id: 5, title: '5. Refuerzo', stitchId: 'ce1717e9a0524e4882cf78627698614c', tag: 'Feedback Visual' },
  { id: 6, title: '6. Mi Progreso', stitchId: '5dab68cc9b274d0faae85e00de28dda7', tag: 'Camila Morales' },
  { id: 7, title: '7. Docente y Familia', stitchId: '062134e26e594017af0b3fc58ea67cfa', tag: 'Vista Acompañante' },
  { id: 8, title: '8. Base Reparada', stitchId: '65ae8aa19d17468396ed9d4445a477f7', tag: 'Éxito de Aprendizaje' }
];

export const Navbar: React.FC<NavbarProps> = ({
  currentScreenId,
  onSelectScreen,
  studentName,
  onResetDemo,
  onLoadPitchScenario
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectScreen(1)}>
            <Icons.BalamLogo className="w-9 h-9" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">BALAM</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  EdTech Guatemala
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Diagnóstico Pedagógico del Proceso</p>
            </div>
          </div>

          {/* Quick Demo Controls */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={onLoadPitchScenario}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition"
              title="Cargar escenario listo para pitch de 4 minutos"
            >
              <Icons.Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Cargar Pitch (Camila)</span>
            </button>

            <button
              onClick={onResetDemo}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition"
              title="Limpiar datos y reiniciar demo"
            >
              <Icons.RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Demo</span>
            </button>

            {studentName && (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-700">
                <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-xs font-bold text-indigo-300">
                  {studentName.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-200 leading-none">{studentName}</p>
                  <p className="text-[10px] text-emerald-400 font-medium leading-tight">14 años · 3ero Básico</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 8 Stitch Screens Tabs Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2 no-scrollbar border-t border-slate-800/60 text-xs">
          {SCREENS_META.map((screen) => {
            const isActive = currentScreenId === screen.id;
            return (
              <button
                key={screen.id}
                onClick={() => onSelectScreen(screen.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-md font-medium transition flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{screen.title}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
