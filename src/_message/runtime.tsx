import {message} from 'antd';
import {Data} from './constants';

// 运行时执行
const runtimeExecute = ({data, inputs}: RuntimeParams<Data>) => {
  //const { type, content, duration } = data;

  // 显示信息
  const open = (type, msg: string) => {
    message[type]({content: msg});
  };

  inputs['info']((val: string) => {
    open('info', val)
  })
  inputs['success']((val: string) => {
    open('success', val)
  })
  inputs['warning']((val: string) => {
    open('warning', val)
  })
  inputs['error']((val: string) => {
    open('error', val)
  })
  inputs['loading']((val: string) => {
    open('loading', val)
  })
}

export default function (props: RuntimeParams<Data>) {
  const {env} = props;
  const {runtime} = env;

  if (runtime) {
    runtimeExecute(props);
  }
}
