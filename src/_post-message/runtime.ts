export interface Data {
  iframeId: string;
  goal: 'subPage' | 'parentPage';
}

export interface Item {
  url: string;
  id: string;
}

export default function (props: RuntimeParams<Data>) {
  const {env, inputs, data} = props;
  const {runtime} = env;
  const envCanvasElement = env.canvasElement || document

  if (runtime) {
    inputs['post']((val, relOutputs) => {
      //父页面向子页面传递数据
      if (data.goal === 'subPage' && data.iframeId !== '') {
        try{
          const iFramexDom = envCanvasElement.querySelector(`#${data.iframeId}`)
          if (iFramexDom) {
            const iFramex = iFramexDom.contentWindow
            iFramex.postMessage(val, '*')

            // iFramexDom.onload = function () {
            //   iFramex.postMessage(val, '*')
            // };
            relOutputs["postDone"](val)
          } else {
            relOutputs["postDone"](`[错误]未找到iframe(#${data.iframeId})`)
          }
        }catch(ex){
          relOutputs["postDone"](`[错误]${ex.message}`)
        }
      }

      //子页面向父页面传递数据
      if (data.goal === 'parentPage') {
        parent.postMessage(val, '*');
        relOutputs["postDone"](val);
      }
    });
  }
}
