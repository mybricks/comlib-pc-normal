//import { Data, OutputIds } from './constants';

export default function ({
  data,
  output,
  input,
  style,
  slot,
  setDeclaredStyle,
  getDeclaredStyle,
  removeDeclaredStyle
}): boolean {
  /**
   * @description 1.0.43->1.0.44  更改关闭按钮的target
  */
  const preCloseStyle = getDeclaredStyle(`.test`);

  console.log('preCloseStyle',preCloseStyle);
  console.log('1234',getDeclaredStyle(`.test`))
  
  if (preCloseStyle) {
    console.log('进来了嘛')
    removeDeclaredStyle('.test');
    setDeclaredStyle('.test2', preCloseStyle.css);
  }


  return true;
}