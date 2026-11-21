import React, { useState } from 'react';
import { MathStep, CanvasStroke, StudentProfile } from '../domain/types';
import { CURRICULUM_PROBLEMS } from '../domain/curriculum';
import { DrawingCanvas } from '../components/whiteboard/DrawingCanvas';
import { StepByStepEditor } from '../components/whiteboard/StepByStepEditor';
import { MathKeypad } from '../components/whiteboard/MathKeypad';
import { Icons } from '../components/common/Icons';

export interface Screen2WhiteboardProps {
  profile: StudentProfile | null;
  onAnalyzeWork: (steps: MathStep[], strokes: CanvasStroke[]) => Promise<void>;
  isAnalyzing: boolean;
  onQuickLoadPitch: () => void;
}

export const Screen2Whiteboard: React.FC<Screen2WhiteboardProps> = ({
  profile,
  onAnalyzeWork,
  isAnalyzing,
  onQuickLoadPitch
}) => {
  // Select problem based on student's topic, default to quadratic equation (demo pitch)
  const topic = profile?.selectedTopic || 'ecuacion_cuadratica';
  const problem = CURRICULUM_PROBLEMS.find((p) => p.topic === topic) || CURRICULUM_PROBLEMS[0];

  const [steps, setSteps] = useState<MathStep[]>(problem.typicalErrorSteps);
  const [strokes, setStrokes] = useState<CanvasStroke[]>([]);
  const [activeTab, setActiveTab] = useState<'both' | 'canvas' | 'steps'>('both');

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

  const handleRunAnalysis = () => {
    onAnalyzeWork(steps, strokes);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* Screen Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Pantalla 2 / 8 · Stitch ID: cf0147a5
          </span>
          <span className="text-xs text-slate-400">Paso 2 del Flujo Demo · Whiteboard Digital</span>
        </div>

        {/* View Layout Tabs for Laptop / Projector */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('both')}
            className={`px-2.5 py-1 rounded font-medium transition ${activeTab === 'both' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Vista Dividida (Lienzo + Pasos)
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-2.5 py-1 rounded font-medium transition ${activeTab === 'steps' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Solo Pasos
          </button>
          <button
            onClick={() => setActiveTab('canvas')}
            className={`px-2.5 py-1 rounded font-medium transition ${activeTab === 'canvas' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Solo Lienzo
          </button>
        </div>
      </div>

      {/* Problem Statement Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              {problem.difficulty}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">{problem.title}</span>
          </div>
          <p className="text-sm text-slate-200 font-medium">{problem.statement}</p>
        </div>

        {/* Equation Badge */}
        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-indigo-500/40 text-indigo-200 font-mono text-base font-extrabold shadow-inner">
          {problem.equation}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Freehand Canvas */}
        {(activeTab === 'both' || activeTab === 'canvas') && (
          <div className={`${activeTab === 'both' ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-3`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <Icons.PenTool className="w-3.5 h-3.5 text-indigo-400" />
                <span>Lienzo Digital (Trazo y Escritura Manuscrita)</span>
              </h3>
              <span className="text-[11px] text-slate-500">Soporta touch & mouse</span>
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

      {/* Bottom pedagogical differentiator notice */}
      <div className="mt-6 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
        💡 <span className="font-semibold text-slate-300">Diferenciador Pedagógico Balam:</span> NO es un chatbot libre que da la respuesta. Analiza la validez matemática de cada transformación paso a paso.
      </div>
    </div>
  );
};
