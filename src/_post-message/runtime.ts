export interface Data {
  iframeId: string;
  goal: 'subPage' | 'parentPage';
}

export interface Item {
  url: string;
  id: string;
}

export default function (props: RuntimeParams<Data>) {
  const { env, inputs, data } = props;
  const { runtime } = env;

  if (runtime) {
    inputs['post']((val, relOutputs) => {
      //父页面向子页面传递数据
      if (data.goal === 'subPage' && data.iframeId !== '') {
        let iFramexDom = document.getElementById(data.iframeId);
        let iFramex = document.getElementById(data.iframeId).contentWindow;
        iFramexDom.onload = function () {
          iFramex.postMessage(val, '*');
        };
        relOutputs["postDone"](val);
      }

      //子页面向父页面传递数据
      if (data.goal === 'parentPage') {
        parent.postMessage(val, '*');
        relOutputs["postDone"](val);
      }
    });
  }
}
