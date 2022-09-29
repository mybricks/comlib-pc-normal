import { Data } from './runtime'

export default {
  ':root'({ data }: EditorResult<{ type }>, ...catalog) {
    catalog[0].title = '常规';
    catalog[0].items = [
      {
        title: '类型',
        type: 'Select',
        options: [
          { label: '圆形', value: 'disc' },
          { label: '环形', value: 'circle' },
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.styleType
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.styleType = value
          },
        }
      }
    ]
  }
}