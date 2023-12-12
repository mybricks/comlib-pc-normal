import dump from './dump.json';
import { dumpPreview, eventCheck } from '../../tools';

describe('对象取值', () => {
  beforeEach(() => {
    dumpPreview(dump);
  });

  it('检查', () => {
    cy.waitForWindow((win) => win.checklist.length === 5);

    eventCheck([
      {
        id: 'a',
        value: '() => {}'
      },
      {
        id: 'b',
        value: 2.2
      },
      {
        id: 'c',
        value: false
      },
      {
        id: 'd',
        value: {
          aa: '?'
        }
      },
      {
        id: 'e',
        value: '?'
      }
    ]);
  });
});
