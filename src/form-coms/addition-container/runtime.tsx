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
}: RuntimeParams<any>) {
  return slots[SlotId].render();
}
