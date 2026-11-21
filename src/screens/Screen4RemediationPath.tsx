import React from 'react';
import { DiagnosticResult, StudentProfile, RemediationExercise } from '../domain/types';
import { Icons } from '../components/common/Icons';

export interface Screen4RemediationPathProps {
  diagnostic: DiagnosticResult;
  profile: StudentProfile | null;
  onStartExercise: (exerciseIndex: number) => void;
  onGoToProgress: () => void;
}

export const Screen4RemediationPath: React.FC<Screen4RemediationPathProps> = ({
  diagnostic,
  profile,
  onStartExercise,
  onGoToProgress
}) => {
  const exercises = diagnostic.remediationExercises || [];
  const completedCount = exercises.filter((e) => e.completed).length;
  const progressPercent = exercises.length > 0 ? Math.round((completedCount / exercises.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Screen Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Pantalla 4 / 8 · Stitch ID: 3c22f79a
          </span>
          <span className="text-xs text-slate-400">Paso 4 del Flujo Demo · Mi Ruta de Práctica Personalizada</span>
        </div>

        <button
          onClick={onGoToProgress}
          className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
        >
          <span>Ver Métricas de Progreso</span>
          <Icons.ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Roadmap Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Roadmap Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                Ruta Focalizada Exclusiva
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Reparando: Jerarquía de Operaciones
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              No tienes que repetir 50 problemas de ecuaciones cuadráticas. Esta ruta ataca únicamente los 3 vacíos que rompieron tu razonamiento.
            </p>
          </div>

          {/* Progress Indicator Widget */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center min-w-[140px]">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Progreso Base</span>
            <span className="text-2xl font-black text-indigo-400">{progressPercent}%</span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {completedCount} de {exercises.length} completados
            </span>
          </div>
        </div>

        {/* Pedagogical Step Path */}
        <div className="space-y-4 mb-8">
          {exercises.map((ex, index) => {
            const isCompleted = ex.completed;
            const isCurrent = !isCompleted && (index === 0 || exercises[index - 1]?.completed);

            return (
              <div
                key={ex.id}
                onClick={() => onStartExercise(index)}
                className={`p-5 rounded-xl border transition cursor-pointer relative ${
                  isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/60'
                    : isCurrent
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-950 ring-2 ring-indigo-500/30'
                      : 'bg-slate-950/50 border-slate-800 opacity-60 hover:opacity-90'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-start space-x-3.5">
                    {/* Step Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950'
                          : isCurrent
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40'
                            : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isCompleted ? <Icons.Check className="w-5 h-5" /> : index + 1}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-bold text-slate-400 uppercase">
                          Micro-Ejercicio {index + 1} · {ex.difficulty}
                        </span>
                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Superado
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-base text-white">{ex.title}</h3>
                      <p className="text-xs text-slate-300 mt-1">{ex.statement}</p>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="shrink-0">
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-lg font-bold text-xs transition flex items-center space-x-1.5 ${
                        isCompleted
                          ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300'
                          : isCurrent
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                            : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <span>{isCompleted ? 'Repasar' : 'Resolver'}</span>
                      <Icons.ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Start Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onStartExercise(0)}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition flex items-center justify-center space-x-2"
          >
            <Icons.Play className="w-4 h-4" />
            <span>Comenzar Micro-Ejercicio 1: Prioridad de Potencias</span>
          </button>
        </div>
      </div>
    </div>
  );
};
