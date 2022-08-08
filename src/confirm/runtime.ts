import { Modal } from 'antd';
import { Data, InputIds, OutputIds } from './constants';
import css from './runtime.less';

export default function ({
  env,
  data,
  inputs = {},
  outputs = {}
}: RuntimeParams<Data>) {
  const { type, showTitle } = data;

  const onOk = () => {
    outputs[OutputIds.Ok](data.inputData);
  };

  const onCancel = () => {
    outputs[OutputIds.Cancel](data.inputData);
  };

  const open = () => {
    Modal[type]({
      ...data,
      okText: env.i18n(data.okText),
      cancelText: env.i18n(data.cancelText),
      content: env.i18n(data.content),
      className: css['fz-modal'],
      title: showTitle ? env.i18n(data.title) : void 0,
      // inputData: void 0,
      onCancel,
      onOk
    });
  };

  if (env.runtime) {
    inputs[InputIds.Open]((val: any) => {
      data.inputData = val;
      if (val && val.toString() === '[object Object]') {
        ['title', 'cancelText', 'content', 'okText'].forEach((key) => {
          data[key] = val[key] === void 0 ? data[key] : val[key];
        });
      }
      open();
    });
  }
}
