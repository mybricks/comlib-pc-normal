import btnItem from '../form-blocks/editors/formItem/btnItem';
import { Data } from './runtime';

export default function ({ input ,data }: EditorResult<Data>): boolean {
  // if (!input.get('install')) {
  //   const params = {
  //     type: 'any'
  //   };
  //   input.add('install', '初始化数据', params);
  // }
  // 1.0.1 -> 1.0.2
  if (!input.get('slotProps')) {
    const params = {
      type: 'follow'
    };
    input.add('slotProps', '插槽参数', params);
  }
  //  1.0.7 -> 1.0.8
  // if(typeof data.tools[0].distance === 'undefined'){
  //   data.tools[0].distance = '2px';
  // }
  data.tools.forEach(function(item){
    if(typeof item.distance === 'undefined'){
      item.distance = '2px';
    }
  })
  //1.0.8 -> 1.0.9
  data.tools.forEach(function(item){
    if(typeof item.backgroundColor === 'undefined'){
      item.backgroundColor = '';
    }
  })
  //1.0.9 -> 1.0.12
 // data.tools.forEach(function(item){
    //兼容fontSize的问题
    // if(item.fontSize === 400){
    //   item.fontSize = ''
    // }
    //用于按钮组的单独按钮的升级
  //   if(item.btns){
  //     item.btns.forEach(function(btn){
  //       //兼容fontSize的问题
  //       if(btn.fontSize === 400){
  //         btn.fontSize = ''
  //       }
  //     })
  //   }
  // })
  //1.0.12 -> 1.0.14
  data.tools.forEach(function(item){
    if(typeof item.useTextStyle){
      item.useTextStyle = false;
    }
  })
  return true;
}
