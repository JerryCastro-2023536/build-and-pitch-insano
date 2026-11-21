import { DiagnosticResult } from '../domain/types';
import { PedagogicalAnalysisInput } from './PedagogicalAnalyzerService';

/**
 * Gemini API Adapter for AI Pedagogical Reasoning
 * When an API key is available, calls Gemini to evaluate complex handwritten steps.
 * Designed with a strict JSON schema contract.
 */
export async function evaluateWithGemini(
  input: PedagogicalAnalysisInput, 
  apiKey: string
): Promise<DiagnosticResult | null> {
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

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const parsed = JSON.parse(text);
    return {
      isCorrect: parsed.isCorrect,
      errorStepIndex: parsed.errorStepIndex,
      weakFoundation: parsed.weakFoundation,
      visualFeedback: {
        highlightStepIndex: parsed.errorStepIndex,
        calloutTitle: parsed.calloutTitle || 'Análisis Pedagógico',
        calloutDescription: parsed.calloutDescription || '',
        ruleBroken: parsed.ruleBroken || '',
        foundationGuide: {
          title: 'Regla de Oro',
          conceptName: parsed.weakFoundation || 'Matemáticas',
          explanation: parsed.calloutDescription || '',
          visualGraphic: 'hierarchy_pyramid',
          exampleIncorrect: 'N/A',
          exampleCorrect: 'N/A',
          goldenRule: parsed.goldenRule || ''
        }
      },
      remediationExercises: [],
      adultSummary: null as any
    };
  } catch (e) {
    console.warn('[evaluateWithGemini] Failed, fallback to offline evaluator:', e);
    return null;
  }
}
