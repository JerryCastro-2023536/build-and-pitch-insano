# 🐆 Balam - Plataforma de Práctica y Remediación Matemática (Guatemala)

> **Contexto EdTech:** Diseñada para el contexto educativo de Guatemala alineado a los desafíos de **PISA 2025** (donde solo el **8 %** de los estudiantes de 15 años alcanzan el nivel mínimo de competencia en matemáticas).  
> **Diferenciador central:** **NO es un tutor conversacional ni un chat genérico**. Analiza el **proceso matemático paso a paso** en un whiteboard digital para detectar con exactitud matemática dónde se rompe el razonamiento, aislar "bases débiles" acumuladas (ej. fallos en jerarquía de operaciones de 1ro básico que bloquean ecuaciones cuadráticas en 3ero básico) y construir una ruta de práctica focalizada exclusivamente en esos vacíos.

---

## 🚀 Guía Rápida para la Demo en Vivo (< 4 minutos)

La aplicación cuenta con una **barra superior de control de demo (DemoControlBar)** y accesos directos de 1 clic diseñados específicamente para presentaciones ante jurados de hackathon:

1. **⏱️ Cronómetro de Pitch (4:00 min):** En la esquina superior derecha dispones de un cronómetro en vivo para medir los 4 minutos de tu presentación.
2. **⚡ Botón "Pitch 1-Click" / "Cargar Escenario Pitch (Camila Morales)":** Precarga instantáneamente el caso estrella:
   - **Estudiante:** Camila Morales (14 años, 3ero Básico, Guatemala).
   - **Problema:** Ecuación cuadrática $2(x + 3)^2 - 8 = 24$.
   - **Fallo:** En el Paso 3 comete el error típico $2(x+3)^2 \to (2x+6)^2$ (distribuir factor sobre base con exponente).
   - **Base Débil Aislada:** Jerarquía de Operaciones (PEMDAS).
3. **🔄 Botón "Reset Demo":** Limpia `localStorage` y regresa la plataforma al estado inicial en 1 segundo.

### 🎬 Flujo de 5 Pasos del Pitch (< 4 minutos):
1. **Paso 1: Registro Inicial (`Pantalla 1`):** Ingreso del alumno, edad (13 a 15 años) y selección de tema MVP (Jerarquía, Potencias, Ecuación Cuadrática).
2. **Paso 2: Resolución en Whiteboard (`Pantalla 2`):** Lienzo digital interactivo (trazo/escritura) y editor de transformaciones matemáticas paso a paso. Puedes presionar *"Simular Error Típico"* y luego *"Analizar Dónde se Rompió el Razonamiento"*.
3. **Paso 3: Diagnóstico de Causa Raíz (`Pantalla 3`):** El sistema marca con un recuadro rojo el Paso 3 exacto en el lienzo y resalta que la brecha no es álgebra avanzada sino la base de **Jerarquía de Operaciones**.
4. **Paso 4: Remediación Focalizada & Reintento (`Pantallas 4 y 5`):** Ruta de solo 3 micro-ejercicios focalizados. Al resolverlos, se verifica de inmediato la regla de oro y se muestra la pantalla de **Base Reparada (`Pantalla 8`)**.
5. **Paso 5: Resumen para Tutor / Docente / Familia (`Pantalla 7`):** Vista de acompañamiento escolar que resume en lenguaje claro:
   - *En qué falló* (Multiplicación antes de potencia).
   - *Qué practicó* (3 micro-ejercicios focalizados en vez de 50 planas repetitivas).
   - *Cómo evoluciona* (Dominio subió de 42 % a 94 %).
   - Consejos accionables para la familia en casa.

---

## 📱 Mapeo de Pantallas Stitch

Esta implementación integra fielmente la estructura y diseño de las 8 pantallas generadas en el proyecto Stitch (**ID: 16894582551067296788**):

