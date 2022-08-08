import { GlobalLoading } from './globalLoading';
import { InputIds, Data } from './constants';

export default function ({ env, data, inputs }: RuntimeParams<Data>) {
  if (env?.runtime && inputs) {
    inputs[InputIds.Open]((val) => {
      const { loadingText: defaultLoadingText, maskStyle, ...spinProps } = data;
      const loadingText =
        val && typeof val === 'string' ? val : data.loadingText;

      GlobalLoading.open(env.i18n(loadingText), spinProps);

      const globalLoading = document.getElementById('global-loading');
      if (globalLoading) {
        Object.assign(globalLoading.style, maskStyle);
        const dotItems = globalLoading.querySelectorAll('.ant-spin-dot-item');
        Array.from(dotItems).forEach((item: HTMLElement) => {
          item.style.backgroundColor = spinProps.style.color;
        });
      }
    });

    inputs[InputIds.Close](() => {
      GlobalLoading.close();
    });
  }
}
