import { Data } from './runtime'

export default function ({ input, output }): boolean {
  // 1.0.0 -> 1.0.1
  if (!input.get('slotProps')) {
    input.add('slotProps', '插槽参数', { type: 'string' })
  }

  // 1.0.1 -> 1.0.2
  if (!output.get('onChange')) {
    output.add('onChange', '数据变化', { type: 'string' })
  }

  return true
}