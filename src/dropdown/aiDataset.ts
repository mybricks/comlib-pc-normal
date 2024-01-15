import { defineDataSet } from 'ai-dataset';

const triggerMap = {
  悬浮: 'hover',
  点击: 'click'
};

const placementMap = {
  左下方: 'bottomLeft',
  中下方: 'bottomCenter',
  右下方: 'bottomRight',
  左上方: 'topLeft',
  中上方: 'topCenter',
  右上方: 'topRight'
};
export default defineDataSet((utils) => {
  const result = {};
  const title = utils.lorem.word({ length: { min: 0, max: 10 } });
  result['提示内容'] = [
    {
      Q: `将提示内容设置为“${title}”`,
      A: {
        data: {
          content: title
        }
      }
    }
  ];

  // TODO：title更改
  result['自定义'] = [true, false].map((item) => ({
    Q: `将自定义设置为${item ? '开启' : '关闭'}`,
    A: {
      data: {
        isCustom: item
      }
    }
  }));

  result['子项配置'] = [true, false].map((item) => ({
    Q: `将子项配置设置为${item ? '开启' : '关闭'}`,
    A: {
      data: {
        isChildCustom: item
      }
    }
  }));

  result['触发方式'] = [];
  for (let key in triggerMap) {
    result['触发方式'].push({
      Q: `将触发方式设置为${key}`,
      A: {
        data: {
          trigger: triggerMap[key]
        }
      }
    });
  }

  result['弹出位置'] = [];
  for (let key in placementMap) {
    result['弹出位置'].push({
      Q: `将弹出位置设置为${key}`,
      A: {
        data: {
          placement: placementMap[key]
        }
      }
    });
  }

  let width = utils.number.int({ min: 64, max: 200 });
  result['宽度'] = [
    {
      Q: `将宽度设置为${width}`,
      A: {
        data: {
          width: `${width}px`
        }
      }
    }
  ];

  // TODO:wf, 增加选项，删除选项,修改虚啊想的label,跳转链接
  // result['选项配置'] = []
  // const label = utils.string.alpha();
  // const value = utils.string.nanoid();

  // result['选项配置'].push({
  //   "Q": `添加一项${width}`,
  //   "A": {
  //     options: {

  //     }
  //   }
  // })

  return result;
});
