export default {
  ':root': [
    {
      title: '添加Scope Slot',
      type: 'button',
      value: {
        set({ data, inputs, outputs, slots, setDesc }, connector) {
          slots.add({
            id: 'test',
            title: 'test',
            type: 'scope',
            inputs: [
              {
                id: 'test',
                title: 'Test',
                schema: {
                  type: 'string'
                }
              }
            ]
          });
        }
      }
    },
    {
      title: '添加Slot I/O',
      type: 'button',
      value: {
        set({ data, inputs, outputs, slots, setDesc }, connector) {
          slots.get('content').inputs.add('test', 'test', { type: 'any' });
        }
      }
    },
    {},
    {
      title: '添加内部事件',
      type: '_event',
      options: {
        outputId: 'ok',
        slotId: 'content'
      }
    }
  ]
};
