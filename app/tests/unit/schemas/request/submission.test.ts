import { schema } from '#src/schemas/request/submission';

describe('submission request schemas', () => {
  describe('createSubmission body', () => {
    const valid = {
      firstName: 'Jane',
      email: 'jane.doe@example.com',
      province: 'BC',
      contactMethod: 'email'
    };

    it('accepts the required fields alone', () => {
      expect(schema.createSubmission.body.safeParse(valid).success).toBe(true);
    });

    it('accepts null optional fields, as the form sends for blanks', () => {
      const result = schema.createSubmission.body.safeParse({
        ...valid,
        phone: null,
        startDate: null,
        quantity: null,
        city: null,
        category: null,
        comments: null,
        notes: null
      });

      expect(result.success).toBe(true);
    });

    it.each([
      ['a missing first name', { firstName: undefined }],
      ['an empty first name', { firstName: '' }],
      ['an invalid email', { email: 'not-an-email' }],
      ['an unknown province', { province: 'ON' }],
      ['an unknown contact method', { contactMethod: 'fax' }],
      ['an invalid phone number', { phone: '555' }],
      ['a quantity below 1', { quantity: 0 }],
      ['a quantity above 100', { quantity: 101 }],
      ['a fractional quantity', { quantity: 1.5 }],
      ['a timestamp start date', { startDate: '2026-01-15T00:00:00Z' }],
      ['an unknown field', { password: 'secret' }]
    ])('rejects %s', (_case, change) => {
      expect(schema.createSubmission.body.safeParse({ ...valid, ...change }).success).toBe(false);
    });

    it('rejects a future start date', () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

      expect(schema.createSubmission.body.safeParse({ ...valid, startDate: tomorrow }).success).toBe(false);
    });
  });

  describe('submission id params', () => {
    it.each([
      ['getSubmission', schema.getSubmission.params],
      ['deleteSubmission', schema.deleteSubmission.params]
    ])('%s accepts a uuid and rejects anything else', (_name, params) => {
      expect(params.safeParse({ submissionId: '0b6a1f3e-6d2c-4f0e-9a51-3c8e2d7b4a10' }).success).toBe(true);
      expect(params.safeParse({ submissionId: 'not-a-uuid' }).success).toBe(false);
    });
  });

  describe('listSubmissions query', () => {
    it('defaults to the first page of 10', () => {
      expect(schema.listSubmissions.query.parse({})).toEqual({ page: 1, pageSize: 10 });
    });

    it('coerces query string numbers', () => {
      expect(schema.listSubmissions.query.parse({ page: '2', pageSize: '25' })).toEqual({ page: 2, pageSize: 25 });
    });

    it.each([{ page: '0' }, { pageSize: '0' }, { pageSize: '101' }, { page: 'abc' }])('rejects %o', (query) => {
      expect(schema.listSubmissions.query.safeParse(query).success).toBe(false);
    });
  });
});
