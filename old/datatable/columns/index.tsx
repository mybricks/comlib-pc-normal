import Normal from "./Normal";
import Btns from "./Btns";

export const REG = [
  {type: 'normal', title: '常规', impl: Normal},
  {type: 'btns', title: '按钮组', impl: Btns},
]

export default function ({col,ctx}) {
  let item

  REG.find(reg => {
    if (reg.type === col.type) {
      item = reg.impl({col,ctx})
      return true
    }
  })

  return item
}