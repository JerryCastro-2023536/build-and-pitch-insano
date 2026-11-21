/**
 * Domain Models for Balam Math Diagnostic Platform
 * Target audience: Students 13-15 years old in Guatemala (aligning with PISA 2025 context)
 */

export type WeakFoundationType = 
  | 'jerarquia_operaciones' 
  | 'potencias' 
  | 'ecuacion_cuadratica' 
  | null;

export type TopicType = 'jerarquia_operaciones' | 'potencias' | 'ecuacion_cuadratica';

export interface StudentProfile {
  id: string;
  name: string;
  age: number; // 13 - 15
  grade: string; // e.g. "2do Básico", "3ero Básico"
  school: string;
  department: string; // e.g. "Guatemala", "Quetzaltenango", "Sacatepéquez"
  selectedTopic: TopicType;
  createdAt: string;
  avatarSeed: string;
}

export interface MathStep {
  id: string;
  stepNumber: number;
  expression: string;
  annotation: string;
  isIncorrectStep?: boolean;
  errorReason?: string;
}

export interface CanvasStroke {
  color: string;
  size: number;
  tool: 'pen' | 'eraser';
  points: { x: number; y: number }[];
}

export interface WhiteboardSession {
  id: string;
  studentId: string;
  problemId: string;
  problemStatement: string;
  initialEquation: string;
  topic: TopicType;
  strokes: CanvasStroke[];
  steps: MathStep[];
  status: 'draft' | 'analyzed' | 'remediated';
  createdAt: string;
}

export interface FoundationGuideSnippet {
  title: string;
  conceptName: string;
  explanation: string;
  visualGraphic: 'hierarchy_pyramid' | 'power_signs' | 'quadratic_structure';
  exampleIncorrect: string;
  exampleCorrect: string;
  goldenRule: string;
}

export interface RemediationExercise {
  id: string;
  foundation: 'jerarquia_operaciones' | 'potencias' | 'ecuacion_cuadratica';
  difficulty: 'basico' | 'intermedio' | 'avanzado';
  title: string;
  statement: string;
  formula: string;
  stepOptions: {
    label: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  explanation: string;
  completed: boolean;
  studentSelectedOption?: number;
}

export interface ConceptMastery {
  conceptId: TopicType;
  conceptName: string;
  masteryPercentage: number;
  status: 'mastered' | 'in_progress' | 'critical_gap';
  prerequisiteOf?: string;
  trend: 'up' | 'stable' | 'down';
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'diagnostic_error' | 'practice_attempt' | 'foundation_repaired';
  badge: string;
}

export interface AdultSummary {
  studentName: string;
  age: number;
  grade: string;
  lastUpdated: string;
  detectedWeaknessTitle: string;
  detectedWeaknessDescription: string;
  rootCausePedagogy: string;
  currentPracticeFocus: string;
  evolutionStatus: 'Base Reparada' | 'En Remediación Focalizada' | 'Diagnóstico Inicial';
  conceptMastery: ConceptMastery[];
  timeline: TimelineEvent[];
  teacherAlert: string;
  parentTips: string[];
  pisaContextNote: string;
}

export interface DiagnosticResult {
  isCorrect: boolean;
  errorStepIndex: number | null; // 0-based index of the step where reasoning broke
  weakFoundation: WeakFoundationType;
  visualFeedback: {
    highlightStepIndex: number | null;
    calloutTitle: string;
    calloutDescription: string;
    ruleBroken: string;
    coordinates?: { x: number; y: number; width: number; height: number };
    foundationGuide: FoundationGuideSnippet;
  };
  remediationExercises: RemediationExercise[];
  adultSummary: AdultSummary;
}

export interface ProblemTemplate {
  id: string;
  topic: TopicType;
  title: string;
  statement: string;
  equation: string;
  difficulty: string;
  typicalErrorSteps: MathStep[];
  correctSteps: MathStep[];
}
