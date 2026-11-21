import React from 'react';
import { Icons } from '../common/Icons';

export interface ErrorStepMarkerProps {
  stepNumber: number;
  expression: string;
  ruleBroken: string;
  explanation: string;
}

export const ErrorStepMarker: React.FC<ErrorStepMarkerProps> = ({
  stepNumber,
  expression,
  ruleBroken,
  explanation
}) => {
  return (
    <div className="relative bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 border-2 border-rose-500 rounded-xl p-4 shadow-xl shadow-rose-950/40">
      {/* Indicator tag */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
            {stepNumber}
          </span>
          <span className="font-extrabold text-sm text-rose-300">
            Paso {stepNumber}: Aquí se rompió el razonamiento
          </span>
        </div>
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
          <Icons.AlertTriangle className="w-3 h-3 text-rose-400" />
          <span>Fallo Identificado</span>
        </span>
      </div>

      {/* Target Expression with error styling */}
      <div className="bg-slate-950 p-2.5 rounded-lg border border-rose-900/60 font-mono text-sm text-rose-200 mb-3 flex items-center justify-between">
        <span className="line-through decoration-rose-500 decoration-2 font-bold">{expression}</span>
        <span className="text-[11px] text-rose-400 font-sans font-bold">Transformación no válida</span>
      </div>

      {/* Rationale and Broken rule */}
      <div className="space-y-1.5 text-xs text-slate-300">
        <p className="font-medium leading-relaxed">
          {explanation}
        </p>
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-800 text-[11px] font-semibold text-rose-400">
          <Icons.ShieldCheck className="w-4 h-4 text-rose-500" />
          <span>Regla violada: {ruleBroken}</span>
        </div>
      </div>
    </div>
  );
};
