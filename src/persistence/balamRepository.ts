import { STORAGE_KEYS } from './storageKeys';
import { LocalStorageAdapter } from './localStorageAdapter';
import { 
  StudentProfile, 
  WhiteboardSession, 
  DiagnosticResult, 
  AdultSummary,
  UserProgressMetrics,
  INITIAL_USER_METRICS
} from '../domain/types';

export interface IBalamRepository {
  getStudentProfile(): StudentProfile | null;
  saveStudentProfile(profile: StudentProfile): void;
  getCurrentSession(): WhiteboardSession | null;
  saveCurrentSession(session: WhiteboardSession): void;
  getDiagnostic(): DiagnosticResult | null;
  saveDiagnostic(diag: DiagnosticResult): void;
  getAdultSummary(): AdultSummary | null;
  saveAdultSummary(summary: AdultSummary): void;
  getUserMetrics(): UserProgressMetrics;
  saveUserMetrics(metrics: UserProgressMetrics): void;
  resetDemo(): void;
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

  getUserMetrics(): UserProgressMetrics {
    return LocalStorageAdapter.get<UserProgressMetrics>(STORAGE_KEYS.USER_METRICS, INITIAL_USER_METRICS);
  }

  saveUserMetrics(metrics: UserProgressMetrics): void {
    LocalStorageAdapter.set(STORAGE_KEYS.USER_METRICS, metrics);
  }

  resetDemo(): void {
    LocalStorageAdapter.clearPrefix('balam_');
  }
}

export const balamRepository = new BalamRepository();
