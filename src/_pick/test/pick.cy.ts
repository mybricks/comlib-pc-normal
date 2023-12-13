import toJSON from './toJSON.json';
import { toJSONPreview, eventCheck } from '@/../cypress/tools';

describe('对象取值', () => {
  beforeEach(() => {
    toJSONPreview(toJSON);
  });

  it('检查', () => {
    cy.window().should((win) => {
      expect(win.checklist.length).eq(5);
    });

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
