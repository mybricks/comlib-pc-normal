import { Data, LocationEnum } from '../types';

const IconEditor = [
  {
    title: '图标',
    type: 'Switch',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        const comId = focusArea.dataset.formActionsItem as string;
        return data.actions.items.find((item) => item.key === comId)?.useIcon;
      },
      set({ data, focusArea }: EditorResult<Data>, value: boolean) {
        const comId = focusArea.dataset['formActionsItem'];
        const item = data.actions.items.find((item) => item.key === comId);
        if(item){
          item.useIcon = value;
        }
      }
    }
  },
  {
    title: '图标配置',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const comId = focusArea.dataset['formActionsItem'];
      const item = data.actions.items.find((item) => item.key === comId);
      if(item){
        return !!item.useIcon;
      }
    },
    items: [
      { 
        title: '图标库',
        type: 'Icon',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const comId = focusArea.dataset.formActionsItem as string;
            return data.actions.items.find((item) => item.key === comId)?.icon;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const comId = focusArea.dataset['formActionsItem'];
            const item = data.actions.items.find((item) => item.key === comId);
            if(item){
              item.icon = value;
            }
          }
        }
      },
      {
        title: '图标位置',
        type: 'Select',
        options: [
          { label: '位于文字前', value: LocationEnum.FRONT },
          { label: '位于文字后', value: LocationEnum.BACK }
        ],
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const comId = focusArea.dataset.formActionsItem as string;
            return data.actions.items.find((item) => item.key === comId)?.iconLocation || LocationEnum.FRONT;
          },
          set({ data, focusArea }: EditorResult<Data>, value: LocationEnum) {
            if (!focusArea) return;
            const comId = focusArea.dataset['formActionsItem'];
            const item = data.actions.items.find((item) => item.key === comId);
            if(item){
              item.iconLocation = value;
            }
          }
        }
      },
      {
        title: '间距',
        type: 'Inputnumber',
        options: [{ min: 0, max: 1000, width: 200 }],
        description: '图标与文字间的距离',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const comId = focusArea.dataset.formActionsItem as string;
            const item = data.actions.items.find((item) => item.key === comId);
            if(item){
              return [item.iconDistance];
            }
          },
          set({ data, focusArea }: EditorResult<Data>, value: number[]) {
            if (!focusArea) return;
            const comId = focusArea.dataset['formActionsItem'];
            const item = data.actions.items.find((item) => item.key === comId);
            if(item){
              item.iconDistance = value[0];
            }
          }
        }
      }
    ]
  }
];

export default IconEditor;