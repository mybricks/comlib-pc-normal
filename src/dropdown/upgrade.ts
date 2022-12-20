import { Data } from './types';

export default function ({ 
  data
}: UpgradeParams<Data>): boolean {
  //1.0.0 ->1.0.1，增加自定义开关，允许往插槽内拖入内容
  if(typeof data.isCustom === "undefined"){
    data.isCustom = true;
  };
  
  return true;
}