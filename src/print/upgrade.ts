import { Data, InputIds } from './constants';

export default function ({ data, config, setDeclaredStyle, input, output }: UpgradeParams<Data>): boolean {

  /**
   * @description v1.0.8 ==> v1.0.9
   * 打印
  */
  const inputRels = input.get(InputIds.StartPrint).rels;
  if (!inputRels) {
    input.get(InputIds.StartPrint).setRels(["afterPrint"]);
  }

  return true;
}