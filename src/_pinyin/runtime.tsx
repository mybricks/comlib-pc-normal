import { Data } from './constants';
// import pinyin from 'pinyin';
import { getPinyYin } from './utils';

export default function (props: RuntimeParams<Data>) {
  const { env, inputs, outputs, data, logger } = props;
  const { runtime } = env;

  const loadPingyin = getPinyYin();
  // if (runtime && inputs['text']) {
  //   inputs['text']((val: string) => {
  //     if(typeof val === 'string'){
  //       switch (data.valType){
  //         case 'pinyinArr':
  //           outputs['letter'](pinyin(val));
  //           break;
  //         case 'pinyinStr':
  //           if(pinyin(val).length !== 0){
  //             let pinyinStr = pinyin(val).map((item)=>{
  //               return item[0]
  //             })
  //             outputs['letter'](pinyinStr.join(data.splitChart));
  //           }
  //           break;
  //         case 'firstLetter':
  //           if(pinyin(val).length !== 0){
  //             outputs['letter'](pinyin(val)[0][0][0]);
  //           }
  //           break;
  //       }
  //     }else{
  //       logger.error('输入数据类型不是字符串');
  //     }
  //   });

  // }

  if (runtime && inputs['text']) {
    inputs['text']((val: string) => {
      if (typeof val === 'string') {
        loadPingyin.then(() => {
          const pinYin = window?.pinyinUtil.getPinyin(val, data.splitChart, false);
          if (pinYin.length !== 0) {
            // let pinyinStr = firstLetter.map((item) => {
            //   return item[0];
            // });
            outputs['letter'](pinYin);
          }
        });
      } else {
        logger.error('输入数据类型不是字符串');
      }
    });
  }
}
