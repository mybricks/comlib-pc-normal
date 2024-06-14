
import { formItemPropsSchema } from "./constants";
export default function ({
  data,
  output,
  input
}: UpgradeParams<any>): boolean {

  /**
   * v1.0.1 -> v1.0.2 修改schema结构
   */
  // if (data.enableArray === true) {
  //   input.get('store').setSchema({
  //     "type": 'object',
  //     "properties": {
  //       "data": {
  //         "type": "array",
  //         "items": formItemPropsSchema
  //       }
  //     }
  //   })
  // } else if (!data.enableArray) {
  //   input.get('store').setSchema({
  //     "type": 'object',
  //     "properties": {
  //       "data": formItemPropsSchema
  //     }
  //   })
  // }
  //=========== 1.0.2 end ===============

  /**
   * v1.0.4 输入schema结构固定为数组
   */
  input.get('store').setSchema({
    "type": 'object',
    "properties": {
      "data": {
        "type": "array",
        "items": formItemPropsSchema
      }
    }
  })
  //=========== 1.0.4 end ===============
  return true;
}