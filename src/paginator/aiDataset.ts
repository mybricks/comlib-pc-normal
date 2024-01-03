import { defineDataSet } from "ai-dataset";
import {AlignTypeEnum, SizeTypeEnum} from "./constants";

export default defineDataSet((utils) => {
  const result = {};
  const layoutOptions = [
    { label: '居左', value: AlignTypeEnum.FlexStart },
    { value: '居中', label: AlignTypeEnum.Center },
    { value: '居右', label: AlignTypeEnum.FlexEnd }
  ];
  result['位置'] = layoutOptions.map(item => {
    return {
      Q: `将位置设置为${item.label}`,
      A: { data: { align: item.value }, style: { width: 1024 } },
    };
  });
  result['尺寸'] = [
    { label: '正常', value: SizeTypeEnum.Default },
    { label: '小', value: SizeTypeEnum.Small },
    { label: '简单模式', value: SizeTypeEnum.Simple }
  ].map(item => {
    return {
      Q: `将尺寸设置为${item.label}`,
      A: { data: { size: item.value } },
    };
  });
  const pageSize = utils.number.int({ min: 0, max: 1000 });
  result['默认每页显示条数'] = {
    Q: `将默认每页显示条数设置为pageSize`,
    A: {
      data: {
        defaultPageSize: pageSize,
        currentPage: {
          pageNum: 1,
          pageSize,
        }
      },
    },
  };
  result['前置说明文字'] = ['共 {total} 条结果', '{total} 条数据', '总数： {total}'].map(key => {
    return {
      Q: `将前置说明文字设置为'${key}'`,
      A: {
        data: {
          size: SizeTypeEnum.Default,
          text: key,
        },
      },
    };
  });
  result['跳页功能'] = utils.options.switch().map(item => {
    return {
      Q: `将跳页功能设置为${item.label}`,
      A: {
        data: {
          size: SizeTypeEnum.Default,
          showQuickJumper: item.value,
        },
      },
    };
  });
  result['条数选择功能'] = utils.options.switch().map(item => {
    return {
      Q: `将条数选择功能设置为${item.label}`,
      A: {
        data: {
          size: SizeTypeEnum.Default,
          showSizeChanger: item.value,
        },
      },
    };
  });
  result['条数配置'] = [[10, 20, 50, 100], [10, 20, 50, 70, 100]].map(item => {
    return {
      Q: `将页面条数选项列表设置为${item.join('、')}`,
      A: {
        data: {
          size: SizeTypeEnum.Default,
          showSizeChanger: true,
          pageSizeOptions: item
        },
      },
    };
  });
  result['页数为1时隐藏分页器'] = utils.options.switch().reduce((pre, item) => {
    return [
      ...pre,
      {
        Q: `当页数为1时${item.value ? '' : '不'}隐藏分页器`,
        A: {
          data: {
            size: SizeTypeEnum.Simple,
            hideOnSinglePage: item.value,
          },
        },
      },
      {
        Q: `当页数为1时${item.value ? '' : '不'}隐藏分页器`,
        A: {
          data: {
            showSizeChanger: false,
            hideOnSinglePage: item.value,
          },
        },
      }
    ];
  }, []);

  /** TODO: 复杂编辑项、样式 */
  result['动态启用/禁用'] = [];

  return result;
});
