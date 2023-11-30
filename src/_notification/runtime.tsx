import { notification } from 'antd';
import { Data, InputIds, OutputIds } from './constants';
import { uuid } from '../utils';

export default (props: RuntimeParams<Data>) => {
  const { data, inputs, env } = props;
  const { runtime, edit, i18n, canvasElement } = env;
  const { type, message, showTitle, description, duration, placement, top, bottom } = data;

  const openNotification = (onClose: () => void, val: any) => {
    notification[type]({
      top,
      bottom,
      onClose,
      duration,
      placement,
      key: uuid(),
      description: val?.content || i18n(description),
      message: showTitle && (val?.title || i18n(message)),
      getContainer: !(edit || runtime.debug) ? () => canvasElement || document.body : void 0
    });
  };

  if (env.runtime) {
    inputs[InputIds.Open]((val: any, outputRels: { [x: string]: (arg0: any) => void }) => {
      const onClose = () => {
        outputRels[OutputIds.Close](val);
      };
      openNotification(onClose, val);
    });
  }
};
