import React, { useState } from 'react';
import { StudentProfile } from '../domain/types';
import { balamRepository } from '../persistence/balamRepository';
import { BalamJaguarAvatar } from '../components/common/BalamJaguarAvatar';
import { TextileRibbon } from '../components/common/TextileRibbon';

export interface Screen2HomePathProps {
  profile: StudentProfile | null;
  onGoToWhiteboard: () => void;
  onGoToProgress: () => void;
  onGoToTeacherView: () => void;
}

export const Screen2HomePath: React.FC<Screen2HomePathProps> = ({
  profile,
  onGoToWhiteboard,
  onGoToProgress,
  onGoToTeacherView
}) => {
  const studentName = profile?.name || 'Estudiante';
  const gradeLabel = profile?.grade || 'Básico';

  const metrics = balamRepository.getUserMetrics();
  const diagnostic = balamRepository.getDiagnostic();
  const session = balamRepository.getCurrentSession();
  const hasErrorDiagnostic = Boolean(diagnostic && !diagnostic.isCorrect);

  const completedNodes = metrics.completedNodes;
  const cycleProgressPercent = Math.min(100, Math.round((completedNodes / 20) * 100));
  const remCount = diagnostic?.remediationExercises?.filter((e) => e.completed).length || 0;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStationAccordion, setActiveStationAccordion] = useState<number | null>(1);
  const [tipIndex, setTipIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const TIPS = [
    {
      quote: '"Las potencias y raíces siempre se calculan antes que las multiplicaciones. ¡Tené presente el orden hoy y nada se te enreda!"',
      tag: 'Regla PEMDAS'
    },
    {
      quote: '"En el telar maya, cada hilo cuenta. Cuando multipliques dos números negativos, recuerda: dos giros inversos devuelven el hilo al derecho (+)."',
      tag: 'Leyes de Signos'
    },
    {
      quote: '"Si una fracción tiene igual denominador, solo hilvanas los numeradores. ¡No sumes los de abajo, que son la medida del telar!"',
      tag: 'Fracciones'
    },
    {
      quote: '"Respira hondo: cometer errores es solo desatar una puntada para hacer el tejido más firme. ¡Vas muy bien!"',
      tag: 'Motivación'
    }
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const rotateTip = () => {
    setTipIndex((prev) => (prev + 1) % TIPS.length);
    showToast('Nuevo consejo cargado');
  };

  const handlePlayVoice = () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    showToast('Escuchando a Balam con voz cálida');

    if ('speechSynthesis' in window) {
      const text = TIPS[tipIndex].quote.replace(/"/g, '');
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-GT';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 py-4 sm:py-6 flex flex-col gap-4 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1e1548] text-white px-4 py-2 rounded-full font-mono text-xs shadow-lg border border-[#f5a623] flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[#f5a623] text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Saludo & Metadatos del Estudiante */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <BalamJaguarAvatar size={48} animated />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-headline font-bold text-xl text-[#201b0d] leading-tight">
                ¡Qué tal, {studentName.split(' ')[0]}!
              </h1>
              <span className="inline-block text-base">✨</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="font-mono text-[9px] bg-[#f8edd5] px-2 py-0.5 rounded-full text-[#524534] font-bold border border-[#d7c3ae] shadow-[1px_1px_0px_#201b0d]">
                {gradeLabel.toUpperCase()} • MINEDUC
              </span>
            </div>
          </div>
        </div>

        {/* Contador Racha de Rombos */}
        <div 
          onClick={() => showToast(metrics.streakDays > 0 ? `¡${metrics.streakDays} días continuos de tejido matemático!` : '¡Inicia hoy tu racha en la pizarra!')}
          className="flex flex-col items-end cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-1 bg-[#f2e7d0] px-2.5 py-1 rounded-full shadow-[2px_2px_0px_#201b0d] border border-[#201b0d]">
            <div className="w-3 h-3 bg-[#f5a623] rotate-45 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#201b0d]" />
            </div>
            <span className="font-mono text-xs font-bold text-[#201b0d]">{metrics.streakDays} DÍAS</span>
          </div>
          <span className="font-mono text-[9px] text-[#835500] font-bold mt-1">
            {metrics.streakDays > 0 ? '¡Racha de fuego!' : 'Inicia tu racha hoy'}
          </span>
        </div>
      </div>

      {/* Cinta Bordada de Progreso Matemático (Urdimbre del Ciclo) */}
      <div className="bg-[#fef3db] rounded-2xl p-4 shadow-[3px_3px_0px_#201b0d] border-2 border-[#201b0d] flex flex-col gap-2 relative overflow-hidden">
        <div className="flex items-center justify-between text-[#201b0d]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#b90c55] text-base">auto_awesome</span>
            <span className="font-mono text-[10px] text-[#b90c55] uppercase font-bold tracking-wider">
              Urdimbre del Ciclo
            </span>
          </div>
          <span className="font-mono text-xs text-[#201b0d] font-bold">{cycleProgressPercent}% completado</span>
        </div>

        {/* Barra textil geométrica con rombos */}
        <div className="w-full bg-[#625499]/20 h-5 rounded-md p-0.5 relative flex items-center overflow-hidden border border-[#201b0d]/20 shadow-inner">
          <div className="bg-[#625499] h-full rounded-sm flex items-center justify-end px-1 gap-1" style={{ width: `${cycleProgressPercent}%` }}>
            {cycleProgressPercent > 10 && <span className="w-2 h-2 bg-[#f5a623] rotate-45 shrink-0" />}
            {cycleProgressPercent > 25 && <span className="w-2 h-2 bg-[#b90c55] rotate-45 shrink-0" />}
            {cycleProgressPercent > 50 && <span className="w-2 h-2 bg-[#fff8f0] rotate-45 shrink-0" />}
            {cycleProgressPercent > 75 && <span className="w-2 h-2 bg-[#f5a623] rotate-45 shrink-0" />}
          </div>
          <div className="flex-1 flex justify-around opacity-40 px-2">
            <span className="w-1.5 h-1.5 bg-[#857462] rotate-45" />
            <span className="w-1.5 h-1.5 bg-[#857462] rotate-45" />
            <span className="w-1.5 h-1.5 bg-[#857462] rotate-45" />
          </div>
        </div>

        <div className="flex justify-between items-center text-[#524534] text-xs">
          <span className="font-mono text-[10px]">Telar de Álgebra I</span>
          <span className="font-mono text-[10px] text-[#835500] font-bold">{completedNodes}/20 Nudos tejidos</span>
        </div>
      </div>

      {/* Hero Priority Card: Hilo Roto Detectado o Ruta Inicial */}
      <section className="bg-white rounded-2xl shadow-[4px_4px_0px_#201b0d] p-4 relative overflow-hidden flex flex-col gap-3 border-2 border-[#201b0d]">
        <TextileRibbon height="h-1.5" />

        {hasErrorDiagnostic && diagnostic ? (
          <>
            {/* Badge Hilo Roto */}
            <div className="flex items-center justify-between pt-1">
              <span className="inline-flex items-center gap-1.5 bg-[#ffdad6] text-[#93000a] px-2.5 py-1 rounded-md font-mono text-[10px] font-bold border border-[#ba1a1a]/30 shadow-[1px_1px_0px_#93000a]">
                <span className="material-symbols-outlined text-sm animate-pulse">warning</span>
                HILO ROTO DETECTADO
              </span>
              <span className="font-mono text-xs text-[#524534] font-bold">Prioridad 1</span>
            </div>

            {/* Título y Diagnóstico */}
            <div>
              <h2 className="font-headline font-bold text-lg text-[#201b0d]">
                {diagnostic.visualFeedback?.foundationGuide?.conceptName || 'Jerarquía de Operaciones'}
              </h2>
              <div className="bg-[#f2e7d0] px-3 py-1.5 rounded-md mt-1 inline-block border border-[#d7c3ae]">
                <p className="font-mono text-xs text-[#201b0d]">
                  {diagnostic.visualFeedback?.ruleBroken || 'Jerarquía Operacional (PEMDAS)'}
                </p>
              </div>
            </div>

            {/* Mensaje Empático Local */}
            <div className="flex items-start gap-2 bg-[#f8edd5] p-2.5 rounded-xl border border-[#d7c3ae]">
              <span className="material-symbols-outlined text-[#835500] text-lg shrink-0 mt-0.5">sentiment_satisfied</span>
              <p className="font-sans text-xs text-[#201b0d] leading-snug">
                {diagnostic.visualFeedback?.calloutDescription || 'Se detectó una alteración en la prioridad operacional. ¡Vamos a resolverlo juntos!'}
              </p>
            </div>

            {/* CTA Primario Azafrán Solar */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full min-h-[48px] bg-[#f5a623] text-[#291800] rounded-xl font-mono text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_#201b0d] border-2 border-[#201b0d] hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#201b0d] transition-all flex items-center justify-between px-4 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">gesture</span>
                <span>Reparar base en Pizarra</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <span>5 pasos</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </div>
            </button>
          </>
        ) : (
          <>
            {/* Badge Inicio Limpio */}
            <div className="flex items-center justify-between pt-1">
              <span className="inline-flex items-center gap-1.5 bg-[#e7deff] text-[#4e4184] px-2.5 py-1 rounded-md font-mono text-[10px] font-bold border border-[#625499]/30 shadow-[1px_1px_0px_#4e4184]">
                <span className="material-symbols-outlined text-sm">explore</span>
                RUTA DE INICIO
              </span>
              <span className="font-mono text-xs text-[#524534] font-bold">Paso 1</span>
            </div>

            {/* Título y Diagnóstico */}
            <div>
              <h2 className="font-headline font-bold text-lg text-[#201b0d]">Diagnóstico Inicial en Pizarra</h2>
              <div className="bg-[#f2e7d0] px-3 py-1.5 rounded-md mt-1 inline-block border border-[#d7c3ae]">
                <p className="font-mono text-xs text-[#201b0d]">
                  Ecuación: <span className="text-[#835500] font-bold">{session?.initialEquation || '2(x + 3)² - 8 = 24'}</span>
                </p>
              </div>
            </div>

            {/* Mensaje Empático Local */}
            <div className="flex items-start gap-2 bg-[#f8edd5] p-2.5 rounded-xl border border-[#d7c3ae]">
              <span className="material-symbols-outlined text-[#835500] text-lg shrink-0 mt-0.5">sentiment_satisfied</span>
              <p className="font-sans text-xs text-[#201b0d] leading-snug">
                Aquí comienza tu tejido matemático. Resuelve el problema paso a paso en la pizarra y analizaremos tu razonamiento.
              </p>
            </div>

            {/* CTA Primario Azafrán Solar */}
            <button
              type="button"
              onClick={onGoToWhiteboard}
              className="w-full min-h-[48px] bg-[#f5a623] text-[#291800] rounded-xl font-mono text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_#201b0d] border-2 border-[#201b0d] hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#201b0d] transition-all flex items-center justify-between px-4 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">gesture</span>
                <span>Comenzar en Pizarra</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <span>5 pasos</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </div>
            </button>
          </>
        )}
      </section>

      {/* Sección: Tu Sendero Tejido (Vertical Stepping Path) */}
      <section className="flex flex-col gap-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#b90c55] rotate-45" />
            <h3 className="font-headline font-bold text-lg text-[#201b0d]">Tu Sendero Tejido</h3>
          </div>
          <span className="font-mono text-[10px] text-[#625499] uppercase font-bold tracking-wider">
            Ruta Adaptativa
          </span>
        </div>

        {/* Contenedor del Sendero */}
        <div className="relative pl-6 space-y-3">
          {/* Línea guía vertical tipo cordón de telar */}
          <div className="absolute left-[19px] top-4 bottom-6 w-1 bg-[#ece2ca] flex flex-col justify-between items-center py-2 pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-[#b90c55]" />
            <div className="w-2 h-2 rounded-full bg-[#625499]" />
            <div className="w-2 h-2 rounded-full bg-[#857462]" />
          </div>

          {/* Estación 1: Activa / Remediación Crítica */}
          <div 
            onClick={() => setActiveStationAccordion(activeStationAccordion === 1 ? null : 1)}
            className="cursor-pointer relative flex flex-col bg-white p-3.5 rounded-xl shadow-[3px_3px_0px_#201b0d] border-2 border-[#201b0d] transition-all"
          >
            <div className="absolute -left-6 top-4 w-6 h-6 flex items-center justify-center">
              <div className="w-5 h-5 bg-[#b90c55] rotate-45 flex items-center justify-center shadow-xs">
                <div className="w-2 h-2 bg-white" />
              </div>
            </div>

            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[9px] bg-[#ffd9df] text-[#910040] px-2 py-0.5 rounded font-bold">
                ESTACIÓN ACTIVA
              </span>
              <span className="font-mono text-[10px] text-[#b90c55] font-bold">{remCount}/5 remediación</span>
            </div>

            <div className="flex items-start justify-between">
              <h4 className="font-sans font-bold text-sm text-[#201b0d]">Jerarquía de Operaciones</h4>
              <span className={`material-symbols-outlined text-[#857462] text-lg transition-transform ${activeStationAccordion === 1 ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </div>
            <p className="font-sans text-xs text-[#524534] mt-0.5 leading-snug">
              Regla PEMDAS aplicada a potencias, multiplicaciones y signos combinados.
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onGoToWhiteboard();
                }}
                className="px-3 py-1.5 bg-[#b90c55] text-white rounded-lg font-mono text-[10px] uppercase tracking-wider font-bold shadow-[2px_2px_0px_#201b0d] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">play_arrow</span>
                <span>Continuar</span>
              </button>
              <span className="font-mono text-[10px] text-[#524534] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#835500]">schedule</span> ~8 min
              </span>
            </div>

            {/* Accordion expandible */}
            {activeStationAccordion === 1 && (
              <div className="border-t border-[#ece2ca] pt-2.5 mt-2.5 flex flex-col gap-1.5 text-xs text-[#201b0d] bg-[#f8edd5] p-2.5 rounded-lg">
                <span className="font-mono text-[10px] uppercase font-bold text-[#b90c55] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">psychology</span>
                  Objetivo de Aprendizaje
                </span>
                <p className="font-sans leading-snug">
                  Comprender por qué las potencias y multiplicaciones preceden a sumas modelándolo en la pizarra con equivalencias y aislamiento de términos.
                </p>
              </div>
            )}
          </div>

          {/* Estación 2: En Pausa */}
          <div 
            onClick={() => setActiveStationAccordion(activeStationAccordion === 2 ? null : 2)}
            className="cursor-pointer relative flex flex-col bg-[#fef3db] p-3.5 rounded-xl shadow-[2px_2px_0px_#201b0d] border border-[#d7c3ae] transition-all"
          >
            <div className="absolute -left-6 top-4 w-6 h-6 flex items-center justify-center">
              <div className="w-4 h-4 bg-[#625499] rotate-45 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white" />
              </div>
            </div>

            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[9px] bg-[#e7deff] text-[#4e4184] px-2 py-0.5 rounded font-bold">
                PASO FIRME
              </span>
              <span className="font-mono text-[10px] text-[#625499] font-bold">
                {completedNodes > 5 ? Math.min(6, completedNodes - 5) : 0}/6 bordados
              </span>
            </div>

            <div className="flex items-start justify-between">
              <h4 className="font-sans font-bold text-sm text-[#201b0d]">Potencias y Exponentes Enteros</h4>
              <span className={`material-symbols-outlined text-[#857462] text-lg transition-transform ${activeStationAccordion === 2 ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </div>
            <p className="font-sans text-xs text-[#524534] mt-0.5">
              Leyes de exponentes con base negativa y signos sin paréntesis.
            </p>

            {activeStationAccordion === 2 && (
              <div className="border-t border-[#ece2ca] pt-2 mt-2 flex flex-col gap-1 text-xs bg-white p-2 rounded-lg">
                <span className="font-mono text-[10px] uppercase font-bold text-[#625499]">Regla clave</span>
                <p className="font-mono text-xs font-bold text-[#201b0d]">-aⁿ ≠ (-a)ⁿ</p>
              </div>
            )}
          </div>

          {/* Estación 3: Bloqueada */}
          <div className="relative flex flex-col bg-[#f2e7d0]/60 p-3.5 rounded-xl border border-[#d7c3ae] opacity-75">
            <div className="absolute -left-6 top-4 w-6 h-6 flex items-center justify-center">
              <div className="w-4 h-4 bg-[#857462] rotate-45 flex items-center justify-center">
                <div className="w-1 h-1 bg-[#fff8f0]" />
              </div>
            </div>

            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[9px] bg-[#ece2ca] text-[#524534] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">lock</span>
                BLOQUEADO
              </span>
              <span className="font-mono text-[9px] text-[#524534]">Siguiente hito</span>
            </div>

            <h4 className="font-sans font-bold text-sm text-[#201b0d]">Ecuación Cuadrática por Despeje</h4>
            <p className="font-sans text-xs text-[#524534] mt-0.5">
              Desbloquea al completar y reparar la Jerarquía de Operaciones.
            </p>
          </div>
        </div>
      </section>

      {/* Tarjeta Inspiracional de Balam & Audio Guía */}
      <section className="bg-[#f8edd5] rounded-2xl p-4 shadow-[3px_3px_0px_#201b0d] border-2 border-[#201b0d] flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={rotateTip}
            title="Toca para rotar el consejo"
            className="w-10 h-10 rounded-full bg-[#f5a623] border border-[#201b0d] shadow-[2px_2px_0px_#201b0d] flex items-center justify-center shrink-0 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-[#291800] text-lg">tips_and_updates</span>
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#835500] uppercase font-bold tracking-wider">
                Consejo de Balam
              </span>
              <span className="font-mono text-[9px] text-[#524534] flex items-center gap-0.5">
                <span className="material-symbols-outlined text-xs text-[#b90c55]">touch_app</span> Toca icono para rotar
              </span>
            </div>
            <p className="font-sans text-xs text-[#201b0d] mt-1 font-medium italic leading-relaxed">
              {TIPS[tipIndex].quote}
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={handlePlayVoice}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-[#201b0d] rounded-lg text-xs font-bold border border-[#d7c3ae] shadow-[1px_1px_0px_#201b0d] active:scale-95 transition-all"
              >
                <span className={`material-symbols-outlined text-sm text-[#835500] ${isPlayingAudio ? 'animate-pulse' : ''}`}>
                  {isPlayingAudio ? 'graphic_eq' : 'volume_up'}
                </span>
                <span>{isPlayingAudio ? 'Reproduciendo...' : 'Escuchar con voz cálida'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sincronización Escolar */}
        <div className="pt-2 flex items-center justify-between text-[#524534] border-t border-[#d7c3ae]/60 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#625499] inline-block animate-ping" />
            <span className="font-mono text-[10px]">
              Sincronizado con: <strong className="text-[#201b0d]">{metrics.linkedTeacher || 'Sin docente vinculado'}</strong>
            </span>
          </div>
          <span className="font-mono text-[9px] text-[#625499] font-bold">{profile?.school || 'Registro libre'}</span>
        </div>
      </section>

      {/* MODAL DE REPARACIÓN DE BASE EN PIZARRA (Bottom Sheet) */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#201b0d]/70 backdrop-blur-xs animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-[#fff8f0] border-t-4 border-t-[#f5a623] sm:border-4 sm:border-[#201b0d] rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 z-10 max-h-[85vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-[#ece2ca]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#b90c55] text-2xl">construction</span>
                <div>
                  <h3 className="font-headline font-bold text-lg text-[#201b0d] leading-none">Reparar Hilo Roto</h3>
                  <span className="font-mono text-[10px] text-[#b90c55] uppercase font-bold">Jerarquía de Operaciones</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f2e7d0] flex items-center justify-center text-[#201b0d] hover:bg-[#ece2ca] shadow-[1px_1px_0px_#201b0d]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Plan de 5 pasos */}
            <div className="py-3 flex flex-col gap-2.5">
              <div className="bg-[#fef3db] p-3 rounded-xl border-l-4 border-[#835500] text-xs text-[#201b0d]">
                <span className="font-mono text-[10px] text-[#835500] font-bold uppercase tracking-wider block">
                  Plan de Remediación Adaptativo
                </span>
                <p className="mt-0.5">
                  Completa este recorrido en la pizarra para soldar el hilo y continuar tu ruta sin vacíos acumulados.
                </p>
              </div>

              {[
                { num: 1, title: 'Paso 1: Paréntesis y Agrupación', desc: 'Identificar operaciones prioritarias.', done: remCount >= 1 },
                { num: 2, title: 'Paso 2: Potencias y Raíces', desc: 'Aislar exponentes antes de multiplicar.', done: remCount >= 2 },
                { num: 3, title: 'Paso 3: Multiplicación vs Suma (Foco)', desc: 'Despejar respetando jerarquía PEMDAS.', alert: hasErrorDiagnostic && remCount < 3, done: remCount >= 3 },
                { num: 4, title: 'Paso 4: Despeje y Sumas Finales', desc: 'Resolver la igualdad paso a paso.', done: remCount >= 4 },
                { num: 5, title: 'Paso 5: Nudo de Prueba y Desbloqueo', desc: 'Verificar el dominio para abrir cuadráticas.', done: remCount >= 5 }
              ].map((step) => (
                <div 
                  key={step.num}
                  className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-[#201b0d]/10 shadow-[2px_2px_0px_#201b0d]"
                >
                  <span className={`w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                    step.alert ? 'bg-[#ffdad6] text-[#ba1a1a]' : step.done ? 'bg-[#f5a623] text-[#291800]' : 'bg-[#ece2ca] text-[#524534]'
                  }`}>
                    {step.num}
                  </span>
                  <div className="flex-1 text-xs">
                    <p className={`font-bold ${step.alert ? 'text-[#ba1a1a]' : 'text-[#201b0d]'}`}>{step.title}</p>
                    <span className="text-[#524534] text-[11px]">{step.desc}</span>
                  </div>
                  {step.done ? (
                    <span className="material-symbols-outlined text-[#0D9488] text-base">check_circle</span>
                  ) : step.alert ? (
                    <span className="material-symbols-outlined text-[#ba1a1a] text-base">error</span>
                  ) : (
                    <span className="material-symbols-outlined text-[#857462] text-base">circle</span>
                  )}
                </div>
              ))}
            </div>

            {/* Acciones */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  onGoToWhiteboard();
                }}
                className="w-full min-h-[48px] bg-[#835500] hover:bg-[#6e4600] text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_#201b0d] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">draw</span>
                <span>Abrir en Pizarra Ahora</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
