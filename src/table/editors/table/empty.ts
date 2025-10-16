import { Data } from '../../types';
import { SlotIds} from '../../constants';

export const emptyEditor = [
  {
    title: '自定义空白状态',
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.isEmpty || false;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.isEmpty = value;
      }
    }
  },
  {
    title: '图片地址',
    type: 'ImageSelector',
    ifVisible({ data }: EditorResult<Data>) {
      return !!data.isEmpty;
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return data.image;
      },
      set({ data }: EditorResult<Data>, value: string) {
        data.image = value;
      }
    }
  },
  {
    title: '空状态文案',
    type: 'Text',
    description: '自定义描述内容',
    options: {
      placeholder: '自定义描述内容',
      locale: true
    },
    ifVisible({ data }: EditorResult<Data>) {
      return !!data.isEmpty;
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return data.description;
      },
      set({ data }: EditorResult<Data>, value: string) {
        data.description = value;
      }
    }
  },
  {
    title: '空状态插槽',
    description: '开启后，支持在表格空状态时自定义内容', 
    type: 'switch', 
    value: {
      get({ data }: EditorResult<Data>) {
        return data.useEmptySlot; //TODO123 
      },
      set({ data, slot }: EditorResult<Data>, value: boolean) {
        if (value) {
          slot.add(SlotIds.EMPTY_CONTENT, '空状态插槽');
        } else {
          slot.remove(SlotIds.EMPTY_CONTENT);
        }
        data.useEmptySlot = value;
      }
    }
  },
];

export const emptyStyleEditor = {
  items: [
    {
      title: '空状态图片',
      options: ['size', 'border', { type: 'background', config: { disableBackgroundImage: true } }],
      target: ['.ant-empty-image > svg', '.emptyImage']
    },
    {
      title: '空状态文案',
      options: ['font'],
      target: [`.ant-empty-description`, '.emptyDescription']
    }
  ]
};