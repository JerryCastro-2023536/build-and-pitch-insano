import React, { useState } from 'react';
import { DiagnosticResult, StudentProfile } from '../domain/types';
import { balamRepository } from '../persistence/balamRepository';
import { TextileRibbon } from '../components/common/TextileRibbon';

export interface Screen5RemediationRouteProps {
  diagnostic: DiagnosticResult;
  profile: StudentProfile | null;
  onStartExercise: (exerciseIndex: number) => void;
  onGoToProgress: () => void;
  onGoToWhiteboard?: () => void;
}

export const Screen5RemediationRoute: React.FC<Screen5RemediationRouteProps> = ({
  diagnostic,
  profile,
  onStartExercise,
  onGoToProgress,
  onGoToWhiteboard
}) => {
  const exercises = diagnostic.remediationExercises || [];
  const [completedExercises, setCompletedExercises] = useState<number[]>(() => {
    return exercises.map((e, idx) => (e.completed ? idx : -1)).filter((idx) => idx !== -1);
  });
  const completedCount = completedExercises.length;
  const totalNodes = exercises.length || 5;
  const progressPercent = totalNodes > 0 ? Math.min(100, Math.round((completedCount / totalNodes) * 100)) : 0;

  // Modals state
  const [modalRevisionOpen, setModalRevisionOpen] = useState(false);
  const [modalSimulatorOpen, setModalSimulatorOpen] = useState(false);
  const [modalNotesOpen, setModalNotesOpen] = useState(false);
  const [notesActiveTab, setNotesActiveTab] = useState<'jerarquia' | 'ejemplos' | 'errores'>('jerarquia');

  // Simulator state
  const [simStep, setSimStep] = useState<1 | 2>(1);
  const [selectedPowerAnswer, setSelectedPowerAnswer] = useState<number | null>(null);
  const [selectedFinalAnswer, setSelectedFinalAnswer] = useState<number | null>(null);
  const [simFeedback, setSimFeedback] = useState<string | null>(null);

  // Mnemonic tip banner
  const [mnemonicTip, setMnemonicTip] = useState<string | null>(null);

  const handleSelectPower = (val: number) => {
    setSelectedPowerAnswer(val);
    if (val === 16) {
      setSimFeedback('¡Exacto! 4² = 16. La potencia se calcula antes de multiplicar.');
      setTimeout(() => setSimStep(2), 600);
    } else {
      setSimFeedback('¡Ojo con el exponente! 4² es 4 × 4 = 16, no 4 × 2.');
    }
  };

  const handleSelectFinal = (val: number) => {
    setSelectedFinalAnswer(val);
    if (val === 32) {
      setSimFeedback('¡Nudo apretado con éxito! 2 × 16 = 32.');
      if (!completedExercises.includes(1)) {
        const nextCompleted = [...completedExercises, 1];
        setCompletedExercises(nextCompleted);
        const metrics = balamRepository.getUserMetrics();
        balamRepository.saveUserMetrics({
          ...metrics,
          completedExercisesCount: metrics.completedExercisesCount + 1,
          completedNodes: Math.max(metrics.completedNodes, nextCompleted.length),
          points: metrics.points + 20
        });
      }
    } else {
      setSimFeedback('Revisa el producto: 2 × 16.');
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 py-4 sm:py-6 flex flex-col gap-4 relative">
      {/* Encabezado de la Ruta */}
      <section className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#b90c55] uppercase font-bold tracking-wider">
            Hilo de Refuerzo Activo
          </span>
          <span className="w-2 h-2 rounded-full bg-[#b90c55] animate-ping" />
          <span className="font-mono text-xs text-[#524534]">Nudo {Math.min(totalNodes, completedCount + 1)} en telar</span>
        </div>

        <h1 className="font-headline font-bold text-2xl text-[#201b0d] tracking-tight">
          Jerarquía de Operaciones
        </h1>
        <p className="font-sans text-xs text-[#524534] leading-relaxed">
          5 nudos guiados para soldar tu base y tejer tus operaciones algebraicas sin tropiezos.
        </p>

        {/* Urdimbre de Progreso (Mayan Weave Track) */}
        <div className="mt-2 p-3 bg-[#fef3db] rounded-2xl border-2 border-[#201b0d] shadow-[3px_3px_0px_#201b0d] flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-mono font-bold">
            <span className="flex items-center gap-1.5 text-[#201b0d]">
              <span className="material-symbols-outlined text-[#835500] text-base">texture</span>
              Avance del telar
            </span>
            <span className="text-[#835500]">{completedCount} de {totalNodes} nudos ({progressPercent}%)</span>
          </div>

          <div className="w-full h-3 bg-[#ece2ca] rounded-full overflow-hidden flex items-center p-0.5 border border-[#201b0d]/20">
            <div 
              className="h-full bg-[#f5a623] rounded-full transition-all duration-700 flex items-center justify-end pr-1"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="w-1.5 h-1.5 bg-[#201b0d] rounded-full" />
            </div>
          </div>

          <div className="flex justify-between items-center font-mono text-[10px] text-[#524534] pt-0.5">
            <span>Inicio: Paréntesis</span>
            <span className="text-[#b90c55] font-bold">Meta: Desafío de Maestría</span>
          </div>
        </div>
      </section>

      {/* Secuencia de 5 Nudos con el Hilo Tensor Vertical */}
      <section className="flex flex-col gap-3 relative pt-2">
        {/* Línea guía vertical (hilo tensor) */}
        <div className="absolute left-[22px] top-6 bottom-6 w-0.5 bg-[#d7c3ae] z-0" />

        {/* NUDO 1: COMPLETADO */}
        <article
          onClick={() => setModalRevisionOpen(true)}
          className="cursor-pointer flex items-start gap-3 relative z-10 p-3 bg-[#fef3db] rounded-2xl border-2 border-[#201b0d] shadow-[3px_3px_0px_#201b0d] hover:bg-[#f8edd5] transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-white border border-[#201b0d] flex items-center justify-center shrink-0 shadow-xs rotate-45">
            <span className="-rotate-45 material-symbols-outlined text-[#0D9488] text-xl font-bold">check_circle</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase font-bold text-[#524534]">Nudo 1 • Completado</span>
              <span className="px-2 py-0.5 bg-white rounded-full font-mono text-[9px] text-[#0D9488] font-bold border border-[#d7c3ae] flex items-center gap-0.5">
                <span className="material-symbols-outlined text-xs">visibility</span> Revisar
              </span>
            </div>
            <h2 className="font-sans font-bold text-sm text-[#201b0d] mt-0.5">
              Identificar operaciones y paréntesis
            </h2>
            <p className="font-sans text-xs text-[#524534] mt-0.5 leading-snug">
              Distinguiste con éxito los grupos prioritarios. Toca para ver la solución del nudo.
            </p>
          </div>
        </article>

        {/* NUDO 2: ACTIVO / EN CURSO (Taller del Nudo) */}
        <article className="flex items-start gap-3 relative z-10 p-4 bg-white rounded-2xl border-2 border-[#201b0d] shadow-[4px_4px_0px_#201b0d]">
          <div className="w-10 h-10 rounded-xl bg-[#f5a623] border border-[#201b0d] flex items-center justify-center shrink-0 shadow-xs rotate-45">
            <span className="-rotate-45 material-symbols-outlined text-[#291800] text-xl font-bold">adjust</span>
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-[#835500]">Nudo Activo • Paso 2 de 5</span>
              <span className="px-2 py-0.5 bg-[#f5a623] text-[#291800] font-mono text-[9px] rounded-full font-bold animate-pulse">
                En Curso
              </span>
            </div>

            <div>
              <h2 className="font-headline font-bold text-base text-[#201b0d]">
                Potencias antes de multiplicaciones
              </h2>
              <p className="font-sans text-xs text-[#524534] mt-0.5 leading-snug">
                Desatemos la trampa: la potencia pertenece únicamente a su base, nunca al producto exterior.
              </p>
            </div>

            {/* Expresión Matemática Visual */}
            <div className="p-2.5 bg-[#f8edd5] rounded-xl border border-[#d7c3ae] flex flex-col gap-1">
              <span className="font-mono text-[10px] text-[#524534]">Ejemplo guiado a resolver:</span>
              <div className="flex items-center justify-center gap-2 py-1 font-mono font-bold text-sm text-[#201b0d]">
                <span>2 ×</span>
                <span className="bg-[#ffd9df] text-[#910040] px-2 py-0.5 rounded-lg border border-[#b90c55]">
                  4² (1° resolver)
                </span>
                <span>= 2 × 16 =</span>
                <span className="text-[#0D9488] font-black">32</span>
              </div>
              <p className="font-sans text-[11px] text-[#524534] text-center italic">
                ¡Ojo! No hagas (2 × 4)². Primero elevás, luego multiplicás.
              </p>
            </div>

            {/* Botón de Taller Interactivo */}
            <button
              type="button"
              onClick={() => setModalSimulatorOpen(true)}
              className="w-full min-h-[44px] bg-[#f5a623] text-[#291800] rounded-xl font-mono text-xs uppercase tracking-wider font-bold shadow-[2px_2px_0px_#201b0d] border border-[#201b0d] flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <span>Abrir Taller del Nudo 2</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </article>

        {/* NUDO 3: PRÓXIMO */}
        <article className="flex items-start gap-3 relative z-10 p-3 bg-[#f2e7d0]/60 rounded-2xl border border-[#d7c3ae] opacity-75">
          <div className="w-8 h-8 rounded-xl bg-[#ece2ca] border border-[#857462] flex items-center justify-center shrink-0 rotate-45">
            <span className="-rotate-45 material-symbols-outlined text-[#857462] text-sm">lock</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase font-bold text-[#857462]">Nudo 3 • Próximo</span>
              <span className="material-symbols-outlined text-[#857462] text-sm">lock_clock</span>
            </div>
            <h2 className="font-sans font-bold text-xs text-[#201b0d] mt-0.5">
              Multiplicación y división de izquierda a derecha
            </h2>
            <p className="font-sans text-[11px] text-[#524534]">
              Avanzan con igual jerarquía: el hilo corre en orden de lectura natural.
            </p>
          </div>
        </article>

        {/* NUDO 4: PRÓXIMO */}
        <article className="flex items-start gap-3 relative z-10 p-3 bg-[#f2e7d0]/60 rounded-2xl border border-[#d7c3ae] opacity-75">
          <div className="w-8 h-8 rounded-xl bg-[#ece2ca] border border-[#857462] flex items-center justify-center shrink-0 rotate-45">
            <span className="-rotate-45 material-symbols-outlined text-[#857462] text-sm">lock</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-mono text-[9px] uppercase font-bold text-[#857462]">Nudo 4 • Próximo</span>
            <h2 className="font-sans font-bold text-xs text-[#201b0d] mt-0.5">
              Sumas y restas finales
            </h2>
            <p className="font-sans text-[11px] text-[#524534]">
              Los últimos amarres para cerrar cada expresión sin tropiezos.
            </p>
          </div>
        </article>

        {/* NUDO 5: RETO DE MAESTRÍA */}
        <article className="flex items-start gap-3 relative z-10 p-3 bg-[#e7deff]/60 rounded-2xl border-2 border-[#625499] shadow-[3px_3px_0px_#201b0d]">
          <div className="w-9 h-9 rounded-xl bg-[#625499] text-white flex items-center justify-center shrink-0 rotate-45 shadow-xs">
            <span className="-rotate-45 material-symbols-outlined text-base">military_tech</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase font-bold text-[#625499]">Reto Integrador • Nudo 5</span>
              <span className="px-2 py-0.5 bg-[#c0b1fd] text-[#4e4184] font-mono text-[9px] rounded-full font-bold">
                Maestría
              </span>
            </div>
            <h2 className="font-sans font-bold text-sm text-[#201b0d] mt-0.5">
              Desafío de Maestría: El nudo perfecto
            </h2>
            <p className="font-sans text-xs text-[#524534]">
              Ecuaciones cuadráticas completas para sellar tu dominio y consolidar la base matemática.
            </p>
          </div>
        </article>
      </section>

      {/* Tarjeta de Apoyo Pedagógico: Regla del Tejedor Maya Mnemotécnica */}
      <section className="p-4 bg-[#f8edd5] rounded-2xl border-2 border-[#201b0d] shadow-[3px_3px_0px_#201b0d] flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-[#835500] font-bold">
          <span className="material-symbols-outlined text-xl">lightbulb</span>
          <h3 className="font-headline font-bold text-base text-[#201b0d]">Regla del Tejedor Maya</h3>
        </div>
        <p className="font-sans text-xs text-[#201b0d]">
          Recordá siempre la postura del tecolote sabio:
        </p>

        {/* 3 Mnemonic Buttons */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <button
            type="button"
            onClick={() => setMnemonicTip('Coronas (Potencias y Raíces): Se tejen en la cúspide antes de operar con los lados.')}
            className="p-2 bg-white rounded-xl border border-[#d7c3ae] flex flex-col items-center hover:bg-[#fef3db] transition-colors"
          >
            <span className="material-symbols-outlined text-[#b90c55] text-xl">crown</span>
            <span className="font-mono text-[11px] font-bold text-[#201b0d] mt-1">1. Coronas</span>
            <span className="font-sans text-[10px] text-[#524534]">Potencias</span>
          </button>
          <button
            type="button"
            onClick={() => setMnemonicTip('Brazos (Multiplicación y División): Se extienden juntos de izquierda a derecha sin favoritismos.')}
            className="p-2 bg-white rounded-xl border border-[#d7c3ae] flex flex-col items-center hover:bg-[#fef3db] transition-colors"
          >
            <span className="material-symbols-outlined text-[#835500] text-xl">front_hand</span>
            <span className="font-mono text-[11px] font-bold text-[#201b0d] mt-1">2. Brazos</span>
            <span className="font-sans text-[10px] text-[#524534]">Mult / Div</span>
          </button>
          <button
            type="button"
            onClick={() => setMnemonicTip('Pasos (Sumas y Restas): Asientan la base del telar, siempre al final del recorrido.')}
            className="p-2 bg-white rounded-xl border border-[#d7c3ae] flex flex-col items-center hover:bg-[#fef3db] transition-colors"
          >
            <span className="material-symbols-outlined text-[#625499] text-xl">directions_walk</span>
            <span className="font-mono text-[11px] font-bold text-[#201b0d] mt-1">3. Pasos</span>
            <span className="font-sans text-[10px] text-[#524534]">Suma / Resta</span>
          </button>
        </div>

        {/* Tip Display Banner */}
        {mnemonicTip && (
          <div className="p-2.5 bg-white rounded-xl border border-[#f5a623] text-xs font-sans text-[#201b0d] animate-fadeIn">
            <strong className="text-[#835500]">Pista del Tejedor: </strong>
            <span>{mnemonicTip}</span>
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setModalNotesOpen(true)}
            className="flex-1 min-h-[40px] px-3 bg-white text-[#201b0d] hover:bg-[#f2e7d0] rounded-xl font-mono text-xs font-bold border border-[#d7c3ae] shadow-xs flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">menu_book</span>
            <span>Abrir apuntes</span>
          </button>
          {onGoToWhiteboard && (
            <button
              type="button"
              onClick={onGoToWhiteboard}
              className="flex-1 min-h-[40px] px-3 bg-[#1e1548] text-white hover:bg-[#2a1b5e] rounded-xl font-mono text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">draw</span>
              <span>Pizarra</span>
            </button>
          )}
        </div>
      </section>

      {/* CTA de Continuación Directa */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => onStartExercise(0)}
          className="w-full min-h-[50px] bg-[#835500] hover:bg-[#6e4600] text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_#201b0d] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">play_arrow</span>
          <span>Continuar práctica (Nudo 2)</span>
        </button>
      </div>

      {/* MODAL 1: REVISIÓN DE NUDO 1 */}
      {modalRevisionOpen && (
        <div className="fixed inset-0 z-50 bg-[#201b0d]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-[360px] bg-[#fff8f0] rounded-2xl shadow-2xl p-4 border-2 border-[#201b0d] flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#ece2ca]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#0D9488] text-xl">verified</span>
                <h3 className="font-headline font-bold text-base text-[#201b0d]">Nudo 1: Solución tejida</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalRevisionOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f2e7d0] flex items-center justify-center text-[#201b0d]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#d7c3ae] text-xs font-mono space-y-1">
              <p className="text-[#524534] uppercase text-[10px] font-bold">Problema resuelto:</p>
              <p className="font-bold text-[#201b0d] text-center py-1.5 bg-[#fef3db] rounded-lg">
                3 + (5 × 2) - 4
              </p>
              <p className="text-[#0D9488] font-bold">✓ Paso 1: Paréntesis (5 × 2 = 10)</p>
              <p className="text-[#524534]">Paso 2: 3 + 10 - 4 = 9</p>
            </div>
            <button
              type="button"
              onClick={() => setModalRevisionOpen(false)}
              className="w-full py-2.5 bg-[#1e1548] text-white rounded-xl font-mono text-xs font-bold"
            >
              Volver a la ruta
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: TALLER DEL NUDO 2 (Mini-ejercicio interactivo) */}
      {modalSimulatorOpen && (
        <div className="fixed inset-0 z-50 bg-[#201b0d]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-[370px] bg-[#fff8f0] rounded-2xl shadow-2xl p-4 border-2 border-[#201b0d] flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#ece2ca]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#f5a623] text-[#291800] flex items-center justify-center text-xs font-bold font-mono">
                  2
                </span>
                <h3 className="font-headline font-bold text-base text-[#201b0d]">Taller del Nudo 2</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalSimulatorOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f2e7d0] flex items-center justify-center text-[#201b0d]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#d7c3ae] flex flex-col gap-1.5 text-center">
              <span className="font-mono text-[10px] text-[#b90c55] font-bold uppercase">Nivel: Potencias primero</span>
              <p className="font-mono text-xl font-bold text-[#201b0d]">
                2 × <span className="bg-[#ffd9df] text-[#910040] px-1.5 py-0.5 rounded">4²</span> = ?
              </p>
              <p className="font-sans text-xs text-[#524534]">
                {simStep === 1 ? '¿Cuál es el valor prioritario de 4²?' : 'Ahora multiplica 2 × 16:'}
              </p>
            </div>

            {simStep === 1 ? (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: 8, label: '8 (4×2)' },
                  { val: 16, label: '16 (4×4)' },
                  { val: 64, label: '64 (8²)' }
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => handleSelectPower(opt.val)}
                    className={`py-3 px-1 rounded-xl font-mono text-xs font-bold border-2 transition-all ${
                      selectedPowerAnswer === opt.val
                        ? opt.val === 16
                          ? 'bg-[#e6f7f5] border-[#0D9488] text-[#0D9488]'
                          : 'bg-[#ffdad6] border-[#ba1a1a] text-[#ba1a1a]'
                        : 'bg-white border-[#d7c3ae] text-[#201b0d] hover:bg-[#fef3db]'
                    }`}
                  >
                    <div>{opt.val}</div>
                    <span className="font-sans text-[9px] font-normal text-[#524534]">{opt.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {[24, 32, 36].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSelectFinal(num)}
                    className={`py-2.5 rounded-xl font-mono text-sm font-bold border-2 transition-all ${
                      selectedFinalAnswer === num
                        ? num === 32
                          ? 'bg-[#e6f7f5] border-[#0D9488] text-[#0D9488]'
                          : 'bg-[#ffdad6] border-[#ba1a1a] text-[#ba1a1a]'
                        : 'bg-white border-[#d7c3ae] text-[#201b0d] hover:bg-[#fef3db]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}

            {simFeedback && (
              <div className="p-2 rounded-lg bg-[#f8edd5] text-xs font-sans text-[#201b0d] border border-[#d7c3ae]">
                {simFeedback}
              </div>
            )}

            <button
              type="button"
              disabled={selectedFinalAnswer !== 32}
              onClick={() => {
                setModalSimulatorOpen(false);
                onStartExercise(0);
              }}
              className="w-full py-2.5 bg-[#835500] hover:bg-[#6e4600] disabled:opacity-40 text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider"
            >
              Apretar Nudo en Telar
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: APUNTES DEL TEJEDOR */}
      {modalNotesOpen && (
        <div className="fixed inset-0 z-50 bg-[#201b0d]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-[370px] bg-[#fff8f0] rounded-2xl shadow-2xl p-4 border-2 border-[#201b0d] flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#ece2ca]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#835500] text-xl">menu_book</span>
                <h3 className="font-headline font-bold text-base text-[#201b0d]">Apuntes del Tejedor</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalNotesOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f2e7d0] flex items-center justify-center text-[#201b0d]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="flex bg-[#f2e7d0] p-1 rounded-xl text-xs font-mono font-bold">
              <button
                type="button"
                onClick={() => setNotesActiveTab('jerarquia')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${notesActiveTab === 'jerarquia' ? 'bg-white text-[#835500] shadow-xs' : 'text-[#524534]'}`}
              >
                Jerarquía
              </button>
              <button
                type="button"
                onClick={() => setNotesActiveTab('ejemplos')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${notesActiveTab === 'ejemplos' ? 'bg-white text-[#835500] shadow-xs' : 'text-[#524534]'}`}
              >
                Ejemplos
              </button>
              <button
                type="button"
                onClick={() => setNotesActiveTab('errores')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${notesActiveTab === 'errores' ? 'bg-white text-[#835500] shadow-xs' : 'text-[#524534]'}`}
              >
                Trampas
              </button>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#d7c3ae] text-xs font-sans space-y-2 max-h-[45vh] overflow-y-auto">
              {notesActiveTab === 'jerarquia' && (
                <>
                  <p className="font-bold text-[#b90c55]">1° Paréntesis y Agrupación: ( ), [ ], {'{ }'}</p>
                  <p className="font-bold text-[#835500]">2° Potencias y Raíces: aⁿ, √a</p>
                  <p className="font-bold text-[#625499]">3° Multiplicación y División (de izq a der)</p>
                  <p className="font-bold text-[#201b0d]">4° Sumas y Restas al puro final</p>
                </>
              )}
              {notesActiveTab === 'ejemplos' && (
                <div className="font-mono text-xs space-y-1">
                  <p className="font-sans font-bold text-[#835500]">Ejemplo riguroso:</p>
                  <p className="bg-[#fef3db] p-1.5 rounded border border-[#d7c3ae]">
                    2(x+3)² = 32 → (x+3)² = 16 → x+3 = ±4
                  </p>
                </div>
              )}
              {notesActiveTab === 'errores' && (
                <div className="space-y-1">
                  <p className="font-bold text-[#ba1a1a]">❌ Trampa común: 2(x+3)² → (2x+6)²</p>
                  <p className="text-[#524534]">Nunca multipliques la base con exponente pendiente.</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setModalNotesOpen(false)}
              className="w-full py-2 bg-[#f8edd5] text-[#201b0d] rounded-xl font-mono text-xs font-bold"
            >
              Cerrar apuntes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
