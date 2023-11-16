import { Modal } from 'antd';
import { Data, InputIds, OutputIds } from './constants';
import css from './runtime.less';
import { checkIfMobile } from '../utils';

const createFakeDom = (root: { appendChild: (arg0: HTMLDivElement) => void }) => {
  const div = document.createElement('div');
  root?.appendChild(div);
  return div;
};
export default function ({ env, data, inputs, outputs }: RuntimeParams<Data>) {
  const { type, showTitle } = data;
  const isMobile = checkIfMobile(env);
  const root = createFakeDom(env?.canvasElement || document.body);
  const open = (onOk: () => void, onCancel: () => void) => {
    Modal[type]({
      ...data,
      width: isMobile ? '100%' : data.width || 520,
      className: isMobile ? css.mobileWrap : css.modalWrap,
      title: showTitle ? env.i18n(data.title) : undefined,
      content: env.i18n(data.content),
      okText: env.i18n(data.okText),
      cancelText: env.i18n(data.cancelText),
      onCancel,
      onOk,
      getContainer() {
        return root;
      }
    });
  };

  if (env.runtime) {
    inputs[InputIds.Open]((val: any, outputRels: { [x: string]: (arg0: any) => void }) => {
      data.outputValue = val?.outputValue || val;
      const onOk = () => {
        outputRels[OutputIds.Ok](data.outputValue);
      };

      const onCancel = () => {
        outputRels[OutputIds.Cancel](data.outputValue);
      };
      if (val && val.toString() === '[object Object]') {
        ['title', 'cancelText', 'content', 'okText'].forEach((key) => {
          data[key] = typeof val[key] === 'string' ? val[key] : data[key];
        });
      }
      open(onOk, onCancel);
    });
  }
}
