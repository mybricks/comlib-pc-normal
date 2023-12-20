import moment from 'moment';
import { TFormatterInfo } from '../types';

const timeTemplateFormatter: TFormatterInfo = {
  name: 'TIMETEMPLATE',
  label: '时间戳转化',
  genEditor(options) {
    return {
      type: 'select',
      description: '待转换数据格式为字符串或数字型时间戳',
      options: {
        options: [
          {
            label: '年-月-日 时:分:秒',
            value: 'YYYY-MM-DD HH:mm:ss'
          },
          {
            label: '月-日 时:分:秒',
            value: 'MM-DD HH:mm:ss'
          },
          {
            label: '时:分:秒',
            value: 'HH:mm:ss'
          }
        ],
        ...options
      }
    };
  },
  genFormatting(editorValue) {
    const formatTemplate = editorValue ?? 'YYYY-MM-DD HH:mm:ss';
    return (data) => {
      const m = moment(!isNaN(Number(data)) ? Number(data) : data);
      return m.format(formatTemplate);
    };
  }
};

export default timeTemplateFormatter;
