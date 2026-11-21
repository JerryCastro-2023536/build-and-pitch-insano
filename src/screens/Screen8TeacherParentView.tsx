import React, { useState } from 'react';
import { StudentProfile, UserProgressMetrics } from '../domain/types';
import { balamRepository } from '../persistence/balamRepository';
import { TextileRibbon } from '../components/common/TextileRibbon';

export interface Screen8TeacherParentViewProps {
  profile: StudentProfile | null;
  onGoToWhiteboard?: () => void;
  onGoToSuccessRepaired?: () => void;
}

export const Screen8TeacherParentView: React.FC<Screen8TeacherParentViewProps> = ({
  profile,
  onGoToWhiteboard,
  onGoToSuccessRepaired
}) => {
  const [metrics, setMetrics] = useState<UserProgressMetrics>(() => balamRepository.getUserMetrics());
  const diagnostic = balamRepository.getDiagnostic();

  const studentName = profile?.name || 'Estudiante';
  const studentFirstName = studentName.split(' ')[0] || 'Estudiante';
  const studentGrade = profile?.grade 
    ? `${profile.grade} · ${profile.school || 'Secundaria'}` 
    : 'Nivel Básico';

  // Cheer Modal state
  const [isCheerModalOpen, setIsCheerModalOpen] = useState(false);
  const [cheerMsg, setCheerMsg] = useState('');
  const [cheerToast, setCheerToast] = useState<string | null>(null);

  // Teacher reply accordion state
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyInput, setReplyInput] = useState('');
  const [replyFeedback, setReplyFeedback] = useState(false);

  // Reminders & Duration state
  const [remindersActive, setRemindersActive] = useState(true);
  const [reminderDuration, setReminderDuration] = useState('20 min');

  // PIN Linking modal state
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinDigits, setPinDigits] = useState<string[]>([]);
  const [pinStatus, setPinStatus] = useState<string | null>(null);

  const handleSendCheer = (customText?: string) => {
    const textToSend = customText || cheerMsg || '¡Orgulloso de tu esfuerzo hoy!';
    setIsCheerModalOpen(false);
    setCheerMsg('');
    setCheerToast(`«${textToSend.slice(0, 32)}${textToSend.length > 32 ? '...' : ''}» enviado a ${studentName}`);
    setTimeout(() => setCheerToast(null), 4000);
  };

  const handleSendTeacherReply = () => {
    if (!replyInput.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      date: new Date().toISOString(),
      teacherName: metrics.linkedTeacher || 'Familiar',
      teacherRole: 'Seguimiento familiar',
      note: replyInput.trim(),
      assignedCount: 0
    };
    const updatedNotes = [...metrics.teacherNotes, newNote];
    const updatedMetrics: UserProgressMetrics = {
      ...metrics,
      teacherNotes: updatedNotes
    };
    balamRepository.saveUserMetrics(updatedMetrics);
    setMetrics(updatedMetrics);

    setReplyFeedback(true);
    setReplyInput('');
    setTimeout(() => {
      setReplyFeedback(false);
      setIsReplyOpen(false);
    }, 2500);
  };

  const handleKeypadPress = (val: string) => {
    if (pinDigits.length < 4) {
      setPinDigits([...pinDigits, val]);
      setPinStatus(null);
    }
  };

  const handleBackspace = () => {
    setPinDigits(pinDigits.slice(0, -1));
    setPinStatus(null);
  };

  const handleClearPin = () => {
    setPinDigits([]);
    setPinStatus(null);
  };

  const handleVerifyPin = () => {
    if (pinDigits.length === 4) {
      const updatedMetrics: UserProgressMetrics = {
        ...metrics,
        linkedTeacher: metrics.linkedTeacher || 'Licda. Docente Asignada'
      };
      balamRepository.saveUserMetrics(updatedMetrics);
      setMetrics(updatedMetrics);

      setPinStatus('¡Estudiante vinculado con éxito al centro escolar!');
      setTimeout(() => {
        setIsPinModalOpen(false);
        setPinDigits([]);
        setPinStatus(null);
      }, 1800);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col items-center selection:bg-primary-container selection:text-on-primary-container pb-28 pt-4">
      {/* Toast Notification */}
      {cheerToast && (
        <div className="fixed bottom-20 inset-x-4 max-w-[360px] mx-auto z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">favorite</span>
            <span className="font-sans text-xs">{cheerToast}</span>
          </div>
          <button
            onClick={() => setCheerToast(null)}
            className="text-on-surface-variant hover:text-white"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Cheer Modal */}
      {isCheerModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setIsCheerModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-[390px] bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl border-t border-outline-variant/30 flex flex-col gap-4 animate-slideUp"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">forum</span>
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-on-surface">Mensaje de Ánimo</h3>
                  <p className="font-mono text-[10px] text-on-surface-variant">Directo a la pantalla de {studentName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsCheerModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant"
                aria-label="Cerrar modal"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase text-on-surface-variant tracking-wider block mb-2 font-bold">
                Sugerencias rápidas:
              </span>
              <div className="flex flex-col gap-1.5">
                {[
                  '«¡Orgulloso de tu esfuerzo hoy!»',
                  '«¡Paso a paso se teje el saber!»',
                  '«¡Descansa la vista, te queremos!»'
                ].map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCheerMsg(sug.replace(/«|»/g, ''))}
                    className="text-left font-sans text-xs p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 text-on-surface transition-all flex items-center justify-between"
                  >
                    <span>{sug}</span>
                    <span className="material-symbols-outlined text-primary text-[16px]">add_circle</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="customCheerMessage" className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                O escribe tus palabras:
              </label>
              <textarea
                id="customCheerMessage"
                rows={2}
                value={cheerMsg}
                onChange={e => setCheerMsg(e.target.value)}
                placeholder="Escribe un mensaje cariñoso..."
                className="w-full bg-surface-container-low rounded-xl p-2.5 text-xs text-on-surface border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary resize-none font-sans"
              />
            </div>

            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCheerModalOpen(false)}
                className="flex-1 min-h-[44px] rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-sans text-xs font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleSendCheer()}
                className="flex-[1.4] min-h-[44px] rounded-xl bg-primary text-on-primary font-mono text-xs font-bold uppercase flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Enviar con cariño</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN Linking Modal */}
      {isPinModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setIsPinModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-[360px] bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl border-t border-outline-variant/30 flex flex-col gap-3.5 animate-slideUp"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">pin</span>
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-on-surface">Vincular Estudiante</h3>
                  <p className="font-mono text-[10px] text-on-surface-variant">Código escolar de 4 dígitos</p>
                </div>
              </div>
              <button
                onClick={() => setIsPinModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant"
                aria-label="Cerrar modal PIN"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* PIN Display */}
            <div className="flex flex-col items-center gap-1.5 my-1">
              <span className="font-sans text-xs text-on-surface-variant">Ingresa el PIN numérico:</span>
              <div className="flex gap-2.5 justify-center items-center">
                {[0, 1, 2, 3].map(idx => (
                  <div
                    key={idx}
                    className="w-11 h-12 rounded-xl bg-surface-container-low border-2 border-outline-variant/60 flex items-center justify-center font-mono text-lg font-bold text-primary"
                  >
                    {pinDigits[idx] || '—'}
                  </div>
                ))}
              </div>
              {pinStatus ? (
                <p className="font-sans text-xs text-emerald-600 font-bold">{pinStatus}</p>
              ) : (
                <p className="font-mono text-[10px] text-on-surface-variant">Ejemplo: 4 8 2 1</p>
              )}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto w-full">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num)}
                  className="h-11 rounded-xl bg-surface-container hover:bg-surface-container-high font-mono text-base font-bold text-on-surface flex items-center justify-center active:scale-95 transition-all"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearPin}
                className="h-11 rounded-xl bg-surface-container-low hover:bg-surface-container font-mono text-xs font-bold text-on-surface flex items-center justify-center active:scale-95 transition-all"
              >
                C
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="h-11 rounded-xl bg-surface-container hover:bg-surface-container-high font-mono text-base font-bold text-on-surface flex items-center justify-center active:scale-95 transition-all"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="h-11 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface flex items-center justify-center active:scale-95 transition-all"
                aria-label="Borrar dígito"
              >
                <span className="material-symbols-outlined text-[18px]">backspace</span>
              </button>
            </div>

            <button
              type="button"
              disabled={pinDigits.length < 4}
              onClick={handleVerifyPin}
              className="w-full min-h-[44px] rounded-xl bg-primary disabled:bg-surface-variant disabled:text-on-surface-variant/50 text-on-primary font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all mt-1"
            >
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              <span>Verificar y Vincular</span>
            </button>
          </div>
        </div>
      )}

      <main className="w-full max-w-[440px] px-4 flex flex-col gap-4">
        {/* Companion Greeting */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase text-on-surface-variant tracking-wider font-bold">
              Espacio de Alianza Educativa
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface text-[10px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Sincronizado
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-0.5">
            Acompañamiento Escolar y Familiar
          </h1>
          <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Traducimos los pasos de aprendizaje en guía cercana para el hogar y el aula.
          </p>
        </div>

        {/* Student Selector Card */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3 border border-outline-variant/40">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-serif text-lg font-bold border-2 border-primary">
                  {studentName.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow">
                  <span className="material-symbols-outlined text-white text-[12px]">school</span>
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-sans text-sm font-bold text-on-surface truncate">{studentName}</span>
                  <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                </div>
                <span className="font-sans text-xs text-on-surface-variant truncate">{studentGrade}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPinModalOpen(true)}
              title="Vincular o cambiar estudiante por código PIN"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">pin</span>
            </button>
          </div>

          {/* Active Sync Badge */}
          <div className="bg-surface-container-low rounded-xl p-2.5 flex items-start gap-2.5 border border-outline-variant/30">
            <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
              sync_saved_locally
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-[10px] text-secondary uppercase font-bold tracking-wide">
                {metrics.linkedTeacher ? 'Sincronización activa' : 'Vinculación escolar'}
              </span>
              <p className="font-sans text-xs text-on-surface leading-tight mt-0.5">
                {metrics.linkedTeacher ? (
                  <>Con <strong className="font-bold">{metrics.linkedTeacher}</strong> (Docente titular de Matemática).</>
                ) : (
                  'Sin docente vinculado. Ingresa el PIN escolar para conectar el aula.'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Mayan Tapestry Micro-Banner */}
        <div className="bg-white rounded-2xl p-3 flex items-center justify-between shadow-sm border border-outline-variant/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">auto_stories</span>
            <span className="font-mono text-xs font-bold text-on-surface">Unidad: Jerarquía y Potencias</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map(i => (
              <span
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${
                  metrics.completedNodes > i ? 'bg-primary' : 'bg-surface-variant'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Section 2: Diagnóstico en Palabras Claras */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3 border border-outline-variant/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-container/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">psychology_alt</span>
            </div>
            <h2 className="font-serif text-sm font-bold text-on-surface">¿En qué trabaja {studentFirstName} hoy?</h2>
          </div>

          {diagnostic ? (
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              {studentFirstName} comprende las operaciones básicas. Su diagnóstico identificó una oportunidad de afianzar la regla:{' '}
              <span className="font-mono bg-surface-container px-1 py-0.5 rounded text-on-surface font-bold">
                {diagnostic.visualFeedback.ruleBroken}
              </span>.
            </p>
          ) : (
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              {studentFirstName} aún no ha realizado un diagnóstico de razonamiento en la pizarra. Una vez resuelto el primer ejercicio, aquí verás la explicación clara de sus fortalezas y áreas de apoyo.
            </p>
          )}

          <div className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-2 border border-outline-variant/30">
            <div className="flex items-center justify-between text-on-surface">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                Estado pedagógico
              </span>
              <span className="font-mono text-sm font-bold text-primary">
                {diagnostic ? `${Math.round(metrics.completedNodes * 20)}% afianzado` : '0% afianzado'}
              </span>
            </div>
            <div className="w-full bg-surface-variant h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-700 rounded-full"
                style={{ width: `${diagnostic ? Math.round(metrics.completedNodes * 20) : 0}%` }}
              />
            </div>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="material-symbols-outlined text-primary text-[16px]">verified_user</span>
              <span className="font-sans text-xs font-semibold text-on-surface">
                {diagnostic ? 'En proceso de remediación guiada en Balam' : 'Pendiente de diagnóstico inicial'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Consejo Práctico para el Hogar */}
        <div className="bg-amber-50/80 rounded-2xl shadow-sm p-4 flex flex-col gap-2.5 border border-amber-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">lightbulb</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] uppercase font-bold text-primary tracking-wider">
                Guía Familiar de 5 Minutos
              </span>
              <h3 className="font-serif text-sm font-bold text-on-surface">¿Cómo apoyarlo en casa sin estrés?</h3>
            </div>
          </div>

          <p className="font-sans text-xs text-on-surface leading-relaxed">
            {diagnostic ? (
              <>
                Cuando veas que {studentFirstName} hace su tarea, recuérdale con una sonrisa:
                <span className="font-bold text-primary italic block mt-1">
                  «¡{diagnostic.adultSummary.parentTips[0] || 'Primero la corona de la potencia, luego el resto!'}»
                </span>
              </>
            ) : (
              <>
                Cuando {studentFirstName} empiece a resolver ejercicios en la pizarra digital, acompáñale observando su proceso en el cuaderno:
                <span className="font-bold text-primary italic block mt-1">
                  «¡Paso a paso se teje el entendimiento!»
                </span>
              </>
            )}
          </p>

          <div className="bg-white/90 rounded-xl p-2.5 flex items-start gap-2 border border-amber-200/60">
            <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">favorite</span>
            <p className="font-sans text-xs text-on-surface">
              <strong className="font-bold">Regla del tejedor:</strong> No le des la respuesta directa; invítalo a explicarte qué hilo u operación manda primero en su cuaderno.
            </p>
          </div>
        </div>

        {/* Section 4: Bitácora Docente Directa */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3 border border-outline-variant/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[18px]">stylus_note</span>
              </div>
              <h2 className="font-serif text-sm font-bold text-on-surface">Bitácora Docente</h2>
            </div>
            <span className="font-mono text-[10px] text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">schedule</span> {metrics.teacherNotes.length > 0 ? 'Actualizado' : 'Sin pendientes'}
            </span>
          </div>

          {metrics.teacherNotes.length > 0 ? (
            metrics.teacherNotes.map((note, idx) => (
              <div key={idx} className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-2 border border-outline-variant/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-serif text-xs font-bold">
                    {note.teacherName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-xs font-bold text-on-surface">{note.teacherName}</span>
                    <span className="font-sans text-[10px] text-on-surface-variant">{note.teacherRole}</span>
                  </div>
                </div>
                <p className="font-sans text-xs text-on-surface leading-relaxed pl-9">
                  «{note.note}»
                </p>
              </div>
            ))
          ) : (
            <div className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-2 border border-outline-variant/30">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-secondary/30 text-secondary flex items-center justify-center font-serif text-xs font-bold">
                  <span className="material-symbols-outlined text-[14px]">edit_note</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-xs font-bold text-on-surface">Bitácora de Observaciones</span>
                  <span className="font-sans text-[10px] text-on-surface-variant">Sin notas pendientes</span>
                </div>
              </div>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed pl-9">
                Aún no hay notas registradas por el docente. Las tareas y comentarios asignados aparecerán aquí automáticamente.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-mono text-[10px]">
                <span className="material-symbols-outlined text-[14px] text-primary">task_alt</span>
                {metrics.completedExercisesCount} completados
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-mono text-[10px]">
                <span className="material-symbols-outlined text-[14px] text-secondary">event</span>
                {metrics.linkedTeacher ? 'Docente vinculado' : 'Sin docente vinculado'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsReplyOpen(!isReplyOpen)}
              className="inline-flex items-center gap-1 text-primary hover:text-on-primary-container font-mono text-xs font-bold min-h-[32px] px-2 rounded-lg bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">reply</span>
              <span>Responder</span>
              <span className={`material-symbols-outlined text-[14px] transition-transform ${isReplyOpen ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
          </div>

          {/* Accordion Reply */}
          {isReplyOpen && (
            <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/40 animate-fadeIn">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
                Nota rápida a {metrics.linkedTeacher || 'Docente'}
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {['¡Gracias! Reforzaremos hoy', 'Comprendido, pendientes de la práctica'].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReplyInput(chip)}
                    className="text-[11px] font-sans px-2.5 py-1 rounded-full bg-surface-container hover:bg-primary/10 text-on-surface border border-outline-variant/40 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyInput}
                  onChange={e => setReplyInput(e.target.value)}
                  placeholder="Escribe un mensaje breve..."
                  className="flex-1 bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-sans"
                />
                <button
                  type="button"
                  onClick={handleSendTeacherReply}
                  className="min-h-[40px] px-3.5 rounded-xl bg-secondary text-on-secondary font-mono text-xs flex items-center justify-center gap-1 active:scale-95 transition-all shadow"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </button>
              </div>
              {replyFeedback && (
                <div className="p-2 rounded-lg bg-secondary-container/40 text-on-secondary-container text-xs flex items-center gap-1.5 font-sans">
                  <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                  <span>Nota enviada a la bitácora escolar de {studentName}.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 5: Action Tools & Utilities */}
        <div className="flex flex-col gap-2.5">
          {/* Send Cheer Button */}
          <button
            type="button"
            onClick={() => setIsCheerModalOpen(true)}
            className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-primary text-on-primary font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm hover:brightness-105 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">forum</span>
            <span>Enviar mensaje de ánimo a {studentName.split(' ')[0]}</span>
            <span className="text-base">💬</span>
          </button>

          {/* Study Reminders Card */}
          <div className="w-full p-4 rounded-2xl bg-white text-on-surface flex flex-col gap-3 shadow-sm border border-outline-variant/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[20px]">alarm_on</span>
                <div className="flex flex-col text-left">
                  <span className="font-sans text-xs font-bold text-on-surface leading-tight">
                    Recordatorios de estudio
                  </span>
                  <span className="font-mono text-[10px] text-on-surface-variant">
                    {remindersActive ? `Activos • Sesiones de ${reminderDuration}` : 'Desactivados'}
                  </span>
                </div>
              </div>

              {/* Accessible Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={remindersActive}
                onClick={() => setRemindersActive(!remindersActive)}
                className={`w-12 h-6 rounded-full relative p-0.5 transition-colors focus:outline-none ${
                  remindersActive ? 'bg-primary' : 'bg-surface-container-highest'
                }`}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    remindersActive ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {remindersActive && (
              <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between">
                <span className="font-mono text-[10px] text-on-surface-variant">Duración recomendada:</span>
                <div className="inline-flex rounded-lg bg-surface-container p-0.5 gap-0.5">
                  {['15 min', '20 min', '25 min'].map(dur => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setReminderDuration(dur)}
                      className={`px-2 py-1 font-mono text-[10px] rounded-md transition-all ${
                        reminderDuration === dur
                          ? 'bg-white text-primary font-bold shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {dur.replace(' min', 'm')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Link Another Student Button */}
          <button
            type="button"
            onClick={() => setIsPinModalOpen(true)}
            className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-white hover:bg-surface-container text-on-surface flex items-center justify-between border border-outline-variant/40 shadow-sm transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[20px]">pin</span>
              <div className="flex flex-col text-left">
                <span className="font-sans text-xs font-bold text-on-surface leading-tight">
                  Vincular otro estudiante
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant">Ingresar con código PIN escolar</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">chevron_right</span>
          </button>

          {/* Pitch Closure / Success Repaired Trigger */}
          {onGoToSuccessRepaired && (
            <button
              type="button"
              onClick={onGoToSuccessRepaired}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">military_tech</span>
              <span>Ver Cierre (Base Reparada)</span>
            </button>
          )}

          {onGoToWhiteboard && (
            <button
              type="button"
              onClick={onGoToWhiteboard}
              className="w-full min-h-[40px] px-4 py-2 rounded-xl bg-transparent text-secondary hover:bg-secondary-container/20 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">draw</span>
              <span>Regresar a la Pizarra de Práctica</span>
            </button>
          )}
        </div>

        <p className="font-mono text-[10px] text-on-surface-variant text-center px-4">
          Balam protege el ritmo personal de {studentName.split(' ')[0]}. Sin presiones, tejiendo entendimiento paso a paso.
        </p>

        <TextileRibbon />
      </main>
    </div>
  );
};
