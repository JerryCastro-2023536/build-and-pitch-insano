import { DiagnosticResult, StudentProfile, WhiteboardSession } from './types';

/**
 * Screen identifiers aligned with the Stitch Textiles & Math Design System
 * 1: Bienvenida y Registro Interactivo
 * 2: Mi Camino (Hub interactivo post-registro)
 * 3: Whiteboard de Resolución Interactivo
 * 4: Feedback Visual sobre el Proceso (Análisis de razonamiento)
 * 5: Ruta de Práctica Personalizada (5 nudos de remediación)
 * 6: Material de Apoyo Interactivo (Acordeón PEMDAS y micro-práctica)
 * 7: Mi Progreso Estudiante (Métricas, ritmo y telar de dominio)
 * 8: Vista de Tutor / Padre / Docente (Acompañamiento, alertas y PIN)
 * 9: Base Reparada (Cierre de pitch de impacto: 42% -> 94%)
 */
export type ScreenId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface FlowState {
  currentScreenId: ScreenId;
  profile: StudentProfile | null;
  session: WhiteboardSession | null;
  diagnostic: DiagnosticResult | null;
  currentExerciseIndex: number;
  isAnalyzing: boolean;
}

export type FlowAction =
  | { type: 'NAVIGATE_TO'; screenId: ScreenId }
  | { type: 'REGISTER_STUDENT'; profile: StudentProfile }
  | { type: 'RESET_DEMO' }
  | { type: 'START_ANALYSIS' }
  | { type: 'ANALYSIS_COMPLETED'; payload: { session: WhiteboardSession; diagnostic: DiagnosticResult } }
  | { type: 'ANALYSIS_FAILED' }
  | { type: 'SELECT_EXERCISE'; index: number }
  | { type: 'COMPLETE_EXERCISE'; exerciseIndex: number }
  | { type: 'REPAIR_PITCH_PROBLEM' }
  | { type: 'HYDRATE_STATE'; payload: { profile: StudentProfile | null; session: WhiteboardSession | null; diagnostic: DiagnosticResult | null } };

/**
 * Navigation Guards: ensures user cannot jump to screens requiring prior data
 */
export function getSafeScreenTransition(
  targetScreen: ScreenId,
  state: Pick<FlowState, 'profile' | 'diagnostic' | 'session'>
): ScreenId {
  // If attempting to access diagnostic or remediation without diagnostic result, guide to whiteboard or home
  if ((targetScreen === 4 || targetScreen === 5) && !state.diagnostic) {
    return state.session ? 3 : 2;
  }
  // If attempting to access whiteboard without profile, guide to registration
  if (targetScreen === 3 && !state.profile && !state.session) {
    return 1;
  }
  return targetScreen;
}

/**
 * Pure flow reducer for deterministic state management
 */
export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'NAVIGATE_TO': {
      const safeTarget = getSafeScreenTransition(action.screenId, state);
      return {
        ...state,
        currentScreenId: safeTarget
      };
    }

    case 'REGISTER_STUDENT': {
      return {
        ...state,
        profile: action.profile,
        currentScreenId: 2 // Advance to Mi Camino Hub
      };
    }

    case 'RESET_DEMO': {
      return {
        currentScreenId: 1,
        profile: null,
        session: null,
        diagnostic: null,
        currentExerciseIndex: 0,
        isAnalyzing: false
      };
    }

    case 'START_ANALYSIS': {
      return {
        ...state,
        isAnalyzing: true
      };
    }

    case 'ANALYSIS_COMPLETED': {
      return {
        ...state,
        isAnalyzing: false,
        session: action.payload.session,
        diagnostic: action.payload.diagnostic,
        currentScreenId: 4 // Advance to Feedback Visual
      };
    }

    case 'ANALYSIS_FAILED': {
      return {
        ...state,
        isAnalyzing: false
      };
    }

    case 'SELECT_EXERCISE': {
      return {
        ...state,
        currentExerciseIndex: action.index,
        currentScreenId: 6 // Interactive support / reinforcement
      };
    }

    case 'COMPLETE_EXERCISE': {
      if (!state.diagnostic) return state;
      const updatedExercises = [...state.diagnostic.remediationExercises];
      if (updatedExercises[action.exerciseIndex]) {
        updatedExercises[action.exerciseIndex] = {
          ...updatedExercises[action.exerciseIndex],
          completed: true
        };
      }
      return {
        ...state,
        diagnostic: {
          ...state.diagnostic,
          remediationExercises: updatedExercises
        }
      };
    }

    case 'HYDRATE_STATE': {
      return {
        ...state,
        profile: action.payload.profile,
        session: action.payload.session,
        diagnostic: action.payload.diagnostic,
        currentScreenId: action.payload.profile ? 2 : 1
      };
    }

    case 'REPAIR_PITCH_PROBLEM': {
      if (!state.session) return state;
      return {
        ...state,
        currentScreenId: 3 // Return to whiteboard with repaired state
      };
    }

    default:
      return state;
  }
}
