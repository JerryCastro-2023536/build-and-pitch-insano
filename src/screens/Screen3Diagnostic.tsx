import React from 'react';
import { DiagnosticResult, WhiteboardSession, StudentProfile } from '../domain/types';
import { ErrorStepMarker } from '../components/visualFeedback/ErrorStepMarker';
import { WeakFoundationCard } from '../components/visualFeedback/WeakFoundationCard';
import { DrawingCanvas } from '../components/whiteboard/DrawingCanvas';
import { Icons } from '../components/common/Icons';

export interface Screen3DiagnosticProps {
  diagnostic: DiagnosticResult;
  session: WhiteboardSession | null;
  profile: StudentProfile | null;
  onGoToRemediation: () => void;
  onGoBackToWhiteboard: () => void;
}

export const Screen3Diagnostic: React.FC<Screen3DiagnosticProps> = ({
  diagnostic,
  session,
  profile,
  onGoToRemediation,
  onGoBackToWhiteboard
}) => {
  const errorStepIndex = diagnostic.errorStepIndex ?? 2;
  const errorStep = session?.steps[errorStepIndex] || {
    stepNumber: 3,
    expression: '(2x + 6)^2 = 32',
    annotation: 'Distribuir el 2 dentro del paréntesis (Error)'
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Screen Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Pantalla 3 / 8 · Stitch ID: 597cc88da3ca4d0d98adfcb5a9e6c28a
          </span>
          <span className="text-xs text-slate-400">Paso 3 del Flujo Demo · Dónde se Rompió el Razonamiento</span>
        </div>

        <button
          onClick={onGoBackToWhiteboard}
          className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
        >
          <Icons.ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Whiteboard</span>
        </button>
      </div>

      {/* Diagnostic Hero Banner */}
      <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 border border-rose-500/40 rounded-2xl p-6 mb-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-600/30 border border-rose-500/60 flex items-center justify-center text-rose-300 shrink-0">
              <Icons.AlertTriangle className="w-7 h-7 text-rose-400 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                Diagnóstico del Proceso en Vivo
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {diagnostic.visualFeedback.calloutTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {diagnostic.visualFeedback.calloutDescription}
              </p>
            </div>
          </div>

          {/* Quick CTA */}
          <button
            onClick={onGoToRemediation}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2 shrink-0"
          >
            <span>Ver Mi Ruta de Práctica Personalizada</span>
            <Icons.ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid: Canvas with Visual Error Box & Root Cause Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Student Whiteboard with Visual Red Highlight */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <Icons.PenTool className="w-3.5 h-3.5 text-rose-400" />
            <span>Lienzo del Alumno con Marcado Visual Directo</span>
          </h3>

          <DrawingCanvas
            initialStrokes={session?.strokes || []}
            readOnly={true}
            errorHighlight={{
              x: 25,
              y: 90,
              width: 320,
              height: 70,
              title: 'Ruptura: Paso 3'
            }}
          />

          {/* Step Sequence on Whiteboard */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1.5 text-xs font-mono">
            <p className="text-slate-400 text-[11px] font-sans font-bold">Secuencia de pasos ingresada:</p>
            {session?.steps.map((st, idx) => (
              <div
                key={st.id || idx}
                className={`p-1.5 rounded flex items-center justify-between ${
                  idx === errorStepIndex
                    ? 'bg-rose-950/60 border border-rose-500/80 text-rose-300 font-bold'
                    : 'text-slate-400'
                }`}
              >
                <span>Paso {st.stepNumber}: {st.expression}</span>
                {idx === errorStepIndex && (
                  <span className="text-[10px] text-rose-400 font-sans font-bold">← AQUÍ FALLÓ</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detailed Pedagogical Breakdown & Weak Foundation Card */}
        <div className="lg:col-span-7 space-y-4">
          {/* Error Step Marker */}
          <ErrorStepMarker
            stepNumber={errorStep.stepNumber}
            expression={errorStep.expression}
            ruleBroken={diagnostic.visualFeedback.ruleBroken}
            explanation={diagnostic.visualFeedback.calloutDescription}
          />

          {/* Weak Foundation Card */}
          <WeakFoundationCard
            weakFoundation={diagnostic.weakFoundation}
            guide={diagnostic.visualFeedback.foundationGuide}
            onGoToRemediation={onGoToRemediation}
          />
        </div>
      </div>
    </div>
  );
};
