import { Data, OutputIds } from './constants';

export default function ({
  data,
  output
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

  return true;
}