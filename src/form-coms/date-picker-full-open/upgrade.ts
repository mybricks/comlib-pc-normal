import { Data } from '../date-picker/runtime';
import { descriptionUpList } from './constants';
import { descriptionUp } from '../utils/descriptionUp'
export default function ({ 
  data,
  output,
  input,
  setDeclaredStyle,
  id,
  slot
}: UpgradeParams<Data>): boolean {
  /**
   * @description v1.1.23 新增description
  */
  descriptionUp(descriptionUpList, input, output);
  //=========== v1.1.23 end ===============
  
  return true;
}