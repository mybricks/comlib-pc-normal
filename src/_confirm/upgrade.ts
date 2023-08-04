import { Data, OutputIds, InputIds } from './constants';

export default function ({
  data,
  output,
  input
}: UpgradeParams<Data>): boolean {

  /**
     * @description v1.0.2 
     */
  const cancelSchema = output.get(OutputIds.Ok).schema;
  if (data.type !== 'confirm' && output.get(OutputIds.Cancel)) {
    output.remove(OutputIds.Cancel);
  }
  if (data.type === 'confirm' && !output.get(OutputIds.Cancel)) {
    output.add(OutputIds.Cancel, '取消', cancelSchema);
  }

  /**
   * @description v1.0.6
   * fix https://my.mybricks.world/mybricks-pc-page/index.html?id=463636034879557
  */
  const inputRels = input.get(InputIds.Open).rels;
  if (!inputRels) {
    input.get(InputIds.Open).setRels(["ok", "cancel"]);
  }

  return true;
}