/**
 * Runs axe-core over a mounted component and fails with a readable list of
 * any accessibility violations, e.g.:
 *
 *   const { wrapper } = mountComponent(SomeView);
 *   await expectNoAxeViolations(wrapper.element);
 *
 * Two rules are off because unit tests can't satisfy them:
 * - `color-contrast` needs real layout and rendering, which happy-dom lacks
 * - `region` wants every node inside a landmark, but a view mounted on its
 *   own has no app header or `<main>` around it
 */
import axe from 'axe-core';
import { expect } from 'vitest';

export async function expectNoAxeViolations(element: Element) {
  // axe only audits nodes in the document, and a mounted wrapper isn't attached
  const host = document.createElement('div');
  host.appendChild(element.cloneNode(true));
  document.body.appendChild(host);

  // RouterLinkStub renders <a> without the href a real router-link has, which axe treats as a non-link
  for (const link of host.querySelectorAll('a:not([href])')) link.setAttribute('href', '#');

  try {
    const { violations } = await axe.run(host, {
      rules: { 'color-contrast': { enabled: false }, region: { enabled: false } }
    });

    const found = violations.flatMap((v) => v.nodes.map((node) => `${v.id}: ${v.help} -- ${node.target.join(' ')}`));
    expect(found).toEqual([]);
  } finally {
    host.remove();
  }
}
