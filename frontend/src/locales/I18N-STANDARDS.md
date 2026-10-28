# Localization Standards

This document is the standard for how user-facing text is organized in
`en-CA.json` and used from components. New and changed text should
follow it. If a case isn't covered here, settle it and add it here.

Most of these rules are enforced by `npm run lint`, and by the
pre-commit hook. It runs `@intlify/eslint-plugin-vue-i18n` (configured
in `eslint.config.mts`) and then `check-i18n-keys.mjs`:

| Check                  | Catches                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `no-raw-text`          | Text written straight into a template, including `label`, `placeholder`, `alt`, `aria-label` and similar attributes |
| `no-missing-keys`      | A literal key in a `t()` call or `<i18n-t>` that isn't in `en-CA.json`                                              |
| `key-format-style`     | A key that isn't camelCase                                                                                          |
| `valid-message-syntax` | A message vue-i18n can't parse                                                                                      |
| `check-i18n-keys.mjs`  | A key in `en-CA.json` that no code uses, and a dynamic key prefix that matches no keys                              |

The script replaces the plugin's `no-unused-keys` rule, which can't see
dynamic keys (see [Dynamic keys](#dynamic-keys)).

## Everything user-facing is localized

Any text a user can see or hear goes through vue-i18n. That includes
labels, placeholders, help text, tooltips, headings, button text,
toasts, dialog text, validation messages, `alt` text and `aria-label`s.

These are **not** localized:

- Internal `Error(...)` messages that only developers see.
- Data, such as values from the API or proper nouns like city names.

Format examples, such as a phone placeholder of `(250) 555-0100`, **are**
localized, because formats differ between locales.

## Top-level groups

The file has exactly five top-level groups. Don't add another without
updating this document.

| Group        | Use for                                                                      | Example                     |
| ------------ | ---------------------------------------------------------------------------- | --------------------------- |
| `app`        | Text about the application itself                                            | `app.name`, `app.logoAlt`   |
| `components` | Text owned by one shared component in `src/components`                       | `components.footer.privacy` |
| `ui`         | Generic text any component can use: actions, loading, errors, toast prefixes | `ui.actions.cancel`         |
| `validation` | Validation message templates                                                 | `validation.required`       |
| `views`      | Text owned by one view in `src/views`                                        | `views.developer.title`     |

Under `components` and `views`, the key is the component or view name in
camelCase, without a `View` suffix: `AppDrawer.vue` uses
`components.appDrawer`, and `DemoFormView.vue` uses `views.demoForm`.

## Ownership and reuse

A component or view reads only from:

1. its own `components.<name>` or `views.<name>` group,
2. `app`, `ui` and `validation`.

Don't reach into another component's or view's group because the text
happens to match today. The two will drift apart, and nobody will know
that renaming one changes the other.

The exception is text that **names** another view. For example, the
home page's "Demo form" button uses `views.demoForm.title`, because it
should always match that page's title.

When the same generic word shows up in several places (Cancel, Close,
Submit, Log in), it belongs in `ui.actions`, not in each component. If
you find yourself copying a string into a second group, check whether
it belongs in `ui` instead.

## Naming keys

- **camelCase**, including acronyms: `bcServicesCard`, `idir`, not
  `BCServicesCard` or `IDIR`.
- Name the **meaning**, not the wording. Use `title`, not
  `vue3Scaffold`. Use `requirement`, not `ifYouDoNotHave`. Changing the
  wording should never mean renaming the key.
- Avoid numbered keys such as `contact1`, `contact2`. If text is split
  so a link can sit in the middle, use one message with placeholders
  (see [Embedding links](#embedding-links)).
- Keep keys **sorted alphabetically** at every level, so new keys have
  an obvious place to go and diffs stay small.

## Grouping within a view or component

Group keys by what they are once a view has more than a handful. These
group names are the standard ones; reuse them before inventing new ones:

| Group          | Holds                                                                              |
| -------------- | ---------------------------------------------------------------------------------- |
| `fields`       | Form field labels, keyed by field name                                             |
| `help`         | Help text and tooltips, keyed by field name                                        |
| `placeholders` | Input placeholders, keyed by field name                                            |
| `options`      | Option labels for selects and radios, one subgroup per list, keyed by option value |
| `errors`       | Messages specific to this view that `validation` doesn't cover                     |
| `sections`     | Section headings                                                                   |
| `headings`     | Other headings on the page                                                         |
| `status`       | Status pills and indicators                                                        |

When several things on a page share the same shape, group by the thing.
For example, each identity provider on the login page has a login
button, a sign-up link and a requirement:

```json
"oidcLogin": {
  "headings": { "internalUsers": "...", "register": "..." },
  "providers": {
    "bcsc": { "login": "...", "register": "...", "requirement": "..." },
    "idir": { "login": "..." }
  },
  "title": "Log in"
}
```

Key `fields`, `help` and `placeholders` by the **form field name**, so
the same name links a field to all of its text, and a view can look the
text up by name (see [Dynamic keys](#dynamic-keys)).

## Using text in code

**Components and views:** use `useI18n()`.

```ts
const { t } = useI18n();
```

**Code outside a component**, such as composables, stores, utilities and
zod helpers: use the global instance.

```ts
import { i18n } from '@/i18n';

i18n.t('ui.actions.ok');
```

**Option lists:** the stored value is a code that never depends on the
language. Only the label is translated. Option keys are camelCase names,
not the codes themselves, because codes like `AB` aren't camelCase.

```ts
const provinces = [
  { label: t('views.demoForm.options.provinces.alberta'), value: 'AB' },
  { label: t('views.demoForm.options.provinces.britishColumbia'), value: 'BC' }
];
```

Don't store keys in data to translate later, for example a menu item
with `label: 'components.appDrawer.home'`. Call `t()` where the data is
built, so the key appears in full where it's used.

## Dynamic keys

A key may end in a template variable when a group is looked up by name,
such as a form field's label. The variable **must be typed from the
locale file**, never a plain `string`, so a misspelled name fails to
compile:

```ts
import type { MessageSchema } from '@/i18n';

const field = (name: keyof MessageSchema['views']['demoForm']['fields']) => t(`views.demoForm.fields.${name}`);

field('firstName'); // OK
field('firstNmae'); // TypeScript error
```

Keep the variable to the **last segment** of the key, so the prefix
before it names exactly one group.

`check-i18n-keys.mjs` treats a dynamic key as using every key under its
prefix. So it can't tell when one key in that group stops being used.
Remove a group's key when you remove the field or option it belongs to.

Never build a key from user input or API data. Map API values to a
typed name first.

## Interpolation

Use named placeholders, and pass values in. Never join translated
fragments together in code, because word order differs between
languages.

```json
"required": "{label} is a required field"
```

```ts
t('validation.required', { label: t('views.demoForm.fields.firstName') });
```

## Embedding links

When a link or component sits inside a sentence, translate the whole
sentence and use `<i18n-t>` slots. Always set `scope="global"`.
Without it, vue-i18n looks for a component-local scope and logs a
warning.

```json
"contact": {
  "callUs": "Call, email or text us",
  "message": "We can help in over 220 languages. {callUs}, or {serviceCentre}",
  "serviceCentre": "find a service centre"
}
```

```vue
<i18n-t keypath="components.footer.contact.message" scope="global" tag="p">
  <template #callUs>
    <a href="...">{{ t('components.footer.contact.callUs') }}</a>
  </template>
  <template #serviceCentre>
    <a href="...">{{ t('components.footer.contact.serviceCentre') }}</a>
  </template>
</i18n-t>
```

## Writing the text

- **Sentence case** for headings, labels and buttons: "Internal
  government users", not "Internal Government Users".
- **No styling in the string.** Write "More info" and use the Tailwind
  `uppercase` class, not "MORE INFO".
- **No trailing period** on link text, button text or headings.
- **"Log in" is the verb, "login" is the noun.** Buttons and titles say
  "Log in".

## Tests

Specs mount through `mountComponent`, which installs the real i18n
plugin, so tests assert on the English text a user sees:

```ts
expect(wrapper.text()).toContain('Log in');
```

Don't mock `vue-i18n` in a spec. A mock hides missing keys, and it
breaks any code that imports `@/i18n`.

## Checklist for a change

- [ ] `npm run lint` passes.
- [ ] No raw user-facing text in scripts either. Lint only checks
      templates.
- [ ] New keys sit in the owning component's or view's group, or in
      `ui` if they're generic.
- [ ] Keys are camelCase, describe meaning, and are sorted.
- [ ] No string is duplicated across groups.
- [ ] Any dynamic key ends in a variable typed from `MessageSchema`.
- [ ] Removed text has its key removed too.
