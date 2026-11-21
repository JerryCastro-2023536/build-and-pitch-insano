import React, { useReducer, useEffect } from 'react';
import { 
  StudentProfile, 
  WhiteboardSession, 
  DiagnosticResult, 
  MathStep, 
  CanvasStroke 
} from './domain/types';
import { ScreenId, FlowState, flowReducer } from './domain/flowStateMachine';
import { balamRepository } from './persistence/balamRepository';
import { pedagogicalAnalyzerService } from './services/PedagogicalAnalyzerService';

import { Navbar } from './components/layout/Navbar';
import { DemoControlBar } from './components/layout/DemoControlBar';
import { BottomNavigation } from './components/layout/BottomNavigation';

// The 9 Modernized Textiles & Math Screens
import { Screen1Registration } from './screens/Screen1Registration';
import { Screen2HomePath } from './screens/Screen2HomePath';
import { Screen3Whiteboard } from './screens/Screen3Whiteboard';
import { Screen4ProcessFeedback } from './screens/Screen4ProcessFeedback';
import { Screen5RemediationRoute } from './screens/Screen5RemediationRoute';
import { Screen6InteractiveSupport } from './screens/Screen6InteractiveSupport';
import { Screen7StudentProgress } from './screens/Screen7StudentProgress';
import { Screen8TeacherParentView } from './screens/Screen8TeacherParentView';
import { Screen9SuccessRepaired } from './screens/Screen9SuccessRepaired';

const initialFlowState: FlowState = {
  currentScreenId: 1,
  profile: null,
  session: null,
  diagnostic: null,
  currentExerciseIndex: 0,
  isAnalyzing: false
};

