import { Data } from './constants';

const defaultFilename = 'download';
const getType = (obj) => {
  return Object.prototype.toString.call(obj).match(/\[object (.*)\]/)[1];
};
const matchFilename = (url) => {
  try {
    if (/(http|https):\/\/([\w.]+\/?)\S*/.test(url)) {
      return url.substring(url.lastIndexOf('/') + 1);
    }
  } catch (error) {
    console.error(error);
  }
};
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

export default function ({ data, env, inputs }: RuntimeParams<Data>) {
  const { filename, nameConfig } = data;
  const { runtime } = env;
  if (runtime) {
    inputs['url']((val) => {
      if (val) {
        if (nameConfig === 0 && getType(val) === 'String') {
          download(val, filename || matchFilename(val) || defaultFilename);
        } else if (nameConfig === 1 && getType(val) === 'Object') {
          const { url, filename: _filename } = val;
          download(url, _filename || defaultFilename);
        } else {
          console.error('[资源下载]：数据类型错误');
        }
      }
    });
  }
}
