import { Data } from './runtime';

export default function ({ 
  data
}: UpgradeParams<Data>): boolean {
  //1.0.0 ->1.0.1，1.0.3->1.0.4
  //增加data.contentType, "timeStamp",
  //增加data.formatter, "YYYY-MM-DD HH:mm:ss 星期dd",
    if(typeof data.contentType === "undefined"){
      data.contentType = "timeStamp";
    };
    if(typeof data.formatter === "undefined"){
      data.formatter = "YYYY-MM-DD HH:mm:ss 星期dd";
    };
  return true;
}