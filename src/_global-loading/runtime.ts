import { GlobalLoading } from './globalLoading';
import { InputIds, Data } from './constants';

export default function ({ env, data, inputs }: RuntimeParams<Data>) {
  if (env?.runtime && inputs) {
    inputs[InputIds.Trigger]((val) => {
      const { closeLoading, loadingText: defaultLoadingText, maskStyle, ...spinProps } = data;
      if (closeLoading) {
        GlobalLoading.close();
        return;
      }
      const loadingText = val && typeof val === 'string' ? val : data.loadingText;

      GlobalLoading.open(loadingText, spinProps, !!(env?.runtime && env?.runtime.debug) ? env?.canvasElement : document.body);

      const globalLoading = document.getElementById('global-loading');
      if (globalLoading) {
        Object.assign(globalLoading.style, maskStyle);
        const dotItems = globalLoading.querySelectorAll('.ant-spin-dot-item');
        Array.from(dotItems).forEach((item: any) => {
          item.style.backgroundColor = spinProps.style.color;
        });
      }
    });
    if (inputs[InputIds.Close]) {
      inputs[InputIds.Close](() => {
        GlobalLoading.close();
      });
    }
  }
}
