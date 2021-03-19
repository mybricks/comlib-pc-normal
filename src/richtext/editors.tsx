import { Data } from './runtime'

export default {
  ':root': [
    {
      title: '文本内容',
      type: 'RichText',
      value: {
        get({ data }) {
          return data.content
        },
        set({ data }, value: string) {
          data.content = value
        }
      }
    }
  ]
}