export const App: React.FC = () => {
  const [state, dispatch] = useReducer(flowReducer, initialFlowState);
  const { currentScreenId, profile, session, diagnostic, isAnalyzing } = state;

  // Initialize from LocalStorage or pre-load pitch scenario on first visit
  useEffect(() => {
    const savedProfile = balamRepository.getStudentProfile();
    const savedSession = balamRepository.getCurrentSession();
    const savedDiagnostic = balamRepository.getDiagnostic();

    if (savedProfile && savedDiagnostic) {
      dispatch({
        type: 'LOAD_PITCH_SCENARIO',
        payload: {
          profile: savedProfile,
          session: savedSession || balamRepository.loadPitchScenario().session,
          diagnostic: savedDiagnostic
        }
      });
    } else {
      // By default load the pitch-ready scenario of Camila Morales so the demo is immediately testable
      const loaded = balamRepository.loadPitchScenario();
      dispatch({
        type: 'LOAD_PITCH_SCENARIO',
        payload: {
          profile: loaded.profile,
          session: loaded.session,
          diagnostic: loaded.diagnostic
        }
      });
    }
  }, []);

  // 1-Click Fast Pitch Scenario Loader
  const handleLoadPitchScenario = () => {
    const loaded = balamRepository.loadPitchScenario();
    dispatch({
      type: 'LOAD_PITCH_SCENARIO',
      payload: {
        profile: loaded.profile,
        session: loaded.session,
        diagnostic: loaded.diagnostic
      }
    });
  };

  // Reset Demo to fresh clean state
  const handleResetDemo = () => {
    balamRepository.resetDemo();
    dispatch({ type: 'RESET_DEMO' });
  };

  // Screen 1: Registration
  const handleRegister = (newProfile: StudentProfile) => {
    balamRepository.saveStudentProfile(newProfile);
    dispatch({ type: 'REGISTER_STUDENT', profile: newProfile });
  };

  // Screen 3: Analyze Student Work
  const handleAnalyzeWork = async (steps: MathStep[], strokes: CanvasStroke[]) => {
    dispatch({ type: 'START_ANALYSIS' });
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
        studentId: profile?.id || 'camila-morales',
        problemId: session?.problemId || 'prob-1',
        problemStatement: session?.problemStatement || 'Resuelve la ecuación cuadrática:',
        initialEquation: session?.initialEquation || '2(x + 3)^2 - 8 = 24',
        topic,
        strokes,
        steps,
        status: 'analyzed',
        createdAt: new Date().toISOString()
      };

      balamRepository.saveCurrentSession(updatedSession);
      balamRepository.saveDiagnostic(diag);
      balamRepository.saveAdultSummary(diag.adultSummary);

      dispatch({
        type: 'ANALYSIS_COMPLETED',
        payload: {
          session: updatedSession,
          diagnostic: diag
        }
      });
    } catch (error) {
      console.error('Error analyzing work:', error);
      dispatch({ type: 'ANALYSIS_FAILED' });
    }
  };

  // Screen 9: Re-attempt problem with repaired reasoning
  const handleReattemptOriginalProblem = () => {
    if (!session) return;
    const correctSteps: MathStep[] = [
      { id: 'c1', stepNumber: 1, expression: '2(x + 3)^2 = 32', annotation: 'Aislar término con potencia (+8)' },
      { id: 'c2', stepNumber: 2, expression: '(x + 3)^2 = 16', annotation: 'Dividir entre 2 (¡Respetando jerarquía PEMDAS!)' },
      { id: 'c3', stepNumber: 3, expression: 'x + 3 = ±4', annotation: 'Aplicar raíz cuadrada a ambos miembros' },
      { id: 'c4', stepNumber: 4, expression: 'x_1 = 1, x_2 = -7', annotation: 'Soluciones finales verificadas' }
    ];
    const updatedSession: WhiteboardSession = {
      ...session,
      steps: correctSteps,
      status: 'remediated'
    };
    balamRepository.saveCurrentSession(updatedSession);
    dispatch({ type: 'REPAIR_PITCH_PROBLEM' });
  };

  const navigateTo = (screenId: ScreenId) => {
    dispatch({ type: 'NAVIGATE_TO', screenId });
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans selection:bg-primary-container selection:text-on-primary-container">
      {/* Pitch Demo Top Control Bar */}
      <DemoControlBar
        currentStep={currentScreenId}
        onGoToStep={navigateTo}
        onResetDemo={handleResetDemo}
        onLoadPitchScenario={handleLoadPitchScenario}
      />

      {/* Main Header / Screen Switcher Tabs */}
      <Navbar
        currentScreenId={currentScreenId}
        onSelectScreen={navigateTo}
        studentName={profile?.name || 'Camila Morales'}
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
          <Screen2HomePath
            profile={profile}
            onGoToWhiteboard={() => navigateTo(3)}
            onGoToProgress={() => navigateTo(7)}
            onGoToTeacherView={() => navigateTo(8)}
          />
        )}

        {currentScreenId === 3 && (
          <Screen3Whiteboard
            profile={profile}
            onAnalyzeWork={handleAnalyzeWork}
            isAnalyzing={isAnalyzing}
            onQuickLoadPitch={handleLoadPitchScenario}
          />
        )}

        {currentScreenId === 4 && diagnostic && (
          <Screen4ProcessFeedback
            diagnostic={diagnostic}
            session={session}
            profile={profile}
            onGoToRemediation={() => navigateTo(5)}
            onGoBackToWhiteboard={() => navigateTo(3)}
            onGoToSupport={() => navigateTo(6)}
          />
        )}

        {currentScreenId === 5 && diagnostic && (
          <Screen5RemediationRoute
            diagnostic={diagnostic}
            profile={profile}
            onStartExercise={(_idx) => navigateTo(6)}
            onGoToProgress={() => navigateTo(7)}
            onGoToWhiteboard={() => navigateTo(3)}
          />
        )}

        {currentScreenId === 6 && (
          <Screen6InteractiveSupport
            onGoToWhiteboard={() => navigateTo(3)}
            onContinueProgress={() => navigateTo(7)}
            onBack={() => navigateTo(5)}
          />
        )}

        {currentScreenId === 7 && (
          <Screen7StudentProgress
            profile={profile}
            onGoToWhiteboard={() => navigateTo(3)}
            onGoToTeacherView={() => navigateTo(8)}
          />
        )}

        {currentScreenId === 8 && (
          <Screen8TeacherParentView
            profile={profile}
            onGoToWhiteboard={() => navigateTo(3)}
            onGoToSuccessRepaired={() => navigateTo(9)}
          />
        )}

        {currentScreenId === 9 && (
          <Screen9SuccessRepaired
            profile={profile}
            onGoToWhiteboardAgain={handleReattemptOriginalProblem}
            onGoToTeacherView={() => navigateTo(8)}
            onGoToHome={() => navigateTo(2)}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation (shown for screens 2 through 8) */}
      {currentScreenId >= 2 && currentScreenId <= 8 && (
        <div className="block sm:hidden">
          <BottomNavigation
            currentScreenId={currentScreenId}
            onNavigate={navigateTo}
          />
        </div>
      )}

      {/* Footer with Guatemalan EdTech metadata */}
      <footer className="border-t border-outline-variant/30 bg-surface-container-low py-4 px-6 text-center text-xs text-on-surface-variant">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono">🐆 Balam EdTech Guatemala · Proyecto Hackathon 2026</span>
          <span className="font-sans">Alineado a los desafíos PISA 2025 · Menos chat, más análisis del razonamiento</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
