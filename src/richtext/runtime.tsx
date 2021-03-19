import React from 'react'
import { RuntimeParams } from 'src/types'
import { useComputed, useObservable } from '@mybricks/rxui'
import css from './runtime.less'

export class Data {
  content?: string
}

export default function ({env, data, inputs, outputs}: RuntimeParams<Data>) {
  const { runtime } = env
  const textContext = useObservable(Data, (next: any) => next(data))

  textContext.content = data.content

  const content = useComputed(() => {
    if (!textContext.content && !runtime) {
      return <div>在编辑栏中添加文本内容</div>
    }
    return (
      <div
        className={css['text-container']}
        dangerouslySetInnerHTML={{ __html: textContext.content || '' }}>
      </div>
    )
  })

  return content
}

// export default function () {
//   return <div>富文本</div>
// }