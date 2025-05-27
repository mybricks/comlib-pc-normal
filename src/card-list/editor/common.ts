import { Data } from 'src/domain-form/constants';
import { uuid } from '../../utils';
import { TabItem } from '../constants';
export const createItem = (data): TabItem => {
  const key = uuid();
  return {
    id: key,
    key,
    name: `卡片${data.tabList.length + 1}`,
    closable: data.closable,
  };
};

export const updateIO = ({
  input,
  output,
  item,
  slots,
  env
}: {
  input?: any;
  output?: any;
  item: TabItem;
  slots;
  env;
}) => {
  const { id, key, name: originName } = item;
  const name = env.i18n(originName);
  input.setTitle(key, `${name}的通知数`);
  output.setTitle(`${id}_into`, `${name}显示`);
  output.setTitle(`${id}_leave`, `${name}隐藏`);
  slots.get(item.key) && slots.get(item.key)!.setTitle(`${name}`);
};

export const removeIOAndSlot = (props: EditorResult<Data>, item: TabItem) => {
  const { input, output, slots } = props;
  const { key, id } = item;
  slots.remove(id);
  if (input.get(key)) {
    input.remove(key);
  }
};

export const getFocusTab = (props: EditorResult<Data>) => {
  const { data, focusArea } = props;
  if (!focusArea) return {};
  const { index } = focusArea;
  return data.tabList[index];
};
