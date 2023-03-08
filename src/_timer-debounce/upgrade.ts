import { Data } from './constants';

export default function ({ 
  data
}: UpgradeParams<Data>): boolean {
  //1.0.0 ->1.0.1，增加立即执行
  if(typeof data.isleading === "undefined"){
    data.isleading = false;
  };
  
  return true;
}