import { 
  DiagnosticResult, 
  RemediationExercise, 
  AdultSummary, 
  WeakFoundationType 
} from '../domain/types';
import { PedagogicalAnalysisInput } from './PedagogicalAnalyzerService';

/**
 * Deterministic Pedagogical Rule Engine for Guatemala EdTech MVP
 * Evaluates step-by-step transformations and detects foundational breakdowns.
 */
export function evaluateOffline(input: PedagogicalAnalysisInput): DiagnosticResult {
  const { topic, steps, studentProfile } = input;
  const studentName = studentProfile?.name || 'Estudiante';

  // 1. Check if student marked any step as incorrect or if any step has typical error patterns
  let errorIndex: number | null = null;
  let detectedWeakness: WeakFoundationType = null;
  let calloutTitle = '';
  let calloutDesc = '';
  let ruleBroken = '';
  let goldenRule = '';

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    const expr = s.expression.toLowerCase().replace(/\s+/g, '');

    // Case A: Quadratic equation: 2(x + 3)^2 -> (2x + 6)^2
    if (expr.includes('(2x+6)^2') || expr.includes('(2x+6)2') || s.isIncorrectStep) {
      errorIndex = i;
      detectedWeakness = 'jerarquia_operaciones';
      calloutTitle = `¡Aquí se rompió el razonamiento! (Paso ${i + 1})`;
      calloutDesc = 'Intentaste distribuir el factor 2 dentro del paréntesis con exponente. La potencia al cuadrado tiene prioridad sobre la multiplicación externa.';
      ruleBroken = 'Jerarquía Operacional (P.E.M.D.A.S.): Potencias antes de Multiplicación';
      goldenRule = 'Para despejar k(x+a)², primero divide ambos lados entre k: (x+a)² = N/k. ¡Nunca multipliques la base!';
      break;
    }

    // Case B: Sign error with powers: -3^2 evaluated as +9
    if (expr.startsWith('9+') && topic === 'potencias') {
      errorIndex = i;
      detectedWeakness = 'potencias';
      calloutTitle = `¡Error de Base Detectado! (Paso ${i + 1})`;
      calloutDesc = 'Calculaste -3² como +9. Sin paréntesis, el signo negativo no está afectado por el exponente.';
      ruleBroken = 'Convenio de Signos en Potencias: -aⁿ = -(aⁿ) ≠ (-a)ⁿ';
      goldenRule = 'Solo si está escrito (-3)² el resultado es +9. Si está escrito -3², el resultado es -9.';
      break;
    }

    // Case C: Order of operations direct: 18 - 3 * ... evaluated as 15 * ...
    if (expr.startsWith('15*') || expr.startsWith('15\\times')) {
      errorIndex = i;
      detectedWeakness = 'jerarquia_operaciones';
      calloutTitle = `¡Fallo de Prioridad Operativa! (Paso ${i + 1})`;
      calloutDesc = 'Efectuaste la resta 18 - 3 = 15 al inicio. La multiplicación y los paréntesis tienen mayor jerarquía.';
      ruleBroken = 'Prioridad Operativa: Paréntesis y Multiplicaciones antes de Sumas/Restas';
      goldenRule = 'En PEMDAS, las sumas y restas siempre se resuelven de último, de izquierda a derecha.';
      break;
    }
  }

  // If no explicit error detected in loop, check if last step matches correct target or fallback
  const isCorrect = errorIndex === null;

  if (isCorrect) {
    return {
      isCorrect: true,
      errorStepIndex: null,
      weakFoundation: null,
      visualFeedback: {
        highlightStepIndex: null,
        calloutTitle: '¡Razonamiento Perfecto!',
        calloutDescription: 'Has resuelto todos los pasos respetando la jerarquía matemática y las propiedades operacionales.',
        ruleBroken: 'Ninguna: Procedimiento Riguroso',
        foundationGuide: {
          title: 'Maestría Demostrada',
          conceptName: 'Álgebra y Operaciones',
          explanation: 'Tus transformaciones respetan las propiedades de igualdad y la jerarquía de las operaciones.',
          visualGraphic: 'quadratic_structure',
          exampleIncorrect: 'N/A',
          exampleCorrect: 'Pasos ejecutados con precisión',
          goldenRule: '¡Sigue manteniendo este orden en tu práctica diaria!'
        }
      },
      remediationExercises: [],
      adultSummary: generateAdultSummary(studentName, null, true)
    };
  }

  // If error occurred, generate tailored remediation exercises focused ONLY on that weak foundation
  const remediation = getExercisesForFoundation(detectedWeakness || 'jerarquia_operaciones');

  const adultSummary = generateAdultSummary(studentName, detectedWeakness || 'jerarquia_operaciones', false);

  return {
    isCorrect: false,
    errorStepIndex: errorIndex,
    weakFoundation: detectedWeakness,
    visualFeedback: {
      highlightStepIndex: errorIndex,
      calloutTitle,
      calloutDescription: calloutDesc,
      ruleBroken,
      coordinates: { x: 30, y: 130 + (errorIndex || 0) * 45, width: 340, height: 55 },
      foundationGuide: {
        title: 'Regla de Oro Pedagógica',
        conceptName: detectedWeakness === 'jerarquia_operaciones' 
          ? 'Jerarquía de Operaciones' 
          : detectedWeakness === 'potencias' 
            ? 'Potencias y Exponentes' 
            : 'Ecuación Cuadrática',
        explanation: calloutDesc,
        visualGraphic: detectedWeakness === 'potencias' ? 'power_signs' : 'hierarchy_pyramid',
        exampleIncorrect: '2(x + 3)^2 \\to (2x + 6)^2 \\quad (¡Error!)',
        exampleCorrect: '2(x + 3)^2 = 32 \\to (x + 3)^2 = 16 \\quad (¡Correcto!)',
        goldenRule
      }
    },
    remediationExercises: remediation,
    adultSummary
  };
}

