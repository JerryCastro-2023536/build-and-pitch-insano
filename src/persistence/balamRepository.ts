import { STORAGE_KEYS } from './storageKeys';
import { LocalStorageAdapter } from './localStorageAdapter';
import { 
  StudentProfile, 
  WhiteboardSession, 
  DiagnosticResult, 
  AdultSummary, 
  RemediationExercise 
} from '../domain/types';
import { CURRICULUM_PROBLEMS } from '../domain/curriculum';

export interface IBalamRepository {
  getStudentProfile(): StudentProfile | null;
  saveStudentProfile(profile: StudentProfile): void;
  getCurrentSession(): WhiteboardSession | null;
  saveCurrentSession(session: WhiteboardSession): void;
  getDiagnostic(): DiagnosticResult | null;
  saveDiagnostic(diag: DiagnosticResult): void;
  getAdultSummary(): AdultSummary | null;
  saveAdultSummary(summary: AdultSummary): void;
  resetDemo(): void;
  loadPitchScenario(): {
    profile: StudentProfile;
    session: WhiteboardSession;
    diagnostic: DiagnosticResult;
  };
}

export class BalamRepository implements IBalamRepository {
  getStudentProfile(): StudentProfile | null {
    return LocalStorageAdapter.get<StudentProfile | null>(STORAGE_KEYS.STUDENT_PROFILE, null);
  }

  saveStudentProfile(profile: StudentProfile): void {
    LocalStorageAdapter.set(STORAGE_KEYS.STUDENT_PROFILE, profile);
  }

  getCurrentSession(): WhiteboardSession | null {
    return LocalStorageAdapter.get<WhiteboardSession | null>(STORAGE_KEYS.CURRENT_SESSION, null);
  }

  saveCurrentSession(session: WhiteboardSession): void {
    LocalStorageAdapter.set(STORAGE_KEYS.CURRENT_SESSION, session);
  }

  getDiagnostic(): DiagnosticResult | null {
    return LocalStorageAdapter.get<DiagnosticResult | null>(STORAGE_KEYS.DIAGNOSTIC_RESULT, null);
  }

  saveDiagnostic(diag: DiagnosticResult): void {
    LocalStorageAdapter.set(STORAGE_KEYS.DIAGNOSTIC_RESULT, diag);
  }

  getAdultSummary(): AdultSummary | null {
    return LocalStorageAdapter.get<AdultSummary | null>(STORAGE_KEYS.ADULT_SUMMARY, null);
  }

  saveAdultSummary(summary: AdultSummary): void {
    LocalStorageAdapter.set(STORAGE_KEYS.ADULT_SUMMARY, summary);
  }

  resetDemo(): void {
    LocalStorageAdapter.clearPrefix('balam_');
  }

