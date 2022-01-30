import { Data } from '../../runtime';
import { checkItemType, getFormItemProps } from './utils';

const SwitchItemBaseEditor = [
  {
    title: '开关配置',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      return checkItemType({ data, focusArea }, ['switch']);
    },
    items: [
      {
        title: '打开时展示文案',
        type: 'Text',
        description: '开关打开时展示文案',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'options')?.[0];
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            const options: any[] = getFormItemProps(
              { data, focusArea },
              'options'
            );
            options[0] = value;
          }
        }
      },
      {
        title: '关闭时展示文案',
        type: 'Text',
        description: '开关关闭时展示文案',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'options')?.[1];
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            const options: any[] = getFormItemProps(
              { data, focusArea },
              'options'
            );
            options[1] = value;
          }
        }
      }
    ]
  }
];

export { SwitchItemBaseEditor };
