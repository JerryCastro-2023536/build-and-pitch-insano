import React, { useState, useEffect } from 'react';
import { 
  StudentProfile, 
  WhiteboardSession, 
  DiagnosticResult, 
  AdultSummary, 
  MathStep, 
  CanvasStroke 
} from './domain/types';
import { balamRepository } from './persistence/balamRepository';
import { pedagogicalAnalyzerService } from './services/PedagogicalAnalyzerService';
import { Navbar } from './components/layout/Navbar';
import { DemoControlBar } from './components/layout/DemoControlBar';

// 8 Stitch Screens
import { Screen1Registration } from './screens/Screen1Registration';
import { Screen2Whiteboard } from './screens/Screen2Whiteboard';
import { Screen3Diagnostic } from './screens/Screen3Diagnostic';
import { Screen4RemediationPath } from './screens/Screen4RemediationPath';
import { Screen5Reinforcement } from './screens/Screen5Reinforcement';
import { Screen6StudentProgress } from './screens/Screen6StudentProgress';
import { Screen7TeacherParentView } from './screens/Screen7TeacherParentView';
import { Screen8SuccessRepaired } from './screens/Screen8SuccessRepaired';

export const App: React.FC = () => {
  const [currentScreenId, setCurrentScreenId] = useState<number>(1);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [session, setSession] = useState<WhiteboardSession | null>(null);
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [summary, setSummary] = useState<AdultSummary | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Initialize from LocalStorage or pre-load pitch scenario on first visit
  useEffect(() => {
    const savedProfile = balamRepository.getStudentProfile();
    const savedSession = balamRepository.getCurrentSession();
    const savedDiagnostic = balamRepository.getDiagnostic();
    const savedSummary = balamRepository.getAdultSummary();

    if (savedProfile && savedDiagnostic) {
      setProfile(savedProfile);
      setSession(savedSession);
      setDiagnostic(savedDiagnostic);
      setSummary(savedSummary);
    } else {
      // By default load the pitch-ready scenario of Camila Morales so the demo is immediately testable
      const loaded = balamRepository.loadPitchScenario();
      setProfile(loaded.profile);
      setSession(loaded.session);
      setDiagnostic(loaded.diagnostic);
      setSummary(loaded.diagnostic.adultSummary);
    }
  }, []);

  // 1-Click Fast Pitch Scenario Loader
  const handleLoadPitchScenario = () => {
    const loaded = balamRepository.loadPitchScenario();
    setProfile(loaded.profile);
    setSession(loaded.session);
    setDiagnostic(loaded.diagnostic);
    setSummary(loaded.diagnostic.adultSummary);
    setCurrentExerciseIndex(0);
    setCurrentScreenId(2); // Jump straight to Whiteboard
  };

  // Reset Demo to fresh clean state
  const handleResetDemo = () => {
    balamRepository.resetDemo();
    setProfile(null);
    setSession(null);
    setDiagnostic(null);
    setSummary(null);
    setCurrentExerciseIndex(0);
    setCurrentScreenId(1);
  };

  // Screen 1: Registration
  const handleRegister = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    balamRepository.saveStudentProfile(newProfile);
    setCurrentScreenId(2); // Advance to Whiteboard
  };

  // Screen 2: Analyze Student Work
  const handleAnalyzeWork = async (steps: MathStep[], strokes: CanvasStroke[]) => {
    setIsAnalyzing(true);
    try {
      const topic = profile?.selectedTopic || 'ecuacion_cuadratica';
      const diag = await pedagogicalAnalyzerService.analyzeStudentWork({
        problemStatement: session?.problemStatement || 'Resuelve la ecuación cuadrática encontrando el valor de x:',
        initialEquation: session?.initialEquation || '2(x + 3)^2 - 8 = 24',
        topic,
        steps,
        studentProfile: profile
      });

      const updatedSession: WhiteboardSession = {
        id: session?.id || `session-${Date.now()}`,
        studentId: profile?.id || 'guest',
        problemId: session?.problemId || 'prob-1',
        problemStatement: session?.problemStatement || 'Resuelve la ecuación:',
        initialEquation: session?.initialEquation || '2(x + 3)^2 - 8 = 24',
        topic,
        strokes,
        steps,
        status: 'analyzed',
        createdAt: new Date().toISOString()
      };

      setSession(updatedSession);
      setDiagnostic(diag);
      setSummary(diag.adultSummary);

      balamRepository.saveCurrentSession(updatedSession);
      balamRepository.saveDiagnostic(diag);
      balamRepository.saveAdultSummary(diag.adultSummary);

      setCurrentScreenId(3); // Advance to Diagnostic
    } catch (error) {
      console.error('Error analyzing work:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Complete an exercise in Screen 5
  const handleCompleteExercise = (exerciseIndex: number) => {
    if (!diagnostic) return;
    const updatedExercises = [...diagnostic.remediationExercises];
    if (updatedExercises[exerciseIndex]) {
      updatedExercises[exerciseIndex] = {
        ...updatedExercises[exerciseIndex],
        completed: true
      };
      const updatedDiag: DiagnosticResult = {
        ...diagnostic,
        remediationExercises: updatedExercises
      };
      setDiagnostic(updatedDiag);
      balamRepository.saveDiagnostic(updatedDiag);
    }
  };

  // Re-attempt problem on Screen 2 with correct steps
  const handleReattemptOriginalProblem = () => {
    if (!session) return;
    // Load correct steps to demonstrate repaired reasoning
    const correctSteps: MathStep[] = [
      { id: 'c1', stepNumber: 1, expression: '2(x + 3)^2 = 32', annotation: 'Aislar término con potencia' },
      { id: 'c2', stepNumber: 2, expression: '(x + 3)^2 = 16', annotation: 'Dividir entre 2 (¡Respetando jerarquía!)' },
      { id: 'c3', stepNumber: 3, expression: 'x + 3 = ±4', annotation: 'Aplicar raíz cuadrada' },
      { id: 'c4', stepNumber: 4, expression: 'x_1 = 1, x_2 = -7', annotation: 'Soluciones finales verificadas' }
    ];
    const updatedSession: WhiteboardSession = {
      ...session,
      steps: correctSteps,
      status: 'remediated'
    };
    setSession(updatedSession);
    balamRepository.saveCurrentSession(updatedSession);
    setCurrentScreenId(2);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 flex flex-col font-sans">
      {/* Pitch Demo Top Control Bar */}
      <DemoControlBar
        currentStep={currentScreenId}
        onGoToStep={(stepId) => setCurrentScreenId(stepId)}
        onResetDemo={handleResetDemo}
        onLoadPitchScenario={handleLoadPitchScenario}
      />

      {/* Main Header / Screen Switcher Tabs */}
      <Navbar
        currentScreenId={currentScreenId}
        onSelectScreen={(screenId) => setCurrentScreenId(screenId)}
        studentName={profile?.name}
        onResetDemo={handleResetDemo}
        onLoadPitchScenario={handleLoadPitchScenario}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {currentScreenId === 1 && (
          <Screen1Registration
            initialProfile={profile}
            onRegister={handleRegister}
            onQuickLoadPitch={handleLoadPitchScenario}
          />
        )}

        {currentScreenId === 2 && (
          <Screen2Whiteboard
            profile={profile}
            onAnalyzeWork={handleAnalyzeWork}
            isAnalyzing={isAnalyzing}
            onQuickLoadPitch={handleLoadPitchScenario}
          />
        )}

        {currentScreenId === 3 && diagnostic && (
          <Screen3Diagnostic
            diagnostic={diagnostic}
            session={session}
            profile={profile}
            onGoToRemediation={() => setCurrentScreenId(4)}
            onGoBackToWhiteboard={() => setCurrentScreenId(2)}
          />
        )}

        {currentScreenId === 4 && diagnostic && (
          <Screen4RemediationPath
            diagnostic={diagnostic}
            profile={profile}
            onStartExercise={(idx) => {
              setCurrentExerciseIndex(idx);
              setCurrentScreenId(5);
            }}
            onGoToProgress={() => setCurrentScreenId(6)}
          />
        )}

        {currentScreenId === 5 && diagnostic && (
          <Screen5Reinforcement
            diagnostic={diagnostic}
            currentExerciseIndex={currentExerciseIndex}
            onCompleteExercise={handleCompleteExercise}
            onGoToNextExercise={() => setCurrentExerciseIndex((prev) => prev + 1)}
            onGoToSuccessScreen={() => setCurrentScreenId(8)}
          />
        )}

        {currentScreenId === 6 && (
          <Screen6StudentProgress
            profile={profile}
            summary={summary}
            onGoToTeacherView={() => setCurrentScreenId(7)}
            onGoToWhiteboard={() => setCurrentScreenId(2)}
          />
        )}

        {currentScreenId === 7 && (
          <Screen7TeacherParentView
            summary={summary}
            profile={profile}
            onGoToWhiteboard={() => setCurrentScreenId(2)}
          />
        )}

        {currentScreenId === 8 && (
          <Screen8SuccessRepaired
            profile={profile}
            onGoToWhiteboardAgain={handleReattemptOriginalProblem}
            onGoToTeacherView={() => setCurrentScreenId(7)}
          />
        )}
      </main>

      {/* Footer with Guatemalan EdTech metadata */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>🐆 Balam EdTech Guatemala · Proyecto Hackathon 2026</span>
          <span>Alineado a los desafíos PISA 2025 · Menos chat, más análisis del razonamiento</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
