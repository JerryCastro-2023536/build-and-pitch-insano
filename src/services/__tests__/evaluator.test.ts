import { describe, it, expect } from 'vitest';
import { evaluateOffline } from '../offlineEvaluator';
import { PedagogicalAnalyzerService } from '../PedagogicalAnalyzerService';
import { CURRICULUM_PROBLEMS } from '../../domain/curriculum';

describe('Balam Pedagogical Evaluator Engine', () => {
  it('correctly diagnoses multi-step quadratic scenario (Error at Step 3: PEMDAS)', () => {
    const quadraticProblem = CURRICULUM_PROBLEMS[0];
    const result = evaluateOffline({
      problemStatement: quadraticProblem.statement,
      initialEquation: quadraticProblem.equation,
      topic: quadraticProblem.topic,
      steps: quadraticProblem.typicalErrorSteps,
      studentProfile: {
        id: 'student-01',
        name: 'Sofía Martínez',
        age: 14,
        grade: '3ero Básico',
        school: 'Instituto Experimental',
        department: 'Guatemala',
        selectedTopic: 'ecuacion_cuadratica',
        createdAt: '2026-01-01',
        avatarSeed: 'sofia'
      }
    });

    expect(result.isCorrect).toBe(false);
    expect(result.errorStepIndex).toBe(2); // 0-based index for Step 3
    expect(result.weakFoundation).toBe('jerarquia_operaciones');
    expect(result.visualFeedback.ruleBroken).toContain('Jerarquía');
    expect(result.remediationExercises.length).toBeGreaterThan(0);
    expect(result.adultSummary).toBeDefined();
    expect(result.adultSummary.studentName).toBe('Sofía Martínez');
    expect(result.adultSummary.conceptMastery.some(c => c.conceptId === 'jerarquia_operaciones')).toBe(true);
  });

  it('validates a completely correct multi-step solution without errors', () => {
    const quadraticProblem = CURRICULUM_PROBLEMS[0];
    const result = evaluateOffline({
      problemStatement: quadraticProblem.statement,
      initialEquation: quadraticProblem.equation,
      topic: quadraticProblem.topic,
      steps: quadraticProblem.correctSteps,
      studentProfile: null
    });

    expect(result.isCorrect).toBe(true);
    expect(result.errorStepIndex).toBeNull();
    expect(result.weakFoundation).toBeNull();
    expect(result.remediationExercises).toHaveLength(0);
    expect(result.adultSummary.evolutionStatus).toBe('Base Reparada');
    expect(result.adultSummary.conceptMastery.every(c => c.masteryPercentage >= 80)).toBe(true);
  });

  it('detects power sign confusion (-3^2 evaluated as +9)', () => {
    const potenciasProblem = CURRICULUM_PROBLEMS[1];
    const result = evaluateOffline({
      problemStatement: potenciasProblem.statement,
      initialEquation: potenciasProblem.equation,
      topic: potenciasProblem.topic,
      steps: potenciasProblem.typicalErrorSteps,
      studentProfile: null
    });

    expect(result.isCorrect).toBe(false);
    expect(result.errorStepIndex).toBe(0);
    expect(result.weakFoundation).toBe('potencias');
    expect(result.visualFeedback.calloutDescription).toContain('signo');
  });

  it('detects unbalanced parentheses gracefully without throwing exceptions', () => {
    const result = evaluateOffline({
      problemStatement: 'Ecuación',
      initialEquation: '2(x+3)^2 = 32',
      topic: 'ecuacion_cuadratica',
      steps: [
        { id: '1', stepNumber: 1, expression: '2(x+3 = 16', annotation: 'Paréntesis roto' }
      ],
      studentProfile: null
    });

    expect(result.isCorrect).toBe(false);
    expect(result.errorStepIndex).toBe(0);
    expect(result.visualFeedback.calloutTitle).toContain('Paréntesis incompletos');
  });

  it('PedagogicalAnalyzerService falls back to offline engine when Gemini is unavailable or throws', async () => {
    const service = new PedagogicalAnalyzerService(false); // Force offline mode
    const problem = CURRICULUM_PROBLEMS[0];

    const result = await service.analyzeStudentWork({
      problemStatement: problem.statement,
      initialEquation: problem.equation,
      topic: problem.topic,
      steps: problem.typicalErrorSteps,
      studentProfile: null
    });

    expect(result).toBeDefined();
    expect(result.errorStepIndex).toBe(2);
    expect(result.weakFoundation).toBe('jerarquia_operaciones');
    expect(result.adultSummary).not.toBeNull();
  });
});
