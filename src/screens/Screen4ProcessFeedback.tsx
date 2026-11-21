import React, { useState } from 'react';
import { DiagnosticResult, WhiteboardSession, StudentProfile } from '../domain/types';
import { TextileRibbon } from '../components/common/TextileRibbon';

export interface Screen4ProcessFeedbackProps {
  diagnostic: DiagnosticResult;
  session: WhiteboardSession | null;
  profile: StudentProfile | null;
  onGoToRemediation: () => void;
  onGoBackToWhiteboard: () => void;
  onGoToSupport?: () => void;
}

export const Screen4ProcessFeedback: React.FC<Screen4ProcessFeedbackProps> = ({
  diagnostic,
  session,
  profile,
  onGoToRemediation,
  onGoBackToWhiteboard,
  onGoToSupport
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(1);
  const [activeViewToggle, setActiveViewToggle] = useState<'user' | 'weaver'>('user');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(45);

  const SLOW_STEPS = [
    {
      step: 1,
      title: 'Paso 1: Aislar el término cuadrático',
      formula: '2(x + 3)² = 24 + 8 = 32',
      desc: 'Comenzaste excelente sumando 8 a ambos miembros de la ecuación.',
      badge: 'Término cuadrático'
    },
    {
      step: 2,
      title: 'Paso 2: Neutralizar factor multiplicativo',
      formula: '(x + 3)² = 32 ÷ 2 = 16',
      desc: '¡Aquí está la clave del tejedor! Antes de tocar el paréntesis con potencia, divides ambos lados entre 2.',
      badge: 'Aislar potencia'
    },
    {
      step: 3,
      title: 'Paso 3: Extracción de raíz simétrica (±)',
      formula: 'x + 3 = ±√16 = ±4',
      desc: 'Al extraer raíz cuadrada, se liberan dos caminos simétricos en los números reales: +4 y -4.',
      badge: 'Doble signo'
    },
    {
      step: 4,
      title: 'Paso 4: Soluciones finales',
      formula: 'x₁ = 4 - 3 = 1,   x₂ = -4 - 3 = -7',
      desc: '¡El nudo queda completamente desatado con dos soluciones comprobables en la ecuación original!',
      badge: 'Soluciones reales'
    }
  ];

  const currentSlowStep = SLOW_STEPS[activeStepIndex - 1];

  const handleToggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        'Observa cómo en el paso 3 la potencia al cuadrado protege al binomio. Primero divides entre dos y luego extraes la raíz.'
      );
      utterance.lang = 'es-GT';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 py-4 sm:py-6 flex flex-col gap-4 relative">
      {/* Encabezado de Diagnóstico */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#b90c55] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            psychology
          </span>
          <span className="font-mono text-xs font-bold text-[#524534] uppercase tracking-wider">
            Feedback de Proceso
          </span>
        </div>
        <span className="bg-[#f8edd5] border border-[#d7c3ae] text-[#201b0d] px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold">
          {session?.initialEquation || 'Ecuación evaluada'}
        </span>
      </div>

      {/* Hero Callout Banner */}
      <section className="bg-white rounded-2xl border-2 border-[#201b0d] p-4 shadow-[4px_4px_0px_#201b0d] flex flex-col gap-2 relative overflow-hidden">
        <TextileRibbon height="h-1.5" variant="warning" />
        <div className="flex items-center gap-2 text-[#93000a] pt-1">
          <span className="material-symbols-outlined text-lg">error</span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider">
            {diagnostic.visualFeedback.calloutTitle}
          </span>
        </div>
        <p className="font-sans text-xs sm:text-sm text-[#201b0d] leading-relaxed">
          {diagnostic.visualFeedback.calloutDescription}
        </p>
        <div className="bg-[#ffdad6]/60 border border-[#ba1a1a]/40 p-2 rounded-xl text-xs font-mono font-bold text-[#93000a]">
          ⚠️ {diagnostic.visualFeedback.ruleBroken}
        </div>
      </section>

      {/* Tarjeta Interactiva: Slider de Pasos Cámara Lenta */}
      <section className="bg-white rounded-2xl border-2 border-[#201b0d] p-4 shadow-[4px_4px_0px_#201b0d] flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[#ece2ca] pb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#835500] text-lg">slow_motion_video</span>
            <span className="font-headline font-bold text-sm text-[#201b0d]">Desata el nudo en cámara lenta</span>
          </div>
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-[#1e1548] text-white">
            Paso {activeStepIndex} / 4
          </span>
        </div>

        {/* Range Slider */}
        <div className="flex flex-col gap-1.5">
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={activeStepIndex}
            onChange={(e) => setActiveStepIndex(Number(e.target.value))}
            aria-label="Slider de pasos del proceso matemático"
            className="w-full accent-[#835500] h-2.5 bg-[#f2e7d0] rounded-lg cursor-pointer"
          />
          <div className="flex justify-between font-mono text-[9px] text-[#857462] px-1 font-bold">
            <span>1. Aislar</span>
            <span>2. Dividir</span>
            <span>3. Raíz ±</span>
            <span>4. Soluciones</span>
          </div>
        </div>

        {/* Contenedor del Paso Activo */}
        <div className="bg-[#fff8f0] rounded-xl border border-[#d7c3ae] p-3 flex flex-col gap-1.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-sans font-bold text-xs text-[#201b0d]">{currentSlowStep.title}</span>
            <span className="font-mono text-[9px] uppercase font-bold text-[#835500] bg-white px-2 py-0.5 rounded border border-[#d7c3ae]">
              {currentSlowStep.badge}
            </span>
          </div>
          <div className="py-2 px-3 bg-white rounded-lg font-mono text-sm font-bold text-center text-[#201b0d] border border-[#d7c3ae] shadow-inner">
            {currentSlowStep.formula}
          </div>
          <p className="font-sans text-xs text-[#524534] leading-relaxed">
            {currentSlowStep.desc}
          </p>
        </div>

        {/* Botones Anterior / Siguiente */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            disabled={activeStepIndex === 1}
            onClick={() => setActiveStepIndex((prev) => Math.max(1, prev - 1))}
            className="flex-1 h-9 rounded-xl bg-[#f8edd5] hover:bg-[#f2e7d0] disabled:opacity-40 border border-[#d7c3ae] text-[#201b0d] font-mono text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
            <span>Paso anterior</span>
          </button>
          <button
            type="button"
            disabled={activeStepIndex === 4}
            onClick={() => setActiveStepIndex((prev) => Math.min(4, prev + 1))}
            className="flex-1 h-9 rounded-xl bg-[#1e1548] text-white hover:bg-[#2a1b5e] disabled:opacity-40 font-mono text-xs font-bold flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <span>Paso siguiente</span>
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>
      </section>

      {/* Comparativa visual: Tu desarrollo vs Camino del tejedor */}
      <section className="bg-white rounded-2xl border-2 border-[#201b0d] p-4 shadow-[4px_4px_0px_#201b0d] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#625499] text-lg">compare</span>
            <span className="font-headline font-bold text-sm text-[#201b0d]">Comparativa de caminos</span>
          </div>

          {/* Toggle Button */}
          <div className="inline-flex rounded-xl bg-[#f8edd5] p-0.5 border border-[#d7c3ae]">
            <button
              type="button"
              onClick={() => setActiveViewToggle('user')}
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition-all ${
                activeViewToggle === 'user'
                  ? 'bg-white text-[#ba1a1a] shadow-xs'
                  : 'text-[#524534] hover:text-[#201b0d]'
              }`}
            >
              Tu desarrollo
            </button>
            <button
              type="button"
              onClick={() => setActiveViewToggle('weaver')}
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition-all ${
                activeViewToggle === 'weaver'
                  ? 'bg-white text-[#0D9488] shadow-xs'
                  : 'text-[#524534] hover:text-[#201b0d]'
              }`}
            >
              Camino del tejedor
            </button>
          </div>
        </div>

        {/* Vista 1: Tu Desarrollo (con nudo resaltado) */}
        {activeViewToggle === 'user' && (
          <div className="flex flex-col gap-2 rounded-xl bg-[#fff8f0] border border-[#d7c3ae] p-3 animate-fadeIn">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#ece2ca]">
              <span className="font-mono text-[10px] font-bold text-[#ba1a1a] uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" />
                Procedimiento registrado
              </span>
              <span className="font-mono text-[9px] text-[#ba1a1a] font-bold bg-[#ffdad6] px-2 py-0.5 rounded border border-[#ba1a1a]/30">
                Nudo en Paso 3
              </span>
            </div>

            <div className="flex flex-col gap-2 text-xs font-mono">
              {session?.steps && session.steps.length > 0 ? (
                session.steps.map((step, idx) => {
                  const isErrorStep = diagnostic.errorStepIndex === idx || step.isIncorrectStep;
                  return (
                    <div
                      key={step.id || idx}
                      className={`flex items-center gap-2 ${
                        isErrorStep
                          ? 'bg-[#ffdad6]/60 p-1.5 rounded-lg border border-[#ba1a1a]/30'
                          : ''
                      }`}
                    >
                      <span className={`w-4 font-bold ${isErrorStep ? 'text-[#ba1a1a]' : 'text-[#857462]'}`}>
                        {idx + 1}.
                      </span>
                      <span className={`${isErrorStep ? 'text-[#ba1a1a] font-bold' : 'text-[#201b0d]'}`}>
                        {step.expression}
                      </span>
                      {isErrorStep && (
                        <span className="text-[10px] text-[#93000a] font-sans ml-auto">
                          ← {step.annotation || diagnostic.visualFeedback.calloutTitle || 'Aquí se rompió el razonamiento'}
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-2 text-xs text-[#524534]">
                  No se registraron pasos en la sesión.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vista 2: Camino del Tejedor (Correcto) */}
        {activeViewToggle === 'weaver' && (
          <div className="flex flex-col gap-2 rounded-xl bg-[#e6f7f5] border border-[#0D9488]/40 p-3 animate-fadeIn">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#0D9488]/30">
              <span className="font-mono text-[10px] font-bold text-[#0D9488] uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
                Solución rigurosa paso a paso
              </span>
              <span className="font-mono text-[9px] text-[#0D9488] font-bold bg-white px-2 py-0.5 rounded border border-[#0D9488]/30">
                Jerarquía estricta
              </span>
            </div>

            <div className="flex flex-col gap-2 text-xs font-mono">
              <div className="flex items-center justify-between bg-white/80 p-1.5 rounded-lg">
                <span className="text-[#524534]">1. Aislar cuadrático:</span>
                <span className="text-[#201b0d] font-bold">2(x + 3)² = 32</span>
              </div>
              <div className="flex items-center justify-between bg-white/80 p-1.5 rounded-lg border-2 border-[#0D9488]">
                <span className="text-[#0D9488] font-bold">2. Dividir entre 2 (¡Regla de Oro!):</span>
                <span className="text-[#0D9488] font-bold">(x + 3)² = 16</span>
              </div>
              <div className="flex items-center justify-between bg-white/80 p-1.5 rounded-lg">
                <span className="text-[#524534]">3. Raíz simétrica:</span>
                <span className="text-[#201b0d] font-bold">x + 3 = ±4</span>
              </div>
              <div className="flex items-center justify-between bg-[#0D9488] text-white p-1.5 rounded-lg font-bold">
                <span>4. Soluciones finales:</span>
                <span>x₁ = 1,  x₂ = -7  ✓</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Audio-Explicación de Balam */}
      <section className="w-full">
        <button
          type="button"
          onClick={handleToggleAudio}
          className="w-full rounded-2xl bg-[#f8edd5] hover:bg-[#f2e7d0] border-2 border-[#201b0d] p-3 flex items-center justify-between shadow-[3px_3px_0px_#201b0d] active:scale-[0.99] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1e1548] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className={`material-symbols-outlined text-xl ${isPlayingAudio ? 'animate-pulse' : ''}`}>
                {isPlayingAudio ? 'pause' : 'volume_up'}
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-sans font-bold text-xs sm:text-sm text-[#201b0d] leading-tight">
                Escuchar explicación pedagógica de Balam
              </span>
              <span className="font-sans text-[11px] text-[#524534] leading-tight">
                {isPlayingAudio ? 'Reproduciendo audio...' : '"Observa cómo la potencia protege a la base..."'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white border border-[#d7c3ae] px-2 py-1 rounded-md shrink-0">
            <span className="material-symbols-outlined text-[#835500] text-sm">graphic_eq</span>
            <span className="font-mono text-[11px] font-bold text-[#201b0d]">0:45</span>
          </div>
        </button>
      </section>

      {/* Botones de Acción Accesibles */}
      <section className="flex flex-col gap-2 pt-1">
        <button
          type="button"
          onClick={onGoToRemediation}
          className="w-full min-h-[50px] px-4 rounded-xl bg-[#f5a623] text-[#291800] font-mono text-xs uppercase tracking-wider font-bold shadow-[4px_4px_0px_#201b0d] border-2 border-[#201b0d] flex items-center justify-center gap-2 hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#201b0d] transition-all cursor-pointer"
        >
          <span>Comenzar Ruta de Remediación (5 Nudos)</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onGoBackToWhiteboard}
            className="min-h-[44px] px-3 rounded-xl bg-white border border-[#d7c3ae] hover:bg-[#f8edd5] text-[#201b0d] font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">draw</span>
            <span>Volver a Pizarra</span>
          </button>

          {onGoToSupport && (
            <button
              type="button"
              onClick={onGoToSupport}
              className="min-h-[44px] px-3 rounded-xl bg-white border border-[#d7c3ae] hover:bg-[#f8edd5] text-[#835500] font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">menu_book</span>
              <span>Material Apoyo</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
