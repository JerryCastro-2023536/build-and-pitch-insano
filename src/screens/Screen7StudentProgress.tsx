import React, { useState } from 'react';
import { StudentProfile } from '../domain/types';
import { TextileRibbon } from '../components/common/TextileRibbon';

export interface Screen7StudentProgressProps {
  profile: StudentProfile | null;
  onGoToWhiteboard?: () => void;
  onGoToTeacherView?: () => void;
}

interface BadgeInfo {
  id: string;
  title: string;
  icon: string;
  statusText: string;
  statusColor: string;
  level: string;
  criteria: string;
  date: string;
  unlocked: boolean;
}

const BADGES: BadgeInfo[] = [
  {
    id: 'jaguar',
    title: 'Jaguar de Jade',
    icon: 'pets',
    statusText: 'Activo 🌟',
    statusColor: 'bg-primary text-on-primary',
    level: 'Constancia y Enfoque Semanal',
    criteria: 'Completaste 5 días ininterrumpidos tejiendo matemáticas en tu telar con dedicación superior a 20 minutos diarios.',
    date: 'Obtenida hoy: Viernes (Racha de 5 días)',
    unlocked: true
  },
  {
    id: 'potencias',
    title: 'Bordado Potencias',
    icon: 'grid_goldenratio',
    statusText: 'Ganado ✨',
    statusColor: 'bg-secondary text-on-secondary',
    level: 'Aritmética y Leyes de Exponentes',
    criteria: 'Dominio impecable de potencias y bases con un 94% de precisión en tu última sesión guiada.',
    date: 'Obtenida: Miércoles 22 de Octubre',
    unlocked: true
  },
  {
    id: 'nudo',
    title: 'Nudo Firme',
    icon: 'security',
    statusText: 'Firme 🛡️',
    statusColor: 'bg-tertiary text-on-tertiary',
    level: 'Autocorrección y Metacognición',
    criteria: 'Detectaste y reparaste un tropiezo conceptual en el orden PEMDAS al primer intento con asistencia del tutor Balam.',
    date: 'Obtenida: Jueves 23 de Octubre',
    unlocked: true
  },
  {
    id: 'quetzal',
    title: 'Quetzal Algebraico',
    icon: 'lock',
    statusText: '60% 🔒',
    statusColor: 'bg-surface-container-highest text-on-surface-variant',
    level: 'Álgebra Lineal y Despejes',
    criteria: 'Criterio pendiente: Resuelve 4 ecuaciones más con propiedad distributiva y simplificación de términos semejantes.',
    date: 'Meta estimada: Próxima semana',
    unlocked: false
  }
];

const WEEK_DAYS = [
  { key: 'lun', label: 'Lun', done: true, icon: 'check_circle', title: 'Lunes: 25 min de práctica', sub: 'Repaso de fracciones equivalentes y 4 problemas resueltos' },
  { key: 'mar', label: 'Mar', done: true, icon: 'check_circle', title: 'Martes: 30 min de práctica', sub: 'Multiplicación algebraica y 5 problemas resueltos' },
  { key: 'mie', label: 'Mié', done: true, icon: 'check_circle', title: 'Miércoles: 20 min de práctica', sub: 'Introducción a exponentes y leyes de potencias' },
  { key: 'jue', label: 'Jue', done: true, icon: 'check_circle', title: 'Jueves: 40 min de práctica', sub: 'Detección de nudo en PEMDAS y remediación guiada' },
  { key: 'vie', label: 'Vie', done: true, icon: 'stars', title: 'Viernes: 35 min de pizarra', sub: 'Resolviste 6 ejercicios de PEMDAS con 1 pausa activa' },
  { key: 'sab', label: 'Sáb', done: false, icon: 'circle', title: 'Sábado: Práctica opcional', sub: '2 micro-desafíos de repaso preparados si deseas tejer' },
  { key: 'dom', label: 'Dom', done: false, icon: 'bedtime', title: 'Domingo: Descanso merecido', sub: 'Tu cerebro asimila los conceptos aprendidos en la semana' }
];

