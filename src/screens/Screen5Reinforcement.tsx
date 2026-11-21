import React, { useState } from 'react';
import { RemediationExercise, DiagnosticResult } from '../domain/types';
import { Icons } from '../components/common/Icons';

export interface Screen5ReinforcementProps {
  diagnostic: DiagnosticResult;
  currentExerciseIndex: number;
  onCompleteExercise: (exerciseIndex: number) => void;
  onGoToNextExercise: () => void;
  onGoToSuccessScreen: () => void;
}

export const Screen5Reinforcement: React.FC<Screen5ReinforcementProps> = ({
  diagnostic,
  currentExerciseIndex,
  onCompleteExercise,
  onGoToNextExercise,
  onGoToSuccessScreen
}) => {
  const exercises = diagnostic.remediationExercises || [];
  const exercise = exercises[currentExerciseIndex] || exercises[0];

  const [selectedOption, setSelectedOption] = useState<number | null>(
    exercise?.studentSelectedOption ?? null
  );
  const [hasChecked, setHasChecked] = useState<boolean>(exercise?.completed ?? false);

  if (!exercise) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center text-slate-400">
        No hay ejercicios de remediación pendientes.
      </div>
    );
  }

  const handleSelect = (idx: number) => {
    if (hasChecked) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setHasChecked(true);
    const chosen = exercise.stepOptions[selectedOption];
    if (chosen.isCorrect) {
      onCompleteExercise(currentExerciseIndex);
    }
  };

  const isCurrentCorrect = selectedOption !== null && exercise.stepOptions[selectedOption]?.isCorrect;
  const isLastExercise = currentExerciseIndex === exercises.length - 1;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Screen Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Pantalla 5 / 8 · Stitch ID: ce1717e9
          </span>
          <span className="text-xs text-slate-400">
            Paso 4 del Flujo Demo · Ejercicio {currentExerciseIndex + 1} de {exercises.length}
          </span>
        </div>

        {/* Exercises Tracker Pills */}
        <div className="flex items-center space-x-1.5">
          {exercises.map((ex, i) => (
            <span
              key={ex.id}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                i === currentExerciseIndex
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                  : ex.completed
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-500'
              }`}
            >
              {i + 1}
            </span>
          ))}
        </div>
      </div>

      {/* Main Exercise Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Refuerzo de Base Débil: Jerarquía de Operaciones
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400 font-semibold">{exercise.difficulty}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">{exercise.title}</h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">{exercise.statement}</p>
        </div>

        {/* Formula Box with Visual Spotlight */}
        <div className="bg-slate-950 p-6 rounded-xl border border-indigo-500/40 mb-6 text-center shadow-inner relative">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Expresión Matemática
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-black text-indigo-300 tracking-wider">
            {exercise.formula}
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-3 mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Elige la justificación u operación matemáticamente rigurosa:
          </p>

          {exercise.stepOptions.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            let optionStyle = 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200';

            if (hasChecked) {
              if (opt.isCorrect) {
                optionStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
              } else if (isSelected && !opt.isCorrect) {
                optionStyle = 'bg-rose-950/40 border-rose-500 text-rose-200 ring-1 ring-rose-500';
              }
            } else if (isSelected) {
              optionStyle = 'bg-indigo-950/50 border-indigo-500 text-white ring-2 ring-indigo-500/50';
            }

            return (
              <div
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`p-4 rounded-xl border transition cursor-pointer ${optionStyle}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">{opt.label}</p>
                  {hasChecked && opt.isCorrect && (
                    <Icons.CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {hasChecked && isSelected && !opt.isCorrect && (
                    <Icons.XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                </div>

                {/* Instant Feedback Callout when checked */}
                {hasChecked && isSelected && (
                  <div
                    className={`mt-3 p-3 rounded-lg text-xs leading-relaxed ${
                      opt.isCorrect
                        ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                        : 'bg-rose-950/60 border border-rose-800 text-rose-300'
                    }`}
                  >
                    <span className="font-bold">{opt.isCorrect ? '✅ ¡Correcto! ' : '❌ Atención: '}</span>
                    {opt.feedback}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          {!hasChecked ? (
            <button
              type="button"
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2"
            >
              <span>Verificar Razonamiento</span>
              <Icons.Check className="w-4 h-4" />
            </button>
          ) : isCurrentCorrect ? (
            <div className="w-full flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                <Icons.CheckCircle2 className="w-4 h-4" />
                <span>¡Excelente! Paso asimilado con éxito.</span>
              </span>

              {isLastExercise ? (
                <button
                  type="button"
                  onClick={onGoToSuccessScreen}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center space-x-2"
                >
                  <Icons.Award className="w-4 h-4 text-amber-300" />
                  <span>Ver Base Reparada con Éxito</span>
                  <Icons.ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onGoToNextExercise}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
                >
                  <span>Siguiente Micro-Ejercicio</span>
                  <Icons.ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              <span className="text-xs text-rose-400 font-semibold">
                Revisa el feedback arriba e inténtalo de nuevo.
              </span>
              <button
                type="button"
                onClick={() => {
                  setHasChecked(false);
                  setSelectedOption(null);
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
