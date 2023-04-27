import { Data, OutputIds } from './constants';

export default function ({
  data,
  output
}: UpgradeParams<Data>): boolean {

  /**
     * @description v1.1.4 增加关闭回调事件
     */
  if (!output.get(OutputIds.AfterClose)) {
    output.add(OutputIds.AfterClose, '关闭回调', {
      type: 'any'
    })
  }
  /**
     * @description v1.1.8 增加maskClosable配置项
     */
  if (data.maskClosable === undefined) {
    data.maskClosable = false;
  }
  return true;
}