  /**
   * Pre-loads the official Hackathon pitch scenario:
   * Camila Morales (14 years, Guatemala) solving quadratic equation:
   * 2(x + 3)^2 - 8 = 24
   * Error detected on Step 3: Weak foundation in "Jerarquía de Operaciones"
   */
  loadPitchScenario() {
    const profile: StudentProfile = {
      id: 'student-camila-01',
      name: 'Camila Morales',
      age: 14,
      grade: '3ero Básico',
      school: 'Instituto Nacional Experimental',
      department: 'Guatemala',
      selectedTopic: 'ecuacion_cuadratica',
      createdAt: new Date().toISOString(),
      avatarSeed: 'camila'
    };

    const problem = CURRICULUM_PROBLEMS[0]; // 2(x + 3)^2 - 8 = 24

    const session: WhiteboardSession = {
      id: 'session-pitch-demo',
      studentId: profile.id,
      problemId: problem.id,
      problemStatement: problem.statement,
      initialEquation: problem.equation,
      topic: 'ecuacion_cuadratica',
      strokes: [
        // Realistic student mathematical handwritten strokes
        {
          color: '#818CF8',
          size: 3,
          tool: 'pen',
          points: [{ x: 45, y: 35 }, { x: 75, y: 38 }, { x: 120, y: 40 }]
        },
        {
          color: '#818CF8',
          size: 3,
          tool: 'pen',
          points: [{ x: 125, y: 45 }, { x: 155, y: 80 }, { x: 195, y: 85 }]
        }
      ],
      steps: problem.typicalErrorSteps,
      status: 'analyzed',
      createdAt: new Date().toISOString()
    };

    const remediationExercises: RemediationExercise[] = [
      {
        id: 'rem-jer-1',
        foundation: 'jerarquia_operaciones',
        difficulty: 'basico',
        title: 'Prioridad de Potencias frente a Multiplicación',
        statement: 'En la expresión 3 · 4², ¿cuál es la primera operación matemática que debes realizar obligatoriamente?',
        formula: '3 \\times 4^2 = ?',
        stepOptions: [
          {
            label: 'A) Multiplicar primero 3 × 4 = 12 y luego elevar al cuadrado: 12² = 144',
            isCorrect: false,
            feedback: '¡Error común! La potencia tiene mayor jerarquía que la multiplicación. No puedes multiplicar antes de resolver el exponente.'
          },
          {
            label: 'B) Elevar primero 4² = 16 y luego multiplicar por 3: 3 × 16 = 48',
            isCorrect: true,
            feedback: '¡Excelente! Regla de oro: Potencias y raíces siempre se resuelven ANTES de multiplicaciones y divisiones.'
          },
          {
            label: 'C) Es indistinto, da el mismo resultado',
            isCorrect: false,
            feedback: 'Falso. 144 es completamente diferente de 48. La jerarquía matemática garantiza el resultado único universal.'
          }
        ],
        explanation: 'Por jerarquía operacional (PEMDAS), los exponentes tienen prioridad de nivel 2, mientras que las multiplicaciones tienen prioridad nivel 3.',
        completed: false
      },
      {
        id: 'rem-jer-2',
        foundation: 'jerarquia_operaciones',
        difficulty: 'intermedio',
        title: 'Despeje correcto de coeficientes en binomios cuadráticos',
        statement: 'Si tienes 2(x + 3)² = 32, ¿cuál es el paso riguroso para despejar x?',
        formula: '2(x + 3)^2 = 32 \\implies ?',
        stepOptions: [
          {
            label: 'A) Distribuir el 2 dentro del paréntesis: (2x + 6)² = 32',
            isCorrect: false,
            feedback: 'Falso. No se puede meter un factor multiplicativo dentro de una base elevada a un exponente.'
          },
          {
            label: 'B) Dividir ambos miembros de la ecuación entre 2: (x + 3)² = 16',
            isCorrect: true,
            feedback: '¡Exacto! Al dividir entre 2, aíslas el término al cuadrado para después aplicar raíz cuadrada sin alterar el binomio.'
          },
          {
            label: 'C) Restar 2 a 32: (x + 3)² = 30',
            isCorrect: false,
            feedback: 'Incorrecto. El 2 está multiplicando al paréntesis, por lo tanto pasa al otro lado dividiendo.'
          }
        ],
        explanation: 'Para despejar términos con potencias, primero se neutralizan factores externos mediante división, aislando la potencia.',
        completed: false
      },
      {
        id: 'rem-jer-3',
        foundation: 'jerarquia_operaciones',
        difficulty: 'avanzado',
        title: 'Extracción de raíz con signos duales (±)',
        statement: 'Una vez obtenido (x + 3)² = 16, ¿qué valores satisface la ecuación?',
        formula: '(x + 3)^2 = 16 \\implies x + 3 = \\pm 4',
        stepOptions: [
          {
            label: 'A) Solo x + 3 = 4, por lo que x = 1',
            isCorrect: false,
            feedback: 'Recuerda que una ecuación cuadrática tiene 2 soluciones en los números reales: tanto (+4)² como (-4)² son 16.'
          },
          {
            label: 'B) x + 3 = ±4, dando x₁ = 1 y x₂ = -7',
            isCorrect: true,
            feedback: '¡Impecable! Solución completa y rigurosa.'
          }
        ],
        explanation: 'La raíz cuadrada de un cuadrado perfecto genera dos raíces reales simétricas.',
        completed: false
      }
    ];

    const adultSummary: AdultSummary = {
      studentName: 'Camila Morales',
      age: 14,
      grade: '3ero Básico',
      lastUpdated: 'Hoy (Sesión en vivo)',
      detectedWeaknessTitle: 'Base Débil Raíz: Jerarquía de Operaciones',
      detectedWeaknessDescription: 'Camila intentó resolver una ecuación cuadrática de 3ero básico, pero el obstáculo no es el álgebra avanzada: es una confusión de 1ro básico al priorizar la multiplicación sobre la potencia en 2(x+3)²',
      rootCausePedagogy: 'Al distribuir el factor 2 dentro de una base cuadrática, el estudiante viola el orden operacional (PEMDAS). En lugar de hacerla repetir 50 ecuaciones cuadráticas, se remediaron 3 ejercicios clave de jerarquía operacional.',
      currentPracticeFocus: 'Prioridad de operadores y aislamiento de potencias',
      evolutionStatus: 'En Remediación Focalizada',
      conceptMastery: [
        {
          conceptId: 'jerarquia_operaciones',
          conceptName: 'Jerarquía de Operaciones (PEMDAS)',
          masteryPercentage: 42,
          status: 'critical_gap',
          trend: 'down',
          prerequisiteOf: 'Potencias y Álgebra'
        },
        {
          conceptId: 'potencias',
          conceptName: 'Potencias y Exponentes',
          masteryPercentage: 68,
          status: 'in_progress',
          trend: 'stable',
          prerequisiteOf: 'Ecuación Cuadrática'
        },
        {
          conceptId: 'ecuacion_cuadratica',
          conceptName: 'Ecuación Cuadrática',
          masteryPercentage: 55,
          status: 'in_progress',
          trend: 'stable'
        }
      ],
      timeline: [
        {
          id: 'tl-1',
          date: '11:40 AM',
          title: 'Diagnóstico en Whiteboard',
          description: 'Resolviendo 2(x + 3)² - 8 = 24. Razonamiento roto en Paso 3.',
          type: 'diagnostic_error',
          badge: 'Base Débil Detectada'
        },
        {
          id: 'tl-2',
          date: '11:42 AM',
          title: 'Inicio de Ruta de Remediación',
          description: 'Asignados 3 micro-ejercicios focalizados en aislar potencias.',
          type: 'practice_attempt',
          badge: 'Focalizado'
        }
      ],
      teacherAlert: '⚠️ Atención docente: Camila domina el planteamiento del problema, pero requiere no saltarse la regla de potencias antes de factores.',
      parentTips: [
        'No le digas "estás mal en matemáticas": felicítala por plantear bien la ecuación.',
        'Pídele que te explique en voz alta la frase: "Las potencias siempre se respetan antes que las multiplicaciones".'
      ],
      pisaContextNote: 'Contexto PISA 2025: En Guatemala, el 92% de los estudiantes tropieza en niveles iniciales de razonamiento algebraico debido a vacíos acumulados en operaciones básicas no diagnosticadas a tiempo.'
    };

    const diagnostic: DiagnosticResult = {
      isCorrect: false,
      errorStepIndex: 2, // 0-indexed: step 3 (Paso 3)
      weakFoundation: 'jerarquia_operaciones',
      visualFeedback: {
        highlightStepIndex: 2,
        calloutTitle: '¡Aquí se Rompió el Razonamiento! (Paso 3)',
        calloutDescription: 'Intentaste distribuir el 2 dentro del paréntesis: (2x + 6)². La potencia al cuadrado (² ) tiene prioridad sobre la multiplicación por 2.',
        ruleBroken: 'Regla de Jerarquía: P.E.M.D.A.S. (Potencias antes que Multiplicación)',
        coordinates: { x: 30, y: 140, width: 340, height: 60 },
        foundationGuide: {
          title: 'Regla de Oro: La Fortaleza de las Potencias',
          conceptName: 'Jerarquía de Operaciones',
          explanation: 'Un número con exponente no puede multiplicarse por un factor externo hasta que el exponente sea resuelto o el factor sea dividido a ambos lados de la igualdad.',
          visualGraphic: 'hierarchy_pyramid',
          exampleIncorrect: '2(x + 3)^2 \\to (2x + 6)^2 \\quad (¡ERROR GRAVE!)',
          exampleCorrect: '2(x + 3)^2 = 32 \\to (x + 3)^2 = \\frac{32}{2} = 16 \\quad (¡CORRECTO!)',
          goldenRule: '¡Primero aíslas la potencia dividiendo entre 2, NUNCA multipliques hacia adentro!'
        }
      },
      remediationExercises,
      adultSummary
    };

    this.saveStudentProfile(profile);
    this.saveCurrentSession(session);
    this.saveDiagnostic(diagnostic);
    this.saveAdultSummary(adultSummary);

    return { profile, session, diagnostic };
  }
}

export const balamRepository = new BalamRepository();
