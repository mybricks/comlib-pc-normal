import { Data } from "./constants";

export default function ({
  data,
  input,
  output,
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

  return true;
}