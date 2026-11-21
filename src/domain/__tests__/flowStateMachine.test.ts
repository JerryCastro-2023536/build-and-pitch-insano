import { describe, it, expect } from 'vitest';
import { flowReducer, FlowState, getSafeScreenTransition } from '../flowStateMachine';
import { CURRICULUM_PROBLEMS } from '../curriculum';
import { evaluateOffline } from '../../services/offlineEvaluator';

describe('Flow State Machine and Reducer', () => {
  const initialProblem = CURRICULUM_PROBLEMS[0];
  const mockDiagnostic = evaluateOffline({
    problemStatement: initialProblem.statement,
    initialEquation: initialProblem.equation,
    topic: initialProblem.topic,
    steps: initialProblem.typicalErrorSteps,
    studentProfile: null
  });

  const baseState: FlowState = {
    currentScreenId: 1,
    profile: null,
    session: null,
    diagnostic: null,
    currentExerciseIndex: 0,
    isAnalyzing: false
  };

  it('prevents navigation to Diagnostic (4) or Remediation (5) without an active diagnostic', () => {
    const safeTarget4 = getSafeScreenTransition(4, baseState);
    expect(safeTarget4).toBe(2);

    const safeTarget5 = getSafeScreenTransition(5, baseState);
    expect(safeTarget5).toBe(2);
  });

  it('allows navigation to Diagnostic (4) once diagnostic is present', () => {
    const stateWithDiag: FlowState = {
      ...baseState,
      diagnostic: mockDiagnostic
    };
    const safeTarget = getSafeScreenTransition(4, stateWithDiag);
    expect(safeTarget).toBe(4);
  });

  it('transitions to Mi Camino (Screen 2) upon registration', () => {
    const profile = {
      id: 'stud-1',
      name: 'Sofía',
      age: 14,
      grade: '3ero Básico',
      school: 'Colegio',
      department: 'Quetzaltenango',
      selectedTopic: 'ecuacion_cuadratica' as const,
      createdAt: '2026-01-01',
      avatarSeed: 'sofia'
    };

    const nextState = flowReducer(baseState, {
      type: 'REGISTER_STUDENT',
      profile
    });

    expect(nextState.currentScreenId).toBe(2);
    expect(nextState.profile?.name).toBe('Sofía');
  });

  it('resets all state on RESET_DEMO action', () => {
    const activeState: FlowState = {
      currentScreenId: 7,
      profile: { id: '1', name: 'Test' } as any,
      session: { id: 's1' } as any,
      diagnostic: mockDiagnostic,
      currentExerciseIndex: 2,
      isAnalyzing: false
    };

    const resetState = flowReducer(activeState, { type: 'RESET_DEMO' });

    expect(resetState.currentScreenId).toBe(1);
    expect(resetState.profile).toBeNull();
    expect(resetState.session).toBeNull();
    expect(resetState.diagnostic).toBeNull();
  });
});
