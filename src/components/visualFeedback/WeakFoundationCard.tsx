import React from 'react';
import { FoundationGuideSnippet, WeakFoundationType } from '../../domain/types';
import { Icons } from '../common/Icons';

export interface WeakFoundationCardProps {
  weakFoundation: WeakFoundationType;
  guide: FoundationGuideSnippet;
  onGoToRemediation?: () => void;
}

export const WeakFoundationCard: React.FC<WeakFoundationCardProps> = ({
  weakFoundation,
  guide,
  onGoToRemediation
}) => {
  const getBadgeTitle = () => {
    switch (weakFoundation) {
      case 'jerarquia_operaciones':
        return 'Base Débil: Jerarquía de Operaciones (PEMDAS)';
      case 'potencias':
        return 'Base Débil: Potencias y Signos';
      case 'ecuacion_cuadratica':
        return 'Base Débil: Estructura Cuadrática';
      default:
        return 'Concepto Prerrequisito';
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-amber-500/40 p-5 shadow-xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Icons.Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Diagnóstico de Causa Raíz
              </span>
              <h4 className="font-extrabold text-base text-white">{getBadgeTitle()}</h4>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Prerrequisito de 1ro Básico
          </span>
        </div>

        {/* Diagnostic explanation */}
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {guide.explanation}
        </p>

        {/* Visual Comparison: Error vs Correct Rule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-xs font-mono">
          {/* Incorrect */}
          <div className="bg-rose-950/40 border border-rose-800/60 p-3 rounded-lg">
            <div className="flex items-center space-x-1.5 text-rose-400 font-bold mb-1 font-sans">
              <Icons.XCircle className="w-4 h-4 text-rose-500" />
              <span>Lo que hiciste:</span>
            </div>
            <p className="text-rose-200">{guide.exampleIncorrect}</p>
          </div>

          {/* Correct */}
          <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-lg">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold mb-1 font-sans">
              <Icons.CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>La regla correcta:</span>
            </div>
            <p className="text-emerald-200">{guide.exampleCorrect}</p>
          </div>
        </div>

        {/* Golden Rule Callout */}
        <div className="bg-slate-950 p-3 rounded-lg border border-indigo-500/30 mb-4 flex items-start space-x-2.5">
          <Icons.Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-indigo-300">Regla de Oro Balam: </span>
            <span className="text-slate-300">{guide.goldenRule}</span>
          </div>
        </div>

        {/* CTA to Remediation */}
        {onGoToRemediation && (
          <button
            type="button"
            onClick={onGoToRemediation}
            className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition flex items-center justify-center space-x-2"
          >
            <span>Iniciar Ruta de Práctica Focalizada (3 micro-ejercicios)</span>
            <Icons.ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
