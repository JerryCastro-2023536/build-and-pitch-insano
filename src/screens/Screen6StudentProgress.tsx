import React from 'react';
import { StudentProfile, AdultSummary } from '../domain/types';
import { Icons } from '../components/common/Icons';

export interface Screen6StudentProgressProps {
  profile: StudentProfile | null;
  summary: AdultSummary | null;
  onGoToTeacherView: () => void;
  onGoToWhiteboard: () => void;
}

export const Screen6StudentProgress: React.FC<Screen6StudentProgressProps> = ({
  profile,
  summary,
  onGoToTeacherView,
  onGoToWhiteboard
}) => {
  const studentName = profile?.name || 'Camila Morales';
  const mastery = summary?.conceptMastery || [
    {
      conceptId: 'jerarquia_operaciones',
      conceptName: 'Jerarquía de Operaciones (PEMDAS)',
      masteryPercentage: 94,
      status: 'mastered',
      trend: 'up'
    },
    {
      conceptId: 'potencias',
      conceptName: 'Potencias y Exponentes',
      masteryPercentage: 88,
      status: 'mastered',
      trend: 'up'
    },
    {
      conceptId: 'ecuacion_cuadratica',
      conceptName: 'Ecuación Cuadrática',
      masteryPercentage: 85,
      status: 'mastered',
      trend: 'up'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Screen Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Pantalla 6 / 8 · Stitch ID: 5dab68cc
          </span>
          <span className="text-xs text-slate-400">Mi Progreso · {studentName}</span>
        </div>

        <button
          onClick={onGoToTeacherView}
          className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
        >
          <span>Ir a Vista Docente y Familia</span>
          <Icons.ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Student Profile Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-600/30">
              {studentName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{studentName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Base Reparada
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                14 años · 3ero Básico · Instituto Nacional Experimental · Guatemala
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-3">
            <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Bases Reparadas</span>
              <span className="text-lg font-black text-emerald-400">1 / 1</span>
            </div>
            <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Tiempo Remediación</span>
              <span className="text-lg font-black text-indigo-400">2m 45s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Mastery by Concept & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Mastery Bars */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
              <Icons.BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Evolución por Concepto (Temas del MVP)</span>
            </h2>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center space-x-1">
              <Icons.TrendingUp className="w-3.5 h-3.5" />
              <span>+52% tras remediación</span>
            </span>
          </div>

          <div className="space-y-4">
            {mastery.map((m) => (
              <div key={m.conceptId} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-sm text-white">{m.conceptName}</h3>
                    {m.prerequisiteOf && (
                      <span className="text-[10px] text-slate-500">
                        Prerrequisito de: {m.prerequisiteOf}
                      </span>
                    )}
                  </div>
                  <span className="text-base font-black text-indigo-300">
                    {m.masteryPercentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      m.masteryPercentage >= 80
                        ? 'bg-emerald-500'
                        : m.masteryPercentage >= 50
                          ? 'bg-indigo-500'
                          : 'bg-rose-500'
                    }`}
                    style={{ width: `${m.masteryPercentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Differentiator callout */}
          <div className="bg-indigo-950/30 border border-indigo-900/60 p-3 rounded-xl text-xs text-indigo-300">
            ✨ <span className="font-bold">Evolución real demostrada:</span> Al reparar la base de Jerarquía de Operaciones (de 42% a 94%), Camila ahora puede resolver ecuaciones cuadráticas sin tropezar en el paso 3.
          </div>
        </div>

        {/* Right: Learning Timeline */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
            <Icons.Clock className="w-4 h-4 text-indigo-400" />
            <span>Línea de Tiempo del Razonamiento</span>
          </h2>

          <div className="relative pl-6 space-y-4 border-l border-slate-800">
            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Ahora Mismo</span>
              <h4 className="text-xs font-bold text-white">Base Reparada con Éxito</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                3/3 micro-ejercicios resueltos correctamente. Dominio consolidado.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-2 border-slate-900" />
              <span className="text-[10px] font-bold text-indigo-400 uppercase">Hace 2 minutos</span>
              <h4 className="text-xs font-bold text-white">Ruta de Práctica Focalizada</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Ejercicios de aislamiento de potencias y prioridad PEMDAS.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-rose-500 border-2 border-slate-900" />
              <span className="text-[10px] font-bold text-rose-400 uppercase">Hace 4 minutos</span>
              <h4 className="text-xs font-bold text-white">Diagnóstico en Whiteboard</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Ruptura detectada en Paso 3 de 2(x+3)²-8=24. Base débil aislada.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onGoToWhiteboard}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
            >
              Volver a Practicar en Whiteboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
