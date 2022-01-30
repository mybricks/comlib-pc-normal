import get from 'lodash/get';
import set from 'lodash/set';
import { Data, FormItemProps } from '../../runtime';
import { FormItemType } from '../../type';
import {
  getCompositionItem,
  getFieldItemIndex,
  getFormItemIndex
} from '../../utils';

interface Props {
  data: Data;
  focusArea: any;
}
export const getFormItem = ({ focusArea, data }: Props): FormItemProps => {
  let formItem;
  if (focusArea.dataset.itemType === 'compositionItem') {
    formItem = getCompositionItem(data, focusArea);
  } else if (focusArea.dataset.itemType === 'dynamicFormItem') {
    const index = getFormItemIndex(focusArea);
    formItem =
      data.formItems[index].fieldsFormItems[getFieldItemIndex(focusArea)];
  } else {
    formItem = data.formItems[~~focusArea.dataset.itemIndex];
  }
  return formItem;
};

export const checkItemType = (
  { focusArea, data }: Props,
  types: FormItemType[]
) => {
  const formItem = getFormItem({ focusArea, data });
  return !!(formItem && types.includes(formItem.type));
};

export const setFormItemProps = <
  T extends keyof FormItemProps,
  P extends FormItemProps[T]
>(
  { focusArea, data }: Props,
  propKey: T,
  value: P
) => {
  const formItem = getFormItem({ focusArea, data });
  set(formItem, propKey, value);
};
export const getFormItemProps = <T extends keyof FormItemProps>(
  { focusArea, data }: Props,
  propKey: T
): FormItemProps[T] => {
  const formItem = getFormItem({ focusArea, data });
  return get(formItem, propKey);
};


export const defaultValidateFn = `
export default function (value) {
  return true
}
`