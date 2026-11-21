import React from 'react';
import { MathStep } from '../../domain/types';
import { Icons } from '../common/Icons';

export interface StepByStepEditorProps {
  steps: MathStep[];
  onStepsChange: (steps: MathStep[]) => void;
  onSimulateError: () => void;
  onSimulateCorrect: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  highlightErrorIndex?: number | null;
}

export const StepByStepEditor: React.FC<StepByStepEditorProps> = ({
  steps,
  onStepsChange,
  onSimulateError,
  onSimulateCorrect,
  onAnalyze,
  isAnalyzing,
  highlightErrorIndex
}) => {
  const handleUpdateExpression = (index: number, expression: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], expression };
    onStepsChange(updated);
  };

  const handleUpdateAnnotation = (index: number, annotation: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], annotation };
    onStepsChange(updated);
  };

  const handleAddStep = () => {
    const newStep: MathStep = {
      id: `step-${Date.now()}`,
      stepNumber: steps.length + 1,
      expression: '',
      annotation: ''
    };
    onStepsChange([...steps, newStep]);
  };

  const handleRemoveStep = (index: number) => {
    const updated = steps.filter((_, i) => i !== index).map((s, i) => ({
      ...s,
      stepNumber: i + 1
    }));
    onStepsChange(updated);
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-xl flex flex-col justify-between h-full">
      <div>
        {/* Header with Pitch Fast Buttons */}
        <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center space-x-1.5">
              <span>Desglose Paso a Paso del Estudiante</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Registra cada transformación matemática para el análisis del proceso.
            </p>
          </div>

          {/* Live pitch quick simulation buttons */}
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={onSimulateError}
              className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-semibold transition"
              title="Cargar error de jerarquía en paso 3 para la demo"
            >
              Simular Error Típico
            </button>
            <button
              type="button"
              onClick={onSimulateCorrect}
              className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold transition"
              title="Cargar procedimiento 100% correcto"
            >
              Cargar Solución Correcta
            </button>
          </div>
        </div>

        {/* Step list */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {steps.map((step, index) => {
            const isHighlighted = highlightErrorIndex === index;
            return (
              <div
                key={step.id || index}
                className={`p-2.5 rounded-lg border transition ${
                  isHighlighted
                    ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-950 ring-1 ring-rose-500/80 animate-pulse'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isHighlighted
                          ? 'bg-rose-600 text-white'
                          : 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                      }`}
                    >
                      {step.stepNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      Paso {step.stepNumber}
                    </span>
                  </div>

                  {isHighlighted && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                      Fallo de Razonamiento
                    </span>
                  )}

                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(index)}
                      className="text-slate-600 hover:text-rose-400 text-xs transition"
                      title="Eliminar paso"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-7">
                    <input
                      type="text"
                      value={step.expression}
                      onChange={(e) => handleUpdateExpression(index, e.target.value)}
                      placeholder="Ej: 2(x + 3)^2 = 32"
                      className="w-full bg-slate-900 border border-slate-800 text-indigo-300 font-mono text-xs rounded px-2.5 py-1.5 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      value={step.annotation}
                      onChange={(e) => handleUpdateAnnotation(index, e.target.value)}
                      placeholder="Justificación / motivo"
                      className="w-full bg-slate-900 border border-slate-800 text-slate-400 text-xs rounded px-2.5 py-1.5 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {isHighlighted && step.errorReason && (
                  <p className="mt-2 text-[11px] font-medium text-rose-300 bg-rose-950/60 p-1.5 rounded border border-rose-900/60">
                    ⚠️ {step.errorReason}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Step button */}
        <button
          type="button"
          onClick={handleAddStep}
          className="mt-3 w-full py-1.5 rounded-lg border border-dashed border-slate-700 hover:border-indigo-500/60 hover:bg-indigo-500/5 text-slate-400 hover:text-indigo-300 text-xs font-medium transition flex items-center justify-center space-x-1"
        >
          <span>+ Agregar Siguiente Paso</span>
        </button>
      </div>

      {/* Main Analysis Action Button */}
      <div className="pt-4 mt-3 border-t border-slate-800">
        <button
          type="button"
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <Icons.RotateCcw className="w-4 h-4 animate-spin text-white" />
              <span>Analizando Proceso Matemático...</span>
            </>
          ) : (
            <>
              <Icons.Sparkles className="w-4 h-4 text-amber-300" />
              <span>Analizar Dónde se Rompió el Razonamiento</span>
              <Icons.ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
