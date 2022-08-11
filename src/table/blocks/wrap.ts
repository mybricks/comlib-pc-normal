import { uuid } from '../../utils'
import { BLOCKS_KEY } from '../constants'

export default {
  name: 'xg.table_wrap',
  title: '换行',
  data: {
    key: '',
    style: {
      padding: [0, 0]
    }
  },
  render(renderer, data, { curFn }) {
    renderer.setColour('#13c2c2')

    renderer.appendDummyInput().appendField('换行符')

    renderer.setPreviousStatement(true)
    renderer.setNextStatement(true)
  },
  editors: [
    {
      title: '间距',
      type: 'Inputnumber',
      options: [
        {title: '上', min: 0, max: 50, width: 50},
        {title: '下', min: 0, max: 50, width: 50},
      ],
      value: {
        get({data}) {
          return data.style.padding
        },
        set({data}, value: number[]) {
          data.style.padding = value
        },
      }
    },
  ],
  to(type, block, data, { curFn }) {
    if (type === 'js') {

      return `${BLOCKS_KEY}.push({
        customType: 'wrap',
        key: '${uuid()}',
        style: { 'padding' : [${data.style.padding}] }
      });`
    }
  }
}
