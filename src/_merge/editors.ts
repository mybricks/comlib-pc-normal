import { Data, Schemas } from './constants';

// 获取输入项序号
function getInputOrder({ input }) {
  const ports = input.get();
  const { id } = ports?.pop?.() || {};
  return (Number(id.slice(5)) || 0) + 1;
}
export default {
  ':root': [
    {
      title: '添加输入项',
      type: 'Button',
      value: {
        set({ input }: EditorResult<Data>) {
          const idx = getInputOrder({ input });
          const title = `输入项${idx}`;
          const hostId = `input${idx}`;
          input.add(hostId, title, Schemas.Follow, true);
        }
      }
    }
  ]
};
