import { Data, InputIds } from './constants';

export default function ({ env, inputs }: RuntimeParams<Data>) {
  if (env?.runtime && inputs) {
    inputs[InputIds.SetCopyText]((val) => {
      const input = document.createElement('input');
      document.body.appendChild(input);
      try {
        input.value = typeof val === 'string' ? val : JSON.stringify(val);
      } catch (e) {
        console.error('JSON.stringify Error', val);
        input.value = `${val}`;
      }
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    });
  }
}
