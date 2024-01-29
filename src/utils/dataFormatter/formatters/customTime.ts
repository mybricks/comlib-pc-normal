import moment from 'moment';
import { TFormatterInfo } from '../types';

const customTimeFormatter: TFormatterInfo = {
  name: 'CUSTOMTIME',
  label: '自定义时间戳转化',
  genEditor(options) {
    return {
      type: 'text',
      description: '待转换数据格式为字符串或数字型时间戳',
      options: {
        placeholder: 'YYYY-MM-DD HH:mm:ss',
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

export default customTimeFormatter;
