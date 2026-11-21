import { ProblemTemplate } from './types';

/**
 * Pre-configured curriculum problems designed for Guatemala's secondary education (13-15 years)
 * Focused on the 3 MVP pillars:
 * 1. Jerarquía de operaciones
 * 2. Potencias
 * 3. Ecuación cuadrática
 */

export const CURRICULUM_PROBLEMS: ProblemTemplate[] = [
  {
    id: 'prob-cuadratica-01',
    topic: 'ecuacion_cuadratica',
    title: 'Ecuación Cuadrática con Factor Multiplicativo',
    statement: 'Resuelve la ecuación cuadrática encontrando el valor de x:',
    equation: '2(x + 3)^2 - 8 = 24',
    difficulty: 'Intermedio (3ero Básico)',
    // Common error: Student applies multiplication BEFORE power or forgets order of operations
    typicalErrorSteps: [
      {
        id: 's1',
        stepNumber: 1,
        expression: '2(x + 3)^2 = 24 + 8',
        annotation: 'Sumar 8 a ambos lados'
      },
      {
        id: 's2',
        stepNumber: 2,
        expression: '2(x + 3)^2 = 32',
        annotation: 'Simplificar el lado derecho'
      },
      {
        id: 's3',
        stepNumber: 3,
        expression: '(2x + 6)^2 = 32',
        annotation: 'Distribuir el 2 dentro del paréntesis antes de la potencia (¡ERROR!)',
        isIncorrectStep: true,
        errorReason: 'Fallo de Jerarquía de Operaciones: Multiplicó antes de resolver o aislar la potencia.'
      },
      {
        id: 's4',
        stepNumber: 4,
        expression: '4x^2 + 24x + 36 = 32',
        annotation: 'Desarrollar el binomio alterado'
      }
    ],
    correctSteps: [
      {
        id: 'c1',
        stepNumber: 1,
        expression: '2(x + 3)^2 = 24 + 8',
        annotation: 'Aislar el término cuadrático sumando 8'
      },
      {
        id: 'c2',
        stepNumber: 2,
        expression: '2(x + 3)^2 = 32',
        annotation: 'Simplificar lado derecho'
      },
      {
        id: 'c3',
        stepNumber: 3,
        expression: '(x + 3)^2 = 16',
        annotation: 'Dividir ambos lados entre 2 respetando la jerarquía'
      },
      {
        id: 'c4',
        stepNumber: 4,
        expression: 'x + 3 = ±4',
        annotation: 'Aplicar raíz cuadrada a ambos lados'
      },
      {
        id: 'c5',
        stepNumber: 5,
        expression: 'x_1 = 1, x_2 = -7',
        annotation: 'Soluciones finales correctas'
      }
    ]
  },
  {
    id: 'prob-potencias-01',
    topic: 'potencias',
    title: 'Operaciones combinadas con Potencias y Signos',
    statement: 'Calcula el valor numérico exacto de la expresión:',
    equation: '-3² + (-2)³ × 4 - √25',
    difficulty: 'Básico (2do Básico)',
    typicalErrorSteps: [
      {
        id: 'p1',
        stepNumber: 1,
        expression: '9 + (-2)³ × 4 - 5',
        annotation: 'Evaluar -3² como (-3)² = +9 (¡ERROR!)',
        isIncorrectStep: true,
        errorReason: 'Fallo en Potencias y Signos: -3² es -(3²) = -9, el signo no está dentro del exponente.'
      },
      {
        id: 'p2',
        stepNumber: 2,
        expression: '9 + (-8) × 4 - 5',
        annotation: 'Calcular (-2)³ = -8'
      },
      {
        id: 'p3',
        stepNumber: 3,
        expression: '9 - 32 - 5 = -28',
        annotation: 'Multiplicar y sumar'
      }
    ],
    correctSteps: [
      {
        id: 'pc1',
        stepNumber: 1,
        expression: '-(3²) + (-8) × 4 - 5',
        annotation: 'Distinguir entre -3² y (-3)²'
      },
      {
        id: 'pc2',
        stepNumber: 2,
        expression: '-9 + (-32) - 5',
        annotation: 'Efectuar la multiplicación (-8) × 4 = -32'
      },
      {
        id: 'pc3',
        stepNumber: 3,
        expression: '-9 - 32 - 5 = -46',
        annotation: 'Reducir términos semejantes'
      }
    ]
  },
  {
    id: 'prob-jerarquia-01',
    topic: 'jerarquia_operaciones',
    title: 'Jerarquía de Operaciones P.E.M.D.A.S.',
    statement: 'Simplifica la expresión aritmética paso a paso:',
    equation: '18 - 3 × (4 - 1)² + 12 ÷ 4',
    difficulty: 'Fundacional (1ro / 2do Básico)',
    typicalErrorSteps: [
      {
        id: 'j1',
        stepNumber: 1,
        expression: '15 × (4 - 1)² + 12 ÷ 4',
        annotation: 'Restar 18 - 3 = 15 al inicio (¡ERROR!)',
        isIncorrectStep: true,
        errorReason: 'Fallo de Jerarquía: Restó antes de resolver paréntesis y multiplicaciones.'
      },
      {
        id: 'j2',
        stepNumber: 2,
        expression: '15 × 3² + 3',
        annotation: 'Resolver paréntesis'
      }
    ],
    correctSteps: [
      {
        id: 'jc1',
        stepNumber: 1,
        expression: '18 - 3 × 3² + 12 ÷ 4',
        annotation: '1º Paréntesis: (4 - 1) = 3'
      },
      {
        id: 'jc2',
        stepNumber: 2,
        expression: '18 - 3 × 9 + 3',
        annotation: '2º Potencia: 3² = 9 y División 12 ÷ 4 = 3'
      },
      {
        id: 'jc3',
        stepNumber: 3,
        expression: '18 - 27 + 3',
        annotation: '3º Multiplicación: 3 × 9 = 27'
      },
      {
        id: 'jc4',
        stepNumber: 4,
        expression: '-9 + 3 = -6',
        annotation: '4º Sumas y restas de izquierda a derecha'
      }
    ]
  }
];
