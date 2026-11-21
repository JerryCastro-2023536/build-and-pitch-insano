import { DiagnosticResult, WeakFoundationType } from '../domain/types';
import { PedagogicalAnalysisInput } from './PedagogicalAnalyzerService';
import { generateAdultSummary, getExercisesForFoundation } from './offlineEvaluator';

/**
 * Gemini API Adapter for AI Pedagogical Reasoning with 3.5s Timeout
 * When an API key is available, calls Gemini to evaluate complex handwritten steps.
 * Always fails gracefully and falls back to deterministic evaluator.
 */
export async function evaluateWithGemini(
  input: PedagogicalAnalysisInput, 
  apiKey: string
): Promise<DiagnosticResult | null> {
  const studentName = input.studentProfile?.name || 'Estudiante';
  const prompt = `
Actúa como el motor pedagógico de Balam (Plataforma EdTech de Guatemala para estudiantes de 13 a 15 años).
Analiza el proceso paso a paso del estudiante:
Problema: ${input.problemStatement} (${input.initialEquation})
Tema: ${input.topic}
Pasos ingresados por el estudiante:
${input.steps.map(s => `Paso ${s.stepNumber}: ${s.expression} [${s.annotation}]`).join('\n')}

Devuelve un JSON estricto con:
{
  "isCorrect": boolean,
  "errorStepIndex": number | null (0-based index donde se rompió el razonamiento),
  "weakFoundation": "jerarquia_operaciones" | "potencias" | "ecuacion_cuadratica" | null,
  "calloutTitle": string,
  "calloutDescription": string,
  "ruleBroken": string,
  "goldenRule": string
}
`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const parsed = JSON.parse(text);
    const weakFoundation: WeakFoundationType = parsed.weakFoundation || null;
    const isCorrect = Boolean(parsed.isCorrect);
    const errorStepIndex = typeof parsed.errorStepIndex === 'number' ? parsed.errorStepIndex : null;

    const exercises = isCorrect ? [] : getExercisesForFoundation(weakFoundation || 'jerarquia_operaciones');
    const adultSummary = generateAdultSummary(studentName, weakFoundation, isCorrect);

    return {
      isCorrect,
      errorStepIndex,
      weakFoundation,
      visualFeedback: {
        highlightStepIndex: errorStepIndex,
        calloutTitle: parsed.calloutTitle || 'Análisis Pedagógico',
        calloutDescription: parsed.calloutDescription || '',
        ruleBroken: parsed.ruleBroken || '',
        foundationGuide: {
          title: 'Regla de Oro',
          conceptName: weakFoundation ? weakFoundation.replace('_', ' ') : 'Matemáticas',
          explanation: parsed.calloutDescription || '',
          visualGraphic: weakFoundation === 'potencias' ? 'power_signs' : 'hierarchy_pyramid',
          exampleIncorrect: 'N/A',
          exampleCorrect: 'N/A',
          goldenRule: parsed.goldenRule || ''
        }
      },
      remediationExercises: exercises,
      adultSummary
    };
  } catch (e) {
    clearTimeout(timeoutId);
    console.warn('[evaluateWithGemini] Failed, fallback to offline evaluator:', e);
    return null;
  }
}
