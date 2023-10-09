import { GlobalLoading } from './globalLoading';
import { InputIds, Data } from './constants';

export default function ({ env, data, inputs }: RuntimeParams<Data>) {
  const debugRuntime = !!(env?.runtime && env?.runtime.debug);
  const getGlobalLoading = () =>
    debugRuntime
      ? (document
          .getElementById('_mybricks-geo-webview_')
          ?.shadowRoot?.getElementById('global-loading') as HTMLElement)
      : document.getElementById('global-loading');
  let globalLoading = getGlobalLoading();

  if (env?.runtime && inputs) {
    inputs[InputIds.Trigger]((val) => {
      const { closeLoading, loadingText: defaultLoadingText, maskStyle, ...spinProps } = data;
      if (closeLoading) {
        GlobalLoading.close(debugRuntime ? env?.canvasElement : document.body, globalLoading);
        return;
      }
      const loadingText = val && typeof val === 'string' ? val : data.loadingText;
      GlobalLoading.open(
        loadingText,
        spinProps,
        debugRuntime ? env?.canvasElement : document.body,
        globalLoading
      );
      globalLoading = getGlobalLoading();
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
        globalLoading = getGlobalLoading();
        GlobalLoading.close(debugRuntime ? env?.canvasElement : document.body, globalLoading);
      });
    }
  }
}
