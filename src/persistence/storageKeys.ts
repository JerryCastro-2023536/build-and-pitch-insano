/**
 * Storage keys and versioning for Balam persistence
 */
export const BALAM_SCHEMA_VERSION = 3;

export const STORAGE_KEYS = {
  SCHEMA_VERSION: 'balam_schema_version',
  STUDENT_PROFILE: 'balam_v3_student_profile',
  CURRENT_SESSION: 'balam_v3_current_session',
  DIAGNOSTIC_RESULT: 'balam_v3_diagnostic_result',
  REMEDIATION_STATE: 'balam_v3_remediation_state',
  ADULT_SUMMARY: 'balam_v3_adult_summary',
  ACTIVE_SCREEN: 'balam_v3_active_screen',
  USER_METRICS: 'balam_v3_user_metrics'
} as const;
