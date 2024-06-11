export const descriptionUp = (
  list: any,
  input: any,
  output: any,
) => {
  const IOMap = {
    'input': input, 
    'output': output  
  }

  list.map((item)=>{
    if(IOMap[item.type].get(item.id).schema !== item.schema){
      IOMap[item.type].get(item.id).setSchema(item.schema);
    }
  })
}