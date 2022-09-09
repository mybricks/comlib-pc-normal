import { uuid } from '../../utils';
import { Data, BtnItem } from '../types';

export const getNewBtn = (): BtnItem => {
  const key = uuid();
  const doubleClickKey = uuid();
  return {
    key,
    doubleClickKey,
    text: '按钮',
    showText: true
  };
};

export const getBtnItemInfo = (
  data: Data,
  focusArea,
  datasetKey = 'btnIdx'
): { item: BtnItem; index: number } => {
  const key = focusArea?.dataset?.[datasetKey];
  const index = data.btnList.findIndex((item) => key && item.key === key);
  const res = index === -1 ? undefined : data.btnList[index];
  return { item: res || getNewBtn(), index };
};
