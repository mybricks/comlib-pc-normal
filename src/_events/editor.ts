import { Data } from './types';

export default {
  '@init': ({}: EditorResult<Data>) => {
  },
  ':root': [
    {
      title: '应用事件',
      type: 'Select',
      options (props) {
        const options = props.env?.events?.map(item => {
          return {
            label: item.title,
            value: item.type
          }
        })
        return {
          options: options || [],
          placeholder: '请选择应用事件'
        }
      },
      value: {
        get ({ data }: EditorResult<Data>) {
          return data.eventType
        },
        set ({ data, input, env }: EditorResult<Data>, val: string) {
          const event = env.events.find(item => item.type === val)

          if (event.options.length > 1) {
            event.options.forEach((item, index) => {
              const pin = input.get(item.id)
              if (index === 0) {
                const defaultInput = data.eventInputs[0]
                defaultInput.key = item.id
                input.get('run').setTitle(item.title)
              } else {
                if (!pin) {
                  data.eventInputs.push({ id: item.id, key: item.id })
                  input.add({ id: item.id, title: item.title, schema: { type: 'any' } })
                }
              }
             
            })

            data.eventInputs.forEach(inputItem => {
              const option = event.options.find(item => item.id === inputItem.id)
              if (!option && inputItem.id !== 'run') {
                const pin = input.get(inputItem.id)
                if (pin) {
                  input.remove(inputItem.id)
                }
              }
            })

          } else {
            data.eventInputs.forEach(item => {
              if (item.id !== 'run') {
                const pin = input.get(item.id)
                if (pin) {
                  input.remove(item.id)
                }
              }
            })

            data.eventInputs = [{ id: 'run', key: event.options[0].id }]
            input.get('run').setTitle('触发事件')
          }

          data.eventType = val
        }
      }
    }
  ]
};
