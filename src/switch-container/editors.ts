import { Status, Data } from './type';
import visibleOpt from '../components/editorRender/visibleOpt';

export default {
  ':slot': {},
  '@init': ({ style }) => {
    style.height = 'fit-content'
  },
  '@resize': {
    options: ['width', 'height']
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
          defaultSelect: data._editSelectId_ || data.statusList[0]?.id,
          customOptRender: visibleOpt,
          getTitle: ({ title }) => {
            return env.i18n(title);
          },
          onSelect(_id) {
            data._editSelectId_ = _id ?? data.statusList[0]?.id;
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
            if (!data._editSelectId_) {
              data._editSelectId_ = data.statusList[0]?.id;
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
