import { InputIds } from '../../constants';
import { Data } from '../../types';

const headerTitleEditor = {
  '[data-table-header-title]': {
    title: '头部标题设置',
    items: [
      {
        title: '显示总数',
        type: 'switch',
        ifVisible({ data }: EditorResult<Data>) {
          return data.useTableTitle;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useTableTitleWithCount;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.useTableTitleWithCount = value;
          }
        }
      },
      {
        title: '标题',
        type: 'text',
        ifVisible({ data }: EditorResult<Data>) {
          return data.useTableTitle;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            return data.tableTitle;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.tableTitle = value;
          }
        }
      },
      {
        title: '动态标题',
        type: 'Switch',
        ifVisible({ data }: EditorResult<Data>) {
          return data.useTableTitle;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            return data.useDynamicTableTitle;
          },
          set({ data, input }: EditorResult<Data>, value: boolean) {
            const hasEvent = input.get(InputIds.SET_DYNAMIC_TABLE_TITLE);
            if (value) {
              !hasEvent &&
                input.add(InputIds.SET_DYNAMIC_TABLE_TITLE, '设置标题', {
                  type: 'string'
                });
            } else {
              hasEvent && input.remove(InputIds.SET_DYNAMIC_TABLE_TITLE);
            }
            data.useDynamicTableTitle = value;
          }
        }
      },
      {
        title: '标题样式',
        type: 'character',
        ifVisible({ data }: EditorResult<Data>) {
          return data.useTableTitle;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            return data.tableTitleStyle;
          },
          set({ data }: EditorResult<Data>, value: any) {
            data.tableTitleStyle = value;
          }
        }
      }
    ]
  }
};

export default headerTitleEditor;
