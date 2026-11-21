import React, { useState } from 'react';
import { StudentProfile, TopicType } from '../domain/types';
import { BalamJaguarAvatar } from '../components/common/BalamJaguarAvatar';
import { TextileRibbon } from '../components/common/TextileRibbon';

export interface Screen1RegistrationProps {
  initialProfile: StudentProfile | null;
  onRegister: (profile: StudentProfile) => void;
  onQuickLoadPitch: () => void;
}

export const Screen1Registration: React.FC<Screen1RegistrationProps> = ({
  initialProfile,
  onRegister,
  onQuickLoadPitch
}) => {
  const [name, setName] = useState(initialProfile?.name || 'David');
  const [selectedCycle, setSelectedCycle] = useState<'basico' | 'diversificado'>('basico');
  const [selectedAge, setSelectedAge] = useState<number>(initialProfile?.age || 14);
  const [selectedTopic, setSelectedTopic] = useState<TopicType>(
    initialProfile?.selectedTopic || 'jerarquia_operaciones'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const GRADES_BY_CYCLE = {
    basico: [
      { age: 13, grade: '1º Básico' },
      { age: 14, grade: '2º Básico' },
      { age: 15, grade: '3º Básico' }
    ],
    diversificado: [
      { age: 16, grade: '4º Bach' },
      { age: 17, grade: '5º Bach' },
      { age: 18, grade: '6º Perito' }
    ]
  };

  const currentGrade = GRADES_BY_CYCLE[selectedCycle].find(g => g.age === selectedAge)?.grade || '2º Básico';

  const TOPIC_CONFIG: Record<TopicType, { title: string; expr: string; desc: string; tip: string }> = {
    jerarquia_operaciones: {
      title: 'Jerarquía de operaciones',
      expr: '3 + 2 × 4²',
      desc: '• PEMDAS ancestral',
      tip: '¡Jerarquía es ideal para calentar motores hoy y afinar la mente!'
    },
    potencias: {
      title: 'Potencias y Raíces',
      expr: 'x³ • x²',
      desc: '• Suma de exponentes',
      tip: '¡Potencias y raíces refuerzan tu agilidad con leyes de exponentes!'
    },
    ecuacion_cuadratica: {
      title: 'Ecuación cuadrática',
      expr: 'x² - 5x + 6 = 0',
      desc: '• Factorización',
      tip: '¡La ecuación cuadrática te abrirá el camino a parábolas y despeje maya!'
    }
  };

  const handleStart = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setShowConfetti(true);

    setTimeout(() => {
      const profile: StudentProfile = {
        id: initialProfile?.id || `student-${Date.now()}`,
        name: name.trim(),
        age: selectedAge,
        grade: currentGrade,
        school: initialProfile?.school || 'Instituto Nacional Experimental',
        department: initialProfile?.department || 'Guatemala',
        selectedTopic,
        createdAt: initialProfile?.createdAt || new Date().toISOString(),
        avatarSeed: name.toLowerCase().replace(/\s+/g, '')
      };
      onRegister(profile);
    }, 700);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 py-4 sm:py-6 flex flex-col gap-4 relative">
      {/* Quick Pitch Benchmark Banner */}
      <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#f8edd5] border border-[#d7c3ae] text-xs">
        <span className="font-mono text-[10px] text-[#835500] font-bold uppercase tracking-wider">
          Pitch 1-Click: Camila Morales (14a)
        </span>
        <button
          type="button"
          onClick={onQuickLoadPitch}
          className="px-2.5 py-1 rounded-lg bg-[#0D9488] text-white font-mono text-[11px] font-bold shadow-[2px_2px_0px_#201b0d] hover:brightness-105 active:scale-95 transition-all"
        >
          Cargar Caso Estrella
        </button>
      </div>

      {/* Brand & Welcome Section */}
      <header className="flex flex-col items-center text-center pt-1 pb-2">
        <BalamJaguarAvatar size={76} animated className="mb-2 shadow-sm" />
        <span className="font-mono text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-[#625499] text-white tracking-widest mb-1.5 shadow-sm">
          Aprende a tu Ritmo
        </span>
        <h1 className="font-headline text-2xl sm:text-3xl text-[#201b0d] font-bold tracking-tight mb-1">
          ¡Hola! Bienvenido a Balam
        </h1>
        <p className="font-sans text-sm text-[#524534] max-w-xs leading-relaxed">
          Aquí las matemáticas se tejen paso a paso, a tu propio ritmo.
        </p>

        {/* Cinta Bordada Progress Bar */}
        <div className="w-full max-w-xs mt-3 flex flex-col items-center">
          <div className="w-full flex items-center justify-between relative px-4">
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-[#ece2ca] rounded-full z-0">
              <div className="h-full bg-[#f5a623] rounded-full w-1/3 transition-all duration-500" />
            </div>
            {/* Step 1 (Active) */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-7 h-7 rotate-45 bg-[#f5a623] shadow-sm flex items-center justify-center scale-105">
                <span className="-rotate-45 font-mono text-[11px] font-bold text-[#644000]">1</span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#201b0d] font-bold mt-2">
                Quién eres
              </span>
            </div>
            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-6 h-6 rotate-45 bg-[#ece2ca] shadow-sm flex items-center justify-center">
                <span className="-rotate-45 font-mono text-[10px] text-[#524534]">2</span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#524534] mt-2">
                Tu tema
              </span>
            </div>
            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-6 h-6 rotate-45 bg-[#ece2ca] shadow-sm flex items-center justify-center">
                <span className="-rotate-45 font-mono text-[10px] text-[#524534]">3</span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#524534] mt-2">
                Pizarra
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Registration Card */}
      <section className="w-full bg-white rounded-2xl shadow-[4px_4px_0px_#201b0d] border-2 border-[#201b0d] overflow-hidden relative">
        <TextileRibbon height="h-1.5" />

        <form onSubmit={handleStart} className="p-4 sm:p-5 flex flex-col gap-4">
          {/* Input Nombre */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-bold text-sm text-[#201b0d] flex items-center gap-1.5" htmlFor="student-name">
              <span className="material-symbols-outlined text-[#f5a623] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                person
              </span>
              ¿Cómo te llamas?
            </label>
            <div className="relative">
              <input
                id="student-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Camila o David"
                className="w-full h-12 px-3.5 bg-[#fef3db] text-[#201b0d] font-sans text-sm rounded-xl border border-[#d7c3ae] shadow-inner outline-none focus:ring-2 focus:ring-[#f5a623] focus:bg-white transition-all"
                required
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#b90c55] material-symbols-outlined text-xl">
                auto_fix_high
              </span>
            </div>
          </div>

          {/* Selector Ciclo y Nivel Educativo */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-sans font-bold text-sm text-[#201b0d] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#625499] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  cake
                </span>
                ¿Cuántos años tienes?
              </label>

              {/* Botones de Ciclo */}
              <div className="flex items-center gap-1 bg-[#f8edd5] p-0.5 rounded-lg border border-[#d7c3ae]">
                <button
                  type="button"
                  onClick={() => setSelectedCycle('basico')}
                  className={`text-[10px] font-mono font-bold px-2 py-1 rounded transition-all ${selectedCycle === 'basico'
                      ? 'bg-[#625499] text-white shadow-xs'
                      : 'text-[#524534] hover:text-[#201b0d]'
                    }`}
                >
                  Básico
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCycle('diversificado')}
                  className={`text-[10px] font-mono font-bold px-2 py-1 rounded transition-all ${selectedCycle === 'diversificado'
                      ? 'bg-[#625499] text-white shadow-xs'
                      : 'text-[#524534] hover:text-[#201b0d]'
                    }`}
                >
                  Diversificado
                </button>
              </div>
            </div>

            {/* Botones de Grado / Edad */}
            <div className="grid grid-cols-3 gap-2">
              {GRADES_BY_CYCLE[selectedCycle].map((item) => {
                const isSelected = selectedAge === item.age;
                return (
                  <button
                    key={item.age}
                    type="button"
                    onClick={() => setSelectedAge(item.age)}
                    className={`min-h-[48px] py-2 px-1 rounded-xl font-mono text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer active:scale-95 ${isSelected
                        ? 'bg-[#f5a623] text-[#291800] border-2 border-[#201b0d] shadow-[2px_2px_0px_#201b0d] -translate-y-0.5'
                        : 'bg-[#f2e7d0]/70 text-[#201b0d] border border-[#d7c3ae] hover:bg-[#f8edd5]'
                      }`}
                  >
                    <span className="flex items-center gap-1">
                      {item.age} años
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#b90c55]" />}
                    </span>
                    <span className="text-[10px] font-normal text-[#524534]">
                      {item.grade}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mascot Tip Notification Card */}
          <div className="bg-[#e7deff]/40 rounded-xl p-3 flex items-start gap-3 border border-[#c0b1fd]">
            <div className="w-8 h-8 rounded-full bg-[#625499] text-white flex-shrink-0 flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                tips_and_updates
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="font-mono text-xs font-bold text-[#1e0c52]">Tip de Balam</span>
                <span className="font-mono text-[8px] bg-[#b90c55] text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Recomendado
                </span>
              </div>
              <p className="font-sans text-xs text-[#524534] leading-snug">
                {TOPIC_CONFIG[selectedTopic].tip}
              </p>
            </div>
          </div>

          {/* Topic Choice Cards */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-sans font-bold text-sm text-[#201b0d] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#b90c55] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  category
                </span>
                ¿Qué quieres practicar hoy?
              </label>
              <span className="font-mono text-[10px] text-[#b90c55] font-bold">1 seleccionado</span>
            </div>

            <div className="flex flex-col gap-2">
              {(Object.keys(TOPIC_CONFIG) as TopicType[]).map((topicKey) => {
                const config = TOPIC_CONFIG[topicKey];
                const isSelected = selectedTopic === topicKey;
                return (
                  <div
                    key={topicKey}
                    onClick={() => setSelectedTopic(topicKey)}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border-2 ${isSelected
                        ? 'bg-white border-[#f5a623] shadow-[3px_3px_0px_#201b0d] scale-[1.01]'
                        : 'bg-[#fff8f0] border-[#d7c3ae] hover:bg-[#fef3db]'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h3 className="font-sans text-sm text-[#201b0d] font-bold">{config.title}</h3>
                          {isSelected && (
                            <span className="font-mono text-[9px] uppercase tracking-wider bg-[#f5a623] text-[#291800] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#b90c55]" />
                              Seleccionado
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-mono text-xs text-[#b90c55] font-bold">{config.expr}</span>
                          <span className="text-[11px] text-[#524534] font-sans">{config.desc}</span>
                        </div>
                      </div>

                      <div className={`w-6 h-6 rotate-45 flex items-center justify-center shrink-0 border ${isSelected ? 'bg-[#f5a623] border-[#201b0d]' : 'bg-[#f2e7d0] border-[#d7c3ae]'
                        }`}>
                        {isSelected ? (
                          <span className="-rotate-45 material-symbols-outlined text-[#291800] text-sm font-bold">check</span>
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#857462]" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Solar Azafrán CTA Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[50px] bg-[#f5a623] text-[#201b0d] font-mono text-sm uppercase tracking-wider font-bold rounded-xl shadow-[4px_4px_0px_#201b0d] border-2 border-[#201b0d] flex items-center justify-center gap-2 hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#201b0d] transition-all cursor-pointer mt-1"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                <span>Tejiendo tu camino...</span>
              </>
            ) : (
              <>
                <span>Comenzar mi camino</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </>
            )}
          </button>
        </form>
      </section>

      {/* Sello Oficial de la Educación Guatemalteca */}
      <footer className="flex flex-col items-center gap-1 text-[#524534] text-xs text-center pb-2">
        <button
          type="button"
          onClick={() => alert('Ingreso mediante código escolar del CNB / MINEDUC')}
          className="text-[#625499] hover:text-[#b90c55] underline decoration-dotted font-medium"
        >
          ¿Tienes código de tu colegio? Ingresa aquí
        </button>
        <div className="flex items-center gap-1.5 opacity-80 mt-1">
          <span className="material-symbols-outlined text-sm text-[#0D9488]">verified</span>
          <span className="font-mono text-[10px] uppercase tracking-wider">
            MINEDUC • Ciclo Básico Guatemala
          </span>
        </div>
      </footer>
    </div>
  );
};