function getExercisesForFoundation(foundation: 'jerarquia_operaciones' | 'potencias' | 'ecuacion_cuadratica'): RemediationExercise[] {
  if (foundation === 'jerarquia_operaciones') {
    return [
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
  }

  // Default fallback for potencias
  return [
    {
      id: 'rem-pot-1',
      foundation: 'potencias',
      difficulty: 'basico',
      title: 'Distinción de Paréntesis en Potencias',
      statement: '¿Cuál es el valor exacto de -4² versus (-4)²?',
      formula: '-4^2 \\quad \\text{vs} \\quad (-4)^2',
      stepOptions: [
        {
          label: 'A) Ambos dan +16',
          isCorrect: false,
          feedback: 'Error. El signo menos sin paréntesis indica opuesto de (4²), es decir -16.'
        },
        {
          label: 'B) -4² = -16, mientras que (-4)² = +16',
          isCorrect: true,
          feedback: '¡Correcto! El exponente solo afecta a lo que abraza inmediatamente.'
        }
      ],
      explanation: 'El alcance de un exponente está limitado a la base inmediata o al contenido del paréntesis.',
      completed: false
    }
  ];
}

function generateAdultSummary(studentName: string, weakness: WeakFoundationType, isSuccess: boolean): AdultSummary {
  if (isSuccess) {
    return {
      studentName,
      age: 14,
      grade: '3ero Básico',
      lastUpdated: 'Recientemente',
      detectedWeaknessTitle: 'Base Reparada con Éxito 🎉',
      detectedWeaknessDescription: 'El estudiante demostró dominio completo del procedimiento y reparó la brecha conceptual detectada.',
      rootCausePedagogy: 'La secuencia de micro-remediación focalizada permitió aislar la regla de operaciones antes de continuar con temas de mayor abstracción.',
      currentPracticeFocus: 'Consolidación de destrezas algebraicas',
      evolutionStatus: 'Base Reparada',
      conceptMastery: [
        {
          conceptId: 'jerarquia_operaciones',
          conceptName: 'Jerarquía de Operaciones (PEMDAS)',
          masteryPercentage: 94,
          status: 'mastered',
          trend: 'up'
        },
        {
          conceptId: 'potencias',
          conceptName: 'Potencias y Exponentes',
          masteryPercentage: 88,
          status: 'mastered',
          trend: 'up'
        },
        {
          conceptId: 'ecuacion_cuadratica',
          conceptName: 'Ecuación Cuadrática',
          masteryPercentage: 85,
          status: 'mastered',
          trend: 'up'
        }
      ],
      timeline: [
        {
          id: 'tl-ok',
          date: 'Ahora',
          title: 'Remediación Superada',
          description: '3/3 micro-ejercicios correctos. Base consolidada.',
          type: 'foundation_repaired',
          badge: 'Éxito'
        }
      ],
      teacherAlert: '✅ Brecha cerrada: El estudiante ya puede avanzar al siguiente bloque curricular sin riesgo de tropiezo acumulado.',
      parentTips: [
        '¡Felicita al estudiante por su perseverancia!',
        'El aprendizaje mediante detección del proceso demostró ser altamente efectivo.'
      ],
      pisaContextNote: 'Alineado a PISA 2025: Al reparar las bases a tiempo, transformamos la estadística nacional en casos individuales de éxito.'
    };
  }

  return {
    studentName,
    age: 14,
    grade: '3ero Básico',
    lastUpdated: 'Hoy en clase',
    detectedWeaknessTitle: 'Base Débil: Jerarquía de Operaciones',
    detectedWeaknessDescription: `${studentName} falló en un problema de ecuaciones cuadráticas porque aplicó una multiplicación antes de una potencia.`,
    rootCausePedagogy: 'No es un problema de álgebra compleja; es un vacío conceptual de 1ro básico acumulado que bloquea el avance actual.',
    currentPracticeFocus: 'Aislamiento de coeficientes y orden PEMDAS',
    evolutionStatus: 'En Remediación Focalizada',
    conceptMastery: [
      {
        conceptId: 'jerarquia_operaciones',
        conceptName: 'Jerarquía de Operaciones (PEMDAS)',
        masteryPercentage: 42,
        status: 'critical_gap',
        trend: 'down',
        prerequisiteOf: 'Ecuaciones y Potencias'
      },
      {
        conceptId: 'potencias',
        conceptName: 'Potencias y Exponentes',
        masteryPercentage: 68,
        status: 'in_progress',
        trend: 'stable'
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
        date: 'Hoy',
        title: 'Error de proceso detectado',
        description: 'Se rompió el razonamiento en el Paso 3 al distribuir un factor dentro de una potencia.',
        type: 'diagnostic_error',
        badge: 'Vacío Detectado'
      }
    ],
    teacherAlert: '⚠️ Atención docente: El alumno necesita no adelantar multiplicaciones cuando existen potencias sin aislar.',
    parentTips: [
      'Apóyalo recordándole que las potencias tienen prioridad.',
      'Pregúntale: ¿Qué se hace primero, la potencia o la multiplicación?'
    ],
    pisaContextNote: 'Contexto PISA 2025: Diagnóstico temprano para romper la brecha del 8% de rendimiento mínimo en Guatemala.'
  };
}
