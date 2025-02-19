import { Data, LabelWidthType } from '../types';
import { getFormItem, getFormItemProp, setFormItemProps } from '../utils';

const additionFormItemEditor = {
  ':child(mybricks.normal-h5.form-container/form-addition-container)': {
    title: '其他内容',
    items: [
      {
        title: '样式',
        items: [
          {
            title: '宽度模式',
            type: 'Select',
            options: [
              {
                label: '24栅格',
                value: 'span'
              },
              {
                label: '固定宽度(px)',
                value: 'px'
              }
            ],
            value: {
              get({ data, name, id }: EditorResult<Data>) {
                return getFormItemProp({ data, id, name }, 'widthOption');
              },
              set({ data, id, name, inputs }: EditorResult<Data>, value: LabelWidthType) {
                setFormItemProps({ data, id, name }, 'widthOption', value);
              }
            }
          },
          {
            title: '宽度配置(共24格)',
            type: 'Slider',
            options: [
              {
                max: 24,
                min: 1,
                step: 1,
                formatter: '/24'
              }
            ],
            ifVisible({ data, id, name }: EditorResult<Data>) {
              const { item } = getFormItem(data, { id, name });

              return item?.widthOption !== 'px';
            },
            value: {
              get({ data, id, name }: EditorResult<Data>) {
                return getFormItemProp({ data, id, name }, 'span');
              },
              set({ data, id, name }: EditorResult<Data>, value: number) {
                setFormItemProps({ data, id, name }, 'span', value);
              }
            }
          },
          {
            title: '宽度配置(px)',
            type: 'text',
            options: {
              type: 'number'
            },
            ifVisible({ data, id, name }: EditorResult<Data>) {
              const { item } = getFormItem(data, { id, name });
              return item?.widthOption === 'px';
            },
            value: {
              get({ data, id, name }: EditorResult<Data>) {
                return getFormItemProp({ data, id, name }, 'width');
              },
              set({ data, id, name }: EditorResult<Data>, value: number) {
                setFormItemProps({ data, id, name }, 'width', value);
              }
            }
          }
        ]
      }
    ]
  },
}

export default additionFormItemEditor