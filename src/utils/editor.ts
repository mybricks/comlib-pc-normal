export enum EditorType {
  Text = 'Text',
  Switch = 'Switch',
  Select = 'Select',
  Character = 'Character',
  Code = 'Code',
  Button = 'Button',
  Number = 'Number',
  Map = 'Map',
  Event = '_Event',

  EventSwitch = 'EventSwitch'
}

export function Editor<Data>(
  title: string,
  type: EditorType,
  key?: keyof Data,
  editorProps?: any
) {
  const { get, set, outputId, title: eventTitle, schema } = editorProps || {};
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
        options: () => ({
          outputId: outputId
        }),
        ...editorProps,
        title,
        type
      };
    case EditorType.EventSwitch:
      return {
        title,
        items: [
          {
            title: '',
            type: EditorType.Switch,
            value: {
              get(props: EditorResult<Data>) {
                if (get) {
                  return get(props);
                }
                const { data } = props;
                return data[key];
              },
              set(props: EditorResult<Data>, value: any) {
                if (set) {
                  return set(props, value);
                }
                const { data, output } = props;
                if (!!value) {
                  outputId &&
                    !output.get(outputId) &&
                    output.add(outputId, eventTitle || title, schema);
                } else {
                  outputId && output.get(outputId) && output.remove(outputId);
                }
                data[key] = value;
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
        if (get) {
          return get(props);
        }
        const { data } = props;
        return data[key];
      },
      set(props: EditorResult<Data>, value: any) {
        if (set) {
          return set(props, value);
        }
        const { data } = props;
        data[key] = value;
      }
    }
  };
}
