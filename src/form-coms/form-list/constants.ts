import { InputIds as CommonInputIds, OutputIds as CommonOutputIds } from '../types';

export const SlotIds = {
  FormItems: 'formItems'
};

export const SlotInputIds = {
  ON_CHANGE: 'onChange',
  CUR_VALUE: 'curValue',
  VALIDATE_TRIGGER: 'validateTrigger',
};

export const OutputIds = {
  ...CommonOutputIds,
  ON_CLICK_ADD: 'add',
  ON_CLICK_REMOVE: 'remove',
};

export const InputIds = {
  ...CommonInputIds,
  AddRow: 'addRow',
  RemoveRow: 'removeRow',
};

export const labelWidthTypes = {
  SPAN: 'span',
  PX: 'px'
}