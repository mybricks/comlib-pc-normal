import css from './NormalButton.less'
import {Button} from 'antd'
import {useCallback} from "react";

export default function NormalButton({env, data, inputs, outputs}) {
  inputs['title'](val => {
    data.title = val
  })
  const click = useCallback(() => {
    outputs['click'](data.outVal)
  }, [])
  // const dblClick = useCallback(() => {
  //   outputs['dblClick'](1)
  // }, [])
  return (
    <div className={css.button} onClick={click}>
      <Button type={data.theme}>
        {data.title}
      </Button>
      <div className={css.cover} data-text={1}></div>
    </div>
  )
}