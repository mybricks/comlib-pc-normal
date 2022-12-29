import { Data } from './constants';

export default function ({ 
  data
}: UpgradeParams<Data>): boolean {
  //1.0.2 ->1.0.3，增加点击输出
  if(data.outputContent === ""){
    data.outputContent = 0;
  };
  if(typeof data.dataType === "undefined"){
    data.dataType = "number";
  };
  
  return true;
}