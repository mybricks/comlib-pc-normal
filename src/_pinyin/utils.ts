const importScript = async (url) => {
  return new Promise((res, rej) => {
    const script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);
    script.onload = () => {
      res(`${url} 记载成功`)
    }
    script.onerror = () => {
      rej(`${url} 加载出错`)
    }
  })
}

const pinYinDic = `https://f2.eckwai.com/kos/nlav11092/fangzhou/pub/temp/1691036184788.pinyin_dict_withtone.js`
const pinYinUtils = `https://f2.eckwai.com/kos/nlav11092/fangzhou/pub/temp/1691036177678.pinyinUtil.js`
export const getPinyYin = async () => {
  // return Promise.all([
  //   importScript(pinYinDic),
  //   importScript(pinYinUtils),
  // ])
  return importScript(pinYinDic).then(() => importScript(pinYinUtils))
}
