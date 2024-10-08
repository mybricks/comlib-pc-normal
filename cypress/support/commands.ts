import compareSnapshotCommand from 'cypress-image-diff-js/dist/command';
import type { RecurseDefaults } from 'cypress-recurse';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * @param name The name of the snapshots that will be generated
       * @param testThreshold @default 0 A number between 0 and 1 that represents the allowed percentage of pixels that can be different between the two snapshots
       * @param retryOptions @default { limit: 1 } @see {@link RecurseDefaults}
       * @example cy.compareSnapshot('empty-canvas', 0.1)
       */
      compareSnapshot(
        name: string,
        testThreshold?: number,
        retryOptions?: Partial<typeof RecurseDefaults>
      ): Chainable<Element>;

      getIframeBody(iframeSelector: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

compareSnapshotCommand({
  failureThreshold: 0.00, // threshold for entire image
  failureThresholdType: 'percent', // percent of image or number of pixels
  customDiffConfig: { threshold: 0.1 }, // threshold for each pixel
  capture: 'viewport' // capture viewport in screenshot
});

Cypress.Commands.overwrite('compareSnapshot', (originalFn, _, name, retryOptions) => {
  if (Cypress.env('DEBUG')) {
    // @ts-ignore
    name = `debug-${name}`;
  }
  return originalFn(_, name, retryOptions);
});

// @ts-ignore
Cypress.Commands.add('getIframeBody', (iframeSelector) => {
  return cy
    .get(iframeSelector)
    .its('0.contentDocument.body').should('not.be.empty')
    .then(cy.wrap);
});