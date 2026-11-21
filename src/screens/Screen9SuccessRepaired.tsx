import React, { useEffect, useRef } from 'react';
import { StudentProfile } from '../domain/types';
import { BalamJaguarAvatar } from '../components/common/BalamJaguarAvatar';
import { TextileRibbon } from '../components/common/TextileRibbon';

export interface Screen9SuccessRepairedProps {
  profile: StudentProfile | null;
  onGoToWhiteboardAgain: () => void;
  onGoToTeacherView: () => void;
  onGoToHome?: () => void;
}

export const Screen9SuccessRepaired: React.FC<Screen9SuccessRepairedProps> = ({
  profile,
  onGoToWhiteboardAgain,
  onGoToTeacherView,
  onGoToHome
}) => {
  const studentName = profile?.name || 'Camila Morales';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Textile-themed high-performance confetti canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#835500', '#F5A623', '#B90C55', '#625499', '#0D9488', '#00875A'];
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 14,
        speedY: (Math.random() - 0.7) * 16,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8
      });
    }

    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.25;
        p.speedX *= 0.98;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const timer = setTimeout(() => {
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 4500);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col items-center selection:bg-primary-container selection:text-on-primary-container pb-28 pt-4 relative overflow-x-hidden">
      {/* Confetti Overlay */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      <main className="w-full max-w-[480px] px-4 flex flex-col gap-4 text-center">
        {/* Meta pill */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
            ¡Hito de Remediación Alcanzado!
          </span>
          <button
            onClick={onGoToTeacherView}
            className="text-xs font-mono font-bold text-secondary hover:text-primary flex items-center gap-1"
          >
            <span>Ver Reporte Familiar</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-primary/30 relative overflow-hidden flex flex-col items-center gap-4">
          {/* Jaguar Avatar */}
          <div className="relative">
            <BalamJaguarAvatar size={88} className="drop-shadow-md" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg font-bold">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-primary-container/40 text-on-primary-container border border-primary/20 inline-block mb-2">
              Nudo Desatado · Base Reparada
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
              ¡Felicidades, {studentName}!
            </h1>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed max-w-sm mx-auto">
              Has dominado la regla de <strong className="text-primary font-bold">Jerarquía de Operaciones</strong>. Tu razonamiento ya no confunde los factores exteriores con los exponentes.
            </p>
          </div>

          {/* Mastery Jump Highlight (Pitch 42% -> 94%) */}
          <div className="w-full bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 flex items-center justify-around">
            <div className="flex flex-col items-center">
              <span className="font-mono text-[10px] uppercase font-bold text-red-600">Dominio Inicial</span>
              <span className="font-mono text-2xl font-bold text-red-600">42%</span>
              <span className="font-sans text-[10px] text-on-surface-variant">Hilo flojo (PEMDAS)</span>
            </div>
            <div className="flex flex-col items-center text-primary">
              <span className="material-symbols-outlined text-[24px] animate-pulse">arrow_forward</span>
              <span className="font-mono text-[9px] uppercase font-bold text-primary">+52 pts</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-mono text-[10px] uppercase font-bold text-emerald-600">Dominio Hoy</span>
              <span className="font-mono text-2xl font-bold text-emerald-600">94%</span>
              <span className="font-sans text-[10px] text-emerald-700 font-bold">Afianzado</span>
            </div>
          </div>

          {/* Before vs After Comparison Card */}
          <div className="w-full bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 text-left font-mono text-xs space-y-2.5">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-on-surface-variant block">
              Transformación del Razonamiento Matemático:
            </span>

            {/* Before */}
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-center justify-between">
              <span className="font-mono text-xs">Antes: 2(x + 3)² = 32 → (2x + 6)² = 32</span>
              <span className="font-mono text-[10px] text-red-700 font-bold bg-white px-1.5 py-0.5 rounded">
                Violaba PEMDAS
              </span>
            </div>

            {/* After */}
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between font-bold">
              <span className="font-mono text-xs">Ahora: 2(x + 3)² = 32 → (x + 3)² = 16 → x = 1, -7</span>
              <span className="font-mono text-[10px] text-emerald-800 bg-white px-1.5 py-0.5 rounded font-bold">
                Impecable
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col w-full gap-2 pt-2">
            <button
              type="button"
              onClick={onGoToWhiteboardAgain}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-primary text-on-primary font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm hover:brightness-105 active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">replay</span>
              <span>Reintentar Problema Original en Pizarra</span>
            </button>

            <button
              type="button"
              onClick={onGoToTeacherView}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white hover:bg-surface-container text-secondary font-mono text-xs font-bold flex items-center justify-center gap-2 border border-outline-variant/40 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">school</span>
              <span>Ver Reporte para Docente / Familia</span>
            </button>

            {onGoToHome && (
              <button
                type="button"
                onClick={onGoToHome}
                className="w-full min-h-[40px] px-4 py-2 rounded-xl bg-transparent text-on-surface-variant hover:text-on-surface font-sans text-xs flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">explore</span>
                <span>Volver a Mi Camino</span>
              </button>
            )}
          </div>
        </div>

        <TextileRibbon />
      </main>
    </div>
  );
};
