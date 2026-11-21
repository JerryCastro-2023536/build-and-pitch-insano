# 🐆 Balam - Plataforma de Práctica y Remediación Matemática (Guatemala)

> **Contexto EdTech:** Diseñada para el contexto educativo de Guatemala alineado a los desafíos de **PISA 2025** (donde solo el **8 %** de los estudiantes de 15 años alcanzan el nivel mínimo de competencia en matemáticas).  
> **Diferenciador central:** **NO es un tutor conversacional ni un chat genérico**. Analiza el **proceso matemático paso a paso** en un whiteboard digital para detectar con exactitud matemática dónde se rompe el razonamiento, aislar "bases débiles" acumuladas (ej. fallos en jerarquía de operaciones de 1ro básico que bloquean ecuaciones cuadráticas en 3ero básico) y construir una ruta de práctica focalizada exclusivamente en esos vacíos.

---

## 🚀 Guía Rápida para la Demo en Vivo (< 4 minutos)

La aplicación cuenta con una **barra superior de control de demo (DemoControlBar)** diseñada específicamente para presentaciones ante jurados de hackathon:

1. **⏱️ Cronómetro de Pitch (4:00 min):** En la esquina superior derecha dispones de un cronómetro en vivo para medir los 4 minutos de tu presentación.
2. **🌱 Inicio Limpio (App Nueva):** La aplicación inicia en estado cero (sin estudiantes precargados ni datos mock). Cada interacción genera datos reales que persisten en `localStorage`.
3. **🔄 Botón "Reset Demo":** Limpia las claves `balam_` de `localStorage` y regresa la plataforma al estado inicial en 1 segundo.

### 🎬 Flujo del Pitch en Vivo (< 4 minutos):
1. **Paso 1: Registro Inicial (`Pantalla 1`):** Ingreso del alumno, edad (13 a 15 años) y selección de tema MVP (Jerarquía, Potencias, Ecuación Cuadrática).
2. **Paso 2: Resolución en Whiteboard (`Pantalla 3`):** Lienzo digital interactivo (trazo/escritura) y editor de transformaciones matemáticas paso a paso. Se introduce la ecuación y los pasos para presionar *"Analizar Dónde se Rompió el Razonamiento"*.
3. **Paso 3: Diagnóstico de Causa Raíz (`Pantalla 4`):** El sistema resalta el paso exacto en el lienzo donde ocurrió la ruptura y determina que la brecha es la base de **Jerarquía de Operaciones**.
4. **Paso 4: Ruta de Práctica & Apoyo Interactivo (`Pantallas 5 y 6`):** Ruta de micro-ejercicios focalizados y acordeón pedagógico con micro-práctica. Al completarlos, se avanza a **Base Reparada (`Pantalla 9`)**.
5. **Paso 5: Resumen para Tutor / Docente / Familia (`Pantallas 7 y 8`):** Vista de progreso del estudiante y espacio de acompañamiento escolar que resume en lenguaje claro el avance y el apoyo familiar en el hogar.

---

## 📱 Mapeo de Pantallas

Esta implementación integra fielmente el sistema de diseño Textiles & Math con 9 pantallas completas:

| # | Nombre de Pantalla | Componente en `src/screens/` |
|---|-------------------|------------------------------|
| 1 | **Registro Inicial - Balam** | `Screen1Registration.tsx` |
| 2 | **Mi Camino (Hub Interactivo)** | `Screen2HomePath.tsx` |
| 3 | **Pizarra de Trabajo - Resolver Problema** | `Screen3Whiteboard.tsx` |
| 4 | **Feedback Visual - Dónde se Rompió el Razonamiento** | `Screen4ProcessFeedback.tsx` |
| 5 | **Mi Ruta de Práctica Personalizada (5 Nudos)** | `Screen5RemediationRoute.tsx` |
| 6 | **Material de Apoyo Interactivo y Micro-Práctica** | `Screen6InteractiveSupport.tsx` |
| 7 | **Mi Progreso Estudiante (Métricas y Racha)** | `Screen7StudentProgress.tsx` |
| 8 | **Vista Docente y Familia (Acompañamiento y PIN)** | `Screen8TeacherParentView.tsx` |
| 9 | **Base Reparada - Éxito de Aprendizaje** | `Screen9SuccessRepaired.tsx` |

---

## 🏗️ Arquitectura Técnica y Estructura de Carpetas

Construido en **TypeScript (Strict Mode)** con arquitectura limpia por capas desacopladas:

```
src/
├── domain/                          # Capa de Dominio Pedagógico
│   ├── types.ts                     # Modelos de datos estrictos (StudentProfile, MathStep, UserProgressMetrics, etc.)
│   ├── flowStateMachine.ts          # Máquina de estados finita y navegación
│   └── curriculum.ts                # Temas MVP y problemas pedagógicos (Jerarquía, Potencias, Cuadrática)
├── persistence/                     # Capa de Persistencia Adaptable (localStorage)
│   ├── storageKeys.ts               # Constantes de almacenamiento con prefijo balam_ y versión
│   ├── localStorageAdapter.ts       # Adaptador genérico tipado con recuperación de corrupción
│   └── balamRepository.ts           # Repositorio (getProfile, saveSession, resetDemo, getUserMetrics)
├── services/                        # Capa de Agente y Lógica Pedagógica
│   ├── PedagogicalAnalyzerService.ts# Interfaz estricta de análisis de proceso
│   ├── offlineEvaluator.ts          # Motor determinista offline (latencia <15ms, sin fallas de red)
│   └── geminiEvaluator.ts           # Adaptador con IA generativa (fallback automático al motor offline)
├── components/                      # Componentes UI Modulares
│   ├── layout/
│   │   ├── Navbar.tsx               # Barra superior con racha, puntos y tabs
│   │   ├── DemoControlBar.tsx       # Barra de pitch con flujo 1-5, cronómetro y Reset Demo
│   │   └── BottomNavigation.tsx     # Barra de navegación móvil
│   ├── whiteboard/
│   │   ├── DrawingCanvas.tsx        # Lienzo HTML5 (mouse/touch, trazos, borrador, colores)
│   │   ├── StepByStepEditor.tsx     # Editor ágil de pasos matemáticos
│   │   └── MathKeypad.tsx           # Teclado matemático rápido (x², √, ±, paréntesis)
│   ├── visualFeedback/
│   │   ├── ErrorStepMarker.tsx      # Marcado visual animado del paso roto
│   │   └── WeakFoundationCard.tsx   # Tarjeta de causa raíz y regla de oro matemática
│   └── common/
│       ├── BalamJaguarAvatar.tsx    # Avatar SVG del jaguar Balam
│       └── TextileRibbon.tsx        # Cinta textil decorativa guatemalteca
├── screens/                         # Las 9 pantallas del flujo
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
