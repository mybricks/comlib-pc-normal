import toJSON from './toJSON.json';
import { toJSONPreview, eventCheck, enhancedIt } from '@/../cypress/tools';

describe('对象取值', () => {
  beforeEach(() => {
    toJSONPreview(toJSON);
  });

  enhancedIt('检查', () => {
    cy.window().should((win) => {
      expect(win.checklist.length).eq(6);
    });

    eventCheck([
      {
        id: '输入数据',
        value: {
          a: '() => {}',
          b: 2.2,
          c: false,
          d: {
            aa: '?'
          }
        }
      },
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
