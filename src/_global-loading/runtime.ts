import { GlobalLoading } from './globalLoading';
import { InputIds, Data } from './constants';

/**
 * @description 实时获取是否有global-loading
 * @param debugRuntime 
 * @returns 
 */
export const getGlobalLoading = (debugRuntime?: boolean) => {
  return !!debugRuntime
    ? (document
        .getElementById('_mybricks-geo-webview_')
        ?.shadowRoot?.getElementById('global-loading') as HTMLElement)
    : document.getElementById('global-loading');
};

export default function ({ env, data, inputs }: RuntimeParams<Data>) {
  const debugRuntime = !!(env?.runtime && env?.runtime.debug);
  let globalLoading = getGlobalLoading(debugRuntime);

  if (env?.runtime && inputs) {
    inputs[InputIds.Trigger]((val) => {
      const { closeLoading, loadingText: defaultLoadingText, maskStyle, ...spinProps } = data;
      if (closeLoading) {
        GlobalLoading.close(debugRuntime);
        return;
      }
      const loadingText = val && typeof val === 'string' ? val : env.i18n(data.loadingText);
      GlobalLoading.open(loadingText, spinProps, debugRuntime ? env?.canvasElement : document.body, debugRuntime);
      globalLoading = getGlobalLoading(debugRuntime);
      if (!!globalLoading) {
        Object.assign(globalLoading.style, maskStyle);
        const dotItems = globalLoading.querySelectorAll('.ant-spin-dot-item');
        Array.from(dotItems).forEach((item: any) => {
          item.style.backgroundColor = spinProps.style.color;
        });
      }
    });
    if (inputs[InputIds.Close]) {
      inputs[InputIds.Close](() => {
        GlobalLoading.close(debugRuntime);
      });
    }
  }
}
