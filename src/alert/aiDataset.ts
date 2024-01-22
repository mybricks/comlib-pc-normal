import { defineDataSet } from 'ai-dataset';

const typesMap = {
  默认: 'info',
  成功: 'success',
  错误: 'error',
  警告: 'warning'
};
export default defineDataSet((utils) => {
  const result = {};
  const message = utils.lorem.word({ length: { min: 0, max: 10 } });
  result['标题'] = [
    {
      Q: `将标题设置为“${message}”`,
      A: {
        data: {
          message: message
        }
      }
    }
  ];

  result['类型'] = [];
  for (let key in typesMap) {
    result['类型'].push({
      Q: `将类型设置为${key}`,
      A: {
        data: {
          type: typesMap[key]
        }
      }
    });
  }

  result['关闭按钮'] = [
    {
      Q: `启用关闭按钮`,
      A: {
        data: {
          closable: true
        }
      }
    }
  ];
  result['顶部公告'] = [
    {
      Q: `打开顶部公告`,
      A: {
        data: {
          banner: true
        }
      }
    }
  ];
  result['辅助图标'] = [
    {
      Q: `打开辅助图标`,
      A: {
        data: {
          showIcon: true
        }
      }
    }
  ];
  result['辅助介绍'] = [
    {
      Q: `打开辅助介绍`,
      A: {
        data: {
          showInfo: true
        }
      }
    }
  ];
  const content = utils.lorem.word({ length: { min: 0, max: 10 } });
  result['辅助介绍文案'] = [
    {
      Q: `将辅助介绍文案设置为“${content}”`,
      A: {
        data: {
          showInfo: true,
          content: `${content}`
        }
      }
    }
  ];
  result['图标自定义'] = [
    {
      Q: `自定义图标`,
      A: {
        data: {
          isChoose: true
        }
      }
    }
  ];
  /**   临时注释icon */
  // const icon = utils.string.alpha(10)
  // result['选择图标'] = {
  //   "Q": `将警告提示的图标设置为${icon}`,
  //   "A": {
  //     "icon": `${icon}`,
  //     "isChoose": true,
  //     "showIcon": true
  //   }
  // }

  result['介绍文案插槽'] = [
    {
      Q: `打开介绍文案插槽（自定义介绍文案内容）`,
      A: {
        data: {
          useContentSlot: true
        }
      }
    }
  ];

  result['固定宽度'] = [
    {
      Q: `将宽度设置为固定宽度`,
      A: {
        data: {
          openWidth: true
        }
      }
    }
  ];

  result['固定宽度'].push({
    Q: `将固定宽度设置为400px`,
    A: {
      data: {
        openWidth: true,
        width: 400
      }
    }
  });

  result['百分比宽度'] = [
    {
      Q: `将百分比宽度设置为80%`,
      A: {
        data: {
          openWidth: false,
          percentWidth: 80
        }
      }
    }
  ];
  return result;
});
