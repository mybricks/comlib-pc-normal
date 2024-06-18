export enum StatusEnum {
    check = '开启时',
    unCheck = '关闭时',
}

export const inputIdList = ["setValue", "setInitialValue"];

export const outputIdList = ["setValueDone", "setInitialValueDone", "onInitial", "onChange", "onValidate", "returnValue"];

export const schemaUpdate = (input, output, value, checkedValue)=>{
  inputIdList.forEach((id)=>{
    if(input.get(id)){
      if(typeof value === typeof checkedValue){
        input.get(id).setSchema({
          type: typeof value
        });
      }else{
        input.get(id).setSchema({
          type: "enum",
          items: [
            {
              type: typeof value,
              value: value
            },
            {
              type: typeof checkedValue,
              value: checkedValue
            }
          ]
        },);
      }
    }
  })
  outputIdList.forEach((id)=>{
    if(output.get(id)){
      if(typeof value === typeof checkedValue){
        output.get(id).setSchema({
          type: typeof value
        });
      }else{
        output.get(id).setSchema({
          type: "enum",
          items: [
            {
              type: typeof value,
              value: value
            },
            {
              type: typeof checkedValue,
              value: checkedValue
            }
          ]
        },);
      }
    }
  })
}