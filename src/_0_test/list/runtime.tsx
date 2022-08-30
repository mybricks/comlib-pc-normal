import {useCallback, useState} from "react";

export default function ({env, data, slots, inputs}) {
  // inputs['ds'](ds => {
  //   if(Array.isArray(ds)){
  //     ds.forEach(item=>{
  //       slots['content'].inputs['curDS'](item)
  //     })
  //   }
  // })

  slots['content'].outputs['test'](val=>{//订阅slot的输出
    console.log(val)
  })


  return (
    <div style={{border: '1px solid red', padding: 10}}>
      {/*<div>*/}
      {/*  <button>Test</button>*/}
      {/*</div>*/}
      {
        slots['content'].render({
          inputValues: {
            curDS: 'aaa'
          },
          key:0
        })
      }
      {/*{*/}
      {/*  slots['content'].render({*/}
      {/*    inputValues: {*/}
      {/*      curDS: 'bbbb'*/}
      {/*    },*/}
      {/*    key:1*/}
      {/*  })*/}
      {/*}*/}
    </div>
  )
}