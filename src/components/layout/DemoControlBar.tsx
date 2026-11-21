import React, { useState, useEffect } from 'react';
import { Icons } from '../common/Icons';

export interface DemoControlBarProps {
  currentStep: number;
  onGoToStep: (step: number) => void;
  onResetDemo: () => void;
  onLoadPitchScenario: () => void;
}

export const DemoControlBar: React.FC<DemoControlBarProps> = ({
  currentStep,
  onGoToStep,
  onResetDemo,
  onLoadPitchScenario
}) => {
  // 4-minute pitch stopwatch
  const [secondsRemaining, setSecondsRemaining] = useState<number>(240); // 4 minutes
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const STEPS = [
    { num: 1, screenId: 1, label: '1. Registro Inicial' },
    { num: 2, screenId: 2, label: '2. Whiteboard' },
    { num: 3, screenId: 3, label: '3. Detección Base Débil' },
    { num: 4, screenId: 4, label: '4. Remediación & Reintento' },
    { num: 5, screenId: 7, label: '5. Resumen Docente/Familia' }
  ];

  return (
    <div className="bg-slate-950/90 border-b border-indigo-950/80 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* 5-step pitch indicator */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <span className="font-bold text-slate-400 hidden lg:inline mr-1">
          Flujo Demo Pitch (&lt;4 min):
        </span>
        {STEPS.map((s) => {
          const isActive = currentStep === s.screenId;
          return (
            <button
              key={s.num}
              onClick={() => onGoToStep(s.screenId)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition flex items-center space-x-1 ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/40 ring-1 ring-emerald-400'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Timer & Fast Scenario Controls */}
      <div className="flex items-center space-x-3 ml-auto">
        {/* Stopwatch */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
          <Icons.Clock className={`w-3.5 h-3.5 ${secondsRemaining < 60 ? 'text-rose-400 animate-pulse' : 'text-indigo-400'}`} />
          <span className="font-mono font-bold">{formatTimer(secondsRemaining)}</span>
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold ml-1 uppercase"
          >
            {isTimerRunning ? 'Pausar' : 'Iniciar'}
          </button>
          <button
            onClick={() => {
              setSecondsRemaining(240);
              setIsTimerRunning(false);
            }}
            className="text-[10px] text-slate-500 hover:text-slate-300 ml-0.5"
            title="Reiniciar a 4 minutos"
          >
            ↻
          </button>
        </div>

        {/* 1-Click Pitch Scenario Button */}
        <button
          onClick={onLoadPitchScenario}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1 rounded shadow-sm shadow-indigo-600/30 transition flex items-center space-x-1.5 text-xs"
        >
          <Icons.Sparkles className="w-3.5 h-3.5" />
          <span>Pitch 1-Click</span>
        </button>

        <button
          onClick={onResetDemo}
          className="text-slate-400 hover:text-rose-400 text-xs transition"
          title="Resetear demo"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
