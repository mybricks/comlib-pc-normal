import { SizeEnum } from './types';

export const BtnItemDataSetKey = 'data-btn-idx';
export const SlotItemDataSetKey = 'data-slot-idx';

export const InputIds = {
  SetDisable: 'setDisable',
  SetEnable: 'setEnable',

  SetHidden: 'setHidden',
  SetVisible: 'setVisible',

  SetBtnText: 'setBtnText',

  SetBtnOpenLoading: 'setBtnOpenLoading',
  SetBtnCloseLoading: 'setBtnCloseLoading',

  SetBtnStyle: 'SetBtnStyle'
};

export const OutputIds = {
  SetDisableDone: 'setDisableDone',
  SetEnableDone: 'setEnableDone',

  SetHiddenDone: 'setHiddenDone',
  SetVisibleDone: 'setVisibleDone',

  SetBtnTextDone: 'setBtnTextDone',

  SetBtnOpenLoadingDone: 'setBtnOpenLoadingDone',
  SetBtnCloseLoadingDone: 'setBtnCloseLoadingDone',

  SetBtnStyleDone: 'SetBtnStyle',

  DoubleClick: 'doubleClick'
};

export const Schemas = {
  Follow: {
    type: 'follow'
  },
  Any: {
    type: 'any'
  },
  String: {
    type: 'string'
  },
  Number: {
    type: 'number'
  },
  Style: {
    type: 'object',
    properties: {
      color: {
        title: '字体颜色',
        type: 'string'
      }
    }
  }
};

export const SizeHeightMap = {
  [SizeEnum.Small]: '24px',
  [SizeEnum.Middle]: '32px',
  [SizeEnum.Large]: '40px'
};
