import { validateVerificationRequest, sanitizeInput } from '../lib/validation';

describe('Verification Workflow Tests (Bounty Part 13)', () => {
  it('should successfully sanitize inputs to prevent injection', () => {
    const dirtyInput = "<script>alert('xss')</script> John Doe";
    const cleanInput = sanitizeInput(dirtyInput);
    expect(cleanInput).not.toContain('<script>');
  });

  it('should validate a correct verification request', () => {
    const validData = {
      name: 'Dr. Jane Smith',
      record_type: 'medical_licence',
      jurisdiction: 'United Kingdom',
      registration_number: '1234567'
    };
    
    const result = validateVerificationRequest(validData);
    expect(result.name).toBe('Dr. Jane Smith');
    expect(result.jurisdiction).toBe('United Kingdom');
  });

  it('should throw an error for missing required fields', () => {
    const invalidData = {
      record_type: 'medical_licence'
    };
    
    expect(() => validateVerificationRequest(invalidData)).toThrow('Valid name is required');
  });
});