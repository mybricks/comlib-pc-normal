import { BtnItem, Data } from '../../types';
import { getBtnItemInfo } from '../../utils';

const PermissionEditor = [
  {
    title: '权限信息配置',
    description: '权限信息配置',
    type: '_permission',
    options: {
      placeholder: '不填写，默认无权限校验'
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        return item.permission;
      },
      set({ data, focusArea }: EditorResult<Data>, value: { id: string, register: () => void }) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        item.permission = { id: value.id };
        value.register()
      }
    }
  }
];

export default PermissionEditor;
