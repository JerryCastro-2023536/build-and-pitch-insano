import React from 'react';
import { AdultSummary, StudentProfile } from '../domain/types';
import { Icons } from '../components/common/Icons';

export interface Screen7TeacherParentViewProps {
  summary: AdultSummary | null;
  profile: StudentProfile | null;
  onGoToWhiteboard: () => void;
}

export const Screen7TeacherParentView: React.FC<Screen7TeacherParentViewProps> = ({
  summary,
  profile,
  onGoToWhiteboard
}) => {
  const studentName = profile?.name || summary?.studentName || 'Camila Morales';

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Screen Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Pantalla 7 / 8 · Stitch ID: 062134e2
          </span>
          <span className="text-xs text-slate-400">Paso 5 del Flujo Demo · Portal Docente y Familia</span>
        </div>

        <button
          onClick={() => window.print()}
          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
        >
          <span>Exportar Ficha de Acompañamiento</span>
        </button>
      </div>

      {/* Main Companion Portal Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header Banner */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Acompañamiento Escolar y en Casa
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Informe de Razonamiento: {studentName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Diseñado para que docentes con 40 alumnos y familias sin formación matemática sepan exactamente qué apoyar.
            </p>
          </div>

          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Estado Actual</span>
            <span className="text-sm font-extrabold text-emerald-400">
              {summary?.evolutionStatus || 'Base Reparada'}
            </span>
          </div>
        </div>

        {/* 3 Pillars Summary Cards: Qué falló, Qué practicó, Cómo evoluciona */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. En qué falló */}
          <div className="bg-slate-950 p-5 rounded-xl border border-rose-900/40">
            <div className="flex items-center space-x-2 text-rose-400 mb-2">
              <Icons.AlertTriangle className="w-4 h-4" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider">1. En qué falló</h3>
            </div>
            <h4 className="font-bold text-sm text-white mb-1.5">
              Multiplicación antes de Potencia
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              En la ecuación 2(x+3)²=32, intentó multiplicar 2·(x+3) antes de resolver la potencia al cuadrado. Fallo típico de jerarquía de operaciones.
            </p>
          </div>

          {/* 2. Qué practicó */}
          <div className="bg-slate-950 p-5 rounded-xl border border-indigo-900/40">
            <div className="flex items-center space-x-2 text-indigo-400 mb-2">
              <Icons.Target className="w-4 h-4" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider">2. Qué practicó</h3>
            </div>
            <h4 className="font-bold text-sm text-white mb-1.5">
              3 Micro-Ejercicios Focalizados
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              En lugar de 50 planas, resolvió únicamente 3 ejercicios clave de aislamiento de potencias y orden PEMDAS en menos de 3 minutos.
            </p>
          </div>

          {/* 3. Cómo evoluciona */}
          <div className="bg-slate-950 p-5 rounded-xl border border-emerald-900/40">
            <div className="flex items-center space-x-2 text-emerald-400 mb-2">
              <Icons.TrendingUp className="w-4 h-4" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider">3. Cómo evoluciona</h3>
            </div>
            <h4 className="font-bold text-sm text-white mb-1.5">
              Dominio Subió de 42% a 94%
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Superó la verificación sin volver a violar la regla de jerarquía. La base quedó reparada para seguir avanzando en el programa escolar.
            </p>
          </div>
        </div>

        {/* Actionable Recommendations for Teacher & Parents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Teacher Section */}
          <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-xl p-5">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2">
              <Icons.School className="w-4 h-4" />
              <span>Para el Docente en el Aula</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {summary?.teacherAlert || 'Camila ya no requiere nivelación adicional en jerarquía de operaciones. Puede proceder con el método de fórmula cuadrática completa.'}
            </p>
            <div className="text-[11px] font-mono text-indigo-400 bg-slate-950/60 p-2.5 rounded-lg border border-indigo-950">
              Sugerencia de clase: Proponerle un reto de ecuaciones cuadráticas con fracciones para consolidar su autonomía.
            </div>
          </div>

          {/* Parent Section */}
          <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-5">
            <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs uppercase tracking-wider mb-2">
              <Icons.ShieldCheck className="w-4 h-4" />
              <span>Para la Familia en Casa</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Felicita a {studentName} por su esfuerzo: detectó exactamente el punto donde se confundía y lo superó.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Pregúntale hoy: "¿Qué aprendiste sobre la regla de las potencias?". Dejar que lo verbalice fija el conocimiento.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Alignment with Guatemala PISA 2025 Note */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start space-x-3">
          <Icons.Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-slate-200">Impacto Institucional (PISA 2025): </span>
            En Guatemala, los estudiantes que caen por debajo del nivel 2 en PISA arrastran un promedio de 3 vacíos conceptuales no diagnosticados. Balam actúa como el sistema de alerta y remediación temprana que cierra estas brechas antes de las evaluaciones estandarizadas.
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2 text-center">
          <button
            onClick={onGoToWhiteboard}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition inline-flex items-center space-x-2"
          >
            <span>Continuar con Nueva Sesión en Whiteboard</span>
            <Icons.ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
