import { Data } from './types';
export default {
  '@init': ({ style, data }) => {},
  '@resize': {
    options: []
  },
  ':root': {
    items({ data }: EditorResult<Data>, ...cate) {
        cate[0].title = '配置';
        cate[0].items = [
          
        ];
      }
  }
};