export const Screen7StudentProgress: React.FC<Screen7StudentProgressProps> = ({
  profile,
  onGoToWhiteboard,
  onGoToTeacherView
}) => {
  const studentName = profile?.name || 'Camila Morales';
  const gradeLabel = profile?.grade || '3ero Básico · INSO';

  const [showBreakdown, setShowBreakdown] = useState(false);
  const [selectedDay, setSelectedDay] = useState('vie');
  const [selectedBadge, setSelectedBadge] = useState<BadgeInfo | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeDayData = WEEK_DAYS.find(d => d.key === selectedDay) || WEEK_DAYS[4];

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setToastMessage('Reporte generado: Listo para Licda. Carmen Morales (PDF, 420 KB)');
      setTimeout(() => setToastMessage(null), 4000);
    }, 1200);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mi progreso en Balam Matemática',
        text: `¡Hola! Alcancé 85% de solidez matemática y 5 días de racha en Balam.`,
        url: window.location.href
      }).catch(() => {});
    } else {
      setToastMessage('Enlace de progreso copiado al portapapeles');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col items-center selection:bg-primary-container selection:text-on-primary-container pb-28 pt-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 inset-x-4 max-w-[360px] mx-auto z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fadeIn">
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
          <span className="font-sans text-xs flex-1">{toastMessage}</span>
        </div>
      )}

      {/* Badge Modal */}
      {selectedBadge && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedBadge(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-surface rounded-2xl w-full max-w-[340px] shadow-2xl p-5 relative overflow-hidden border border-outline-variant/40"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
              aria-label="Cerrar modal"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex flex-col items-center text-center mt-2">
              <div className="relative mb-3">
                <div className="w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-[44px]">{selectedBadge.icon}</span>
                </div>
                <div className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${selectedBadge.statusColor}`}>
                  {selectedBadge.statusText}
                </div>
              </div>

              <h3 className="font-serif text-xl font-bold text-on-surface">{selectedBadge.title}</h3>
              <span className="font-mono text-xs text-primary font-bold mt-0.5">{selectedBadge.level}</span>

              <div className="w-full bg-surface-container-low rounded-xl p-3 my-3 text-left border border-outline-variant/30 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">school</span>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-on-surface-variant block font-bold">Criterio Pedagógico</span>
                    <p className="font-sans text-xs text-on-surface mt-0.5">{selectedBadge.criteria}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[16px]">calendar_month</span>
                  <span className="font-sans text-[11px] text-on-surface-variant">{selectedBadge.date}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full min-h-[44px] py-2.5 rounded-xl bg-primary text-on-primary font-mono text-xs font-bold uppercase tracking-wider shadow-sm hover:opacity-95 transition-opacity"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="w-full max-w-[440px] px-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-1.5 self-start px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-tertiary">flare</span>
            <span className="font-mono text-[11px] uppercase tracking-wider font-bold">{gradeLabel}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-1">
            Mi Telar de Aprendizaje
          </h1>
          <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Hola, {studentName}. Cada nudo desatado hace tu conocimiento más firme. ¡Vas con paso seguro!
          </p>
        </div>

        {/* Hero: Urdimbre Dominada (Circular Gauge) */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-outline-variant/40">
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-surface-container-highest">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">auto_stories</span>
              <span className="font-mono text-xs uppercase text-on-surface font-bold tracking-wider">Urdimbre General</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-mono text-[10px] font-bold">
              Nivel Activo
            </span>
          </div>

          <div
            className="flex items-center gap-4 cursor-pointer select-none group"
            onClick={() => setShowBreakdown(!showBreakdown)}
            role="button"
            tabIndex={0}
          >
            {/* Circular Gauge */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  className="text-surface-container-high"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="38"
                  stroke="currentColor"
                  strokeWidth="8"
                />
                <circle
                  className="text-primary transition-all duration-700"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="38"
                  stroke="currentColor"
                  strokeDasharray="238.7"
                  strokeDashoffset="52.5" // 78% of 238.7
                  strokeLinecap="round"
                  strokeWidth="8"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-lg font-bold text-on-surface">78%</span>
                <span className="font-mono text-[8px] uppercase tracking-tighter text-on-surface-variant font-bold">Firme</span>
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span className="font-sans text-sm font-bold text-on-surface">¡Calidad de avance!</span>
              </div>
              <p className="font-sans text-xs text-on-surface-variant line-clamp-2 mt-0.5">
                Tu tejido matemático muestra gran simetría y solidez en razonamiento.
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-primary mt-1 font-bold">
                <span className="material-symbols-outlined text-[14px]">touch_app</span>
                {showBreakdown ? 'Ocultar desglose' : 'Toca el círculo para detalles'}
              </span>
            </div>
          </div>

          {/* Expandable Breakdown */}
          {showBreakdown && (
            <div className="mt-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface animate-fadeIn space-y-1.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-outline-variant/20 mb-1">
                <span className="font-sans font-bold text-on-surface">Detalle de Urdimbre</span>
                <span className="font-mono text-primary font-bold">16 temas evaluados</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  Hilos firmes y dominados:
                </span>
                <strong className="font-mono text-primary">14 temas (87.5%)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                  Hilos en refuerzo guiado:
                </span>
                <strong className="font-mono text-tertiary">2 temas (12.5%)</strong>
              </div>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-surface-container-highest">
            <div className="flex flex-col items-center p-2 rounded-xl bg-surface-container-low text-center">
              <span className="font-mono text-base font-bold text-primary">14</span>
              <span className="font-mono text-[10px] text-on-surface-variant mt-0.5 font-bold">Firmes</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-surface-container-low text-center">
              <span className="font-mono text-base font-bold text-tertiary">2</span>
              <span className="font-mono text-[10px] text-on-surface-variant mt-0.5 font-bold">En refuerzo</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-surface-container-low text-center">
              <span className="font-mono text-base font-bold text-secondary">320</span>
              <span className="font-mono text-[10px] text-on-surface-variant mt-0.5 font-bold">Hilos (pts)</span>
            </div>
          </div>
        </div>

        {/* Evolución en Hilos Críticos */}
        <div className="flex flex-col rounded-2xl bg-white p-4 shadow-sm border border-outline-variant/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                <span className="material-symbols-outlined text-[16px]">tune</span>
              </div>
              <h2 className="font-serif text-sm font-bold text-on-surface">Evolución en Hilos Críticos</h2>
            </div>
            <span className="font-mono text-[11px] text-primary uppercase font-bold tracking-wider">
              ¡Superado!
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low flex flex-col space-y-2 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-on-surface">Jerarquía de Operaciones</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-primary text-on-primary font-bold">
                PEMDAS
              </span>
            </div>

            {/* Before vs After */}
            <div className="flex items-center justify-between text-xs font-mono pt-1 text-on-surface-variant">
              <span className="flex items-center gap-1 text-red-600">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                Antes: 40% (hilo flojo)
              </span>
              <span className="material-symbols-outlined text-primary text-[16px]">arrow_forward</span>
              <span className="flex items-center gap-1 font-bold text-primary">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Hoy: 85% (afianzado)
              </span>
            </div>

            {/* Dual Progress Bar */}
            <div className="relative w-full h-3 rounded-full bg-surface-container-highest overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-700" style={{ width: '85%' }} />
              <div className="absolute inset-y-0 left-0 bg-amber-300 opacity-40 rounded-full" style={{ width: '40%' }} />
            </div>

            <p className="font-sans text-xs text-on-surface-variant pt-1 flex items-start gap-1.5">
              <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">lightbulb</span>
              <span>Superaste el tropiezo con potencias tras 3 sesiones guiadas en la Pizarra Viva.</span>
            </p>
          </div>
        </div>

        {/* Ritmo Semanal (7 días) */}
        <div className="flex flex-col rounded-2xl bg-white p-4 shadow-sm border border-outline-variant/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary-container/40 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              </div>
              <h2 className="font-serif text-sm font-bold text-on-surface">Ritmo de Práctica</h2>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
              <span className="font-mono text-xs font-bold">5 días seguidos</span>
            </div>
          </div>

          {/* 7 Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center" role="tablist">
            {WEEK_DAYS.map(day => {
              const isSelected = selectedDay === day.key;
              return (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => setSelectedDay(day.key)}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-primary text-on-primary ring-2 ring-primary shadow-sm'
                      : day.done
                      ? 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                      : 'bg-surface-container-low text-on-surface-variant opacity-60'
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase font-bold">{day.label}</span>
                  <span className={`material-symbols-outlined text-[16px] mt-1 ${
                    isSelected ? 'text-on-primary' : day.done ? 'text-primary' : 'text-outline-variant'
                  }`}>
                    {day.icon}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Day Detail Box */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">timer</span>
              <div>
                <span className="font-sans text-xs font-bold text-on-surface block">{activeDayData.title}</span>
                <p className="font-sans text-[11px] text-on-surface-variant">{activeDayData.sub}</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-primary text-[18px]">spa</span>
          </div>
        </div>

        {/* Insignias del Telar */}
        <div className="flex flex-col space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[16px]">military_tech</span>
              </div>
              <h2 className="font-serif text-sm font-bold text-on-surface">Insignias del Telar</h2>
            </div>
            <span className="font-mono text-xs text-on-surface-variant font-bold">3 de 4</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {BADGES.map(b => (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBadge(b)}
                className={`text-left flex flex-col p-3 rounded-2xl transition-all border ${
                  b.unlocked
                    ? 'bg-white hover:border-primary/50 shadow-sm border-outline-variant/40 active:scale-[0.98]'
                    : 'bg-surface-container opacity-80 border-dashed border-outline-variant'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    b.unlocked ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-outline-variant'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">{b.icon}</span>
                  </div>
                  <span className={`font-mono text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${b.statusColor}`}>
                    {b.statusText}
                  </span>
                </div>
                <span className="font-sans text-xs font-bold text-on-surface leading-tight">{b.title}</span>
                <p className="font-sans text-[11px] text-on-surface-variant leading-snug mt-1 line-clamp-2">
                  {b.criteria}
                </p>
                <span className="mt-2 text-[10px] font-mono text-primary flex items-center gap-0.5 font-bold">
                  <span className="material-symbols-outlined text-[12px]">visibility</span>
                  Ver detalle
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-primary text-on-primary font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-sm hover:brightness-105 active:scale-[0.98] transition-all"
          >
            {isDownloading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Generando Reporte...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Descargar Reporte para mi Docente (PDF)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white hover:bg-surface-container text-on-surface font-sans text-xs font-bold tracking-wide flex items-center justify-center gap-2 border border-outline-variant/40 transition-colors"
          >
            <span className="material-symbols-outlined text-secondary text-[18px]">share</span>
            <span>Compartir mi avance con mi familia</span>
          </button>

          {onGoToTeacherView && (
            <button
              type="button"
              onClick={onGoToTeacherView}
              className="w-full min-h-[40px] px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-secondary font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">supervisor_account</span>
              <span>Abrir Vista de Docente/Familia</span>
            </button>
          )}

          {onGoToWhiteboard && (
            <button
              type="button"
              onClick={onGoToWhiteboard}
              className="w-full min-h-[40px] px-4 py-2 rounded-xl bg-transparent text-primary hover:bg-primary-container/20 font-mono text-xs font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">draw</span>
              <span>Volver a la Pizarra de Práctica</span>
            </button>
          )}
        </div>

        <TextileRibbon />
      </main>
    </div>
  );
};
