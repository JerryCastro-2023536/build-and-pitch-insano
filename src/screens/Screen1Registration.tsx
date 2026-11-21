import React, { useState } from 'react';
import { StudentProfile, TopicType } from '../domain/types';
import { Icons } from '../components/common/Icons';

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
  const [name, setName] = useState(initialProfile?.name || '');
  const [age, setAge] = useState<number>(initialProfile?.age || 14);
  const [grade, setGrade] = useState(initialProfile?.grade || '3ero Básico');
  const [school, setSchool] = useState(initialProfile?.school || 'Instituto Nacional Central');
  const [department, setDepartment] = useState(initialProfile?.department || 'Guatemala');
  const [selectedTopic, setSelectedTopic] = useState<TopicType>(
    initialProfile?.selectedTopic || 'ecuacion_cuadratica'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const profile: StudentProfile = {
      id: initialProfile?.id || `student-${Date.now()}`,
      name: name.trim(),
      age,
      grade,
      school,
      department,
      selectedTopic,
      createdAt: initialProfile?.createdAt || new Date().toISOString(),
      avatarSeed: name.toLowerCase().replace(/\s+/g, '')
    };
    onRegister(profile);
  };

  const TOPICS: { id: TopicType; title: string; desc: string; icon: string; badge: string }[] = [
    {
      id: 'ecuacion_cuadratica',
      title: 'Ecuación Cuadrática',
      desc: 'Resolución de ecuaciones de 2do grado por despeje, factorización y fórmula general.',
      icon: '📐',
      badge: '3ero Básico'
    },
    {
      id: 'potencias',
      title: 'Potencias y Signos',
      desc: 'Operaciones combinadas con exponentes, leyes de exponentes y jerarquía de signos.',
      icon: '⚡',
      badge: '2do Básico'
    },
    {
      id: 'jerarquia_operaciones',
      title: 'Jerarquía de Operaciones (PEMDAS)',
      desc: 'Prioridad de operadores: Paréntesis, Exponentes, Multiplicación, División, Sumas.',
      icon: '🏛️',
      badge: '1ro Básico'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Hero Badge & Stitch Screen Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Pantalla 1 / 8 · Stitch ID: d6f04a15
          </span>
          <span className="text-xs text-slate-400">Paso 1 del Flujo Demo</span>
        </div>

        {/* 1-Click Pitch Scenario Button */}
        <button
          type="button"
          onClick={onQuickLoadPitch}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition shadow-sm"
        >
          <Icons.Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Cargar Escenario Pitch (Camila Morales - 14 años)</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <Icons.BalamLogo className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Registro Inicial de Práctica
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Plataforma de diagnóstico del razonamiento matemático para estudiantes de 13 a 15 años en Guatemala.
              </p>
            </div>
          </div>
        </div>

        {/* Context PISA 2025 Guatemala Alert */}
        <div className="bg-indigo-950/40 border border-indigo-800/60 rounded-xl p-4 mb-6 flex items-start space-x-3 text-xs text-indigo-200">
          <Icons.School className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-white">Contexto Nacional (PISA 2025): </span>
            Solo el 8% de los jóvenes de 15 años en Guatemala alcanzan el nivel mínimo de matemáticas. 
            Balam no juzga la respuesta final: observa el proceso en el whiteboard para detectar vacíos de 1ro básico que bloquean el aprendizaje actual.
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Nombre del Estudiante *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Camila Morales"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition pl-10"
                />
                <Icons.User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Edad (Público Objetivo 13 a 15 años) *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[13, 14, 15].map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAge(a)}
                    className={`py-2 rounded-xl text-sm font-bold border transition ${
                      age === a
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {a} años
                  </button>
                ))}
              </div>
            </div>

            {/* Grade */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Grado Escolar
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="1ro Básico">1ro Básico</option>
                <option value="2do Básico">2do Básico</option>
                <option value="3ero Básico">3ero Básico</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Departamento (Guatemala)
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="Guatemala">Guatemala</option>
                <option value="Quetzaltenango">Quetzaltenango</option>
                <option value="Sacatepéquez">Sacatepéquez</option>
                <option value="Alta Verapaz">Alta Verapaz</option>
                <option value="Chimaltenango">Chimaltenango</option>
                <option value="Escuintla">Escuintla</option>
              </select>
            </div>
          </div>

          {/* Topic Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Selecciona el Tema a Practicar (Temas del MVP) *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {TOPICS.map((t) => {
                const isSelected = selectedTopic === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTopic(t.id)}
                    className={`cursor-pointer rounded-xl p-4 border transition relative ${
                      isSelected
                        ? 'bg-indigo-950/50 border-indigo-500 shadow-lg shadow-indigo-950 ring-2 ring-indigo-500/50'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{t.icon}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {t.badge}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white mb-1">{t.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-snug">{t.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition flex items-center justify-center space-x-2"
            >
              <span>Abrir Pizarra Digital y Resolver Problema</span>
              <Icons.ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
