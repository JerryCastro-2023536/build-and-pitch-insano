import React from 'react';
import { MathStep } from '../../domain/types';

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
  const handleUpdateExpression = (index: number, rawExpression: string) => {
    const expression = rawExpression
      .replace(/\\times/g, '×')
      .replace(/\\div/g, '÷');
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
    <div className="bg-white rounded-2xl border-2 border-[#201b0d] p-4 shadow-[4px_4px_0px_#201b0d] flex flex-col justify-between h-full">
      <div>
        {/* Header with Pitch Fast Buttons */}
        <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-[#ece2ca] gap-2">
          <div>
            <h3 className="font-headline font-bold text-[#201b0d] text-base flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-[#1e1548]">format_list_numbered</span>
              <span>Desglose Paso a Paso</span>
            </h3>
            <p className="font-sans text-xs text-[#524534]">
              Registra cada transformación matemática para aislar vacíos conceptuales.
            </p>
          </div>

          {/* Quick simulation buttons for Pitch */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onSimulateError}
              className="px-2.5 py-1.5 rounded-lg bg-[#ffd9df] hover:bg-[#ffb1c2] text-[#910040] border border-[#b90c55]/40 font-mono text-[10px] font-bold transition-all shadow-xs active:scale-95 flex items-center gap-1.5 cursor-pointer"
              title="Simular error típico en paso 3"
            >
              <span className="material-symbols-outlined text-xs">bug_report</span>
              <span>Simular Error (Paso 3)</span>
            </button>
            <button
              type="button"
              onClick={onSimulateCorrect}
              className="px-2.5 py-1.5 rounded-lg bg-[#e6f7f5] hover:bg-[#bbf0ea] text-[#0D9488] border border-[#0D9488]/40 font-mono text-[10px] font-bold transition-all shadow-xs active:scale-95 flex items-center gap-1.5 cursor-pointer"
              title="Cargar procedimiento 100% correcto"
            >
              <span className="material-symbols-outlined text-xs">check_circle</span>
              <span>Cargar Solución Correcta</span>
            </button>
          </div>
        </div>

        {/* Step list */}
        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          {steps.map((step, index) => {
            const isHighlighted = highlightErrorIndex === index;
            return (
              <div
                key={step.id || index}
                className={`p-2.5 rounded-xl border-2 transition-all ${isHighlighted
                    ? 'bg-[#ffdad6]/50 border-[#ba1a1a] shadow-[2px_2px_0px_#ba1a1a]'
                    : 'bg-[#fef3db] border-[#d7c3ae] hover:border-[#201b0d]'
                  }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${isHighlighted
                          ? 'bg-[#ba1a1a] text-white'
                          : 'bg-[#1e1548] text-white'
                        }`}
                    >
                      {step.stepNumber}
                    </span>
                    <span className="font-sans font-bold text-xs text-[#201b0d]">
                      Paso {step.stepNumber}
                    </span>
                  </div>

                  {isHighlighted && (
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#93000a] bg-[#ffdad6] px-2 py-0.5 rounded border border-[#ba1a1a]/40">
                      Fallo de Razonamiento
                    </span>
                  )}

                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(index)}
                      className="text-[#857462] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/50 rounded-md p-1 transition-colors flex items-center justify-center cursor-pointer"
                      title="Eliminar paso"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
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
                      className="w-full bg-white border border-[#d7c3ae] text-[#201b0d] font-mono text-xs rounded-lg px-2.5 py-1.5 focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623] outline-none"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      value={step.annotation}
                      onChange={(e) => handleUpdateAnnotation(index, e.target.value)}
                      placeholder="Motivo / Justificación"
                      className="w-full bg-white border border-[#d7c3ae] text-[#524534] font-sans text-xs rounded-lg px-2.5 py-1.5 focus:border-[#f5a623] outline-none"
                    />
                  </div>
                </div>

                {isHighlighted && step.errorReason && (
                  <p className="mt-2 font-sans text-xs font-medium text-[#93000a] bg-white p-2 rounded-lg border border-[#ba1a1a]/30 flex items-start gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#ba1a1a] shrink-0 mt-0.5">warning</span>
                    <span>{step.errorReason}</span>
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
          className="mt-3 w-full py-2 rounded-xl border-2 border-dashed border-[#d7c3ae] hover:border-[#201b0d] hover:bg-[#fef3db] text-[#524534] font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Agregar Siguiente Paso</span>
        </button>
      </div>

      {/* Main Analysis Action Button */}
      <div className="pt-4 mt-3 border-t border-[#ece2ca]">
        <button
          type="button"
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="w-full min-h-[48px] py-3 rounded-xl bg-[#f5a623] text-[#201b0d] font-mono font-bold text-xs uppercase tracking-wider shadow-[4px_4px_0px_#201b0d] border-2 border-[#201b0d] hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#201b0d] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
              <span>Analizando Razonamiento Matemático...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">task_alt</span>
              <span>Verificar mi desarrollo</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
