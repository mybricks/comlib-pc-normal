function getIoOrder(io) {
  const ports = io.get();
  const { id } = ports.pop();
  return Number(id.replace(/\D+/, '')) + 1;
}

export default {
  ':root': [
    {
      title: '添加参数',
      type: 'Button',
      value: {
        set({ input }: EditorResult<{}>) {
          const idx = getIoOrder(input);
          const hostId = `input.inputValue${idx}`;
          const title = `参数${idx}`;
          input.add(hostId, title, { type: 'follow' }, true);
        }
      }
    }
  ]
};
