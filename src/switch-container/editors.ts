import { Status, Data } from './type';
import once from 'lodash/once';
import visibleOpt from '../components/editorRender/visibleOpt';

let count = 0
let prevAction = ''
const defaultClick = (index, prevAction) => {
  if (count > 0 || prevAction === 'select') {
    return;
  }
  const elements = document.querySelectorAll('div[class*="listItemSelect"]');
  if (!elements[index]?.className?.includes?.('active')) {
    // 再次点击组件，对本来激活状态的进行点击
    elements[index]?.click();
  }
}
export default {
  ':slot': {},
  '@resize': {
    options: ['width']
  },
  ':root': ({ data, slot, env }: EditorResult<Data>, cate1) => {
    cate1.items = [
      {
        title: '使用第一项作为默认状态',
        description: '开启时, 默认显示列表的第一项; 关闭时, 默认不显示',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useDefaultStatus;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.useDefaultStatus = value;
          }
        }
      },
      {
        title: '状态列表',
        description: '通过眼睛图标，控制编辑态各状态的显示和隐藏；选中某一状态，可往此状态的容器添加内容',
        type: 'Array',
        options: {
          selectable: true,
          addText: '添加状态',
          customOptRender: visibleOpt,
          getTitle: ({ title, id, _id }, index) => {
            // return env.i18n(title);
            let isActive = _id === data._editSelectId || id === data._editSelectId
            if (isActive) {
              setTimeout(() => {
                defaultClick(index, prevAction)
              }, 0)
            }
            return env.i18n(title);
          },
          onSelect(_id) {
            data._editSelectId = _id ?? data.statusList[0]?.id;
            count ++;
            prevAction = 'select';
            const elements = document.querySelectorAll('div[class*="listItemSelect"]');
            if (!data._activeArrayClass) {
              let flag = false
              for (let i = 0; i < elements.length; i++) {
                const ele = elements[i];
                const classNames = ele.className.split(' ');
                classNames.forEach(className => {
                  if (className.startsWith('active')) {
                    // 如果类名以"active"开头，记录激活状态的类名
                    data._activeArrayClass = className;
                    flag = true;
                  }
                });
                if (flag) {
                  break
                }
              }
              if (flag === false) {
                // 手动触发第一个元素点击选中
                elements[0]?.click()
              }
            }
          },
          onAdd: (id) => {
            const newSlot = {
              id,
              title: `状态${data.statusList.length + 1} `,
              visible: true,
            };
            slot.add(id, newSlot.title);
            return newSlot;
          },
          items: [
            {
              title: '状态名称',
              type: 'text',
              description: '状态的名称，语义化区分不同状态',
              value: 'title'
            },
            {
              title: '状态值',
              type: 'valueSelect',
              options: ['text', 'number', 'boolean'],
              description: '状态的唯一标识，用于控制显示隐藏',
              value: 'value'
            },
          ],
        },
        value: {
          get({ data }: EditorResult<Data>) {
            if (!data._editSelectId) {
              data._editSelectId = data.statusList[0]?.id;
            }
            if (count >= 1) {
              count = 0
              prevAction = ''
            }
            return data.statusList;
          },
          set({ data }: EditorResult<Data>, value) {
            data.statusList = value;
          },
        },
      },
      {
        title: '状态切换事件',
        type: '_Event',
        options: {
          outputId: 'onChange'
        }
      },
    ]
  },
};
