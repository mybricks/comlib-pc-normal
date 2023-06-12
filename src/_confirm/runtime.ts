import { Modal } from 'antd';
import { Data, InputIds, OutputIds } from './constants';
import css from './runtime.less';

const createFakeDom = (root) => {
  const div = document.createElement('div');
  root?.appendChild(div);
  return div
}

export default function ({ env, data, inputs, outputs }: RuntimeParams<Data>) {
  const { type, showTitle } = data;
  let parendDom: HTMLElement
  const onOk = () => {
    outputs[OutputIds.Ok](data.outputValue);
  };

  const onCancel = () => {
    outputs[OutputIds.Cancel](data.outputValue);
  };

  const open = () => {
    Modal[type]({
      ...data,
      className: css.modalWrap,
      title: showTitle ? data.title : undefined,
      onCancel,
      onOk,
      getContainer() {
        const parendDom = createFakeDom(env?.canvasElement?.parentElement || document.body)
        return parendDom
      },
    });
  };

  if (env.runtime) {
    inputs[InputIds.Open]((val: any) => {
      data.outputValue = val?.outputValue || val;
      if (val && val.toString() === '[object Object]') {
        ['title', 'cancelText', 'content', 'okText'].forEach((key) => {
          data[key] = typeof val[key] === 'string' ? val[key] : data[key];
        });
      }
      open();
    });
  }

  // if (env.edit && parendDom) {
  //   parendDom?.parentElement?.removeChild(parendDom)
  // }
}
