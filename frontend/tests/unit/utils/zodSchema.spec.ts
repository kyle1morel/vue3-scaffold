import { flushPromises, mount } from '@vue/test-utils';
import { useForm } from 'vee-validate';
import { defineComponent } from 'vue';
import { z } from 'zod';

import { optionalTextSchema, requiredTextSchema, toTypedSchema } from '@/utils/zodSchema';

import { runSchema } from '../../helpers';

// Mocks

// Fixtures

const testSchema = z.object({
  basic: z.object({ name: z.string().trim().min(1, 'Name is required') }),
  contact: z.object({ hasPhone: z.string(), phone: z.string().nullish() }).superRefine((value, ctx) => {
    if (value.hasPhone === 'Yes' && !value.phone) {
      ctx.addIssue({ code: 'custom', path: ['phone'], message: 'Phone is required' });
    }
  }),
  roles: z.array(z.object({ roleId: z.number('Role is required') }))
});

const validValues = {
  basic: { name: '  Name  ' },
  contact: { hasPhone: 'No' },
  roles: [{ roleId: 1 }]
};

// Mount

function mountForm() {
  let form!: ReturnType<typeof useForm>;
  mount(
    defineComponent({
      setup() {
        form = useForm({ validationSchema: toTypedSchema(testSchema) });
        return () => null;
      }
    })
  );
  return form;
}

// Tests

describe('toTypedSchema', () => {
  describe('parse', () => {
    it('returns the parsed output when valid', async () => {
      expect(await toTypedSchema(testSchema).parse(validValues)).toEqual({
        value: { ...validValues, basic: { name: 'Name' } },
        errors: []
      });
    });

    it('maps issues to vee-validate field paths, including refinements and array indices', async () => {
      const { value, errors } = await toTypedSchema(testSchema).parse({
        basic: { name: ' ' },
        contact: { hasPhone: 'Yes' },
        roles: [{ roleId: 1 }, {}]
      } as never);

      expect(value).toBeUndefined();
      expect(errors).toEqual([
        { path: 'basic.name', errors: ['Name is required'] },
        { path: 'contact.phone', errors: ['Phone is required'] },
        { path: 'roles[1].roleId', errors: ['Role is required'] }
      ]);
    });

    it('groups multiple issues on the same path', async () => {
      const schema = z.object({ code: z.string().min(3, 'Too short').regex(/^\d+$/, 'Digits only') });

      expect((await toTypedSchema(schema).parse({ code: 'a' })).errors).toEqual([
        { path: 'code', errors: ['Too short', 'Digits only'] }
      ]);
    });

    it('maps root level issues to an empty path', async () => {
      expect((await toTypedSchema(z.string('Required')).parse(undefined as never)).errors).toEqual([
        { path: '', errors: ['Required'] }
      ]);
    });
  });

  describe('vee-validate integration', () => {
    it('reports errors through useForm', async () => {
      const form = mountForm();
      form.setValues({ basic: { name: '' }, contact: { hasPhone: 'Yes' }, roles: [] });

      const result = await form.validate();

      expect(result.valid).toBe(false);
      expect(result.errors).toEqual({
        'basic.name': 'Name is required',
        'contact.phone': 'Phone is required'
      });
    });

    it('hands submit handlers the parsed output', async () => {
      const form = mountForm();
      const onSubmit = vi.fn();
      form.setValues(validValues);

      await form.handleSubmit(onSubmit)();
      await flushPromises();

      expect(onSubmit).toHaveBeenCalledWith({ ...validValues, basic: { name: 'Name' } }, expect.anything());
    });
  });
});

describe('optionalTextSchema', () => {
  it.each([
    ['', null],
    ['   ', null],
    [null, null],
    [undefined, undefined],
    ['  x  ', 'x']
  ])('accepts %j and outputs %j', async (input, output) => {
    expect(await runSchema(optionalTextSchema('Text', 5), input)).toEqual({ value: output, errors: {} });
  });

  it('rejects text over the max length after trimming', async () => {
    expect(Object.keys((await runSchema(optionalTextSchema('Text', 5), ' abcdef ')).errors)).toEqual(['']);
    expect((await runSchema(optionalTextSchema('Text', 5), '  abc  ')).value).toBe('abc');
  });

  it('has no max length when none is given', async () => {
    expect((await runSchema(optionalTextSchema('Text'), 'a'.repeat(5000))).errors).toEqual({});
  });
});

describe('requiredTextSchema', () => {
  it.each(['', '   ', null, undefined])('rejects %j', async (input) => {
    expect(Object.keys((await runSchema(requiredTextSchema('Text', 5), input)).errors)).toEqual(['']);
  });

  it('trims the output', async () => {
    expect(await runSchema(requiredTextSchema('Text', 5), '  x  ')).toEqual({ value: 'x', errors: {} });
  });

  it('rejects text over the max length', async () => {
    expect(Object.keys((await runSchema(requiredTextSchema('Text', 5), 'abcdef')).errors)).toEqual(['']);
  });
});