| # | Nombre de Pantalla | Stitch Screen ID | Componente en `src/screens/` |
|---|-------------------|------------------|------------------------------|
| 1 | **Registro Inicial - Balam** | `d6f04a15bb124422afdf59ea03e68f8b` | `Screen1Registration.tsx` |
| 2 | **Pizarra de Trabajo - Resolver Problema** | `cf0147a592034e049c2ff56aaff8873c` | `Screen2Whiteboard.tsx` |
| 3 | **Diagnóstico - Dónde se Rompió el Razonamiento** | `597cc88da3ca4d0d98adfcb5a9e6c28a` | `Screen3Diagnostic.tsx` |
| 4 | **Mi Ruta de Práctica Personalizada** | `3c22f79a510841adac38188a693ae796` | `Screen4RemediationPath.tsx` |
| 5 | **Ejercicio de Refuerzo con Feedback Visual** | `ce1717e9a0524e4882cf78627698614c` | `Screen5Reinforcement.tsx` |
| 6 | **Mi Progreso - Camila Morales** | `5dab68cc9b274d0faae85e00de28dda7` | `Screen6StudentProgress.tsx` |
| 7 | **Vista Docente y Familia - Balam** | `062134e26e594017af0b3fc58ea67cfa` | `Screen7TeacherParentView.tsx` |
| 8 | **Base Reparada - Éxito de Aprendizaje** | `65ae8aa19d17468396ed9d4445a477f7` | `Screen8SuccessRepaired.tsx` |

---

## 🏗️ Arquitectura Técnica y Estructura de Carpetas

Construido en **TypeScript (Strict Mode)** con arquitectura limpia por capas desacopladas:

```
src/
├── domain/                          # Capa de Dominio Pedagógico
│   ├── types.ts                     # Modelos de datos estrictos (StudentProfile, MathStep, DiagnosticResult, etc.)
│   └── curriculum.ts                # Casos precargados y temas MVP (Jerarquía, Potencias, Cuadrática)
├── persistence/                     # Capa de Persistencia Adaptable (localStorage)
│   ├── storageKeys.ts               # Constantes de almacenamiento con prefijo balam_
│   ├── localStorageAdapter.ts       # Adaptador genérico tipado
│   └── balamRepository.ts           # Repositorio (getProfile, saveSession, resetDemo, loadPitchScenario)
├── services/                        # Capa de Agente y Lógica Pedagógica
│   ├── PedagogicalAnalyzerService.ts# Interfaz estricta de análisis de proceso
│   ├── offlineEvaluator.ts          # Motor determinista offline (latencia <15ms, sin fallas de red)
│   └── geminiEvaluator.ts           # Adaptador con IA generativa (fallback automático al motor offline)
├── components/                      # Componentes UI Modulares
│   ├── layout/
│   │   ├── Navbar.tsx               # Barra de marca, tabs de las 8 pantallas Stitch y perfil
│   │   └── DemoControlBar.tsx       # Barra de pitch con flujo 1-5, cronómetro y botón 1-click
│   ├── whiteboard/
│   │   ├── DrawingCanvas.tsx        # Lienzo HTML5 (mouse/touch, trazos, borrador, colores, caja de error)
│   │   ├── StepByStepEditor.tsx     # Editor ágil de pasos matemáticos con simuladores rápidos
│   │   └── MathKeypad.tsx           # Teclado matemático rápido (x², √, ±, paréntesis)
│   ├── visualFeedback/
│   │   ├── ErrorStepMarker.tsx      # Marcado visual animado del paso roto
│   │   └── WeakFoundationCard.tsx   # Tarjeta de causa raíz y regla de oro matemática
│   └── common/
│       └── Icons.tsx                # Iconografía SVG nativa de alta fidelidad
├── screens/                         # Vistas de las 8 pantallas Stitch
├── App.tsx                          # Orquestador del flujo y enrutador de pantallas
├── main.tsx
└── index.css
```

---

## 🛠️ Comandos de Ejecución

### Levantar en modo desarrollo:
```bash
npm run dev
# o con pnpm:
pnpm dev
```
La aplicación iniciará en `http://localhost:5173`.

### Compilar y verificar TypeScript:
```bash
npm run build
# Ejecuta: tsc --noEmit && vite build
```

---

## 🇬🇹 Contexto Educativo (PISA 2025 & CNB de Guatemala)
- **El reto:** En Guatemala, el 92 % de los estudiantes de 15 años evaluados en PISA no alcanzan los niveles mínimos de competencia.
- **La solución de Balam:** Las matemáticas son acumulativas. Un tropiezo en 3ero básico en ecuaciones cuadráticas casi siempre tiene su origen en 1ro o 2do básico (signos y jerarquía operacional). Balam identifica el origen exacto del tropiezo en menos de 3 minutos para transformar la trayectoria educativa del estudiante.
