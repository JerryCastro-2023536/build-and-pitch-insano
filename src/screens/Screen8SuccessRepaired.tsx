import React, { useEffect, useRef } from 'react';
import { StudentProfile } from '../domain/types';
import { Icons } from '../components/common/Icons';

export interface Screen8SuccessRepairedProps {
  profile: StudentProfile | null;
  onGoToWhiteboardAgain: () => void;
  onGoToTeacherView: () => void;
}

export const Screen8SuccessRepaired: React.FC<Screen8SuccessRepairedProps> = ({
  profile,
  onGoToWhiteboardAgain,
  onGoToTeacherView
}) => {
  const studentName = profile?.name || 'Camila Morales';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Native High-Performance Canvas Confetti
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#6366F1', '#34D399'];
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
        y: canvas.height * 0.45,
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

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.25; // gravity
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
    <div className="max-w-4xl mx-auto py-8 px-4 text-center relative">
      {/* Confetti Overlay Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      {/* Screen Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Pantalla 8 / 8 · Stitch ID: 65ae8aa1
          </span>
          <span className="text-xs text-slate-400">Base Reparada · Éxito de Aprendizaje</span>
        </div>

        <button
          onClick={onGoToTeacherView}
          className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
        >
          <span>Ver Resumen para Docente/Familia</span>
          <Icons.ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Celebration Card */}
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          {/* Trophy Icon */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center text-slate-950 mx-auto shadow-xl shadow-emerald-500/30">
            <Icons.Award className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-block mb-2">
              ¡Base Matemática Reparada!
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              ¡Felicidades, {studentName}!
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
              Has dominado la regla de <span className="font-bold text-emerald-400">Jerarquía de Operaciones</span>. Ya no cometerás el error de adelantar factores sobre potencias cuadráticas.
            </p>
          </div>

          {/* Before vs After Comparison Card */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-left font-mono text-xs space-y-3">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400 block">
              Transformación del Razonamiento:
            </span>

            {/* Before */}
            <div className="flex items-center justify-between p-2 rounded bg-rose-950/30 border border-rose-900/60 text-rose-300">
              <span>Antes: 2(x + 3)² = 32 → (2x + 6)² = 32</span>
              <span className="text-[10px] font-sans font-bold text-rose-400">Violaba PEMDAS</span>
            </div>

            {/* After */}
            <div className="flex items-center justify-between p-2 rounded bg-emerald-950/30 border border-emerald-900/60 text-emerald-300 font-bold">
              <span>Ahora: 2(x + 3)² = 32 → (x + 3)² = 16 → x = 1, -7</span>
              <span className="text-[10px] font-sans font-bold text-emerald-400">Impecable</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onGoToWhiteboardAgain}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/30 transition flex items-center justify-center space-x-2"
            >
              <Icons.RotateCcw className="w-4 h-4" />
              <span>Reintentar Problema Original en Whiteboard</span>
            </button>

            <button
              onClick={onGoToTeacherView}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center space-x-2"
            >
              <Icons.School className="w-4 h-4" />
              <span>Ver Reporte Docente/Familia</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
