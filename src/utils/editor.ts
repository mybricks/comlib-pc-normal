export enum EditorType {
  Text = 'Text',
  TextArea = 'TextArea',
  Switch = 'Switch',
  Select = 'Select',
  Character = 'Character',
  Code = 'Code',
  Button = 'Button',
  Number = 'Number',
  Map = 'Map',
  ColorPicker = 'ColorPicker',
  Icon = 'Icon',
  Slider = 'Slider',
  Event = '_Event',

  EventSwitch = 'EventSwitch'
}

export function Editor<Data>(
  title: string,
  type: EditorType,
  key?: keyof Data | null,
  editorProps?: any
) {
  const { value, title: eventTitle } = editorProps || {};
  let { options } = editorProps || {};

  switch (type) {
    case EditorType.Number:
      type = EditorType.Text;
      if (options) {
        options.type = 'number';
      } else {
        options = {
          type: 'number'
        };
      }
      break;
    case EditorType.Event:
      return {
        ...editorProps,
        title,
        type
      };
    case EditorType.EventSwitch:
      const { outputId, schema } = options;
      return {
        title,
        items: [
          {
            title: '',
            type: EditorType.Switch,
            value: {
              get(props: EditorResult<Data>) {
                if (value?.get) {
                  return value?.get(props);
                }
                const { data } = props;
                return data[key];
              },
              set(props: EditorResult<Data>, val: any) {
                if (value?.set) {
                  return value?.set(props, val);
                }
                const { data, output } = props;
                if (!!val) {
                  outputId &&
                    !output.get(outputId) &&
                    output.add(outputId, eventTitle || title, schema);
                } else {
                  outputId && output.get(outputId) && output.remove(outputId);
                }
                data[key] = val;
              }
            }
          },
          {
            title: '',
            type: EditorType.Event,
            ifVisible({ data }: EditorResult<Data>) {
              return !!data[key];
            },
            options: () => ({
              outputId: outputId
            })
          }
        ]
      };
    default:
      break;
  }
  return {
    ...editorProps,
    options,
    title,
    type,
    value: {
      get(props: EditorResult<Data>) {
        if (value?.get) {
          return value?.get(props);
        }
        const { data } = props;
        return data[key];
      },
      set(props: EditorResult<Data>, val: any) {
        if (value?.set) {
          return value?.set(props, val);
        }
        const { data } = props;
        data[key] = val;
      }
    }
  };
}
