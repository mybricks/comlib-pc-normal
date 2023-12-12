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

      /**
       * 等待，直到满足判断条件
       * @param cb 判断条件
       * @example cy.waitForWindow((win) => win.checklist.length === 5)
       */
      waitForWindow(cb: (win: Cypress.AUTWindow) => boolean): void;
    }
  }
}
compareSnapshotCommand();

// cypress/support/commands.js

Cypress.Commands.add('waitForWindow', (cb: (win: Cypress.AUTWindow) => boolean) => {
  cy.window().should((win) => {
    return new Cypress.Promise((resolve) => {
      if (cb(win)) {
        resolve();
      } else {
        setTimeout(() => {
          resolve();
        }, 300);
      }
    });
  });
});
