import { GlobalLoading } from './globalLoading';
import { InputIds, OutputIds, Data } from './constants';

/**
 * @description 实时获取是否有global-loading
 * @param canvasElement 挂载的dom
 * @returns
 */
export const getGlobalLoading = (canvasElement: HTMLElement = document.body) => {
  return (
    (canvasElement && (canvasElement?.querySelector(`#global-loading`) as HTMLElement)) ||
    document.getElementById('global-loading')
  );
};

export default function ({ env, data, inputs, outputs }: RuntimeParams<Data>) {
  const { runtime, canvasElement } = env;
  if (runtime && inputs) {
    inputs[InputIds.Trigger]((val: any, relOutputs: any) => {
      const { closeLoading, loadingText: defaultLoadingText, maskStyle, ...spinProps } = data;
      if (closeLoading) {
        GlobalLoading.close(canvasElement);
        const outputFn = relOutputs?.[OutputIds.Finish] || outputs[OutputIds.Finish];
        outputFn && outputFn(val);
        return;
      }
      const loadingText = val && typeof val === 'string' ? val : env.i18n(data.loadingText);
      GlobalLoading.open(loadingText, spinProps, canvasElement || document.body);
      let globalLoading = getGlobalLoading(canvasElement);
      if (!!globalLoading) {
        Object.assign(globalLoading.style, maskStyle);
        const dotItems = globalLoading.querySelectorAll('.ant-spin-dot-item');
        Array.from(dotItems).forEach((item: any) => {
          item.style.backgroundColor = spinProps.style.color;
        });
      }
      // IO串行处理
      const outputFn = relOutputs?.[OutputIds.Finish] || outputs[OutputIds.Finish];
      outputFn && outputFn(val);
    });
    // TODO 优化方式 从未运行
    if (inputs[InputIds.Close]) {
      inputs[InputIds.Close](() => {
        GlobalLoading.close(canvasElement);
      });
    }
  }
}
