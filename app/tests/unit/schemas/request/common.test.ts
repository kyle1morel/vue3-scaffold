import { dateOnlyString, email, phoneNumber, uuidv4 } from '#src/schemas/request/common';

describe('common validators', () => {
  describe('dateOnlyString', () => {
    it.each(['2000-01-01', '1999-12-31', '2024-02-29'])('accepts valid past dates: %s', (value) => {
      const result = dateOnlyString.safeParse(value);
      expect(result.success).toBe(true);
      expect(result.success && result.data).toBe(value);
    });

    it.each(['2025-13-01', '2025-00-10', '2025-01-32', '2025-1-01', 'abcd', '', '2025-01-01T00:00:00Z'])(
      'rejects badly formatted date-only strings: %s',
      (value) => {
        const { success } = dateOnlyString.safeParse(value);
        expect(success).toBe(false);
      }
    );

    it('rejects a future date', () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

      const { success } = dateOnlyString.safeParse(tomorrow);
      expect(success).toBe(false);
    });

    it('rejects a syntactically valid but impossible calendar date', () => {
      const { success } = dateOnlyString.safeParse('2025-02-29');
      expect(success).toBe(false);
    });
  });

  describe('email', () => {
    it('accepts a valid email address', () => {
      const { success } = email.safeParse('user@example.com');
      expect(success).toBe(true);
    });

    it('rejects an invalid email address', () => {
      const { success } = email.safeParse('not-an-email');
      expect(success).toBe(false);
    });
  });

  describe('phoneNumber', () => {
    it('accepts a valid phone number', () => {
      const { success } = phoneNumber.safeParse('+1 (604) 555-1234');
      expect(success).toBe(true);
    });

    it('rejects an invalid phone number', () => {
      const { success } = phoneNumber.safeParse('not-a-phone');
      expect(success).toBe(false);
    });
  });

  describe('uuidv4', () => {
    it('accepts a valid UUID v4', () => {
      const { success } = uuidv4.safeParse('68a9a188-4d67-46e3-92a4-b57174354231');
      expect(success).toBe(true);
    });

    it('rejects an invalid UUID', () => {
      const { success } = uuidv4.safeParse('not-a-uuid');
      expect(success).toBe(false);
    });
  });
});
