import compareSnapshotCommand from 'cypress-image-diff-js/dist/command';
declare global {
  namespace Cypress {
    interface Chainable {
      compareSnapshot(name: string): void;
    }
  }
}
compareSnapshotCommand();
