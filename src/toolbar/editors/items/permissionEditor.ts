import { Data } from '../../types';
import { getBtnItemInfo } from '../../utils';

const PermissionEditor = [
  {
    title: '权限Key',
    description: '唯一标识的权限key',
    type: 'Text',
    options: {
      placeholder: '不填写，默认无权限校验'
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        return item.permissionKey;
      },
      set({ data, focusArea }: EditorResult<Data>, value: string) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        item.permissionKey = value;
      }
    }
  }
];

export default PermissionEditor;
