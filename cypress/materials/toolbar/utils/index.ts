import { Data, BtnItem } from '../types';

function uuid(pre = 'u_', len = 6) {
  const seed = 'abcdefhijkmnprstwxyz0123456789', maxPos = seed.length;
  let rtn = '';
  for (let i = 0; i < len; i++) {
    rtn += seed.charAt(Math.floor(Math.random() * maxPos));
  }
  return pre + rtn;
}

export const getNewBtn = (): BtnItem => {
  const key = uuid();
  return {
    key,
    text: '按钮',
    showText: true,
    dataType: 'number',
    outVal: 0,
    inVal: '',
    isCustom: false,
    src: '',
    contentSize: [14, 14],
    iconDistance: 8,
    loading: false,
    useDynamicLoading: false,
    style: {
      height: 'auto',
      width: 'auto'
    },
    isSlot: false,
    useIcon: false
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
