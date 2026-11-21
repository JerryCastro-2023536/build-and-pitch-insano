import React, { useState } from 'react';
import { TextileRibbon } from '../components/common/TextileRibbon';

export interface Screen6InteractiveSupportProps {
  onGoToWhiteboard: () => void;
  onContinueProgress?: () => void;
  onBack?: () => void;
}

export const Screen6InteractiveSupport: React.FC<Screen6InteractiveSupportProps> = ({
  onGoToWhiteboard,
  onContinueProgress,
  onBack
}) => {
  // Accordion state (step 2 open by default)
  const [openSteps, setOpenSteps] = useState<Record<number, boolean>>({
    1: false,
    2: true,
    3: false,
    4: false
  });

  // Micro-check state
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [noteSaved, setNoteSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  const toggleStep = (stepNum: number) => {
    setOpenSteps(prev => ({
      ...prev,
      [stepNum]: !prev[stepNum]
    }));
  };

  const handleSelectOption = (opt: number) => {
    setSelectedOpt(opt);
    if (opt === 3) {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 2000);
    }
  };

  const handleSaveNote = () => {
    setNoteSaved(!noteSaved);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col items-center selection:bg-primary-container selection:text-on-primary-container pb-28 pt-4">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 inset-x-0 z-50 flex justify-center pointer-events-none px-4 transition-all duration-300">
          <div className="bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-title-md border border-outline-variant/30">
            <span className="material-symbols-outlined text-emerald-400 text-[18px]">
              {noteSaved ? 'bookmark_check' : 'bookmark_remove'}
            </span>
            <span>{noteSaved ? 'Guardado en tu cuaderno textil' : 'Eliminado de tus notas'}</span>
          </div>
        </div>
      )}

      <main className="w-full max-w-[440px] px-4 flex flex-col gap-5">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack || onGoToWhiteboard}
            className="flex items-center gap-1 text-xs font-bold text-secondary hover:text-primary transition-colors py-1 px-2 rounded-lg hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Volver</span>
          </button>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-mono text-[11px] font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">psychology_alt</span>
            Material de Apoyo Interactivo
          </span>
        </div>

        {/* Status & Context Header */}
        <div className="flex flex-col gap-1.5">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface leading-tight">
            Potencias antes que Sumas y Multiplicaciones
          </h1>
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
            ¡No hay pena! En el tejido numérico, desenredar el hilo es solo cuestión de ritmo: la potencia abraza únicamente al número que tiene pegado.
          </p>
        </div>

        {/* Empathy & Spotlight Card: El Tropiezo Común */}
        <div className="w-full bg-red-50/80 rounded-2xl p-4 shadow-sm flex flex-col gap-3.5 border border-red-200">
          <div className="flex items-center gap-2 text-red-900 font-bold text-xs uppercase tracking-wider font-mono">
            <span className="material-symbols-outlined text-[20px] text-red-600">lightbulb</span>
            <span>El tropiezo común revisado</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* El Error Frecuente */}
            <div className="bg-white rounded-xl p-3 flex flex-col gap-1.5 shadow-sm border border-red-100">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 font-mono text-xs text-red-700 uppercase font-bold">
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                  Lo que pasó (Suma apurada)
                </span>
                <span className="font-mono text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                  3 + 2 × 4²
                </span>
              </div>
              <div className="p-2 rounded-lg bg-red-50 flex flex-wrap items-center gap-2 text-red-600 font-mono text-xs line-through">
                <span>(3 + 2) × 4²</span>
                <span>➔</span>
                <span>5 × 4²</span>
                <span>➔</span>
                <span>80</span>
              </div>
              <p className="font-sans text-xs text-on-surface-variant">
                Sumamos antes de tiempo y dejamos que el 4² se escapara del orden natural.
              </p>
            </div>

            {/* La Regla del Tejedor */}
            <div className="bg-white rounded-xl p-3.5 flex flex-col gap-2 shadow-sm border-2 border-primary/30">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 font-mono text-xs text-primary uppercase font-bold">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  La regla del tejedor
                </span>
                <span className="font-mono text-xs text-on-primary-container bg-primary-container/40 px-2 py-0.5 rounded-full font-bold">
                  Respuesta: 35
                </span>
              </div>
              <div className="flex flex-col gap-1.5 font-mono text-xs text-on-surface">
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-surface-container-low">
                  <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                    1
                  </span>
                  <span className="font-bold text-primary">4² = 16</span>
                  <span className="text-[11px] text-on-surface-variant font-sans">(Potencia manda)</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-surface-container-low">
                  <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                    2
                  </span>
                  <span>2 × 16 = <strong className="text-on-surface">32</strong></span>
                  <span className="text-[11px] text-on-surface-variant font-sans">(Multiplicación junta hilos)</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                    3
                  </span>
                  <span>3 + 32 = <strong className="text-primary text-[14px]">35</strong></span>
                  <span className="text-[11px] text-primary font-bold font-sans">¡Calidad!</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Mnemonic: La Regla del Tejedor Maya (PEMDAS) */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">grid_goldenratio</span>
              La Regla del Tejedor (PEMDAS)
            </h2>
            <span className="font-mono text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
              4 PASOS
            </span>
          </div>
          <p className="font-sans text-xs text-on-surface-variant">
            Todo buen güipil se teje con jerarquía estricta. Toca cualquier paso para explorar su patrón:
          </p>

          {/* Interactive Accordion */}
          <div className="flex flex-col gap-2">
            {/* Paso 1: Marcos del Telar */}
            <div
              className={`rounded-xl p-3 flex flex-col gap-2 shadow-sm transition-all duration-200 cursor-pointer border ${
                openSteps[1] ? 'bg-white border-outline-variant/60' : 'bg-surface-container-lowest border-transparent hover:border-outline-variant/40'
              }`}
              onClick={() => toggleStep(1)}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0 font-mono font-bold">
                    ( )
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-on-surface-variant uppercase font-bold">Paso 1</span>
                      <span className="font-sans text-sm font-bold text-on-surface">Marcos del Telar</span>
                    </div>
                    <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                      Paréntesis, corchetes y llaves que aíslan secciones completas.
                    </p>
                  </div>
                </div>
                <span className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-300 ${openSteps[1] ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </div>
              {openSteps[1] && (
                <div className="pt-2 border-t border-surface-container mt-1 flex flex-col gap-1.5 text-xs">
                  <div className="bg-surface-container-low rounded-lg p-2.5 font-sans text-on-surface">
                    <span className="font-bold text-secondary flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-[15px]">tips_and_updates</span>
                      Regla práctica:
                    </span>
                    <span>Primero desata lo que esté más adentro del paréntesis:</span>
                    <div className="bg-white p-2 rounded mt-1 font-mono text-primary font-bold border border-outline-variant/30">
                      5 × (4 + 3) = 5 × 7 = 35
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Paso 2: Las Coronas de Oro (Focus) */}
            <div
              className={`rounded-xl p-3.5 flex flex-col gap-2 shadow-md relative overflow-hidden transition-all duration-200 cursor-pointer border-2 ${
                openSteps[2]
                  ? 'bg-amber-50/70 border-primary shadow-amber-900/5'
                  : 'bg-white border-primary/40 hover:border-primary'
              }`}
              onClick={() => toggleStep(2)}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">hotel_class</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] text-primary uppercase font-bold">Paso 2</span>
                      <span className="font-sans text-sm font-bold text-on-surface">Las Coronas de Oro</span>
                      <span className="bg-primary text-on-primary font-mono text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                        Foco de tu repaso
                      </span>
                    </div>
                    <p className="font-sans text-xs text-on-surface font-semibold mt-1">
                      Exponentes (potencias) y raíces. Se calculan antes que cualquier multiplicación o suma.
                    </p>
                  </div>
                </div>
                <span className={`material-symbols-outlined text-[20px] text-primary transition-transform duration-300 ${openSteps[2] ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </div>
              {openSteps[2] && (
                <div className="pt-2 border-t border-primary/20 mt-1 flex flex-col gap-2">
                  <div className="bg-white rounded-lg p-2 font-mono text-xs text-primary flex items-center gap-2 border border-primary/20 shadow-inner">
                    <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                    <span>2 × <strong>4²</strong> ➔ 2 × <strong>16</strong> = <strong>32</strong></span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant font-sans italic">
                    ★ Recuerda: La potencia no multiplica al 2, solo eleva al 4.
                  </p>
                </div>
              )}
            </div>

            {/* Paso 3: Los Hilos Gemelos */}
            <div
              className={`rounded-xl p-3 flex flex-col gap-2 shadow-sm transition-all duration-200 cursor-pointer border ${
                openSteps[3] ? 'bg-white border-outline-variant/60' : 'bg-surface-container-lowest border-transparent hover:border-outline-variant/40'
              }`}
              onClick={() => toggleStep(3)}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0 font-mono font-bold">
                    × ÷
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-on-surface-variant uppercase font-bold">Paso 3</span>
                      <span className="font-sans text-sm font-bold text-on-surface">Los Hilos Gemelos</span>
                    </div>
                    <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                      Multiplicaciones y divisiones al mismo nivel, avanzando de izquierda a derecha.
                    </p>
                  </div>
                </div>
                <span className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-300 ${openSteps[3] ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </div>
              {openSteps[3] && (
                <div className="pt-2 border-t border-surface-container mt-1 flex flex-col gap-1.5 text-xs">
                  <div className="bg-surface-container-low rounded-lg p-2.5 font-sans text-on-surface">
                    <span className="font-bold text-secondary flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-[15px]">swap_horiz</span>
                      De izquierda a derecha:
                    </span>
                    <div className="bg-white p-2 rounded mt-1 font-mono text-on-surface font-medium border border-outline-variant/30">
                      12 ÷ 3 × 2 ➔ 4 × 2 = <strong className="text-primary font-bold">8</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Paso 4: El Remate Final */}
            <div
              className={`rounded-xl p-3 flex flex-col gap-2 shadow-sm transition-all duration-200 cursor-pointer border ${
                openSteps[4] ? 'bg-white border-outline-variant/60' : 'bg-surface-container-lowest border-transparent hover:border-outline-variant/40'
              }`}
              onClick={() => toggleStep(4)}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0 font-mono font-bold">
                    + −
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-on-surface-variant uppercase font-bold">Paso 4</span>
                      <span className="font-sans text-sm font-bold text-on-surface">El Remate Final</span>
                    </div>
                    <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                      Sumas y restas unen todos los tramos al puro final.
                    </p>
                  </div>
                </div>
                <span className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-300 ${openSteps[4] ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </div>
              {openSteps[4] && (
                <div className="pt-2 border-t border-surface-container mt-1 flex flex-col gap-1.5 text-xs">
                  <div className="bg-surface-container-low rounded-lg p-2.5 font-sans text-on-surface">
                    <span className="font-bold text-secondary flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-[15px]">done_all</span>
                      El cierre del telar:
                    </span>
                    <p>Ninguna suma o resta se anticipa hasta haber resuelto potencias y productos.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Micro-Check / Práctica Guiada */}
        <div className="w-full bg-surface-container-low rounded-2xl p-4 shadow-sm flex flex-col gap-3 relative overflow-hidden border border-outline-variant/40">
          {confettiActive && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20 overflow-hidden">
              <div className="animate-ping w-48 h-48 rounded-full bg-primary/20" />
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 font-mono text-xs text-tertiary uppercase font-bold">
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
              Prueba rápida de hilo
            </span>
            <span className="font-mono text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
              1 pregunta
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-sans text-sm font-bold text-on-surface">¿Cuál resolverías primero aquí?</p>
            <div className="bg-white py-2.5 px-4 rounded-xl text-center shadow-inner my-1 border border-outline-variant/30">
              <span className="font-mono text-base font-bold text-on-surface tracking-wide">
                7 + 3(2³)
              </span>
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-2">
            {/* Option 1 */}
            <button
              type="button"
              onClick={() => handleSelectOption(1)}
              className={`w-full text-left p-3 rounded-xl transition-all border-2 flex flex-col gap-1.5 ${
                selectedOpt === 1
                  ? 'bg-red-50 border-red-400'
                  : 'bg-white border-transparent hover:border-outline-variant/50 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                    selectedOpt === 1 ? 'border-red-600 bg-red-100 text-red-600' : 'border-outline-variant'
                  }`}>
                    {selectedOpt === 1 && <span className="w-2 h-2 rounded-full bg-red-600" />}
                  </div>
                  <span className="font-mono text-xs font-semibold text-on-surface">7 + 3 = 10</span>
                </div>
                {selectedOpt === 1 && (
                  <span className="material-symbols-outlined text-[18px] text-red-600">error</span>
                )}
              </div>
              {selectedOpt === 1 && (
                <div className="p-2 rounded-lg bg-red-100/60 text-red-900 text-xs font-sans flex items-start gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-[16px] text-red-600 shrink-0">priority_high</span>
                  <span><strong>Hilo suelto:</strong> ¡Cuidado! La suma (+3) debe esperar. El 3 está pegado al paréntesis multiplicando y hay una potencia pendiente.</span>
                </div>
              )}
            </button>

            {/* Option 2 */}
            <button
              type="button"
              onClick={() => handleSelectOption(2)}
              className={`w-full text-left p-3 rounded-xl transition-all border-2 flex flex-col gap-1.5 ${
                selectedOpt === 2
                  ? 'bg-red-50 border-red-400'
                  : 'bg-white border-transparent hover:border-outline-variant/50 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                    selectedOpt === 2 ? 'border-red-600 bg-red-100 text-red-600' : 'border-outline-variant'
                  }`}>
                    {selectedOpt === 2 && <span className="w-2 h-2 rounded-full bg-red-600" />}
                  </div>
                  <span className="font-mono text-xs font-semibold text-on-surface">3 × 2 = 6</span>
                </div>
                {selectedOpt === 2 && (
                  <span className="material-symbols-outlined text-[18px] text-red-600">error</span>
                )}
              </div>
              {selectedOpt === 2 && (
                <div className="p-2 rounded-lg bg-red-100/60 text-red-900 text-xs font-sans flex items-start gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-[16px] text-red-600 shrink-0">priority_high</span>
                  <span><strong>Corona manda:</strong> La potencia 2³ abraza a la base antes de multiplicarse con el 3 exterior. ¡Primero eleva la potencia!</span>
                </div>
              )}
            </button>

            {/* Option 3 (Correct) */}
            <button
              type="button"
              onClick={() => handleSelectOption(3)}
              className={`w-full text-left p-3 rounded-xl transition-all border-2 flex flex-col gap-1.5 ${
                selectedOpt === 3
                  ? 'bg-emerald-50 border-emerald-500 shadow-md'
                  : 'bg-white border-transparent hover:border-outline-variant/50 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                    selectedOpt === 3 ? 'border-emerald-600 bg-emerald-100 text-emerald-600' : 'border-outline-variant'
                  }`}>
                    {selectedOpt === 3 && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                  </div>
                  <span className="font-mono text-xs font-bold text-on-surface">
                    2³ = 8 <span className="text-primary font-normal">(¡La potencia manda!)</span>
                  </span>
                </div>
                {selectedOpt === 3 && (
                  <span className="material-symbols-outlined text-[20px] text-emerald-600 font-bold">check_circle</span>
                )}
              </div>
            </button>
          </div>

          {/* Celebration Feedback Banner */}
          {selectedOpt === 3 && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-950 border border-emerald-200 flex items-start gap-2.5 mt-1 animate-fadeIn">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-xs text-emerald-900 flex items-center gap-1">
                  ¡Bárbaro! Así se hace. 🎉
                </span>
                <p className="font-sans text-xs text-emerald-900 leading-relaxed">
                  Elevas <strong className="font-mono font-bold text-primary">2³ = 8</strong>, luego multiplicas <strong className="font-mono">3 × 8 = 24</strong>, y al final sumas <strong className="font-mono">7 + 24 = 31</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Balam Advisor Card */}
        <div className="p-3 bg-surface-container-low rounded-xl flex items-center gap-3 border border-outline-variant/30 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
            <span className="material-symbols-outlined text-[22px]">pets</span>
          </div>
          <p className="font-sans text-xs text-on-surface-variant leading-snug">
            <strong className="text-on-surface">Consejo de Balam:</strong> Cuando veas un exponente arriba de un número, imaginalo como un imán bien apretado. Nadie lo puede separar hasta que lo operes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={onGoToWhiteboard}
            className="w-full min-h-[48px] px-4 py-3 bg-primary text-on-primary font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md hover:brightness-105 active:scale-[0.99] transition-all font-sans"
          >
            <span>Ir a Pizarra a Resolver con Pista</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          {onContinueProgress && (
            <button
              onClick={onContinueProgress}
              className="w-full min-h-[44px] px-4 py-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold text-xs rounded-xl flex items-center justify-center gap-2 border border-outline-variant/40 transition-colors"
            >
              <span className="material-symbols-outlined text-secondary text-[18px]">bar_chart</span>
              <span>Ver mi progreso acumulado</span>
            </button>
          )}

          <button
            onClick={handleSaveNote}
            className="w-full min-h-[40px] px-4 py-2 bg-transparent text-secondary font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-secondary-container/20 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">
              {noteSaved ? 'bookmark_remove' : 'bookmark_add'}
            </span>
            <span>{noteSaved ? 'Eliminar de mis notas' : 'Guardar en mis notas de apoyo'}</span>
          </button>
        </div>

        <TextileRibbon />
      </main>
    </div>
  );
};
