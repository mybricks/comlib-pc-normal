import { Status, Data } from './type';
import visibleOpt from '../components/editorRender/visibleOpt';

export default {
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
        type: 'Array',
        options: {
          addText: '添加状态',
          customOptRender: visibleOpt,
          getTitle: ({ title }) => {
            return env.i18n(title);
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
              title: '状态值',
              type: 'valueSelect',
              options: ['text', 'number', 'boolean'],
              description: '状态的唯一标识，用于控制显示隐藏',
              value: 'value'
            }
          ],
        },
        value: {
          get({ data }: EditorResult<Data>) {
            console.log(data.statusList, data.statusList.map(i => {
              return {
                label: i.title,
                value: i.value,
              }
            }))
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
