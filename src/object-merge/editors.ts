import { CODE_TEMPLATE, COMMENTS, Data } from './constants';

function mergeSchema(schema1: any = {}, schema2: any = {}) {
  const schema = schema1;
  schema.properties = {
    ...schema.properties,
    ...schema2.properties
  };
  return schema;
}

export default {
  '@outputConnected'({ data, output }, fromPin, toPIn) {
  },
  '@inputConnected'({ data, output }, fromPin) {
    data.outputSchema = mergeSchema(data.outputSchema, fromPin.schema)
    output.get('output').setSchema(data.outputSchema);
  },
  '@inputDisConnected'({ data, input }, fromPin, toPIn) {
  },
  '@outputDisConnected'({ data, output }, fromPin, toPIn) {
  },
  ':root': [
    {
      title: '添加输入项',
      type: 'Button',
      value: {
        set({ input }) {
          const idx = getInputOrder({ input });
          const title = `输入项${idx}`;
          const hostId = `input${idx}`;
          input.add(
            hostId,
            title,
            {
              type: 'follow'
            }
          );
        }
      }
    },
  ]
};

function getInputOrder({ input }) {
  const ports = input.get();
  const { id } = ports.pop();
  return Number(id.slice(5)) + 1;
}