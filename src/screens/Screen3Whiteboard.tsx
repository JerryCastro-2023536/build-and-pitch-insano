import React, { useState } from 'react';
import { MathStep, CanvasStroke, StudentProfile } from '../domain/types';
import { CURRICULUM_PROBLEMS } from '../domain/curriculum';
import { DrawingCanvas } from '../components/whiteboard/DrawingCanvas';
import { StepByStepEditor } from '../components/whiteboard/StepByStepEditor';
import { MathKeypad } from '../components/whiteboard/MathKeypad';
import { TextileRibbon } from '../components/common/TextileRibbon';

export interface Screen3WhiteboardProps {
  profile: StudentProfile | null;
  onAnalyzeWork: (steps: MathStep[], strokes: CanvasStroke[]) => Promise<void>;
  isAnalyzing: boolean;
  onQuickLoadPitch: () => void;
}

export const Screen3Whiteboard: React.FC<Screen3WhiteboardProps> = ({
  profile,
  onAnalyzeWork,
  isAnalyzing,
  onQuickLoadPitch
}) => {
  const topic = profile?.selectedTopic || 'ecuacion_cuadratica';
  const problem = CURRICULUM_PROBLEMS.find((p) => p.topic === topic) || CURRICULUM_PROBLEMS[0];

  const [steps, setSteps] = useState<MathStep[]>(problem.typicalErrorSteps);
  const [strokes, setStrokes] = useState<CanvasStroke[]>([]);
  const [activeTab, setActiveTab] = useState<'both' | 'canvas' | 'steps'>('both');
  const [showHint, setShowHint] = useState<boolean>(false);

  const handleSimulateError = () => {
    setSteps(problem.typicalErrorSteps);
  };

  const handleSimulateCorrect = () => {
    setSteps(problem.correctSteps);
  };

  const handleInsertSymbol = (symbol: string) => {
    if (steps.length === 0) return;
    const lastIndex = steps.length - 1;
    const current = steps[lastIndex];
    const updated = [...steps];
    updated[lastIndex] = {
      ...current,
      expression: (current.expression || '') + symbol
    };
    setSteps(updated);
  };

  const handleAutoTraceStep = () => {
    // Adds or replaces the next step with proper isolated power
    const updated = [...steps];
    if (updated.length >= 3) {
      updated[2] = {
        ...updated[2],
        expression: '(x + 3)^2 = 16',
        annotation: 'Dividir entre 2 respetando la jerarquía (¡Sin multiplicar hacia adentro!)',
        isIncorrectStep: false
      };
      setSteps(updated);
    }
    setShowHint(false);
  };

  const handleRunAnalysis = () => {
    onAnalyzeWork(steps, strokes);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-6 flex flex-col gap-4">
      {/* Encabezado del Ejercicio */}
      <section className="bg-white rounded-2xl border-2 border-[#201b0d] shadow-[4px_4px_0px_#201b0d] p-4 flex flex-col gap-3 relative overflow-hidden">
        <TextileRibbon height="h-1.5" />

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#b90c55] animate-pulse" />
            <span className="font-mono text-xs text-[#b90c55] uppercase font-bold tracking-wider">
              {problem.title} • {problem.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher for Tablets / Laptops */}
            <div className="hidden sm:flex items-center gap-1 bg-[#f8edd5] p-1 rounded-xl border border-[#d7c3ae] text-xs font-mono font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('both')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeTab === 'both' ? 'bg-[#1e1548] text-white shadow-xs' : 'text-[#524534] hover:text-[#201b0d]'
                }`}
              >
                Vista Dividida
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('canvas')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeTab === 'canvas' ? 'bg-[#1e1548] text-white shadow-xs' : 'text-[#524534] hover:text-[#201b0d]'
                }`}
              >
                Cuaderno
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('steps')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeTab === 'steps' ? 'bg-[#1e1548] text-white shadow-xs' : 'text-[#524534] hover:text-[#201b0d]'
                }`}
              >
                Pasos
              </button>
            </div>

            {/* Quick Pitch Loader */}
            <button
              type="button"
              onClick={onQuickLoadPitch}
              className="px-2.5 py-1 rounded-lg bg-[#e7deff] text-[#4e4184] hover:bg-[#cbbeff] border border-[#625499]/40 font-mono text-[10px] font-bold shadow-xs active:scale-95"
            >
              Cargar Camila (Pitch)
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="font-sans text-xs text-[#524534]">Enunciado:</span>
            <p className="font-sans font-bold text-sm sm:text-base text-[#201b0d]">
              {problem.statement}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Formula Pill */}
            <div className="bg-[#fef3db] border-2 border-[#201b0d] px-3.5 py-1.5 rounded-xl font-mono text-base font-bold text-[#201b0d] shadow-[2px_2px_0px_#201b0d]">
              {problem.equation}
            </div>

            {/* Hint Button */}
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="min-h-[44px] px-3 rounded-xl bg-[#f8edd5] text-[#835500] hover:bg-[#f2e7d0] border border-[#d7c3ae] font-mono text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">lightbulb</span>
              <span>Pista</span>
            </button>
          </div>
        </div>

        {/* Pista Guiada Interactiva: Regla del Tejedor */}
        {showHint && (
          <div className="bg-[#fef5e6] text-[#633f00] border-2 border-[#f5a623] rounded-xl p-3.5 flex flex-col gap-2 shadow-sm animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#f5a623] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[11px] text-[#835500] uppercase font-bold tracking-wider">
                  Regla del Tejedor: ¿Qué hilo desatar primero?
                </span>
                <p className="font-sans text-xs sm:text-sm leading-snug text-[#422c00]">
                  ¡Primero la potencia! La urdimbre matemática exige aislar los exponentes dividiendo antes de intentar multiplicar hacia adentro: <strong className="bg-white/80 px-1.5 py-0.5 rounded text-[#835500] border border-[#f3cca0] font-mono">2(x+3)² = 32 → (x+3)² = 16</strong>.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#f4dfb8]">
              <button
                type="button"
                onClick={handleAutoTraceStep}
                className="min-h-[36px] px-3 rounded-lg bg-white border border-[#d7c3ae] text-[#835500] hover:bg-[#fdf0d9] text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-sm text-[#b90c55]">draw</span>
                <span>Auto-trazar corrección de Paso 3</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: Cuaderno de Dibujo / Lienzo Libre */}
        {(activeTab === 'both' || activeTab === 'canvas') && (
          <div className={`${activeTab === 'both' ? 'lg:col-span-6' : 'lg:col-span-12'} flex flex-col gap-3`}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#524534] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-[#0D9488]">draw</span>
                Cuaderno Táctil (Lápiz y Tintas Textiles)
              </span>
              <span className="font-mono text-[10px] text-[#857462]">Touch, Stylus y Mouse</span>
            </div>

            <DrawingCanvas
              initialStrokes={strokes}
              onStrokesChange={setStrokes}
            />

            <MathKeypad onInsertSymbol={handleInsertSymbol} />
          </div>
        )}

        {/* Right: Step By Step Mathematical Transformations */}
        {(activeTab === 'both' || activeTab === 'steps') && (
          <div className={`${activeTab === 'both' ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
            <StepByStepEditor
              steps={steps}
              onStepsChange={setSteps}
              onSimulateError={handleSimulateError}
              onSimulateCorrect={handleSimulateCorrect}
              onAnalyze={handleRunAnalysis}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}
      </div>

      {/* Diferenciador Pedagógico */}
      <footer className="p-3 rounded-xl bg-[#f8edd5] border border-[#d7c3ae] text-center text-xs text-[#524534] font-sans">
        💡 <strong className="text-[#201b0d]">Diferenciador Pedagógico Balam:</strong> No es un chatbot conversacional que resuelve la tarea. Analiza el proceso deductivo paso a paso para aislar la base débil exacta.
      </footer>
    </div>
  );
};
