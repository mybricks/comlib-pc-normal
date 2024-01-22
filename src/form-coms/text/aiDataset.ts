import { DataSetItem, defineDataSet } from 'ai-dataset';

export default defineDataSet((utils) => {
  const result: DataSetItem[] = [];

  // ======================== 尺寸 ========================
  const sizeOptions = [
    {
      label: '宽',
      value: 'large'
    },
    {
      label: '中',
      value: 'middle'
    },
    {
      label: '窄',
      value: 'small'
    }
  ];
  result.push(
    ...sizeOptions.map((item) => ({
      Q: `将尺寸设置为${item.label}`,
      A: {
        data: {
          config: {
            size: item.value
          }
        }
      }
    }))
  );

  // ======================== 图标来源 ========================
  const iconSourceOptions = [
    // { label: '无', value: 'none' },
    { label: '内置图标库', value: 'inner' },
    { label: '自定义上传', value: 'custom' }
  ];
  result.push(
    ...iconSourceOptions.map((item) => ({
      Q: `将图标来源设置为${item.label}`,
      A: { data: { src: item.value } }
    }))
  );

  // ======================== 选择图标 ========================
  // TODO: src/form-coms/text/editors.tsx:67

  // ======================== 上传 ========================
  // TODO: src/form-coms/text/editors.tsx:82

  result.push({
    Q: '将图标设置为地址是https://www.baidu.com的图片',
    A: {
      data: {
        src: 'custom',
        customIcon: 'https://www.baidu.com'
      }
    }
  });
  result.push({
    Q: '显示清除图标（可以点击清除图标删除内容）',
    A: {
      data: {
        config: {
          allowClear: true
        }
      }
    }
  });
  result.push({
    Q: '将提示内容（在值为空时显示）设置为请输入文本',
    A: {
      data: {
        config: {
          placeholder: '请输入文本'
        }
      }
    }
  });

  result.push({
    Q: '将前置标签设置为$',
    A: {
      data: {
        config: {
          addonBefore: '$'
        }
      }
    }
  });

  result.push({
    Q: '将后置标签设置为.com',
    A: {
      data: {
        config: {
          addonAfter: '.com'
        }
      }
    }
  });

  result.push({
    Q: '禁用',
    A: {
      data: {
        config: {
          disabled: true
        }
      }
    }
  });

  result.push({
    Q: '显示字数',
    A: {
      data: {
        config: {
          showCount: true
        }
      }
    }
  });

  result.push({
    Q: '删除两端空白字符',
    A: {
      data: {
        isTrim: true
      }
    }
  });

  result.push({
    Q: '可输入的内容最大长度设置为4',
    A: {
      data: {
        config: {
          maxLength: 4
        }
      }
    }
  });

  result.push({
    Q: '当值变化、失去焦点、按下回车时触发校验',
    A: {
      data: {
        validateTrigger: ['onChange', 'onBlur', 'onPressEnter']
      }
    }
  });

  return result;
});
