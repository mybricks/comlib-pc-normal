import { Data } from './constants';

export default function ({ data, env, style, inputs }: RuntimeParams<Data>) {
  const { name } = data;
  const { runtime } = env;
  if (runtime) {
    inputs['url']((val) => {
      if (val) {
        download(val, name);
      }
    });
  }
}

const download = function (url, filename) {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', blobUrl);
      link.setAttribute('download', filename);
      link.setAttribute('target', '_blank');
      link.click();
      URL.revokeObjectURL(blobUrl);
    });
};
