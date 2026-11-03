// Global types for the LicenseCheck application
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface VerificationPayload {
  name: string;
  record_type: string;
  jurisdiction: string;
  registration_number?: string;
}