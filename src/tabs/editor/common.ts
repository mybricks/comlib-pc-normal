import { Data } from 'src/domain-form/constants';
import { uuid } from '../../utils';
import { TabItem } from '../constants';
export const createItem = (): TabItem => {
  const key = uuid();
  return {
    key,
    name: '新标签页'
  };
};

export const addEventIO = (output, item: TabItem) => {
  const { key, name } = item;
  output.add(`${key}_into`, `${name}显示`, { type: 'any' });
  output.add(`${key}_leave`, `${name}隐藏`, { type: 'any' });
};

export const updateIO = ({ input, output, item }: { input?: any; output?: any; item: TabItem }) => {
  const { key, name } = item;
  input.setTitle(key, `${name}的通知数`);
  output.setTitle(`${key}_into`, `${name}显示`);
  output.setTitle(`${key}_leave`, `${name}隐藏`);
};

export const removeIOAndSlot = (props: EditorResult<Data>, item: TabItem) => {
  const { input, output, slots } = props;
  const { key, id } = item;
  if (!!id) {
    //兼容老数据
    slots.remove(id);
    output.remove(`${id}_into`);
    output.remove(`${id}_leave`);
  } else {
    slots.remove(key);
    output.remove(`${key}_into`);
    output.remove(`${key}_leave`);
    if (input.get(key)) {
      input.remove(key);
    }
  }
};
