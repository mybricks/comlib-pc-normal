import {useCallback} from "react";

let cur = 0

export default function ({env, data, inputs, outputs}) {

  inputs['test']((val, relOutputs) => {
    data.val = val

    relOutputs['testOut'](cur++)
  })

  const setVal = useCallback(()=>{
    data.val = Math.random()
  },[])

  return (
    <div style={{border: '1px solid blue', padding: 10}}>
      ::{data.val}::
      <button onClick={setVal}>setVal</button>
    </div>
  )
}