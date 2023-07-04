import { Data } from "./constants";

export default function ({
  data,
  input,
  output,
  setDeclaredStyle
}: UpgradeParams<Data>): boolean {
  data.items.forEach(item => {

    //1.0.0 -> 1.0.1
    const { style = {} } = item;
    const fontWeightMap = {
      normal: 400,
      bold: 700
    };
    if (typeof style.lineHeight === 'number') {
      style.lineHeight = parseInt(style.fontSize) * style.lineHeight + 'px';
    }
    if (typeof style.fontWeight === 'string') {
      style.fontWeight = fontWeightMap[style.fontWeight]
    }

  });

  //1.0.3 -> 1.0.4 style升级，文本排版的边框和内容文字的颜色
  if(data.style){
    setDeclaredStyle('.container', data.style);
  }
  data.items.forEach((item) => {
    setDeclaredStyle(`.${item.key}`, item.style);
  })

  return true;
}