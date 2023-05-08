import { Data } from './constants';

export default function ({ input, output, data, slot }: UpgradeParams<Data>): boolean {
  data.tabList.forEach(({ key, name }) => {
    if (!output.get(`${key}_into`)) {
      output.add(`${key}_into`, `${name}显示`, { type: 'any' });
    }
    if (!output.get(`${key}_leave`)) {
      output.add(`${key}_leave`, `${name}隐藏`, { type: 'any' });
    }
    if (!input.get(key)) {
      input.add(key, `${name}的通知数`, {
        type: 'string'
      });
    }
    if (!slot.get(key)) {
      slot.add({
        id: key,
        title: name
      });
    }
  });
  return true;
}
