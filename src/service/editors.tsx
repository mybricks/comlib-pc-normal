import { Data, IService } from './constants';

const setDescByData = ({ data, setDesc }: { data: Data; setDesc }) => {
  const { insideServiceContent } = data;
  const info: string[] = [];
  if (insideServiceContent && insideServiceContent.title) {
    info.push(`接口：${insideServiceContent.title}`);
  }
  setDesc(info.join('\n'));
};
export default {
  '@init': ({ data, setAutoRun, isAutoRun }: EditorResult<Data>) => {
    const autoRun = isAutoRun ? isAutoRun() : false;
    if (autoRun || data.immediate) {
      setAutoRun(true);
      data.immediate = true;
    }
  },
  '@connectorUpdated': ({ data, input, output, setDesc, setAutoRun, isAutoRun }, { connector }) => {
    const { id, inputSchema, outputSchema } = connector;
    if (id === data.connectorId) {
      if (outputSchema) {
        output.get('res')?.setSchema(outputSchema);
      }
      if (inputSchema) {
        input.get('params')?.setSchema(connector.inputSchema);
      }
      setDesc(`接口: ${connector.title}`);
    }
  },
  '@connectorRemoved': ({ data, input, output, setDesc }, { connector }) => {
    const { id, inputSchema, outputSchema } = connector;
    if (id === data.connectorId) {
      data.connectorId = void 0;
      if (outputSchema) {
        output.get('res')?.setSchema(void 0);
      }
      if (inputSchema) {
        input.get('params')?.setSchema(void 0);
      }
      setDesc(`${connector.title} 已失效`);
    }
  },
  ':root': [
    {
      title: '内部接口选择',
      type: 'insideService',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.insideServiceContent;
        },
        set({ data, setDesc, input, output }: EditorResult<Data>, value: IService) {
          const { content = {}, id } = value;
          const { inputSchema, outputSchema } = content;
          data.connectorId = id;
          data.serviceType = 'inside';
          data.insideServiceContent = {
            id,
            title: content.title
          };
          if (inputSchema) {
            input.get('params')?.setSchema(inputSchema);
          }
          if (outputSchema) {
            output.get('res')?.setSchema(outputSchema);
          }
          setDescByData({ data, setDesc });
        }
      }
    }
  ]
};
