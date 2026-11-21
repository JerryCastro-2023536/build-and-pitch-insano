/**
 * Storage keys and versioning for Balam persistence
 */
export const BALAM_SCHEMA_VERSION = 2;

export const STORAGE_KEYS = {
  SCHEMA_VERSION: 'balam_schema_version',
  STUDENT_PROFILE: 'balam_v2_student_profile',
  CURRENT_SESSION: 'balam_v2_current_session',
  DIAGNOSTIC_RESULT: 'balam_v2_diagnostic_result',
  REMEDIATION_STATE: 'balam_v2_remediation_state',
  ADULT_SUMMARY: 'balam_v2_adult_summary',
  ACTIVE_SCREEN: 'balam_v2_active_screen',
  DEMO_MODE: 'balam_v2_demo_mode'
} as const;
