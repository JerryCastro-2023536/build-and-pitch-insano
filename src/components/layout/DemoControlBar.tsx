import React, { useState, useEffect } from 'react';
import { ScreenId } from '../../domain/flowStateMachine';

export interface DemoControlBarProps {
  currentStep: ScreenId;
  onGoToStep: (step: ScreenId) => void;
  onResetDemo: () => void;
}

export const DemoControlBar: React.FC<DemoControlBarProps> = ({
  currentStep,
  onGoToStep,
  onResetDemo
}) => {
  // 4-minute pitch countdown stopwatch
  const [secondsRemaining, setSecondsRemaining] = useState<number>(240); // 4 minutes
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsRemaining]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  // 5 Canonical Pitch Steps
  const PITCH_STEPS: { num: number; screenId: ScreenId; label: string }[] = [
    { num: 1, screenId: 1, label: '1. Registro' },
    { num: 2, screenId: 3, label: '2. Pizarra' },
    { num: 3, screenId: 4, label: '3. Diagnóstico' },
    { num: 4, screenId: 5, label: '4. Remediación' },
    { num: 5, screenId: 9, label: '5. Base Reparada' }
  ];

  return (
    <aside 
      aria-label="Barra de control de pitch para jueces"
      className="bg-[#1e1548] text-white border-b border-[#201b0d] px-3 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs font-sans shadow-md"
    >
      {/* 5-step pitch indicator */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="font-mono text-[11px] font-bold text-[#f5a623] hidden md:inline mr-1">
          Flujo Demo Pitch (&lt;4 min):
        </span>
        {PITCH_STEPS.map((s) => {
          const isActive = currentStep === s.screenId;
          return (
            <button
              key={s.num}
              onClick={() => onGoToStep(s.screenId)}
              className={`px-2.5 py-1 rounded font-mono text-[10px] font-bold transition-all flex items-center gap-1 shadow-xs ${
                isActive
                  ? 'bg-[#f5a623] text-[#291800] shadow-[2px_2px_0px_#ffffff]'
                  : 'bg-[#2a1b5e] text-[#ece2ca] hover:text-white border border-[#3a2a7a]'
              }`}
            >
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Timer & Fast Scenario Controls */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        {/* Stopwatch */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2a1b5e] border border-[#3a2a7a] text-white font-mono text-xs">
          <span className={`material-symbols-outlined text-[16px] ${secondsRemaining < 60 ? 'text-[#ff98b0] animate-pulse' : 'text-[#f5a623]'}`}>
            schedule
          </span>
          <span className="font-bold">{formatTimer(secondsRemaining)}</span>
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="text-[10px] text-[#f5a623] hover:underline font-bold ml-1 uppercase"
          >
            {isTimerRunning ? 'Pausar' : 'Iniciar'}
          </button>
          <button
            onClick={() => {
              setSecondsRemaining(240);
              setIsTimerRunning(false);
            }}
            className="text-[10px] text-[#ece2ca]/70 hover:text-white ml-0.5"
            title="Reiniciar a 4 minutos"
          >
            ↻
          </button>
        </div>

        {/* Reset Demo Button */}
        <button
          onClick={onResetDemo}
          className="text-[#ece2ca] hover:text-[#ff98b0] text-xs font-mono font-bold transition-colors"
          title="Resetear demo a estado inicial limpio"
        >
          Reset
        </button>
      </div>
    </aside>
  );
};
