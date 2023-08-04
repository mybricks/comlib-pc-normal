import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Data } from './types';
import css from './runtime.less';
import { SlotId } from './contants';

export default function Runtime({
  env,
  data,
  slots,
  inputs,
  outputs,
  parentSlot,
  id,
  name
}: RuntimeParams<Data>) {
  return slots[SlotId].render();
}
